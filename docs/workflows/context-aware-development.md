# Context-Aware Development Workflow

This guide demonstrates how to use cascading context in real development workflows, both for human developers setting up projects and for AI agents consuming context to perform tasks.

For the underlying concepts and methodology, see `docs/guides/cascading-context.md`.

---

## Workflow 1: Setting Up a New Project with Cascading Context

### Scenario

You're starting a new TypeScript web service and want to establish cascading context so AI assistants can help build it effectively.

### Steps

#### 1. Choose or Create a Collection

Browse `collections/` to find a stack that matches your needs:

```bash
ls collections/
# typescript-web-service.md
# python-ml-service.md
```

If `typescript-web-service.md` matches your needs, reference it. If not, create a new collection:

```bash
touch collections/typescript-api-gateway.md
```

Document the stack in your new collection:

```markdown
# TypeScript API Gateway Collection

This collection combines:
- `docs/standards/typescript.md` for language conventions
- `docs/standards/api-design.md` for REST API patterns

## Stack
- TypeScript 5.x with strict mode
- Fastify for routing
- Zod for validation
- Vitest + Supertest for testing
- Pino for logging

## Structure
- `src/routes/` - API route handlers
- `src/middleware/` - Fastify middleware (auth, logging, error handling)
- `src/schemas/` - Zod validation schemas
- `src/services/` - Business logic
- `tests/` - Test files mirroring src
```

#### 2. Create the Project Directory

```bash
mkdir projects/my-api-gateway
cd projects/my-api-gateway
```

#### 3. Add a Project README

Create `README.md` that references higher-level context and adds project-specific details:

```markdown
# My API Gateway

An API gateway for the MyCompany platform.

## Context Hierarchy

This project follows:
- Repository-wide conventions: see `AGENTS.md` in the repo root
- TypeScript standards: see `docs/standards/typescript.md`
- API gateway stack: see `collections/typescript-api-gateway.md`

## Project-Specific Conventions

- All endpoints require OAuth2 authentication via Auth0
- Responses follow the JSON:API specification
- Rate limiting: 100 requests per minute per API key

## Architecture

- `src/routes/` - Route handlers grouped by resource (users, products, orders)
- `src/middleware/auth.ts` - Auth0 JWT validation
- `src/middleware/ratelimit.ts` - Redis-backed rate limiting
- `src/services/` - Business logic for aggregating data from microservices

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

## Testing

\`\`\`bash
npm test                     # run all tests
npm test -- users.test.ts    # run specific test file
\`\`\`
```

#### 4. Add Tool-Specific Adapters (Optional)

If your team uses Cursor, create a minimal `.cursorrules`:

```markdown
# Cursor Rules for My API Gateway

Read context from:
- Repository root: `AGENTS.md`
- Standards: `docs/standards/typescript.md`
- Collection: `collections/typescript-api-gateway.md`
- This project: `README.md`

## Cursor-Specific Settings
- Index all files except node_modules, dist, .cache
```

If your team uses GitHub Copilot, create `.github/copilot-instructions.md`:

```markdown
# Copilot Instructions

Follow conventions in:
- `AGENTS.md` (repository-wide)
- `docs/standards/typescript.md` (TypeScript-specific)
- `collections/typescript-api-gateway.md` (stack)
- `README.md` (this project)

Key points:
- Use Zod for validation
- All endpoints require Auth0 JWT
- Follow JSON:API response format
```

#### 5. Scaffold the Project

Use your AI assistant to scaffold the project. With cascading context in place, you can now give high-level instructions:

**Prompt to AI**:
```
Scaffold a new TypeScript API gateway project following the conventions in 
collections/typescript-api-gateway.md. Set up Fastify, Zod, and Vitest.
```

The AI will read the collection, standards, and repository-level context to create a properly structured project.

---

## Workflow 2: Adding a New Feature (AI Agent Perspective)

### Scenario

An AI agent is asked to add a new API endpoint: `GET /api/users/:id/orders`.

### Steps the Agent Should Follow

#### 1. Discover Context Files

**Tool-Agnostic Discovery** (works with any AI assistant):
```
1. Check if AGENTS.md exists in repo root
2. Check if docs/standards/ exists and contains relevant files
3. Check if collections/ exists and is referenced by the project
4. Read the project README.md
5. Check if the module (src/routes/) has a README.md or CONTEXT.md
```

#### 2. Traverse Context Hierarchy

**Read in order from general to specific**:

1. **Repository Level** (`AGENTS.md`):
   - Code style: camelCase for functions, PascalCase for types
   - Error handling: fail fast, return actionable error messages
   - Testing: write focused unit tests

