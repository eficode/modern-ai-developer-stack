# Skill: Setup Cascading Context

## Description

This skill audits a project's existing context files, validates consistency across cascading context layers, and generates missing context files based on the cascading context methodology.

Use this skill when:
- Setting up cascading context for a new project
- Auditing an existing project's context structure
- Migrating from tool-specific to tool-agnostic context

## Prerequisites

- Basic understanding of cascading context (see `docs/guides/cascading-context.md`)
- Git repository with at least one code file

## Inputs

1. **Project path** (required): Path to the project directory to audit
2. **Mode** (optional): `audit` (default) or `generate`
   - `audit`: Check existing context and report issues
   - `generate`: Create missing context files with templates

## Outputs

### Audit Mode

A report containing:
- Discovered context files at each level
- Missing context files
- Duplicated guidelines across layers
- Tool-specific files that should reference tool-agnostic context
- Recommendations for improvement

### Generate Mode

Creates missing context files:
- `AGENTS.md` (if missing at repository root)
- `docs/standards/[language].md` (for detected languages)
- `collections/[stack].md` (optional, based on detected stack)
- Project `README.md` (if missing or minimal)
- Module-level READMEs (for large subsystems, optional)

## Instructions

### Step 1: Discover Project Structure

1. Navigate to the project directory specified by the user
2. Identify the repository root (look for `.git` directory)
3. Detect programming languages used (check file extensions: `.ts`, `.js`, `.py`, `.rs`, etc.)
4. Detect frameworks (check `package.json`, `requirements.txt`, `Cargo.toml` for dependencies)
5. Identify project type (web service, CLI tool, library, etc.)

### Step 2: Discover Existing Context Files

Search for context files at each level:

1. **Repository Level**:
   - `AGENTS.md`
   - `README.md`
   - `CONTRIBUTING.md`

2. **Standards Level**:
   - `docs/standards/*.md`
   - Common patterns: `typescript.md`, `python.md`, `rust.md`, etc.

3. **Collections Level**:
   - `collections/*.md`
   - Common patterns: `typescript-web-service.md`, `python-ml-service.md`, etc.

4. **Project Level**:
   - Project `README.md`
   - Tool-specific files: `.cursorrules`, `.github/copilot-instructions.md`

5. **Module Level**:
   - `src/[module]/README.md`
   - `src/[module]/CONTEXT.md`

### Step 3: Audit Context Hierarchy (Audit Mode)

Check for common issues:

1. **Missing Context Files**:
   - Is there an `AGENTS.md` at the repository root?
   - Are there language standards in `docs/standards/` for the detected languages?
   - Does the project have a README?
   - Do tool-specific files (`.cursorrules`) exist without referencing tool-agnostic context?

2. **Duplication**:
   - Search for common guidelines (e.g., "Use Zod", "camelCase", "strict mode") across multiple files
   - Report guidelines that appear in more than one context layer
   - Recommend consolidating duplicates at the appropriate layer

3. **Tool-Specific vs Tool-Agnostic**:
   - Check if `.cursorrules` or `.github/copilot-instructions.md` contain substantial conventions
   - If yes, recommend extracting conventions to tool-agnostic markdown files

4. **Consistency**:
   - Compare naming conventions, code style, and tooling across different context files
   - Report conflicting guidelines (e.g., `AGENTS.md` says "use Vitest", but project README says "use Jest")

### Step 4: Ask for Confirmation (Generate Mode Only)

Before creating files, ask the user:
- "I will create the following files: [list]. Proceed? (y/n)"
- If user says no, abort
- If user says yes, proceed with file generation

### Step 5: Generate Missing Context Files (Generate Mode)

If mode is `generate` and user confirmed:

1. **Repository Level** (`AGENTS.md`):
   - If missing, create a template based on `examples/cascading-context-demo/repository-context/AGENTS.md`
   - Customize for detected languages and frameworks

2. **Standards Level** (`docs/standards/[language].md`):
   - For each detected language (TypeScript, Python, etc.), create a standards file if missing
   - Use templates from `examples/cascading-context-demo/repository-context/docs/standards/`

3. **Collections Level** (`collections/[stack].md`):
   - If a clear stack is detected (e.g., TypeScript + Fastify + Vitest), offer to create a collection
   - Use template from `examples/cascading-context-demo/repository-context/collections/`

4. **Project Level**:
   - If project README is missing or minimal, create a template with:
     - Project overview
     - Context hierarchy references
     - Project-specific conventions
     - Getting started instructions
   - If tool-specific files exist, ensure they reference tool-agnostic context

