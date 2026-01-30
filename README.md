# ⚡ The Modern AI Developer Stack

**A curated list of tools, frameworks, and methodologies for the AI-enabled engineering team.**

This repository tracks the rapidly evolving landscape of AI development tools. It moves beyond simple "chatbots" to focus on **Agentic Workflows**, **Spec-Driven Development**, and **Developer Enablement**.

---

## 🔍 How to Use This Repo

- If you are a team lead:
  - Use this repo to standardize how your team sets up AI-enabled services.
  - Start with `AGENTS.md` for agent behavior and `docs/standards/` for language-specific guidelines.
  - Pick a collection under `collections/` (for example `collections/typescript-web-service.md`) as the default stack for new projects.
- If you are an individual developer:
  - Use the sections below to choose tools for your IDE, stack, and workflows.
  - When creating a new service, follow the relevant standards in `docs/standards/`.
- If you are an AI coding agent:
  - Always read `AGENTS.md` first.
  - For new subprojects, follow the language standards in `docs/standards/` and the relevant collection under `collections/`.

---

## 📚 Standards & Collections

- Language and service standards:
  - `docs/standards/typescript.md` – TypeScript/Node service layout, tooling, tests, and error handling.
  - `docs/standards/python.md` – Python service layout, tooling (pytest, ruff, mypy), and error handling.
- Ready-made stacks (collections):
  - `collections/typescript-web-service.md` – Opinionated stack for a TypeScript/Node web service with strict typing, Vitest, ESLint, and CI outline.
- Workflow guides:
  - `docs/guides/choosing-mcp-servers.md` – How to choose MCP servers based on your tech stack (Java/GitLab, Python/GitHub, .NET/Azure DevOps, etc.).

As you add more standards or collections, list them here so both humans and AI agents can discover them easily.

---

## 🏗️ Core Development (The "Hands")
*Tools that integrate directly into the coding workflow.*

