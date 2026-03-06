# Cascading Context: A Tool-Agnostic Approach to AI-Assisted Development

## What is Cascading Context?

**Cascading Context** is a methodology for organizing instructions, conventions, and architectural decisions across multiple layers of a software project so that AI coding assistants can access the right information at the right level of specificity.

Unlike tool-specific configuration files (`.cursorrules`, `.github/copilot-instructions.md`, etc.), cascading context emphasizes **general, tool-agnostic guidelines** that can be consumed by any AI agent, whether it's Cursor, GitHub Copilot, Windsurf, Aider, Claude Code, or future tools.

### Why Cascading Context Matters

1. **Tool Independence**: By using general markdown documentation and standard formats, your context files remain useful regardless of which AI coding tool your team adopts.

2. **Easy Tool Migration**: When a better AI assistant emerges, you don't rewrite your entire context system—agents simply read the same markdown files.

3. **Progressive Specificity**: Broad organizational principles live at the repository level; specific implementation details live close to the code they affect.

4. **Reduced Duplication**: Each layer of context adds or refines information without repeating what's already defined at higher levels.

5. **Human-Readable Documentation**: Context files double as onboarding documentation for human developers.

---

## The Context Hierarchy

Cascading context is organized in layers, from broadest (repository-wide) to most specific (inline code). Each layer inherits and can override or extend the layers above it.

### 1. Repository Level

**Files**: `AGENTS.md`, `README.md`, `CONTRIBUTING.md`

**Purpose**: Define the overarching philosophy, workflows, and conventions for the entire codebase.

**What belongs here**:
- High-level architecture and design philosophy
- Repository-wide code style (naming, formatting, error handling)
- Git workflow expectations (commit messages, branching strategy)
- Testing philosophy (unit vs integration, coverage expectations)
- Build and deployment conventions
- Links to lower-level context (standards, collections, guides)

**Example from `AGENTS.md`**:
```markdown
## Code Style Guidelines
- Prefer TypeScript over plain JavaScript for new Node-based code
- Enable strict typing by default
- Fail fast in tooling and CLIs; do not silently ignore failures
```

**Tool Agnostic**: These are general principles that apply whether you're using Cursor, Copilot, Aider, or a future AI tool. No tool-specific syntax is used.

---

### 2. Standards Level

**Files**: `docs/standards/typescript.md`, `docs/standards/python.md`, etc.

**Purpose**: Define language-specific or framework-specific conventions that apply across all projects using that stack.

**What belongs here**:
- Language-specific tooling (linters, formatters, test runners)
- Dependency management approach (npm/pnpm, uv/pip, cargo, etc.)
- File and folder structure conventions
- Module organization patterns
- Type system usage and boundaries
- Language-specific error handling patterns

**Example**:
```markdown
## TypeScript Project Structure
- `src/` - all source code
- `src/types/` - shared type definitions
- `src/utils/` - pure utility functions
- `tests/` - test files mirroring src structure
```

**Tool Agnostic**: Standards describe *what* to do, not *which AI tool* should do it. They work equally well for Windsurf Flows, Aider pair programming, or Cursor Composer.

---

### 3. Collections Level

**Files**: `collections/typescript-web-service.md`, `collections/python-ml-service.md`, etc.

**Purpose**: Provide opinionated, ready-to-use stacks that combine multiple standards into a cohesive starting point.

**What belongs here**:
- A curated list of dependencies and tools
- Recommended project structure for this specific use case
- CI/CD pipeline outline
- Integration patterns (databases, APIs, authentication)
- References to the standards being composed

**Example**:
```markdown
## TypeScript Web Service Stack
Combines `docs/standards/typescript.md` with web-specific conventions:
- Framework: Express or Fastify
- Validation: Zod
- ORM: Prisma or Drizzle
- Testing: Vitest + Supertest
```

**Tool Agnostic**: Collections are documented in plain markdown. Any AI tool can read and apply them when scaffolding a new service.

---

### 4. Project Level

**Files**: Project-specific `README.md`, `.cursorrules`, `.github/copilot-instructions.md`, `docs/architecture.md`

**Purpose**: Define the specifics of *this* project—its domain, architecture, and any deviations from higher-level standards.

**What belongs here**:
- Project domain and business context
- Architecture diagrams and component relationships
- Third-party integrations and API contracts
- Project-specific conventions (e.g., "always use ISO-8601 for timestamps")
- Deviations from repository or language standards (with justification)

