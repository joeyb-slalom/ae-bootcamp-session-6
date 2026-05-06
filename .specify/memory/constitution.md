<!--
  SYNC IMPACT REPORT
  ==================
  Version change: (template) → 1.0.0
  Constitution ratified for the first time.

  Principles established:
    I.  Monorepo & Separation of Concerns     (new)
    II. Clean Code & Simplicity               (new)
    III. Test-Driven Development (NON-NEGOTIABLE) (new)
    IV. Accessible & Consistent UI            (new)
    V.  Persistent & Reliable Data            (new)

  Added sections:
    - Technology Stack & Standards
    - Development Workflow & Quality Gates

  Templates updated:
    - .specify/templates/plan-template.md     ✅ reviewed (Constitution Check gates align)
    - .specify/templates/spec-template.md     ✅ reviewed (no structural changes required)
    - .specify/templates/tasks-template.md    ✅ reviewed (test task guidance aligns)

  Follow-up TODOs: none
-->

# Copilot Bootcamp Todo App Constitution

## Core Principles

### I. Monorepo & Separation of Concerns

The project is organized as an npm-workspaces monorepo with two distinct packages:
`packages/frontend` (React) and `packages/backend` (Express.js). Each package MUST be
independently runnable, independently testable, and have a clearly defined responsibility.
Cross-package coupling MUST be limited to the REST API contract boundary. Neither package
may import directly from the other's source tree. Every module, component, or function
MUST have a single, well-defined responsibility (Single Responsibility Principle).

### II. Clean Code & Simplicity (NON-NEGOTIABLE)

Code MUST be readable by any team member without additional context. Apply these non-
negotiable rules:

- **DRY**: Duplicate logic MUST be extracted into a shared utility or reusable component.
- **KISS**: Prefer the simplest solution that satisfies the requirement. Premature
  optimization is prohibited.
- **Naming**: Use `camelCase` for variables/functions, `PascalCase` for React components
  and classes, `UPPER_SNAKE_CASE` for constants. Names MUST be descriptive and self-
  documenting.
- **Formatting**: 2-space indentation, LF line endings, no trailing whitespace, lines ≤ 100
  characters.
- **Linting**: All code MUST pass ESLint before opening a pull request. No suppressed
  warnings without a documented justification.
- **SOLID**: Apply Single Responsibility, Open/Closed, Liskov Substitution, Interface
  Segregation, and Dependency Inversion principles throughout.

### III. Test-Driven Development (NON-NEGOTIABLE)

Tests are a first-class deliverable. The following rules are strictly enforced:

- Tests SHOULD describe expected behavior before or alongside implementation.
- **Coverage target**: 80%+ code coverage across all packages (verified via Jest coverage
  reports).
- **Required test types**: unit tests for all components and utility functions; integration
  tests for component interactions and API communication.
- End-to-end tests are out of scope for initial development.
- Tests MUST be isolated: no shared mutable state between tests; all external dependencies
  (API calls, timers) MUST be mocked.
- Test files MUST be colocated in `__tests__/` directories adjacent to source files and
  named `{filename}.test.js`.
- Test code MUST be treated with the same quality bar as production code (DRY, readable,
  maintained).

### IV. Accessible & Consistent UI

The UI MUST conform to the established design system at all times:

- **Design language**: Material Design-inspired with a Halloween theme (orange `#ff6b35`/
  `#ff8c42` and purple `#9d4edd`/`#bb86fc` accents).
- **Spacing**: All spacing MUST follow the 8px grid (xs=8px, sm=16px, md=24px, lg=32px,
  xl=48px). No ad-hoc pixel values.
- **Typography**: Use the defined system font stack and established size/weight hierarchy.
- **Dark/Light mode**: Both modes MUST be supported; user preference MUST be persisted to
  `localStorage`; default to system preference on first visit.
- **Accessibility**: All interactive elements MUST be keyboard-accessible, color contrast
  MUST meet WCAG AA standards, and all icon buttons MUST have descriptive `aria-label`
  attributes.
- **Responsiveness**: Layouts MUST adapt for mobile (<768px), tablet (768–1024px), and
  desktop (>1024px) breakpoints.

### V. Persistent & Reliable Data

All user actions that modify state MUST be persisted to the backend immediately. The
following rules apply:

- No optimistic UI updates without corresponding API persistence.
- All API calls MUST be wrapped in try/catch; failures MUST surface a clear, actionable
  error message to the user.
- Destructive operations (e.g., delete) MUST require explicit confirmation before the API
  call is made.
- The backend MUST be the single source of truth; the frontend MUST not maintain a
  separate authoritative store.

## Technology Stack & Standards

- **Frontend**: React 18+, plain CSS (no CSS-in-JS or third-party component libraries
  unless explicitly approved).
- **Backend**: Node.js ≥ 16, Express.js, no external database — use the existing in-
  process persistence mechanism.
- **Testing**: Jest for both packages; `@testing-library/react` for frontend component
  tests.
- **Package management**: npm workspaces; manage dependencies at the correct package level
  (root = shared dev tools, package-level = runtime deps).
- **No unapproved technology additions**: New runtime dependencies MUST be discussed and
  approved before introduction.

## Development Workflow & Quality Gates

- **Branch strategy**: All feature work MUST occur on a named feature branch; no direct
  commits to `main`.
- **Pre-commit**: ESLint MUST pass with zero errors before committing. Address all
  warnings proactively.
- **Pull requests**: Every PR MUST include passing tests with coverage ≥ 80%. PRs that
  reduce coverage below the threshold MUST not be merged.
- **Import discipline**: Follow the prescribed import order (external → internal → styles);
  no circular dependencies; use relative paths for internal modules.
- **Comments**: Comment "why", not "what". Outdated comments MUST be deleted. JSDoc is
  REQUIRED for all public functions and components.

## Governance

This constitution supersedes all other informal agreements. Amendments require:

1. A documented rationale explaining the change and its impact on existing code.
2. An updated version number following semantic versioning:
   - **MAJOR**: Backward-incompatible governance changes or principle removals.
   - **MINOR**: New principle or section added, or material expansion of guidance.
   - **PATCH**: Clarifications, wording fixes, or non-semantic refinements.
3. All dependent templates (`.specify/templates/`) MUST be reviewed and updated in the
   same commit as the constitution change.

All pull requests and code reviews MUST verify compliance with this constitution. Any
deviation requires explicit documented justification approved by the team.

For runtime development guidance refer to `docs/coding-guidelines.md`,
`docs/testing-guidelines.md`, `docs/ui-guidelines.md`, and
`docs/functional-requirements.md`.

**Version**: 1.0.0 | **Ratified**: 2026-05-06 | **Last Amended**: 2026-05-06