* **[GitHub Copilot](https://github.com/features/copilot)** - The industry standard for in-editor code completion and chat.
* **[Cursor](https://cursor.sh/)** - An AI-native fork of VS Code. It indexes your entire codebase for superior context awareness.
* **[GitLab Duo](https://about.gitlab.com/solutions/ai/)** - The integrated AI suite for the GitLab ecosystem (DevSecOps).
* **[Windsurf](https://codeium.com/windsurf)** - The "Agentic IDE" by Codeium. Uses "Flows" to maintain deep context across complex refactors.
* **[Kiro](https://kiro.dev/)** - An agentic AI development environment.

### CLI & Terminal Agents
* **[Claude Code](https://docs.anthropic.com/)** / **Open Code** - Command-line interfaces that allow LLMs to perform file operations and edits directly from the terminal.
* **[Gemini CLI](https://geminicli.com)** - A command-line interface for interacting with the Gemini AI platform.
* **[Aider](https://aider.chat/)** - The benchmark for AI pair programming in the terminal. Excellent at git-aware commits and refactoring.
* **[OpenAI Codex](https://github.com/openai/codex)** - A lightweight coding agent from OpenAI that runs locally in your terminal and integrates with ChatGPT and IDEs.
* **[Goose](https://github.com/block/goose)** - A local-first AI engineering agent that automates complex tasks using MCP servers, extensions, and recipes.
* **[Kiro CLI](https://kiro.dev/cli/)** - A command-line interface for interacting with the Kiro AI platform.

---

## 🧠 Architecture & Methodology (The "Brain")
*How we define software before the AI writes it. This is the shift to Spec-Driven Development (SDD).*

* **[Agents.md](https://github.com/simonw/agents.md)** - A proposal for a standard file format to document context/instructions for AI agents within a repository.
* **[GitHub Spec Kit](https://github.com/github/spec-kit)** - Tools and templates for defining structured specifications. This enables AI to generate high-quality code by strictly following a pre-defined "spec."
* **[OpenSpec](https://github.com/Fission-AI/OpenSpec)** - Spec-driven development (SDD) for AI coding assistants, with change proposals, tasks, and spec deltas that tools can drive via slash commands or AGENTS.md. See `docs/workflows/spec-driven-openspec.md` for a full end-to-end example.

---

## 🤖 Building & Orchestrating Agents (The "Factory")
*Frameworks for building your own internal agents and tools.*

### Frameworks & Cloud
* **[Microsoft Agent Framework](https://github.com/microsoft/autogen)** - A standardized way to build multi-agent conversations and workflows.
* **[AWS Bedrock Agents](https://aws.amazon.com/bedrock/agents/)** - Fully managed agents on AWS infrastructure.
* **[Microsoft Foundry](https://azure.microsoft.com/en-us/solutions/ai/)** - Comprehensive service for building and deploying AI apps on Azure.
* **[LangGraph](https://langchain-ai.github.io/langgraph/)** - A library for building stateful, multi-actor applications with LLMs. The standard for complex orchestration.

### Agent Libraries
* **[LangChain](https://python.langchain.com/docs/get_started/introduction)** - A batteries-included framework for building LLM applications, with chains, tools, memory, and integrations across many providers.
* **[LlamaIndex](https://www.llamaindex.ai/)** - A data framework for connecting LLMs to your data, with indexing, retrieval, and RAG tooling.

### Connectivity & Skills
* **[MCP (Model Context Protocol)](https://modelcontextprotocol.io/)** - The new open standard for connecting AI assistants to systems (databases, Slack, GitHub) without building custom integrations for every model. See `docs/guides/choosing-mcp-servers.md` for workflow-specific recommendations.
* **[apm (Agent Package Manager)](https://github.com/danielmeppiel/apm)** - A package manager for distributing and installing AI agent "skills" and tools.
* **[Agent Skills](https://agentskills.io/home)** - An open format for packaging reusable agent skills as folders of instructions, scripts, and resources.


### Low Code / No Code
* **[n8n](https://n8n.io/)** - Workflow automation tool that has pivotally embraced AI. Allows creating complex agentic workflows via a visual node interface.

---

## 🚀 Rapid Prototyping & GenUI
*Going from "Idea" to "Interface" in seconds.*

* **[Lovable](https://lovable.dev/)** - Generates full-stack web apps from prompts. Excellent for MVPs.
* **[GitHub Spark](https://github.com/features/spark)** - GitHub's platform for building and deploying intelligent apps, including AI-powered prototypes and workflows.
* **[v0](https://v0.dev/)** - Vercel's generative UI tool. Exports production-ready React/Tailwind code.

---

## 🛡️ Testing, Security & Observability
*How do we trust what the AI built?*

* **[Promptfoo](https://www.promptfoo.dev/)** - The CLI tool for testing LLM prompts. Essential for checking security jailbreaks, regressions, and output quality.
* **[LangSmith](https://www.langchain.com/langsmith)** - Observability platform to trace, monitor, and debug agent workflows in production.

---

## 🏢 Enterprise Knowledge
* **[Atlassian Rovo](https://www.atlassian.com/software/rovo)** - An AI engine that connects data across the Atlassian suite (Jira, Confluence) to answer questions and manage requirements.
* **[NotebookLM](https://notebooklm.google)** - Google’s AI research and thinking partner that builds grounded assistants over your documents, transcripts, and notes.

---

## 📦 Local Development (Privacy-First)
* **[Ollama](https://ollama.com/)** - Run Llama 3, DeepSeek, and other open-source models locally. Critical for testing agents without API costs or data leakage.

---

### 🤝 Contributing
Found a new tool that changes the game? Open a PR to add it to the stack. If you add standards or collections, also:

- Update `docs/standards/` or `collections/` with clear, opinionated guidance.
- Add links to new documents in the "Standards & Collections" section above so they are easy to discover.
