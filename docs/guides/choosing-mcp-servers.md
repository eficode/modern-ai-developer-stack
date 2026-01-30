# Choosing MCP Servers for Your Workflow

This guide helps you select the right MCP (Model Context Protocol) servers based on your tech stack, toolchain, and value stream.

---

## What Are MCP Servers?

MCP servers provide structured, safe access to external systems (databases, APIs, CI/CD, documentation, APM tools) for AI assistants. Instead of building custom integrations for every LLM and every tool, MCP defines a standard protocol.

Think of MCP servers as "connectors" that let your AI coding assistant:
- Fetch CI/CD logs and merge requests from GitLab
- Query tickets and documentation from Jira/Confluence
- Access monitoring data from Sentry or other APM tools
- Interact with code quality reports from SonarQube

---

## General Approach: Map Your Value Stream

Before choosing MCP servers, ask:

1. **What is your toolchain?** (build tools, package managers, linters)
2. **What is your value stream?** (where does code go from commit to production?)
3. **Where is friction?** (slow feedback loops, missing context, manual steps)

The goal is to **remove friction** by giving your AI assistant access to the systems developers interact with most.

---

## Common MCP Servers by Workflow

### Java Developers Using GitLab

**Context:**
- Primary language: Java (tooling: Maven, Gradle, or Ant)
- CI/CD: GitLab
- Project management: Jira, Confluence
- Code quality: SonarQube
- Deployment targets: Linux-based systems
- APM/monitoring: Sentry (or equivalent)

**Recommended MCP Servers:**

1. **GitLab MCP**
   - Connect AI to fetch CI/CD logs, merge requests, and code from other repos
   - Essential for understanding build failures and reviewing changes across projects
   - Addresses the limitation that Atlassian MCP has little GitLab support

2. **Atlassian MCP (Jira/Confluence)**
   - Connect to tickets, requirements, and internal documentation
   - Use for context on "why" a feature exists or "what" a bug report says

3. **SonarQube MCP**
   - Query code quality metrics, technical debt, and security issues
   - Note: If your IDE already integrates with SonarQube (IntelliJ IDEA, VS Code plugins), this may be redundant; evaluate whether AI-driven queries add value

4. **Sentry MCP (or equivalent APM server)**
   - Access application performance monitoring and error tracking
   - Helps AI correlate code changes with production issues
   - Replace with your APM tool's MCP server if using Datadog, New Relic, etc.

5. **SharePoint MCP** (if applicable)
   - Use if Atlassian does not cover all internal documentation
   - Relevant for organizations with hybrid documentation strategies

**Optional/Context-Dependent:**

- **Nexus/Artifactory MCP** – If you need AI to query artifact repositories or dependency metadata
- **Slack/Teams MCP** – If important context lives in team chat (design decisions, incident notes)

---

## Python/Node.js Developers Using GitHub

**Context:**
- Languages: Python, TypeScript/Node.js
- CI/CD: GitHub Actions
- Project management: GitHub Issues/Projects or Linear
- Monitoring: Datadog, Sentry

**Recommended MCP Servers:**

1. **GitHub MCP**
   - Access Issues, PRs, Actions logs, repository metadata
   - Core integration for GitHub-native workflows

2. **Linear MCP** (if using Linear instead of GitHub Issues)
   - Fetch tickets, sprint context, and roadmap data

3. **Sentry MCP**
   - Query errors and performance data to inform debugging

4. **Datadog MCP** (or equivalent APM)
   - Connect to logs, metrics, and traces

---

## .NET Developers Using Azure DevOps

**Context:**
- Language: C#
- CI/CD: Azure Pipelines
- Project management: Azure Boards
- Hosting: Azure App Service or AKS

**Recommended MCP Servers:**

1. **Azure DevOps MCP**
   - Access pipelines, work items, repos, and test results

2. **Azure MCP** (for cloud resources)
   - Query resource status, logs, and metrics

3. **Application Insights MCP**
   - APM data for .NET applications

---

## When NOT to Use an MCP Server

Skip an MCP server if:

1. **Your IDE already integrates tightly with the tool**
   - Example: SonarQube in IntelliJ IDEA with real-time linting
   - The AI assistant may not add value if the developer already sees issues inline

2. **The tool is primarily CLI-driven**
   - Example: Maven, Gradle, `pytest`, `npm`
   - AI assistants can run these commands directly; no MCP server needed

3. **Data is ephemeral or low-value**
   - Example: temporary scratch notes, personal to-do lists
   - Not worth the overhead of an MCP integration

4. **Security or compliance restrictions**
   - If the system contains secrets or sensitive data, evaluate whether MCP access is safe
   - Prefer read-only MCP servers or scoped permissions

---

## Evaluating New MCP Servers

When a new MCP server appears, ask:

- **Does it reduce friction?** Does it save developers from context-switching or manual lookups?
- **Is the data grounded?** Does it provide factual, version-controlled information (not opinions or hallucinations)?
- **Is it maintained?** Check the repository for recent commits and issue response times
- **Does it duplicate existing tooling?** If your IDE or CLI already does this well, skip it

---

## Contributing

If you discover MCP servers that fit a common workflow, add them here with:
- The workflow/stack they support
- Why they reduce friction
- Any caveats or alternatives

Keep descriptions concise and value-focused.