**Tool-Specific vs Tool-Agnostic**:
- **Tool-Agnostic**: `README.md`, `docs/architecture.md` (readable by any agent or human)
- **Tool-Specific**: `.cursorrules`, `.github/copilot-instructions.md` (only work with specific tools)

**Best Practice**: Keep the bulk of your context in tool-agnostic files like `README.md` and `docs/`. Use tool-specific files only for features unique to that tool (e.g., Cursor's codebase indexing preferences or Copilot's file ignore patterns).

---

### 5. Module Level

**Files**: `src/payments/README.md`, `src/auth/CONTEXT.md`

**Purpose**: Document the design and conventions of a specific subsystem or module within a larger project.

**What belongs here**:
- Module-specific architecture (e.g., "payments uses the Strategy pattern")
- Key abstractions and their responsibilities
- Internal conventions (e.g., "all payment providers implement the PaymentGateway interface")
- Known limitations or technical debt
- Integration points with other modules

**When to use**:
- In large projects (10k+ lines) where subsystems have distinct patterns
- When a module has a different architectural style than the rest of the project
- When onboarding new developers (or agents) to a complex subsystem

**Tool Agnostic**: Module-level context files are just markdown. They help any AI assistant understand the local architecture before making changes.

---

### 6. File Level

**Files**: Inline comments, docstrings, JSDoc, type annotations

**Purpose**: Explain the "why" behind specific functions, classes, or algorithms.

**What belongs here**:
- Why a non-obvious approach was chosen
- Edge cases and invariants
- Performance considerations
- References to external documentation (RFCs, API docs)

**Example**:
```typescript
/**
 * Retries failed payment captures up to 3 times with exponential backoff.
 * 
 * We retry because Stripe occasionally returns transient 500 errors during
 * high load. After 3 attempts, we mark the payment as failed and notify support.
 * 
 * See: https://stripe.com/docs/error-handling
 */
export async function capturePaymentWithRetry(paymentId: string): Promise<void> {
  // ...
}
```

**Tool Agnostic**: Standard code comments and docstrings work with all AI tools and serve as inline documentation for humans.

---

## How Context Cascades: Resolution Rules

When an AI agent needs to make a decision (e.g., "Should I use `any` in TypeScript?"), it should traverse the context hierarchy from **most specific to least specific**, stopping at the first layer that provides an answer.

### Resolution Order (Most Specific First)

1. **Inline comment or docstring** (if present and relevant)
2. **Module-level context** (e.g., `src/auth/README.md`)
3. **Project-level context** (e.g., project `README.md` or `docs/architecture.md`)
4. **Collection-level context** (e.g., `collections/typescript-web-service.md`)
5. **Standards-level context** (e.g., `docs/standards/typescript.md`)
6. **Repository-level context** (e.g., `AGENTS.md`)
7. **Agent's default behavior** (fallback if no context provides guidance)

### Example: Should I use `any` in TypeScript?

**Question**: An agent is writing a TypeScript function and wonders if it can use `any`.

**Resolution**:
1. Check inline comments near the function → No guidance
2. Check `src/[module]/README.md` → No guidance
3. Check project `README.md` → No guidance
4. Check `collections/typescript-web-service.md` → No guidance
5. Check `docs/standards/typescript.md` → **Found**: "Avoid `any` in TypeScript; use precise types or generics instead."
6. **Decision**: Do not use `any`.

### Handling Conflicts

If two context layers give conflicting guidance, **more specific context wins**.

**Example Conflict**:
- `AGENTS.md` says: "Prefer many small, focused tests"
- Project `README.md` says: "This legacy service has large integration tests; do not refactor tests without approval"

**Resolution**: The project-level context overrides the repository-level guidance because it's more specific to this codebase.

---

## Benefits of Tool-Agnostic Context

### 1. Future-Proof Your Investment

AI coding tools evolve rapidly. In 2023, GitHub Copilot was dominant. In 2024, Cursor and Windsurf gained traction. In 2025, new agentic IDEs will emerge.

By using tool-agnostic markdown files and standard formats, your context remains useful regardless of which tool your team adopts next.

### 2. Multi-Tool Teams

Not everyone on your team will use the same AI assistant. Some prefer Cursor's deep codebase indexing; others prefer Aider's git-aware pair programming in the terminal.

Tool-agnostic context files (like `AGENTS.md` and `docs/standards/`) work for all team members, regardless of their editor.

### 3. Easier Migration

