# Testing & Debugging (The "Quality Control")

This topic covers how you test, evaluate, and debug AI systems and agentic workflows.

---

## What Lives Here

- Prompt and agent evaluation tools.
- Tracing and observability platforms.
- Guidance for integrating these into CI and production.

As your stack matures, expand this with your own testing strategies and SLAs.

---

## Prompt & Output Testing

- **Promptfoo** – CLI and framework for testing LLM prompts and agents.
  - Use it to run regression suites, jailbreak checks, and quality evaluations across models.
  - Fits well into CI pipelines for prompt changes and agent behaviors.

---

## Tracing, Debugging, and Evaluation

- **LangSmith** – Observability for LangChain/LangGraph apps.
  - Provides traces, evaluations, and analytics for LLM workflows.
  - Helpful when debugging complex chains or agent conversations in production.

When you add new tools for safety, guardrails, or evaluation, document how they plug into your services and agents here.
