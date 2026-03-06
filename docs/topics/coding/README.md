# Coding (The "Hands")

This topic covers tools that integrate directly into the coding workflow: IDE assistants and terminal-based coding agents.

---

## What Lives Here

- IDE plugins and AI-native editors.
- Terminal and CLI coding agents.
- Guidance for how these tools should follow this repo's standards.

As you adopt new tools, list them here with when/why to use each.

---

## IDE Assistants

- **GitHub Copilot (Editor Client)** – In-editor code completion and chat across VS Code, JetBrains, Neovim, and more.
  - Use for everyday coding assistance and inline suggestions; pair it with Copilot Chat/CLI for broader workflows.
- **GitLab Duo (Editor Client)** – GitLab's AI assistant integrated into supported IDEs.
  - Best for teams already on GitLab, especially when you want suggestions that understand your GitLab repos, issues, and pipelines.
- **Cursor** – AI-native VS Code fork with deep codebase context.
  - Ideal when you want agents to navigate and refactor large projects.
- **Windsurf** – Agentic IDE with "Flows" for complex, multi-step changes.
  - Use when you want structured, repeatable flows for refactors and implementations.
- **VS Code + Copilot** – Baseline setup for most teams.
  - Add this to projects where you do not want to standardize on Cursor or Windsurf yet.

---

## Copilot & Duo CLI Clients

- **GitHub Copilot CLI** – Terminal companion for Copilot integrated with GitHub tools.
  - Use it to ask natural-language questions about your codebase, generate commands, and assist with git and GitHub workflows directly from the shell.
  - Pairs well with IDE Copilot and terminal agents: let Copilot CLI handle quick "what command should I run?" tasks while heavier refactors go through a coding agent.
- **GitLab Duo CLI (where available)** – GitLab Duo experiences exposed through GitLab tooling.
  - Use alongside GitLab projects to query repos, suggest commands, and assist with pipelines and MR workflows from the terminal.

---

## CLI & Terminal Agents

- **Claude Code / Open Code** – Terminal interfaces that let AI read and edit your repository.
  - Great for spec-first workflows, code reviews, and multi-file edits controlled from the shell.
- **Aider** – Git-aware terminal pair programmer.
  - Excellent for refactors and incremental changes with strong git integration.
- **OpenAI ChatGPT / IDE & CLI agents** – Cloud-based coding agents powered by current OpenAI models.
  - Integrate with ChatGPT, the OpenAI API, and supported IDE/CLI extensions; good for teams standardized on OpenAI tooling.
- **Goose** – Local-first AI engineering agent.
  - Automates larger engineering tasks using MCP servers, extensions, and recipes.

---

## How This Repo Wants Coding Tools to Behave

- Always respect `AGENTS.md` at the root for repo-wide rules.
- For new services, follow `docs/standards/typescript.md` or `docs/standards/python.md` instead of inventing a new layout.
- Use collections under `collections/` (for example the TypeScript web service stack) as the default starting point for new projects.
