# Implementation Plan: Overdue Todo Items

**Branch**: `001-overdue-todo-items` | **Date**: 2026-05-06 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-overdue-todo-items/spec.md`

## Summary

Users need a clear, visual way to identify which todos have not been completed by their due date. The solution is entirely frontend-only: a shared `isOverdue(todo)` utility function evaluates overdue status at render time, and `TodoCard` renders a warning color + icon badge when the function returns true. No backend changes are required.

## Technical Context

**Language/Version**: JavaScript (Node.js 18), React 18  
**Primary Dependencies**: React 18, plain CSS, Jest, @testing-library/react  
**Storage**: N/A — overdue status is computed at render time; no new persisted fields  
**Testing**: Jest + @testing-library/react (frontend), Jest (backend — unchanged)  
**Target Platform**: Web browser (desktop-focused, responsive down to mobile)  
**Project Type**: Web application (npm workspaces monorepo — frontend + backend packages)  
**Performance Goals**: Overdue evaluation must complete within the same render cycle (synchronous utility function)  
**Constraints**: No page reload required for status changes; WCAG AA color contrast; light/dark mode compatible  
**Scale/Scope**: Single-user; typical todo list size (< 1000 items)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Monorepo & Separation of Concerns | ✅ PASS | Change scoped entirely to `packages/frontend`; no cross-package imports introduced |
| II. Clean Code & Simplicity | ✅ PASS | Utility extracted per DRY; KISS — no new libraries; names follow camelCase/PascalCase conventions |
| III. Test-Driven Development | ✅ PASS | Unit tests required for `isOverdue()`; `TodoCard` tests updated; coverage stays ≥ 80% |
| IV. Accessible & Consistent UI | ✅ PASS | Warning color + icon badge (FR-009); design tokens follow 8px grid; both themes handled; WCAG AA contrast |
| V. Persistent & Reliable Data | ✅ PASS | No state persistence changes; overdue is computed display-only |

**Gate result**: All gates PASS. No violations to justify.

## Project Structure

### Documentation (this feature)

```text
specs/001-overdue-todo-items/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

*No `contracts/` directory — this feature introduces no new API endpoints or external interfaces.*

### Source Code (repository root)

```text
packages/
├── frontend/
│   └── src/
│       ├── utils/
│       │   ├── todoUtils.js           # NEW: isOverdue(todo) utility function
│       │   └── __tests__/
│       │       └── todoUtils.test.js  # NEW: unit tests for isOverdue()
│       ├── components/
│       │   ├── TodoCard.js            # MODIFY: add overdue indicator rendering
│       │   └── __tests__/
│       │       └── TodoCard.test.js   # MODIFY: add overdue indicator tests
│       └── App.css                    # MODIFY: add .todo-card-overdue styles
└── backend/                           # UNCHANGED
```

**Structure Decision**: Web application layout (Option 2 pattern). The feature is pure frontend — only `packages/frontend` is touched. A new `utils/` directory is introduced to house the reusable `isOverdue()` function per constitution DRY rule.

## Complexity Tracking

> No constitution violations — section not required.