2. **Standards Level** (`docs/standards/typescript.md`):
   - Use Zod for validation
   - Name route handlers: `handle[Method][Resource]`
   - Export types from `src/types/`

3. **Collection Level** (`collections/typescript-api-gateway.md`):
   - Use Fastify for routing
   - Store routes in `src/routes/`
   - Group routes by resource

4. **Project Level** (`projects/my-api-gateway/README.md`):
   - Require Auth0 JWT authentication
   - Follow JSON:API response format
   - Apply rate limiting

5. **Module Level** (`projects/my-api-gateway/src/routes/README.md`):
   - Routes grouped by resource (users, products, orders)
   - Each resource in its own file (`users.routes.ts`)

#### 3. Synthesize Requirements

From the context traversal, the agent determines:
- **File location**: `src/routes/users.routes.ts` (resource-based grouping)
- **Handler name**: `handleGetUserOrders` (standards-level naming)
- **Validation**: Use Zod for `:id` parameter (standards-level)
- **Authentication**: Apply Auth0 JWT middleware (project-level)
- **Response format**: JSON:API structure (project-level)
- **Error handling**: Return 404 if user not found, 500 for server errors (repository-level)
- **Testing**: Write unit tests in `tests/routes/users.routes.test.ts` (repository-level)

#### 4. Implement the Feature

**File**: `src/routes/users.routes.ts`

```typescript
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { authenticateJWT } from '../middleware/auth'
import { getUserOrders } from '../services/orders.service'

const UserIdSchema = z.object({
  id: z.string().uuid(),
})

/**
 * Handles GET /api/users/:id/orders
 * Returns all orders for the specified user in JSON:API format.
 */
export async function handleGetUserOrders(
  request: FastifyRequest<{ Params: z.infer<typeof UserIdSchema> }>,
  reply: FastifyReply
): Promise<void> {
  const { id } = UserIdSchema.parse(request.params)

  const orders = await getUserOrders(id)

  if (!orders) {
    return reply.status(404).send({
      errors: [{ status: '404', title: 'User not found' }],
    })
  }

  reply.send({
    data: orders.map((order) => ({
      type: 'order',
      id: order.id,
      attributes: {
        total: order.total,
        status: order.status,
        createdAt: order.createdAt,
      },
    })),
  })
}

export function registerUserRoutes(app: FastifyInstance): void {
  app.get(
    '/api/users/:id/orders',
    { preHandler: authenticateJWT },
    handleGetUserOrders
  )
}
```

**File**: `tests/routes/users.routes.test.ts`

```typescript
import { describe, it, expect, vi } from 'vitest'
import { build } from '../helpers/app'
import * as ordersService from '../../src/services/orders.service'

describe('GET /api/users/:id/orders', () => {
  it('returns orders in JSON:API format', async () => {
    const app = build()
    vi.spyOn(ordersService, 'getUserOrders').mockResolvedValue([
      { id: 'order-1', total: 100, status: 'completed', createdAt: new Date() },
    ])

    const response = await app.inject({
      method: 'GET',
      url: '/api/users/550e8400-e29b-41d4-a716-446655440000/orders',
      headers: { Authorization: 'Bearer valid-jwt-token' },
    })

    expect(response.statusCode).toBe(200)
    expect(response.json().data).toHaveLength(1)
    expect(response.json().data[0].type).toBe('order')
  })

  it('returns 404 if user not found', async () => {
    const app = build()
    vi.spyOn(ordersService, 'getUserOrders').mockResolvedValue(null)

    const response = await app.inject({
      method: 'GET',
      url: '/api/users/550e8400-e29b-41d4-a716-446655440000/orders',
      headers: { Authorization: 'Bearer valid-jwt-token' },
    })

    expect(response.statusCode).toBe(404)
    expect(response.json().errors[0].status).toBe('404')
  })
})
```

#### 5. Verify Compliance

The agent should verify that the implementation follows all context layers:
- ✅ Repository: Fails fast with 404/500, has focused unit tests
- ✅ Standards: Uses Zod, handler named `handleGetUserOrders`, types exported
- ✅ Collection: Uses Fastify, route in `src/routes/`
- ✅ Project: JWT auth applied, JSON:API response format
- ✅ Module: Route in `users.routes.ts` (grouped by resource)

---

## Workflow 3: Resolving Context Conflicts

### Scenario

A developer is refactoring tests, but the project's context conflicts with repository-level guidance.

**Repository Level** (`AGENTS.md`):
```markdown
Prefer many small, focused tests over a few large integration suites.
```

**Project Level** (`projects/legacy-service/README.md`):
```markdown
This is a legacy service with large integration tests. Do NOT refactor tests 
without team approval—they are fragile and critical for deployment validation.
```

### Resolution

