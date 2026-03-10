# MyCompany API Gateway (Example Project)

This is an **example** project README demonstrating project-level context for cascading context.

This file would typically live at the root of a specific project directory.

---

## Overview

**MyCompany API Gateway** is a REST API that aggregates data from multiple microservices and exposes a unified interface for frontend applications.

---

## Context Hierarchy

This project follows:
- **Repository-wide conventions**: See `AGENTS.md` in the repo root
- **TypeScript standards**: See `docs/standards/typescript.md`
- **Web service stack**: See `collections/typescript-web-service.md`

This README adds **project-specific** conventions and architecture details.

---

## Project-Specific Conventions

### Authentication

**All endpoints require OAuth2 authentication via Auth0.**

- Tokens are validated using `src/middleware/auth.ts`
- Tokens must be sent in the `Authorization` header: `Bearer <token>`
- Invalid or missing tokens return `401 Unauthorized`

**Implementation**:
```typescript
// All routes use the authenticateJWT middleware
app.get('/api/users/:id', { preHandler: authenticateJWT }, handleGetUser)
```

### API Response Format

**All responses follow the JSON:API specification.**

**Success response**:
```json
{
  "data": {
    "type": "user",
    "id": "123",
    "attributes": {
      "email": "user@example.com",
      "name": "John Doe"
    }
  }
}
```

**Error response**:
```json
{
  "errors": [
    {
      "status": "404",
      "title": "User not found",
      "detail": "No user found with ID 123"
    }
  ]
}
```

### Rate Limiting

**All endpoints are rate-limited: 100 requests per minute per API key.**

- Rate limiting is implemented using Redis in `src/middleware/rate-limit.ts`
- Exceeded limits return `429 Too Many Requests`

### Timestamps

**Always use ISO-8601 format for timestamps:**
```typescript
createdAt: new Date().toISOString()  // "2026-03-06T10:30:00.000Z"
```

---

## Architecture

### High-Level Design

```
┌─────────────┐
│  Frontend   │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│  API Gateway (this) │
└──────┬──────────────┘
       │
       ├──────────────┐
       │              │
       ▼              ▼
┌──────────┐   ┌──────────┐
│  User    │   │ Payment  │
│  Service │   │ Service  │
└──────────┘   └──────────┘
```

### Modules

- **`src/routes/`** – API route handlers, grouped by resource (users, orders, payments)
- **`src/services/`** – Business logic for aggregating data from microservices
- **`src/middleware/`** – Fastify middleware (auth, rate limiting, error handling)
- **`src/schemas/`** – Zod validation schemas for request/response bodies
- **`src/clients/`** – HTTP clients for calling downstream microservices
- **`src/types/`** – Shared TypeScript types

### Key Integration Points

- **Auth0**: JWT validation (`src/middleware/auth.ts`)
- **Redis**: Rate limiting and caching (`src/utils/redis.ts`)
- **User Service**: `https://users.internal.mycompany.com` (HTTP client: `src/clients/user-client.ts`)
- **Payment Service**: `https://payments.internal.mycompany.com` (HTTP client: `src/clients/payment-client.ts`)

---

## Getting Started

### Prerequisites

- Node.js 20+
- Redis (for rate limiting)
- Auth0 account (for JWT validation)

### Installation

```bash
npm install
```

### Configuration

Copy `.env.example` to `.env` and fill in the values:

```bash
# Auth0
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_AUDIENCE=https://api.mycompany.com

# Redis
REDIS_URL=redis://localhost:6379

# Downstream services
USER_SERVICE_URL=https://users.internal.mycompany.com
PAYMENT_SERVICE_URL=https://payments.internal.mycompany.com

# Server
PORT=3000
LOG_LEVEL=info
```

### Running Locally

```bash
npm run dev
```

The server will start on `http://localhost:3000`.

---

## Testing

### Run All Tests

```bash
npm test
```

### Run Specific Test File

```bash
npm test -- users.routes.test.ts
```

### Test Coverage

```bash
npm run test:coverage
```

Target: 80%+ coverage for routes and services.

---

## API Endpoints

### Users

- `GET /api/users/:id` – Get user by ID
- `POST /api/users` – Create a new user
- `PATCH /api/users/:id` – Update user
- `DELETE /api/users/:id` – Delete user

### Orders

- `GET /api/orders/:id` – Get order by ID
- `POST /api/orders` – Create a new order
- `GET /api/users/:id/orders` – Get all orders for a user

### Payments

- `POST /api/payments` – Create a payment
- `POST /api/payments/:id/refund` – Refund a payment

All endpoints require `Authorization: Bearer <token>` header.

---

## Deployment

### Build

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Docker

```bash
docker build -t mycompany-api-gateway .
docker run -p 3000:3000 --env-file .env mycompany-api-gateway
```

---

## Monitoring & Logging

- **Logs**: Structured JSON logs via Pino (see `src/utils/logger.ts`)
- **Health check**: `GET /health` (returns 200 OK if server is healthy)
- **Metrics**: Prometheus metrics exposed at `GET /metrics`

---

## Deviations from Standards

This project deviates from repository-level standards in the following ways:

1. **JSON:API format**: This project uses JSON:API for all responses, which is more specific than the general "return JSON" guideline in `AGENTS.md`.

2. **Rate limiting**: This project enforces rate limiting on all endpoints, which is not a repository-wide requirement.

**Justification**: These are project-specific requirements for the API gateway use case.

---

## Contributing

When adding new features:

1. Follow the context hierarchy (read `AGENTS.md`, `docs/standards/typescript.md`, `collections/typescript-web-service.md`, and this README)
2. Add new routes to `src/routes/` (one file per resource)
3. Add business logic to `src/services/`
4. Write tests in `tests/` (mirroring `src/` structure)
5. Update this README if you add new endpoints or change architecture

---

## Tool-Agnostic Principle

This README is written in plain markdown and contains general project conventions, not tool-specific syntax.

The same conventions apply whether you use:
- Cursor, GitHub Copilot, Aider, Claude Code, Windsurf, or future AI tools
- VSCode, WebStorm, or other IDEs

For tool-specific settings, see:
- `.cursorrules` (Cursor IDE)
- `.github/copilot-instructions.md` (GitHub Copilot)

These files reference this README and higher-level context files.
