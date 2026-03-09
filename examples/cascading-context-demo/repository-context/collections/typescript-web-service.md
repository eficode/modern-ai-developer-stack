# TypeScript Web Service Collection (Example)

This is an **example** collection file demonstrating a curated stack for cascading context.

This file would typically live at `collections/typescript-web-service.md` in your repository.

---

## What is a Collection?

A **collection** is an opinionated, ready-to-use stack that combines multiple standards into a cohesive starting point for a specific type of project.

Collections reference standards (like `docs/standards/typescript.md`) and add stack-specific conventions.

---

## This Collection

**Name**: TypeScript Web Service

**Purpose**: Build REST APIs with TypeScript, focusing on developer experience, type safety, and testability.

**Standards Used**:
- `docs/standards/typescript.md` – TypeScript-specific conventions
- `AGENTS.md` – Repository-wide conventions

---

## Stack

### Core Framework

- **Fastify** – Fast web framework with excellent TypeScript support
  - Why Fastify: Better performance than Express, built-in schema validation, modern async/await patterns

### Validation & Types

- **Zod** – Runtime validation with automatic TypeScript type generation
  - Why Zod: Generates types from schemas, eliminating duplication

### Testing

- **Vitest** – Fast, modern test runner with native TypeScript support
- **Supertest** – HTTP assertion library for testing APIs

### Database (Optional)

- **Prisma** or **Drizzle** – Type-safe ORMs with excellent TypeScript support
  - Why Prisma/Drizzle: Generated types for database queries, migration tooling

### Logging

- **Pino** – Fast JSON logger for Node.js
  - Why Pino: Performance, structured logging, Fastify integration

---

## Project Structure

```
project/
├── src/
│   ├── routes/               # API route handlers
│   │   ├── users.routes.ts
│   │   ├── orders.routes.ts
│   │   └── index.ts          # Register all routes
│   ├── services/             # Business logic
│   │   ├── user.service.ts
│   │   └── order.service.ts
│   ├── middleware/           # Fastify middleware
│   │   ├── auth.ts
│   │   ├── error-handler.ts
│   │   └── rate-limit.ts
│   ├── schemas/              # Zod validation schemas
│   │   ├── user.schema.ts
│   │   └── order.schema.ts
│   ├── types/                # Shared TypeScript types
│   │   └── index.ts
│   ├── utils/                # Pure utility functions
│   │   └── logger.ts
│   ├── app.ts                # Fastify app setup
│   └── server.ts             # Entry point
├── tests/                    # Tests mirroring src
│   ├── routes/
│   │   └── users.routes.test.ts
│   ├── services/
│   │   └── user.service.test.ts
│   └── helpers/
│       └── test-app.ts       # Test app builder
├── prisma/                   # Prisma schema (if using Prisma)
│   └── schema.prisma
├── dist/                     # Compiled output (gitignored)
├── .env.example              # Example environment variables
├── tsconfig.json
├── package.json
└── README.md
```

---

## Key Conventions

### 1. Route Handlers

**Location**: `src/routes/`

**Naming**: Group routes by resource, one file per resource:
- `users.routes.ts` – All `/users/*` routes
- `orders.routes.ts` – All `/orders/*` routes

**Handler naming**: `handle[Method][Resource]`

**Example**:

```typescript
// src/routes/users.routes.ts
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { getUserById } from '../services/user.service'

const UserIdSchema = z.object({
  id: z.string().uuid(),
})

export async function handleGetUser(
  request: FastifyRequest<{ Params: z.infer<typeof UserIdSchema> }>,
  reply: FastifyReply
): Promise<void> {
  const { id } = UserIdSchema.parse(request.params)
  const user = await getUserById(id)
  
  if (!user) {
    return reply.status(404).send({ error: 'User not found' })
  }
  
  reply.send({ data: user })
}

export function registerUserRoutes(app: FastifyInstance): void {
  app.get('/api/users/:id', handleGetUser)
}
```

### 2. Validation Schemas

**Location**: `src/schemas/`

**Pattern**: Define Zod schemas and export inferred types:

```typescript
// src/schemas/user.schema.ts
import { z } from 'zod'

export const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  age: z.number().min(0).optional(),
})

export type CreateUserInput = z.infer<typeof CreateUserSchema>
```

### 3. Business Logic

