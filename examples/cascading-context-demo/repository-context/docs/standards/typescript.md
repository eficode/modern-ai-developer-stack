# TypeScript Standards (Example)

This is an **example** standards file demonstrating language-specific context for cascading context.

This file would typically live at `docs/standards/typescript.md` in your repository.

---

## 1. TypeScript Configuration

### 1.1 Required Settings

All TypeScript projects must enable:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

### 1.2 Target and Module

- **Target**: ES2022 or later for Node projects
- **Module**: ESNext for modern Node.js (with "type": "module" in package.json)

---

## 2. Project Structure

All TypeScript projects should follow this structure:

```
project/
├── src/                  # All source code
│   ├── types/            # Shared type definitions
│   ├── utils/            # Pure utility functions
│   ├── services/         # Business logic
│   └── routes/           # API route handlers (for web services)
├── tests/                # Test files mirroring src structure
├── dist/                 # Compiled output (gitignored)
├── tsconfig.json         # TypeScript configuration
└── package.json          # Node.js dependencies
```

---

## 3. Dependency Management

- **Package manager**: Use `npm` or `pnpm` consistently within a project
- **Lock files**: Always commit `package-lock.json` or `pnpm-lock.yaml`

### 3.1 Common Scripts

Add these scripts to `package.json`:

```json
{
  "scripts": {
    "build": "tsc -p .",
    "lint": "eslint .",
    "test": "vitest run",
    "dev": "tsx watch src/index.ts"
  }
}
```

---

## 4. Testing

### 4.1 Test Runner

- **Preferred**: Vitest (fast, modern, good TypeScript support)
- **Alternative**: Jest (if project already uses it)

### 4.2 Test Structure

- Tests live in `tests/` directory, mirroring `src/` structure
- Test files are named `[module].test.ts`
- Use descriptive test names: `describe('PaymentService', () => { it('retries failed captures up to 3 times', ...) })`

### 4.3 Running Tests

```bash
npm test                              # run all tests
npx vitest run path/to/file.test.ts   # run a single test file
npx vitest run --testNamePattern "name"  # run tests matching a name substring
```

---

## 5. Type System Usage

### 5.1 Avoid `any`

Do not use `any` in TypeScript. Use precise types or generics instead.

**Bad**:
```typescript
function processData(data: any): any {
  return data.result
}
```

**Good**:
```typescript
function processData<T>(data: { result: T }): T {
  return data.result
}
```

### 5.2 Prefer Explicit Return Types

Always specify return types for exported functions:

```typescript
// Good
export function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0)
}

// Bad (implicit return type)
export function calculateTotal(items: Item[]) {
  return items.reduce((sum, item) => sum + item.price, 0)
}
```

### 5.3 Use Zod for Runtime Validation

When validating external input (API requests, environment variables), use Zod to generate types automatically:

```typescript
import { z } from 'zod'

const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  age: z.number().min(0),
})

type User = z.infer<typeof UserSchema>

// Validate at runtime
const user = UserSchema.parse(rawData)
```

**Why Zod**: It generates TypeScript types automatically, reducing duplication between runtime and compile-time checks.

---

## 6. Naming Conventions for TypeScript

### 6.1 Route Handlers (for web services)

Name route handlers with the pattern `handle[Method][Resource]`:

```typescript
// Good
export async function handleGetUser(req, res) { ... }
export async function handlePostOrder(req, res) { ... }

// Bad
export async function getUser(req, res) { ... }
export async function createOrder(req, res) { ... }
```

### 6.2 Service Functions

Name service functions as verbs describing the action:

```typescript
// Good
export async function createPayment(amount: number): Promise<Payment> { ... }
export async function refundPayment(paymentId: string): Promise<void> { ... }

// Bad
export async function payment(amount: number) { ... }
export async function refund(paymentId: string) { ... }
```

---

## 7. Module Organization

### 7.1 Barrel Exports

Use `index.ts` files to re-export public APIs from a module:

```typescript
// src/services/index.ts
export { PaymentService } from './payment.service'
export { OrderService } from './order.service'
export type { Payment, Order } from './types'
```

This allows clean imports: `import { PaymentService } from './services'`

### 7.2 Avoid Circular Dependencies

If module A imports from module B, module B should not import from module A.

Use dependency injection or event-driven patterns to break cycles.

---

## 8. Error Handling

### 8.1 Custom Error Classes

Create custom error classes for domain-specific errors:

```typescript
export class PaymentFailedError extends Error {
  constructor(
    message: string,
    public readonly paymentId: string,
    public readonly providerCode: string
  ) {
    super(message)
    this.name = 'PaymentFailedError'
  }
}
```

### 8.2 Async Error Handling

Always use `try/catch` with async code:

```typescript
// Good
try {
  const payment = await processPayment(paymentId)
  return payment
} catch (error) {
  logger.error('Payment processing failed', { paymentId, error })
  throw new PaymentFailedError('Failed to process payment', paymentId, error.code)
}
```

---

## 9. Linting & Formatting

### 9.1 ESLint

Use ESLint with TypeScript support:

```bash
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

**Config** (`.eslintrc.json`):
```json
{
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error"
  }
}
```

### 9.2 Prettier

Use Prettier for consistent formatting:

```bash
npm install --save-dev prettier
```

**Config** (`.prettierrc.json`):
```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 100
}
```

---

## 10. Tool-Agnostic Principle

These standards are written in plain markdown and contain general TypeScript conventions, not tool-specific syntax.

The same guidelines apply whether you use:
- Cursor, GitHub Copilot, Aider, Claude Code, Windsurf, or future AI tools
- VSCode, WebStorm, or other IDEs
- CI pipelines (GitHub Actions, GitLab CI, etc.)

For tool-specific settings, use small adapter files that reference this standards file.
