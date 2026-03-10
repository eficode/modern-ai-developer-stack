# Payments Module (Example)

This is an **example** module-level context file demonstrating subsystem-specific architecture for cascading context.

This file would typically live at `src/payments/README.md` within a project.

---

## Overview

The **Payments Module** handles payment processing for MyCompany's e-commerce platform.

It supports multiple payment providers (Stripe, PayPal, manual) and provides a unified interface for creating, capturing, and refunding payments.

---

## Architecture

### Strategy Pattern

We use the **Strategy pattern** to support multiple payment providers without coupling the business logic to any specific provider.

```
┌────────────────────┐
│  PaymentService    │  (orchestrates provider selection)
└────────┬───────────┘
         │
         │ uses
         ▼
┌────────────────────┐
│  PaymentGateway    │  (interface)
└────────┬───────────┘
         │
         ├──────────────┬──────────────┐
         │              │              │
         ▼              ▼              ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│StripeGateway │ │PayPalGateway │ │ManualGateway │
└──────────────┘ └──────────────┘ └──────────────┘
```

### Key Components

- **`PaymentService`** (`services/payment.service.ts`): Main orchestration logic, provider selection, error handling
- **`PaymentGateway` interface** (`types/payment-gateway.ts`): Contract all providers implement
- **Provider implementations** (`gateways/`):
  - `StripeGateway` – Stripe API integration
  - `PayPalGateway` – PayPal API integration
  - `ManualGateway` – Manual payment approval workflow

---

## Module-Specific Conventions

### 1. All Payment Operations Are Idempotent

Every payment operation (create, capture, refund) can be safely retried without side effects.

**Implementation**: Use idempotency keys for all provider API calls:

```typescript
await stripe.paymentIntents.create(
  {
    amount: 1000,
    currency: 'usd',
  },
  {
    idempotencyKey: `payment-${paymentId}`,
  },
)
```

**Why**: Network failures are common. Idempotency allows safe retries without double-charging customers.

### 2. Retry Failed Operations Up to 3 Times

Failed operations are retried up to 3 times with exponential backoff.

**Implementation**: See `utils/retry.ts` for the retry helper function.

**Why**: Payment providers occasionally return transient errors during high load. Retrying resolves most issues without manual intervention.

### 3. After 3 Failures, Notify Support

If an operation fails after 3 retries, mark the payment as failed and notify the support team.

**Implementation**: See `services/payment.service.ts` → `handlePaymentFailure()`.

**Why**: Persistent failures require human investigation (invalid card, fraud detection, API outage).

### 4. All Amounts in Cents (Integers)

Store and process all monetary amounts as integers in cents (or the smallest currency unit).

**Example**:
```typescript
// Good
const amount = 1050  // $10.50

// Bad
const amount = 10.50  // Floating-point precision issues
```

**Why**: Avoids floating-point precision errors that can cause accounting discrepancies.

### 5. Log All Payment Events

Every payment operation (create, capture, refund, failure) must be logged with structured data.

**Implementation**:
```typescript
logger.info({
  event: 'payment.created',
  paymentId: payment.id,
  amount: payment.amount,
  provider: payment.provider,
  userId: payment.userId,
})
```

**Why**: Enables debugging, fraud detection, and compliance audits.

---

## File Structure

```
src/payments/
├── README.md (this file)
├── services/
│   └── payment.service.ts       # Main orchestration logic
├── gateways/
│   ├── stripe-gateway.ts        # Stripe integration
│   ├── paypal-gateway.ts        # PayPal integration
│   └── manual-gateway.ts        # Manual approval workflow
├── types/
│   ├── payment-gateway.ts       # PaymentGateway interface
│   └── payment.ts               # Payment domain types
├── utils/
│   └── retry.ts                 # Retry helper with exponential backoff
└── index.ts                     # Barrel exports
```

---

## Key Files

### `types/payment-gateway.ts`

Defines the `PaymentGateway` interface that all providers implement:

```typescript
export interface PaymentGateway {
  createPayment(params: CreatePaymentParams): Promise<Payment>
  capturePayment(paymentId: string): Promise<Payment>
  refundPayment(paymentId: string, amount: number): Promise<Payment>
}
```

