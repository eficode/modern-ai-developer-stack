# Cascading Context Demo

This example demonstrates a complete cascading context hierarchy for a fictional TypeScript API service.

**Purpose**: Show how context flows from repository-level (`AGENTS.md`) down to inline code comments, with each layer adding specificity without duplication.

---

## Directory Structure

```
examples/cascading-context-demo/
├── README.md (this file)
├── repository-context/
│   ├── AGENTS.md                    # Repository-wide conventions
│   ├── docs/
│   │   └── standards/
│   │       └── typescript.md        # Language-specific standards
│   └── collections/
│       └── typescript-web-service.md  # Stack collection
├── project-context/
│   ├── README.md                    # Project-specific architecture
│   ├── .cursorrules                 # Tool-specific adapter (Cursor)
│   └── .github/
│       └── copilot-instructions.md  # Tool-specific adapter (Copilot)
├── module-context/
│   └── src/
│       └── payments/
│           └── README.md            # Module-level architecture
└── file-context/
    └── payment-service.example.ts   # Inline comments
```

---

## Context Layers Demonstrated

### 1. Repository Level

**File**: `repository-context/AGENTS.md`

Defines organization-wide conventions for all projects.

**Key Points**:
- Code style (naming, formatting, error handling)
- Git workflow expectations
- Testing philosophy

### 2. Standards Level

**File**: `repository-context/docs/standards/typescript.md`

Defines TypeScript-specific conventions.

**Key Points**:
- TypeScript tooling (tsc, Vitest, ESLint)
- Type system usage
- Module organization

### 3. Collections Level

**File**: `repository-context/collections/typescript-web-service.md`

An opinionated stack combining multiple standards.

**Key Points**:
- Curated list of dependencies
- Recommended project structure
- Integration patterns

### 4. Project Level

**File**: `project-context/README.md`

Project-specific architecture and conventions.

**Key Points**:
- Domain context (what this service does)
- Third-party integrations (Auth0, Stripe)
- Deviations from higher-level standards

**Tool-Specific Adapters**:
- `.cursorrules` (for Cursor IDE)
- `.github/copilot-instructions.md` (for GitHub Copilot)

These adapters are minimal and reference the tool-agnostic context files.

### 5. Module Level

**File**: `module-context/src/payments/README.md`

Architecture and conventions for the payments subsystem.

**Key Points**:
- Module-specific patterns (Strategy pattern for payment providers)
- Internal conventions (amounts in cents, retry logic)
- Integration points with other modules

### 6. File Level

**File**: `file-context/payment-service.example.ts`

Inline comments explaining specific decisions.

**Key Points**:
- Why a non-obvious approach was chosen
- Edge cases and invariants
- References to external documentation

---

## How to Use This Example

### For Human Developers

1. Read `repository-context/AGENTS.md` to understand organization-wide conventions
2. Read `repository-context/docs/standards/typescript.md` for TypeScript-specific rules
3. Read `project-context/README.md` for project-specific architecture
4. When working on the payments module, read `module-context/src/payments/README.md`
5. Refer to inline comments in code for function-specific details

### For AI Agents

When asked to perform a task (e.g., "add a refund endpoint to the payments API"):

1. **Discover context files**:
   - Check for `AGENTS.md` in repo root
   - Check for `docs/standards/` directory
   - Check for `collections/` directory
   - Read project `README.md`
   - Check if the relevant module has a `README.md`

2. **Traverse context hierarchy** (from specific to general):
   - Check inline comments near the code being modified
   - Read module-level context (`src/payments/README.md`)
   - Read project-level context (`README.md`)
   - Read collection-level context (`collections/typescript-web-service.md`)
   - Read standards-level context (`docs/standards/typescript.md`)
   - Read repository-level context (`AGENTS.md`)

3. **Synthesize requirements**:
   - Extract relevant guidelines from each layer
   - Resolve conflicts (more specific context wins)
   - Apply all applicable conventions to the new code