**Rule**: More specific context wins. The project-level guidance overrides repository-level.

**AI Agent Behavior**:
```
I see that AGENTS.md recommends small, focused tests, but this project's README 
explicitly states that tests should not be refactored without approval. I will 
not refactor the tests. Would you like me to document the specific test you'd 
like changed so you can discuss it with the team?
```

### Human Developer Behavior

If you believe the project-level context is outdated (e.g., the legacy service has been modernized), update the project README to reflect the new reality:

```markdown
# Legacy Service README

## Testing (Updated 2026-03-06)

~~This service previously used large integration tests that were fragile.~~

We have migrated to smaller, focused tests following the guidelines in AGENTS.md.
New tests should follow the repository standards.
```

---

## Workflow 4: Auditing Cascading Context

### Scenario

You want to verify that your cascading context is consistent and discoverable by AI agents.

### Steps

#### 1. Check for Required Files

```bash
# Repository level
test -f AGENTS.md && echo "✅ AGENTS.md exists" || echo "❌ Missing AGENTS.md"

# Standards level
ls docs/standards/*.md 2>/dev/null && echo "✅ Standards exist" || echo "❌ No standards"

# Collections level
ls collections/*.md 2>/dev/null && echo "✅ Collections exist" || echo "❌ No collections"

# Project level
find projects -name README.md -maxdepth 2
```

#### 2. Check for Duplication

Search for duplicated guidelines:

```bash
# Example: Check if "Use Zod" appears in multiple places
rg "Use Zod" --type md
```

If the same guideline appears in `AGENTS.md`, `docs/standards/typescript.md`, and every project README, consolidate it:
- Define it once in `docs/standards/typescript.md`
- Reference it from project READMEs

#### 3. Verify Tool-Agnostic Format

Ensure context files are plain markdown, not tool-specific syntax:

```bash
# Check for tool-specific files
find . -name ".cursorrules" -o -name "copilot-instructions.md"

# Verify they reference tool-agnostic context
cat .cursorrules
# Should contain references to AGENTS.md, docs/standards/, etc.
```

#### 4. Test with Multiple AI Tools

Ask different AI assistants to perform the same task (e.g., "add a new API endpoint") and compare their output:
- Do both follow the naming conventions?
- Do both apply the required middleware?
- Do both write tests?

If one tool deviates, your context may be too implicit. Make it more explicit.

---

## Workflow 5: Migrating from Tool-Specific to Cascading Context

### Scenario

Your team currently uses Cursor with a large `.cursorrules` file. You want to migrate to tool-agnostic cascading context.

### Steps

#### 1. Extract General Guidelines from `.cursorrules`

**Before** (`.cursorrules`):
```
Always use TypeScript with strict mode.
Prefer Vitest for testing.
Name functions with camelCase.
Use Zod for validation.
All API endpoints require JWT authentication.
Follow JSON:API response format.
```

**After** (tool-agnostic):
- `docs/standards/typescript.md`: TypeScript, Vitest, camelCase, Zod
- `projects/my-api/README.md`: JWT auth, JSON:API format

**After** (`.cursorrules`):
```
Read context from:
- AGENTS.md (repository-wide)
- docs/standards/typescript.md (language-specific)
- README.md (project-specific)
```

#### 2. Create `AGENTS.md` if It Doesn't Exist

```bash
touch AGENTS.md
```

Populate it with repository-wide conventions (see `AGENTS.md` in the ai-tools repo for a template).

#### 3. Create Standards Files

```bash
mkdir -p docs/standards
touch docs/standards/typescript.md
touch docs/standards/python.md
```

Move language-specific rules from `.cursorrules` into the appropriate standard.

#### 4. Update Project READMEs

For each project, update its README to reference the standards:

```markdown
# MyProject

This project follows:
- `AGENTS.md` for repository-wide conventions
- `docs/standards/typescript.md` for TypeScript rules

Project-specific details:
- Uses Auth0 for authentication
- Follows JSON:API response format
```

#### 5. Test the Migration

1. Ask Cursor to implement a new feature (it should read `.cursorrules`, which now references the tool-agnostic files)
2. Ask Aider or another CLI agent to implement the same feature
3. Verify both follow the same conventions

---

## Workflow 6: Adding Module-Level Context

### Scenario

You have a large project (10k+ lines) with a complex payments subsystem. You want to document the subsystem's architecture so AI agents understand it before making changes.

### Steps

#### 1. Create Module-Level Context File

```bash
mkdir -p src/payments
touch src/payments/README.md
```

#### 2. Document Module Architecture