**Location**: `src/services/`

**Pattern**: Service functions are async and return promises:

```typescript
// src/services/user.service.ts
import type { User, CreateUserInput } from '../types'

export async function createUser(input: CreateUserInput): Promise<User> {
  // Database logic here
}

export async function getUserById(id: string): Promise<User | null> {
  // Database logic here
}
```

### 4. Middleware

**Location**: `src/middleware/`

**Pattern**: Fastify hooks or preHandler functions:

```typescript
// src/middleware/auth.ts
import { FastifyRequest, FastifyReply } from 'fastify'

export async function authenticateJWT(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const token = request.headers.authorization?.replace('Bearer ', '')
  
  if (!token) {
    return reply.status(401).send({ error: 'Missing token' })
  }
  
  // Validate token...
}
```

### 5. Testing

**Location**: `tests/` (mirrors `src/` structure)

**Pattern**: Use Vitest + Supertest for integration tests:

```typescript
// tests/routes/users.routes.test.ts
import { describe, it, expect } from 'vitest'
import { buildApp } from '../helpers/test-app'

describe('GET /api/users/:id', () => {
  it('returns user when found', async () => {
    const app = buildApp()
    
    const response = await app.inject({
      method: 'GET',
      url: '/api/users/550e8400-e29b-41d4-a716-446655440000',
    })
    
    expect(response.statusCode).toBe(200)
    expect(response.json().data).toHaveProperty('email')
  })
  
  it('returns 404 when user not found', async () => {
    const app = buildApp()
    
    const response = await app.inject({
      method: 'GET',
      url: '/api/users/00000000-0000-0000-0000-000000000000',
    })
    
    expect(response.statusCode).toBe(404)
  })
})
```

---

## Integration Patterns

### Authentication

Use JWT tokens with middleware:

```typescript
// src/middleware/auth.ts
import jwt from 'jsonwebtoken'

export async function authenticateJWT(request, reply) {
  const token = request.headers.authorization?.replace('Bearer ', '')
  
  if (!token) {
    reply.status(401).send({ error: 'Unauthorized' })
    return
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    request.user = decoded
  } catch (err) {
    reply.status(401).send({ error: 'Unauthorized' })
    return
  }
}

// Usage in routes:
app.get('/api/protected', { preHandler: authenticateJWT }, handler)
```

### Database (Prisma)

```typescript
// src/services/user.service.ts
import { prisma } from '../utils/db'

export async function getUserById(id: string) {
  return prisma.user.findUnique({ where: { id } })
}
```

### Logging

```typescript
// src/utils/logger.ts
import pino from 'pino'

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
})

// Usage:
logger.info({ userId: '123' }, 'User created')
logger.error({ error }, 'Payment failed')
```

---

## CI/CD Outline

### GitHub Actions Example

```yaml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      - run: npm ci
      - run: npm run lint
      - run: npm run build
      - run: npm test
```

---

## Environment Variables

Use `.env` files for local development:

```bash
# .env.example
DATABASE_URL=postgresql://user:pass@localhost:5432/db
JWT_SECRET=your-secret-key
LOG_LEVEL=info
PORT=3000
```

**Validation**: Use Zod to validate environment variables at startup:

```typescript
// src/utils/env.ts
import { z } from 'zod'

const EnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  PORT: z.coerce.number().default(3000),
})

export const env = EnvSchema.parse(process.env)
```

---

## Getting Started

### 1. Scaffold a New Project

```bash
mkdir my-api-service
cd my-api-service
npm init -y
npm install fastify zod pino
npm install --save-dev typescript vitest @types/node tsx
```

### 2. Set Up TypeScript

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 3. Add Scripts to `package.json`

```json
{
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc -p .",
    "start": "node dist/server.js",
    "test": "vitest run",
    "lint": "eslint ."
  }
}
```

### 4. Follow the Project Structure

Create directories: `src/routes/`, `src/services/`, `src/middleware/`, `src/schemas/`, `tests/`

---

## Tool-Agnostic Principle

This collection is written in plain markdown and contains general conventions, not tool-specific syntax.

The same stack and conventions apply whether you use:
- Cursor, GitHub Copilot, Aider, Claude Code, Windsurf, or future AI tools
- VSCode, WebStorm, or other IDEs

For tool-specific settings, use small adapter files that reference this collection.