4. **Implement the feature** following the synthesized requirements

---

## Decision Log Example

This section demonstrates how an AI agent would resolve a specific task by traversing the context hierarchy.

### Task

Add a new endpoint: `POST /api/payments/refund`

### Context Traversal

1. **File Level** (`payment-service.example.ts`):
   - Existing `refundPayment` method with inline documentation describing refund behavior and constraints

2. **Module Level** (`src/payments/README.md`):
   - All payment operations are idempotent
   - Failed operations are retried up to 3 times
   - All amounts in cents (integers)
   - Use Strategy pattern (implement in PaymentGateway interface first)

3. **Project Level** (`project-context/README.md`):
   - All endpoints require Auth0 JWT authentication
   - Responses follow JSON:API format
   - Rate limiting: 100 requests per minute per API key

4. **Collection Level** (`collections/typescript-web-service.md`):
   - Use Fastify for routing
   - Store routes in `src/routes/`
   - Use Zod for validation

5. **Standards Level** (`docs/standards/typescript.md`):
   - Name route handlers: `handle[Method][Resource]`
   - Use strict TypeScript mode
   - Write focused unit tests

6. **Repository Level** (`AGENTS.md`):
   - Use camelCase for functions
   - Fail fast with actionable error messages
   - Write tests for all new functionality

### Synthesized Requirements

From the context traversal, the agent determines:

- **Route**: `POST /api/payments/refund` (task requirement)
- **Handler name**: `handlePostPaymentRefund` (standards-level naming)
- **Location**: `src/routes/payments.routes.ts` (collection-level structure)
- **Validation**: Use Zod for request body (collection-level tooling)
- **Authentication**: Apply Auth0 JWT middleware (project-level security)
- **Response format**: JSON:API structure (project-level API design)
- **Architecture**: Implement `refund()` method in `PaymentGateway` interface first (module-level pattern)
- **Error handling**: Retry up to 3 times, then return actionable error (module-level + repository-level)
- **Data format**: Amount in cents (module-level convention)
- **Testing**: Write unit tests in `tests/routes/payments.routes.test.ts` (standards-level + repository-level)

### Result

The agent produces code that follows all applicable conventions without being explicitly told every detail.

---

## Tool Agnostic Benefits

This example demonstrates cascading context using **tool-agnostic markdown files**. The same context hierarchy works with:

- **Cursor**: Reads `.cursorrules`, which references `AGENTS.md` and `docs/standards/`
- **GitHub Copilot**: Reads `.github/copilot-instructions.md`, which references the same files
- **Aider**: Automatically discovers `AGENTS.md` and project READMEs
- **Claude Code**: Reads `AGENTS.md` and markdown documentation
- **Windsurf**: Discovers context files and uses them for Flows
- **Future AI tools**: Can read the same standard markdown files

### What Happens When You Switch Tools?

If your team migrates from Cursor to Windsurf:

1. **No context rewrite needed**: All conventions are in tool-agnostic markdown files
2. **Update only the adapter**: Remove `.cursorrules`, add Windsurf-specific config (if needed)
3. **Same conventions apply**: Windsurf reads `AGENTS.md` and follows the same rules Cursor did

### What Happens with Tool-Specific Context?

If you put all your conventions in `.cursorrules`:

1. **Cursor-only**: Other tools can't read it
2. **Migration friction**: Must rewrite all context for the new tool
3. **Duplication**: Human developers need separate documentation

By using tool-agnostic cascading context, you maintain **one source of truth** that works for humans and all AI tools.

---

## Next Steps

1. Explore each context layer in the subdirectories
2. Read the **Decision Log Example** section to see how an agent would synthesize requirements
3. Apply this structure to your own projects
4. Use the `skills/setup-cascading-context/` agent skill to audit your existing context

---

## Further Reading

- `docs/guides/cascading-context.md` – Full methodology guide
- `docs/workflows/context-aware-development.md` – Practical workflows
- `collections/typescript-web-service.md` – Real collection example