```markdown
# Payments Module

This module handles payment processing for MyCompany's e-commerce platform.

## Architecture

We use the **Strategy pattern** to support multiple payment providers:

- `PaymentGateway` interface defines the contract all providers implement
- `StripeGateway`, `PayPalGateway`, `ManualGateway` are concrete implementations
- `PaymentService` orchestrates provider selection and error handling

## Key Files

- `src/payments/gateways/` - Payment provider implementations
- `src/payments/services/payment.service.ts` - Main orchestration logic
- `src/payments/types/` - Shared types and interfaces

## Conventions

- All payment operations are idempotent (safe to retry)
- Failed payments are retried up to 3 times with exponential backoff
- After 3 failures, payments are marked as failed and support is notified
- All amounts are stored in cents (integers) to avoid floating-point errors

## Known Limitations

- PayPal integration does not support recurring subscriptions (planned for Q2)
- Manual payments require admin approval (see `ManualGateway.approve()`)

## Testing

- Use `tests/helpers/payment-mocks.ts` for mocking payment providers
- Do NOT make real API calls in tests (use mocks or VCR recordings)

## Integration Points

- `src/orders/` - Orders create payment intents via `PaymentService.createPayment()`
- `src/webhooks/` - Stripe webhooks update payment status via `PaymentService.handleWebhook()`
```

#### 3. Reference Module Context from Project README

Update the project README to mention the module:

```markdown
# MyCompany E-Commerce Platform

## Modules

- `src/payments/` - Payment processing (see `src/payments/README.md`)
- `src/orders/` - Order management
- `src/users/` - User accounts
```

#### 4. Test with AI Agent

Prompt an AI assistant:
```
Refactor the Stripe payment gateway to support refunds.
```

The agent should:
1. Read project README
2. Discover `src/payments/README.md`
3. Understand the Strategy pattern
4. Add a `refund()` method to the `PaymentGateway` interface
5. Implement it in `StripeGateway`
6. Follow the retry and error-handling conventions documented in the module README

---

## Workflow 7: Cross-Tool Consistency

### Scenario

Your team uses multiple AI tools (Cursor, Aider, Claude Code). You want to ensure all tools follow the same conventions.

### Steps

#### 1. Use Tool-Agnostic Context as the Source of Truth

All guidelines should live in:
- `AGENTS.md` (repository-wide)
- `docs/standards/*.md` (language/framework-specific)
- Project/module READMEs (project/module-specific)

Tool-specific files (`.cursorrules`, `.github/copilot-instructions.md`) should reference these, not duplicate them.

#### 2. Create Minimal Tool-Specific Adapters

**Cursor** (`.cursorrules`):
```
Read AGENTS.md and docs/standards/ for conventions.
```

**Copilot** (`.github/copilot-instructions.md`):
```markdown
Follow conventions in AGENTS.md and docs/standards/.
```

**Aider/CLI Agents**: No adapter needed—they auto-discover `AGENTS.md`.

#### 3. Test All Tools with the Same Prompt

```
Add a new API endpoint: GET /api/users/:id/profile
```

Run this prompt with:
- Cursor
- Aider
- Claude Code

Compare the output:
- Do they all use the same naming convention?
- Do they all apply the required middleware?
- Do they all write tests?

If there are discrepancies, your tool-agnostic context may be too implicit. Clarify the guidelines in `AGENTS.md` or `docs/standards/`.

#### 4. Document Tool-Specific Features (Optional)

If you use tool-specific features (e.g., Cursor's codebase indexing or Windsurf Flows), document them in the tool-specific adapter file, not in the tool-agnostic context.

**Example** (`.cursorrules`):
```markdown
# Cursor-Specific Features

- Use workspace-wide search for cross-file refactoring
- Index all files except node_modules, dist, .cache

# General Conventions

Read AGENTS.md and docs/standards/ for all other conventions.
```

---

## Summary: Key Takeaways

1. **Start with tool-agnostic context** (`AGENTS.md`, `docs/standards/`, project READMEs) before adding tool-specific files.

2. **AI agents should traverse the context hierarchy** from most specific (inline comments) to least specific (repository-level), stopping at the first layer that provides an answer.

3. **Conflicts are resolved by specificity**: More specific context (project-level) overrides less specific context (repository-level).

4. **Test your context with multiple AI tools** to ensure it's explicit enough for any agent to follow.

5. **Keep tool-specific files minimal**: Use them only for tool-specific features (indexing preferences, UI settings), not for general conventions.

6. **Module-level context is optional**: Add it only for large, complex subsystems that have distinct architectural patterns.

7. **Audit your context periodically**: Check for duplication, outdated guidelines, and missing references.

---

## Next Steps

- Read `docs/guides/cascading-context.md` for the full methodology
- Explore `collections/typescript-web-service.md` for an example collection
- Use the `skills/setup-cascading-context/` agent skill to audit your project's context