5. **Module Level** (optional):
   - For large subsystems (>1000 lines or >10 files), offer to create module-level READMEs
   - Use template from `examples/cascading-context-demo/module-context/src/payments/README.md`

### Step 6: Report Results

For **audit mode**, output a markdown report:

```markdown
# Cascading Context Audit Report

## Summary
- Repository root: /path/to/repo
- Detected languages: TypeScript, Python
- Detected frameworks: Fastify, React
- Project type: Web service

## Discovered Context Files

### Repository Level
- ✅ AGENTS.md exists
- ✅ README.md exists
- ❌ CONTRIBUTING.md missing

### Standards Level
- ✅ docs/standards/typescript.md exists
- ❌ docs/standards/python.md missing

### Collections Level
- ❌ No collections found

### Project Level
- ✅ Project README.md exists
- ⚠️  .cursorrules exists but contains substantial conventions (should reference AGENTS.md)

### Module Level
- ❌ No module-level context files found

## Issues Found

### 1. Duplicated Guidelines
- "Use strict mode" appears in:
  - AGENTS.md (line 23)
  - docs/standards/typescript.md (line 15)
  - .cursorrules (line 5)
- **Recommendation**: Keep in docs/standards/typescript.md, remove from others

### 2. Tool-Specific Files with Substantial Content
- .cursorrules (42 lines) contains many conventions
- **Recommendation**: Extract conventions to AGENTS.md and docs/standards/, keep only Cursor-specific settings in .cursorrules

### 3. Missing Context Files
- No Python standards file (Python files detected in src/)
- No collections file (TypeScript web service pattern detected)

## Recommendations

1. Create docs/standards/python.md for Python-specific conventions
2. Create collections/typescript-web-service.md to document the stack
3. Extract conventions from .cursorrules to tool-agnostic files
4. Add module-level README for src/payments/ (600+ lines, complex architecture)
```

For **generate mode**, output a summary of created files:

```markdown
# Cascading Context Setup Complete

## Created Files

1. ✅ docs/standards/python.md (Python standards)
2. ✅ collections/typescript-web-service.md (Stack collection)
3. ✅ .cursorrules (Updated to reference tool-agnostic context)

## Next Steps

1. Review and customize the generated context files
2. Commit the new files to version control
3. Test with multiple AI tools (Cursor, Aider, etc.) to verify they follow the context
4. Iterate based on how AI agents use the context in practice
```


## Example Usage

### Audit Mode

**User**: "Audit the cascading context for my project at `/projects/my-api`"

**Agent**:
1. Navigates to `/projects/my-api`
2. Discovers repository root at `/projects/my-api`
3. Detects TypeScript, Fastify, Vitest
4. Finds `AGENTS.md`, `docs/standards/typescript.md`, project README, `.cursorrules`
5. Finds duplication: "Use Zod" in both `docs/standards/typescript.md` and `.cursorrules`
6. Finds `.cursorrules` has 50 lines of conventions (should be minimal)
7. Generates audit report (as shown above)

### Generate Mode

**User**: "Set up cascading context for my new project at `/projects/new-service`"

**Agent**:
1. Navigates to `/projects/new-service`
2. Detects TypeScript, Express, Jest
3. Finds no `AGENTS.md`, no `docs/standards/`, minimal README
4. Asks: "I will create: AGENTS.md, docs/standards/typescript.md, collections/typescript-web-service.md, and update README.md. Proceed?"
5. User confirms
6. Creates files with templates customized for detected stack
7. Reports created files and next steps

## Edge Cases

1. **No Git Repository**: Warn that cascading context works best in version-controlled projects
2. **Multiple Languages**: Create standards files for all detected languages
3. **Monorepo**: Ask if context should be at monorepo root or per-package
4. **Existing Context Files**: In generate mode, skip files that already exist (don't overwrite)
5. **Unknown Stack**: If stack is unclear, create generic templates and ask user to customize

## Testing the Skill

To verify this skill works correctly:

1. Test on a project with no context files (generate mode should create all necessary files)
2. Test on a project with complete cascading context (audit mode should report no issues)
3. Test on a project with tool-specific files only (audit mode should recommend migration to tool-agnostic)
4. Test on a large project with modules (should detect and offer to create module-level context)

## References

- `docs/guides/cascading-context.md` – Full methodology guide
- `docs/workflows/context-aware-development.md` – Practical workflows
- `examples/cascading-context-demo/` – Reference implementation with examples for all context layers
