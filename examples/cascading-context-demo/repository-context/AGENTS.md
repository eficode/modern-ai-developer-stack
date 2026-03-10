# AI Context & Agent Guidelines (Example)

This is an **example** `AGENTS.md` file demonstrating repository-level context for cascading context.

This file would typically live at the root of your repository.

---

## 1. Repository Philosophy

This repository follows **tool-agnostic, cascading context** principles:
- General guidelines live in markdown files, not tool-specific configs
- Context flows from broad (repository) to specific (inline code)
- More specific context overrides less specific context

---

## 2. Code Style Guidelines

### 2.1 Language & Types

- Prefer TypeScript over plain JavaScript for new Node-based code
- Enable strict typing (`strict: true` in `tsconfig.json`) by default
- Avoid `any` in TypeScript; use precise types or generics instead
- Prefer explicit return types for exported functions

### 2.2 Naming Conventions

- Variables and functions: `camelCase`
- Classes, React components, and types/interfaces: `PascalCase`
- Constants: `SCREAMING_SNAKE_CASE` for global constants only
- Files:
  - Runtime modules and scripts: `kebab-case`
  - React components: `PascalCase`
  - Tests: mirror the file under test, e.g. `thing.ts` -> `thing.test.ts`

### 2.3 Error Handling

- Fail fast in tooling and CLIs; do not silently ignore failures
- Always provide actionable error messages with context
- For async code, use `try/catch` around the smallest block that can fail
- Exit with non-zero status codes on failure in CLI tools

### 2.4 Testing Practices

- Prefer many small, focused tests over a few large integration suites
- Keep tests deterministic; avoid live network calls unless explicitly mocked
- Name tests to describe behavior, not implementation details

---

## 3. Git Workflow

- Follow conventional commit messages: `feat:`, `fix:`, `refactor:`, `docs:`, etc.
- Create feature branches from `main`: `feature/add-payment-refunds`
- Keep commits small and focused on a single change
- Write commit messages that explain "why," not just "what"

---

## 4. Agent Workflow Expectations

- Optimize for reproducible flows over ad hoc chat
- When adding commands or scripts, document them in the README
- Always ask: "Does this change help developers build better software with AI, and is it easy for other agents to follow?"

---

## 5. Standards & Collections

This repository uses:
- **Standards**: Language-specific conventions in `docs/standards/`
- **Collections**: Opinionated stacks in `collections/`

AI agents should:
1. Read `AGENTS.md` (this file) for repository-wide conventions
2. Read `docs/standards/[language].md` for language-specific rules
3. Read `collections/[stack].md` if the project references a collection
4. Read project-level READMEs for project-specific context
5. Read module-level READMEs for subsystem-specific context
6. Read inline comments for function-specific details

---

## 6. Tool-Agnostic Principle

This file is written in plain markdown and contains general conventions, not tool-specific syntax.

The same guidelines apply whether you use:
- Cursor (reads `.cursorrules` → references this file)
- GitHub Copilot (reads `.github/copilot-instructions.md` → references this file)
- Aider, Claude Code, Windsurf (auto-discover this file)
- Future AI tools (can read standard markdown)

For tool-specific settings (indexing, UI preferences), use small adapter files that reference this `AGENTS.md` as the source of truth.
