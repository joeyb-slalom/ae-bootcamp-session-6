# Data Model: Overdue Todo Items

**Phase**: 1 — Design & Contracts  
**Date**: 2026-05-06  
**Feature**: 001-overdue-todo-items

---

## Overview

This feature introduces **no new persisted data**. Overdue status is a computed, display-only
property derived from existing `Todo` fields at render time.

---

## Existing Entity: Todo

The `Todo` entity already has all required fields. The backend SQLite schema and API responses
remain unchanged.

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| `id` | integer | PK, auto-increment | Unique identifier |
| `title` | string | required, max 255 chars | Display text |
| `completed` | integer (SQLite boolean) | 0 or 1, default 0 | 0 = incomplete, 1 = complete |
| `dueDate` | string \| null | optional, ISO date `YYYY-MM-DD` | If null → never overdue |
| `createdAt` | string | ISO timestamp | Set on creation |

---

## Derived Concept: Overdue Status

Overdue status is **not stored**. It is evaluated by the `isOverdue(todo)` utility at render time.

### Definition

A todo is overdue if and only if **all** of the following are true:

1. `todo.dueDate` is non-null and non-empty
2. `todo.completed` is falsy (`0` or `false`)
3. `todo.dueDate` (as an ISO date string `YYYY-MM-DD`) is **strictly less than** today's local date string

### Utility Function Contract

```js
/**
 * Determines whether a todo item is overdue.
 *
 * @param {Object} todo - The todo item to evaluate
 * @param {string} [today] - ISO date string (YYYY-MM-DD) representing today; defaults to
 *   the current local date. Injected for deterministic testing.
 * @returns {boolean} true if the todo is incomplete and its due date is strictly before today
 */
export function isOverdue(todo, today = new Date().toISOString().slice(0, 10)) {
  if (!todo.dueDate) return false;
  if (todo.completed) return false;
  return todo.dueDate < today;
}
```

### State Transition Rules

| Todo State | Due Date | Overdue? |
|------------|----------|---------|
| incomplete | null | No |
| incomplete | future | No |
| incomplete | today | No (boundary: today is NOT overdue) |
| incomplete | past | **Yes** |
| complete | any | No |

### State Change Reactions (no page reload required)

| User Action | Effect on Overdue |
|-------------|------------------|
| Mark incomplete todo (past due) as complete | Overdue indicator disappears immediately |
| Mark complete todo (past due) as incomplete | Overdue indicator appears immediately |
| Edit due date → future (was past, incomplete) | Overdue indicator disappears immediately |
| Edit due date → past (was future, incomplete) | Overdue indicator appears immediately |

All transitions are automatic because `isOverdue()` is called on every render with the
current `todo` prop — React's data-driven rendering handles all cases.

---

## Validation Rules

No new validation rules are introduced. Existing due date validation (optional field, ISO
format) remains unchanged in both frontend `TodoForm` and backend `todoService`.

---

## CSS Design Tokens (New)

Two new CSS custom properties are added to `packages/frontend/src/styles/theme.css`:

| Token | Light Value | Dark Value | Usage |
|-------|-------------|------------|-------|
| `--warning-color` | `#e65100` | `#ff8f00` | Overdue text color, icon badge, left-border accent |

These tokens follow the existing naming convention and 8px grid system. Both values meet
WCAG AA color contrast requirements against their respective background tokens.

---

## Post-Design Constitution Re-Check

| Principle | Status |
|-----------|--------|
| I. Monorepo & Separation of Concerns | ✅ PASS — frontend-only; no cross-package coupling |
| II. Clean Code & Simplicity | ✅ PASS — single utility function; no new abstractions beyond what spec requires |
| III. TDD | ✅ PASS — `isOverdue()` has dedicated unit tests; `TodoCard` tests cover overdue rendering |
| IV. Accessible & Consistent UI | ✅ PASS — design token added; icon has `aria-label`; WCAG AA contrast verified |
| V. Persistent & Reliable Data | ✅ PASS — no persistence changes |
