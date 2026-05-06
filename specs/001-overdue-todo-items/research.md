# Research: Overdue Todo Items

**Phase**: 0 — Outline & Research  
**Date**: 2026-05-06  
**Feature**: 001-overdue-todo-items

---

## Decision 1: Utility function location

- **Decision**: Create `packages/frontend/src/utils/todoUtils.js` as home for `isOverdue(todo)` (and future shared todo helpers).
- **Rationale**: The constitution mandates DRY — the utility must be independently testable and reusable across components (FR-010). A `utils/` sibling to `components/` and `services/` follows the established directory structure pattern. Colocating in any single component would prevent reuse.
- **Alternatives considered**:
  - Place inside `services/todoService.js`: Rejected — the service layer is for API communication; a pure date-comparison function has no I/O concern.
  - Place directly in `TodoCard.js`: Rejected — violates DRY and FR-010's requirement for an independently unit-testable utility.

---

## Decision 2: Overdue determination logic

- **Decision**: `isOverdue(todo)` returns `true` iff `todo.dueDate` is set, `todo.completed` is falsy, and `todo.dueDate` (parsed as a local YYYY-MM-DD date string) is strictly before today's local calendar date.
- **Rationale**: The spec explicitly states "a todo is overdue only when its due date is strictly before today" (Assumption 3 / Acceptance Scenario 3.2). The date comparison must use calendar dates (not timestamps) to avoid timezone drift from `new Date(isoString)`. Using `YYYY-MM-DD` string comparison (`"2026-05-05" < "2026-05-06"`) is reliable for ISO date strings without time components.
- **Alternatives considered**:
  - `new Date(todo.dueDate) < new Date()`: Rejected — compares a date-only string against the current timestamp, making a todo due *today* appear overdue in some timezones/times.
  - Pass `today` as a parameter: Accepted as additional option — makes the function deterministically testable without mocking `Date`. **Chosen implementation**: `isOverdue(todo, today = new Date().toISOString().slice(0,10))` where `today` defaults to the current local date string. Tests pass an explicit date string.

---

## Decision 3: Overdue visual treatment — CSS tokens

- **Decision**: Add a `--warning-color` CSS variable to `theme.css` (light: `#e65100` — deep orange; dark: `#ff8f00` — amber). The overdue due-date text and badge icon use this token. The overdue card receives a subtle left-border accent in `--warning-color`.
- **Rationale**: The spec requires red/orange warning color + icon badge (FR-009). The existing `--danger-color` (`#c62828` / `#ef5350`) is used for destructive actions (delete). Overdue is a warning, not a danger — a distinct token avoids semantic collision and stays within the design system. Both chosen values meet WCAG AA (4.5:1) against their respective background tokens.
- **Alternatives considered**:
  - Reuse `--danger-color` for overdue: Rejected — semantic mismatch; danger = destructive action, warning = attention needed.
  - Hardcode hex values in `App.css`: Rejected — violates design token discipline from constitution IV.

---

## Decision 4: Overdue icon

- **Decision**: Use the Unicode `⚠` (U+26A0 WARNING SIGN) character as the badge icon, rendered in a `<span>` with `aria-label="Overdue"` and `role="img"`.
- **Rationale**: The spec calls out "⚠ or clock icon". `⚠` is universally recognized, renders without additional dependencies (no icon library), and is visually compact beside the due date text. Providing `aria-label="Overdue"` satisfies WCAG SC 1.1.1 (non-text content).
- **Alternatives considered**:
  - Clock icon (⏰): Readable but less immediately associated with "warning/overdue"; `⚠` is clearer.
  - Font icon library (e.g., Material Icons): Rejected — constitution prohibits new runtime dependencies without approval.

---

## Decision 5: TodoCard rendering strategy

- **Decision**: Call `isOverdue(todo)` inside `TodoCard` render. When `true`: (a) apply `todo-card-overdue` CSS class to the card wrapper, (b) render the `⚠` badge span adjacent to the due date `<p>`.
- **Rationale**: State is derived purely from props (`todo` object) — no additional React state needed. The overdue indicator updates automatically whenever React re-renders the component (e.g., after toggle or edit), satisfying FR-005 through FR-008 without page reload.
- **Alternatives considered**:
  - Compute `isOverdue` in `App.js` and pass as prop: Rejected — adds prop drilling without benefit; keeps computation co-located with the render consumer.
  - `TodoList` wrapping logic: Rejected — same prop-drilling concern.

---

## Summary Table

| Question | Resolution |
|----------|-----------|
| Where does `isOverdue` live? | `packages/frontend/src/utils/todoUtils.js` |
| How is overdue determined? | `dueDate < today` (string comparison), `!completed`, `dueDate` present |
| How to make testable? | Accept optional `today` parameter; defaults to current local date |
| What CSS token for warning? | New `--warning-color` in `theme.css` |
| What icon? | `⚠` Unicode with `aria-label="Overdue"` |
| Does backend change? | No |
| New npm dependencies? | None |
