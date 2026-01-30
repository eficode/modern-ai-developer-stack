# Building Agents (The "Factory")

This topic covers how you assemble AI agents and applications: frameworks, libraries, and infrastructure that orchestrate models, tools, and workflows.

---

## What Lives Here

- Low-code and visual orchestrators.
- Code-first agent frameworks and libraries.
- Infrastructure for hosting models and connecting tools.

Use this as a map when choosing how to build internal agents or AI-powered services.

---

## Low-Code / Visual Orchestration

- **n8n** – Workflow automation with strong AI support.
  - Good for wiring together APIs, LLM calls, and business logic without writing a lot of glue code.
- **LangFlow** – Visual builder for LangChain/LangGraph-style applications.
  - Helpful when you want a diagram-first view of your LLM pipelines.

---

## Code Frameworks

- **Microsoft Agent Framework (Autogen)** – Multi-agent conversations and workflows.
  - Use when you need complex agent collaboration and conversation planning.
- **LangGraph** – State-machine-style framework for LLM applications.
  - Ideal for production workflows with explicit states, retries, and observability.
- **AWS Bedrock Agents** – Managed agents on AWS.
  - Fits when you want a fully managed platform integrated with AWS services.

---

## Agent Libraries

- **LangChain** – Full-featured framework for building LLM applications.
  - Provides chains, tools, memory, and integrations with many providers.
- **LlamaIndex** – Data framework for connecting LLMs to your data.
  - Focused on indexing, retrieval, and RAG patterns over structured and unstructured data.

---

## Infrastructure & Integrations

- **MCP (Model Context Protocol)** – Standard for connecting assistants to external tools.
  - Use MCP servers to provide safe, structured access to databases, APIs, and internal systems.
- **Ollama** – Local runtime for open-source models.
  - Great for privacy-sensitive or offline workflows and fast local experimentation.

As your architecture evolves, document which frameworks and runtimes you standardize on for different use cases (internal tools, customer-facing apps, prototypes, etc.).
