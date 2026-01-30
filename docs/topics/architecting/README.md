# Architecting (The "Brain")

This topic covers how you define intent, specs, and standards *before* AI tools start writing code. Use these tools to make requirements explicit and shared between humans and agents.

---

## What Lives Here

- High-level architecture and design practices.
- Spec-driven development workflows.
- Agent context and instruction conventions.

As your org matures, expand this document with your own architectural patterns and governance rules.

---

## Core Tools & Concepts

- **Agents.md** – A convention for documenting repo-level context and instructions for AI agents.
  - Use it to tell agents how to behave in your project (coding style, constraints, workflows).
- **GitHub Spec Kit** – Templates and tooling for writing structured specs.
  - Great for 0→1 features, where you want a human-readable spec to drive AI-generated code.
- **OpenSpec** – Spec-driven development for AI coding assistants.
  - Adds a lightweight workflow with proposals, tasks, and spec deltas under `openspec/`.
  - Works across tools via slash commands and `openspec/AGENTS.md`.

---

## How This Repo Uses Architecting Tools

- `AGENTS.md` at the repo root defines how agents should behave here.
- `docs/standards/` contains language- and service-specific coding standards.
- `docs/workflows/spec-driven-openspec.md` shows an end-to-end OpenSpec example for a TypeScript service.

When you introduce new services, keep architecture decisions and specs in code-owned locations (`docs/`, `openspec/`) so AI tools can read and follow them.
