# GitHub Copilot Instructions

Follow conventions defined in:
1. `../../repository-context/AGENTS.md` (repository-wide)
2. `../../repository-context/docs/standards/typescript.md` (TypeScript-specific)
3. `../../repository-context/collections/typescript-web-service.md` (stack)
4. `../README.md` (this project)

## Key Project-Specific Points

- **Authentication**: All endpoints require Auth0 JWT (see `src/middleware/auth.ts`)
- **Response format**: Follow JSON:API specification
- **Rate limiting**: 100 requests per minute per API key
- **Timestamps**: Use ISO-8601 format

## Note

This file contains only brief reminders. For detailed conventions, read the context files listed above.

The same conventions apply whether you use GitHub Copilot, Cursor, Aider, or other AI assistants.