### `services/payment.service.ts`

Orchestrates provider selection and error handling:

```typescript
export class PaymentService {
  constructor(private gateways: Map<PaymentProvider, PaymentGateway>) {}

  async createPayment(params: CreatePaymentParams): Promise<Payment> {
    const gateway = this.gateways.get(params.provider)
    return withRetry(() => gateway.createPayment(params))
  }

  // ...
}
```

### `gateways/stripe-gateway.ts`

Stripe-specific implementation:

```typescript
export class StripeGateway implements PaymentGateway {
  async createPayment(params: CreatePaymentParams): Promise<Payment> {
    const intent = await stripe.paymentIntents.create(
      {
        amount: params.amount,
        currency: params.currency,
      },
      {
        idempotencyKey: `payment-${params.paymentId}`,
      },
    )
    return mapStripeIntentToPayment(intent)
  }

  // ...
}
```

---

## Known Limitations

### 1. PayPal Does Not Support Recurring Subscriptions

The `PayPalGateway` does not currently support recurring subscriptions (e.g., monthly billing).

**Workaround**: Use Stripe for subscription-based products.

**Planned**: Q2 2026 – Add subscription support to PayPal integration.

### 2. Manual Payments Require Admin Approval

The `ManualGateway` (for bank transfers, checks, etc.) requires manual approval by an admin before the payment is marked as captured.

**Implementation**: See `ManualGateway.approvePayment()` method.

**Why**: Manual payments need human verification before fulfilling orders.

---

## Testing

### Test Helpers

Use `tests/helpers/payment-mocks.ts` for mocking payment providers in tests.

**Example**:
```typescript
import { mockStripeGateway } from '../helpers/payment-mocks'

describe('PaymentService', () => {
  it('creates a payment via Stripe', async () => {
    const gateway = mockStripeGateway()
    const service = new PaymentService(new Map([['stripe', gateway]]))
    
    const payment = await service.createPayment({
      amount: 1000,
      currency: 'usd',
      provider: 'stripe',
    })
    
    expect(payment.amount).toBe(1000)
    expect(gateway.createPayment).toHaveBeenCalledOnce()
  })
})
```

### Do NOT Make Real API Calls in Tests

**Never** call real payment provider APIs in tests:
- Use mocks (via `payment-mocks.ts`)
- Or use VCR-style recordings (record once, replay in tests)

**Why**: Real API calls are slow, flaky, and may incur charges or rate limits.

---

## Integration Points

### Orders Module

Orders create payment intents via `PaymentService.createPayment()`:

```typescript
// src/orders/services/order.service.ts
const payment = await paymentService.createPayment({
  amount: order.total,
  currency: 'usd',
  provider: order.paymentProvider,
  orderId: order.id,
})
```

### Webhooks Module

Payment provider webhooks update payment status via `PaymentService.handleWebhook()`:

```typescript
// src/webhooks/routes/stripe-webhook.routes.ts
await paymentService.handleWebhook({
  provider: 'stripe',
  event: stripeEvent,
})
```

---

## Adding a New Payment Provider

To add a new payment provider (e.g., Square):

1. **Create gateway implementation**: `src/payments/gateways/square-gateway.ts`
2. **Implement `PaymentGateway` interface**: Ensure all methods (create, capture, refund) are implemented
3. **Follow module conventions**:
   - Use idempotency keys
   - Retry failed operations
   - Log all events
   - Amounts in cents
4. **Add tests**: Create `tests/gateways/square-gateway.test.ts` with mocked API calls
5. **Register gateway**: Add to `PaymentService` constructor in `src/app.ts`
6. **Update documentation**: Add Square to the list of supported providers in this README

---

## Tool-Agnostic Principle

This module-level context is written in plain markdown and contains general architectural documentation, not tool-specific syntax.

The same architecture and conventions apply whether you use:
- Cursor, GitHub Copilot, Aider, Claude Code, Windsurf, or future AI tools
- VSCode, WebStorm, or other IDEs

For tool-specific settings, refer to the project-level adapter files (`.cursorrules`, `.github/copilot-instructions.md`).
