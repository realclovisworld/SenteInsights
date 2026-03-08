# Contributing Guide

Thank you for contributing to MoMoSense Insights! Please read this guide before submitting pull requests.

---

## Branching Strategy

Use descriptive branch names with a prefix that reflects the type of change:

| Prefix | Use for |
|---|---|
| `feat/` | New features |
| `fix/` | Bug fixes |
| `docs/` | Documentation updates |
| `refactor/` | Code refactoring without behaviour changes |
| `chore/` | Tooling, config, dependency updates |
| `test/` | Adding or updating tests |

Examples:
```
feat/batch-export-csv
fix/mtn-date-parse-edge-case
docs/developer-guide
```

All branches should target `main`. Do not push directly to `main`.

---

## Development Workflow

1. **Fork or branch** from the latest `main`.
2. **Install dependencies**: `npm install`
3. **Copy env file**: `cp .env.example .env` and fill in your values.
4. **Start the dev server**: `npm run dev`
5. **Make your changes** in a focused, well-scoped commit or set of commits.
6. **Run lint and tests** before pushing (see below).
7. **Open a Pull Request** against `main` with a clear description.

---

## Lint & Tests

Before pushing, ensure the following pass locally:

```bash
# Lint
npm run lint

# Tests
npm run test

# Production build check
npm run build
```

Pull requests that fail linting or tests will not be merged.

---

## Code Style

- **TypeScript**: All new code must be TypeScript. Avoid `any` where possible.
- **React**: Use functional components with hooks. Avoid class components.
- **Formatting**: Consistent with the existing codebase (ESLint is configured via `eslint.config.js`).
- **Imports**: Group imports — external libraries first, then internal modules, then relative paths.
- **Naming**:
  - Components: `PascalCase`
  - Functions and variables: `camelCase`
  - Constants: `UPPER_SNAKE_CASE` where appropriate
- **No commented-out code**: Remove dead code before opening a PR.

---

## Commit Conventions (Optional but Encouraged)

Use [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <short description>

[optional body]
[optional footer]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Examples:
```
feat(parser): add support for Airtel statement v2 format
fix(dashboard): correct monthly spend total calculation
docs(supabase): add RLS policy examples
```

---

## Pull Request Guidelines

- Keep PRs focused and small where possible — one feature or fix per PR.
- Fill in the PR description with what changed and why.
- Link any related issue(s) in the description.
- Add or update tests for new behaviour.
- Update relevant documentation in `docs/` if your change affects architecture, setup, or usage.

---

## Reporting Issues

Open a GitHub Issue with:

1. A clear title.
2. Steps to reproduce (for bugs).
3. Expected vs. actual behaviour.
4. Relevant logs or screenshots.
5. Environment details (OS, Node version, browser).
