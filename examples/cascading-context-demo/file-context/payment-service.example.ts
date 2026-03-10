/**
 * Payment Service (Example)
 * 
 * This is an **example** TypeScript file demonstrating file-level (inline) context
 * for cascading context.
 * 
 * This file would typically live at `src/services/payment.service.ts` within a project.
 */

import { logger } from '../utils/logger'
import { withRetry } from '../utils/retry'
import type { Payment, PaymentGateway, CreatePaymentParams } from '../types'

/**
 * PaymentService orchestrates payment operations across multiple providers.
 * 
 * It implements the Strategy pattern: different PaymentGateway implementations
 * (Stripe, PayPal, Manual) are selected based on the payment params.
 * 
 * See src/payments/README.md for module-level architecture details.
 */
export class PaymentService {
  constructor(
    private gateways: Map<string, PaymentGateway>,
    private supportNotifier: SupportNotifier
  ) {}

  /**
   * Creates a new payment intent with the specified provider.
   * 
   * Automatically retries transient failures up to 3 times with exponential backoff.
   * After 3 failures, notifies support and throws an error.
   * 
   * @param params - Payment creation parameters
   * @returns Created payment object
   * @throws PaymentError if creation fails after retries
   * 
   * Why retry: Payment providers occasionally return transient 500 errors during
   * high load. Retrying resolves most issues without manual intervention.
   * 
   * See: src/payments/README.md → "Retry Failed Operations Up to 3 Times"
   */
  async createPayment(params: CreatePaymentParams): Promise<Payment> {
    const gateway = this.gateways.get(params.provider)
    
    if (!gateway) {
      throw new PaymentError(
        `Unsupported payment provider: ${params.provider}`,
        'UNSUPPORTED_PROVIDER'
      )
    }

    try {
      // withRetry implements exponential backoff: 1s, 2s, 4s delays
      const payment = await withRetry(() => gateway.createPayment(params), {
        maxAttempts: 3,
        backoff: 'exponential',
      })

      logger.info({
        event: 'payment.created',
        paymentId: payment.id,
        amount: payment.amount,
        provider: params.provider,
        userId: params.userId,
      })

      return payment
    } catch (error) {
      // After 3 retries, notify support for manual investigation
      await this.handlePaymentFailure(
        params as unknown as Record<string, unknown>,
        error
      )
      throw error
    }
  }

  /**
   * Captures a previously created payment intent.
   * 
   * Idempotent: Safe to call multiple times with the same paymentId.
   * 
   * @param paymentId - ID of the payment to capture
   * @returns Updated payment object with status 'captured'
   * @throws PaymentError if capture fails after retries
   * 
   * Why idempotent: Network failures can cause duplicate capture requests.
   * Idempotency ensures we don't double-charge customers.
   * 
   * Implementation: Payment gateways use idempotency keys internally.
   * See: src/payments/gateways/stripe-gateway.ts for Stripe example.
   */
  async capturePayment(paymentId: string): Promise<Payment> {
    const payment = await this.getPaymentById(paymentId)
    const gateway = this.gateways.get(payment.provider)

    if (!gateway) {
      throw new PaymentError(
        `Gateway not found for provider: ${payment.provider}`,
        'GATEWAY_NOT_FOUND'
      )
    }

    try {
      const capturedPayment = await withRetry(
        () => gateway.capturePayment(paymentId),
        { maxAttempts: 3, backoff: 'exponential' }
      )

      logger.info({
        event: 'payment.captured',
        paymentId: capturedPayment.id,
        amount: capturedPayment.amount,
        provider: payment.provider,
      })

      return capturedPayment
    } catch (error) {
      await this.handlePaymentFailure({ paymentId }, error)
      throw error
    }
  }

  /**
   * Refunds a captured payment.
   * 
   * Partial refunds are supported: specify an amount less than the original payment.
   * Full refunds: omit the amount parameter.
   * 
   * @param paymentId - ID of the payment to refund
   * @param amount - Amount to refund in cents (optional, defaults to full payment amount)
   * @returns Updated payment object with refund details
   * @throws PaymentError if refund fails after retries
   * 
   * Edge case: Stripe allows partial refunds, but PayPal does not (as of 2026).
   * If a partial refund is requested for PayPal, this will fail with PARTIAL_REFUND_NOT_SUPPORTED.
   * 
   * Why amount in cents: Avoids floating-point precision errors.
   * See: src/payments/README.md → "All Amounts in Cents (Integers)"
   */
  async refundPayment(paymentId: string, amount?: number): Promise<Payment> {
    const payment = await this.getPaymentById(paymentId)
    const gateway = this.gateways.get(payment.provider)

    if (!gateway) {
      throw new PaymentError(
        `Gateway not found for provider: ${payment.provider}`,
        'GATEWAY_NOT_FOUND'
      )
    }

    // Default to full refund if amount not specified
    const refundAmount = amount ?? payment.amount

    // Validate refund amount
    if (refundAmount > payment.amount) {
      throw new PaymentError(
        `Refund amount (${refundAmount}) exceeds payment amount (${payment.amount})`,
        'INVALID_REFUND_AMOUNT'
      )
    }

    if (refundAmount <= 0) {
      throw new PaymentError(
        `Refund amount must be positive, got: ${refundAmount}`,
        'INVALID_REFUND_AMOUNT'
      )
    }

    try {
      const refundedPayment = await withRetry(
        () => gateway.refundPayment(paymentId, refundAmount),
        { maxAttempts: 3, backoff: 'exponential' }
      )

      logger.info({
        event: 'payment.refunded',
        paymentId: refundedPayment.id,
        refundAmount,
        originalAmount: payment.amount,
        provider: payment.provider,
      })

      return refundedPayment
    } catch (error) {
      await this.handlePaymentFailure({ paymentId, amount: refundAmount }, error)
      throw error
    }
  }

  /**
   * Handles persistent payment failures by logging and notifying support.
   * 
   * This is called after all retry attempts have been exhausted.
   * 
   * @param context - Context about the failed operation
   * @param error - The error that caused the failure
   * 
   * Why notify support: Persistent failures indicate systemic issues (API outage,
   * invalid configuration, fraud detection) that require human investigation.
   */
  private async handlePaymentFailure(
    context: Record<string, unknown>,
    error: unknown
  ): Promise<void> {
    logger.error({
      event: 'payment.failed',
      ...context,
      error: error instanceof Error ? error.message : String(error),
    })

    // Notify support team for manual investigation
    await this.supportNotifier.notify({
      type: 'payment_failure',
      context,
      error,
      urgency: 'high',
    })
  }

  /**
   * Retrieves a payment by ID.
   * 
   * @param paymentId - ID of the payment to retrieve
   * @returns Payment object
   * @throws PaymentError if payment not found
   * 
   * Note: This is a placeholder. In a real implementation, this would query
   * a database (e.g., via Prisma or Drizzle).
   */
  private async getPaymentById(paymentId: string): Promise<Payment> {
    // Placeholder: In real implementation, query database
    throw new Error('Not implemented')
  }
}

/**
 * Custom error class for payment-related errors.
 * 
 * Includes a machine-readable error code for frontend handling.
 */
export class PaymentError extends Error {
  constructor(
    message: string,
    public readonly code: string
  ) {
    super(message)
    this.name = 'PaymentError'
  }
}

/**
 * Interface for notifying support about critical payment failures.
 * 
 * Implementation could send emails, Slack messages, PagerDuty alerts, etc.
 */
interface SupportNotifier {
  notify(params: {
    type: string
    context: Record<string, unknown>
    error: unknown
    urgency: 'low' | 'medium' | 'high'
  }): Promise<void>
}