When switching from one AI tool to another, you only need to:
- Install the new tool
- Point it to your existing context files (if it doesn't auto-discover them)

You **do not** need to:
- Rewrite all your context in a new format
- Retrain your team on a new context system
- Lose accumulated knowledge stored in tool-specific files

### 4. Human Readability

Context files written in plain markdown are also excellent onboarding documentation for human developers. New team members can read `AGENTS.md`, `docs/standards/typescript.md`, and project READMEs to understand the team's conventions—no AI tool required.

---

## Best Practices for Cascading Context

### 1. Start Broad, Add Specificity as Needed

Begin with repository-level context (`AGENTS.md`) and language standards (`docs/standards/`). Only add project-level or module-level context when the project deviates from those standards or has unique architectural needs.

### 2. Avoid Duplication

If a guideline applies to all TypeScript projects, put it in `docs/standards/typescript.md`, not in every project's README. Use references instead:

```markdown
# MyProject README
This project follows the conventions in `docs/standards/typescript.md` with the following additions:
- Always use ISO-8601 for timestamps
- Prefer Zod over Joi for validation
```

### 3. Document the "Why," Not Just the "What"

Good context explains *why* a decision was made, so agents (and humans) understand when to apply or break the rule.

**Bad**: "Use Zod for validation."

**Good**: "Use Zod for validation because it generates TypeScript types automatically, reducing duplication between runtime and compile-time checks."

### 4. Keep Tool-Specific Files Minimal

If you must use tool-specific files (`.cursorrules`, `.github/copilot-instructions.md`), keep them small and focused on tool-specific features. Put the bulk of your context in tool-agnostic markdown files.

**Example `.cursorrules`**:
```
# Cursor-specific settings
indexIgnore = ["node_modules", "dist", ".cache"]

# For all other context, read AGENTS.md and docs/standards/
```

### 5. Test Your Context with Different Tools

Periodically test that your context files work with multiple AI assistants:
- Ask Cursor to implement a feature
- Ask Aider to do the same task
- Verify both follow the guidelines in your context files

If one tool ignores your context, your guidelines may be too implicit. Make them more explicit or add a tool-specific pointer.

### 6. Version Control Everything

All context files should be committed to your repository. This ensures:
- Context evolves with the codebase
- Changes are reviewable and auditable
- New team members (and agents) get the latest context automatically

---

## Tool-Specific Adapters (When Necessary)

Some AI tools require specific file formats or locations. When using these tools, create small adapter files that reference your tool-agnostic context.

### Cursor

**File**: `.cursorrules` or `.cursor/rules/*.md`

**Content**:
```markdown
# Cursor Rules

Read the following context files for guidance:
- AGENTS.md (repository-wide conventions)
- docs/standards/typescript.md (TypeScript-specific rules)
- README.md (project-specific architecture)

## Cursor-Specific Settings
- Index all files except node_modules, dist, .cache
- Use workspace-wide search for cross-file refactoring
```

### GitHub Copilot

**File**: `.github/copilot-instructions.md`

**Content**:
```markdown
# Copilot Instructions

Follow the coding standards in AGENTS.md and docs/standards/.

This project uses:
- TypeScript with strict mode
- Vitest for testing
- ESLint for linting

For detailed conventions, see docs/standards/typescript.md.
```

### Windsurf / Aider / CLI Agents

Most CLI agents automatically discover `AGENTS.md` and standard README files. No adapter needed—just ensure your tool-agnostic context is well-organized and discoverable.

---

## Example: Cascading Context in Action

### Scenario

An AI agent needs to add a new API endpoint to a TypeScript web service.

### Context Traversal

1. **Repository Level** (`AGENTS.md`):
   - "Fail fast in tooling and CLIs; do not silently ignore failures"
   - "Prefer many small, focused tests over a few large integration suites"

2. **Standards Level** (`docs/standards/typescript.md`):
   - "Use Zod for request validation"
   - "Name API route handlers with the pattern `handle[Method][Resource]` (e.g., `handleGetUser`)"

3. **Collection Level** (`collections/typescript-web-service.md`):
   - "Use Fastify for routing"
   - "Store route handlers in `src/routes/`"

4. **Project Level** (project `README.md`):
   - "All endpoints require JWT authentication (see `src/middleware/auth.ts`)"
   - "Responses must follow the JSON:API specification"

5. **Module Level** (`src/routes/README.md`):
   - "Routes are grouped by resource (users, posts, comments)"
   - "Each resource has its own file (e.g., `users.routes.ts`)"

### Agent's Decision

The agent synthesizes all layers:
- Creates a new route handler in `src/routes/users.routes.ts` (module-level)
- Names it `handleGetUserProfile` (standards-level)
- Uses Zod to validate query parameters (standards-level)
- Adds JWT auth middleware (project-level)
- Returns a JSON:API-compliant response (project-level)
- Fails with a 400 error if validation fails (repository-level)
- Writes focused unit tests for the handler (repository-level)

**Result**: The agent produced code that follows all relevant conventions without being explicitly told every detail—it cascaded through the context hierarchy to gather the necessary information.

---

## Migrating to Cascading Context

If you're starting fresh or migrating from tool-specific context files, follow this process:

### Step 1: Audit Existing Context

Identify all places where conventions are documented:
- README files
- CONTRIBUTING.md
- Tool-specific files (`.cursorrules`, `.github/copilot-instructions.md`)
- Wiki pages or Confluence docs
- Inline comments and docstrings

### Step 2: Extract General Guidelines

Move tool-agnostic conventions into the appropriate layer:
- Repository-wide rules → `AGENTS.md`
- Language-specific rules → `docs/standards/[language].md`
- Project-specific rules → project `README.md` or `docs/architecture.md`

### Step 3: Create Tool-Agnostic Versions

Rewrite tool-specific files to reference the tool-agnostic context:

**Before** (`.cursorrules`):
```
Always use TypeScript with strict mode.
Prefer Vitest for testing.
Name functions with camelCase.
```

**After** (`.cursorrules`):
```
Read AGENTS.md and docs/standards/typescript.md for conventions.
```

**After** (`docs/standards/typescript.md`):
```markdown
## TypeScript Standards
- Always use strict mode
- Prefer Vitest for testing
- Name functions with camelCase
```

### Step 4: Test with Multiple Tools

Verify that your context works with at least two different AI assistants (e.g., Cursor and Aider). If one tool doesn't follow your guidelines, make them more explicit.

### Step 5: Iterate

As you use your cascading context system, refine it:
- Move duplicated guidelines up to a higher layer
- Add module-level context for complex subsystems
- Document edge cases and exceptions

---

## Common Pitfalls

### 1. Over-Specifying at the Wrong Level

**Bad**: Putting project-specific details in `AGENTS.md`

```markdown
# AGENTS.md (repository-wide)
Use Zod for validation in the payments service.
```

**Good**: Put project-specific details in the project README

```markdown
# projects/payments-service/README.md
Use Zod for validation (per docs/standards/typescript.md).
```

### 2. Duplicating Context Across Layers

If the same guideline appears in `AGENTS.md`, `docs/standards/typescript.md`, and every project README, you'll have inconsistencies when updating.

**Solution**: Define the guideline once at the appropriate level, and reference it from lower levels.

### 3. Ignoring Human Readers

Context files should be readable by both AI agents and human developers. Avoid cryptic abbreviations or assuming the reader has seen previous context.

**Bad**: "Use the pattern from 2.3.1."

**Good**: "Use the repository pattern described in `docs/architecture.md#data-access`."

### 4. Not Testing Context Files

If your AI tool ignores a guideline, the context may be too implicit or ambiguous. Test your context by asking multiple agents to perform the same task and comparing results.

---

## Conclusion

Cascading context is a tool-agnostic methodology for organizing AI-readable instructions across multiple layers of specificity. By favoring general markdown documentation over tool-specific configuration, you make your context:

- **Future-proof**: Works with any AI tool, present or future
- **Portable**: Easy to migrate from one tool to another
- **Human-readable**: Doubles as onboarding documentation
- **Maintainable**: Reduces duplication and drift

Start with repository-level context (`AGENTS.md`) and language standards (`docs/standards/`). Add project-level and module-level context only as needed. Keep tool-specific files minimal, using them only for tool-specific features.

When in doubt, ask: *"Could this guideline be read by any AI agent or human developer, regardless of their tools?"* If yes, it belongs in your cascading context hierarchy.

---

## Further Reading

- `AGENTS.md` – Repository-level conventions for this codebase
- `docs/standards/typescript.md` – TypeScript-specific standards
- `docs/standards/python.md` – Python-specific standards
- `docs/workflows/context-aware-development.md` – Practical workflow for using cascading context
- `collections/typescript-web-service.md` – Example collection composing multiple standards
- [Agents.md Proposal](https://github.com/simonw/agents.md) – The inspiration for tool-agnostic agent instructions
