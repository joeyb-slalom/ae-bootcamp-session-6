# Quickstart: Overdue Todo Items

**Feature**: 001-overdue-todo-items  
**Branch**: `001-overdue-todo-items`

---

## Prerequisites

- Node.js ≥ 16
- npm workspaces (run all commands from repo root unless noted)

---

## Run the App Locally

```bash
# Install all dependencies
npm install

# Start backend (port 3001) and frontend (port 3000) concurrently
npm start
```

Open http://localhost:3000 in a browser.

To see overdue behavior, create a todo with a past due date (e.g., `2024-01-01`) and leave it incomplete. The card will display a ⚠ warning badge and orange accent beside the due date.

---

## Run All Tests

```bash
# From repo root — runs both frontend and backend test suites
npm test

# Frontend only (with coverage)
cd packages/frontend && npm test -- --coverage

# Backend only
cd packages/backend && npm test
```

Expected coverage gate: **≥ 80%** for `packages/frontend`.

---

## Key Files for This Feature

| File | Role |
|------|------|
| `packages/frontend/src/utils/todoUtils.js` | `isOverdue(todo)` utility (new) |
| `packages/frontend/src/utils/__tests__/todoUtils.test.js` | Unit tests for `isOverdue()` (new) |
| `packages/frontend/src/components/TodoCard.js` | Renders overdue indicator (modified) |
| `packages/frontend/src/components/__tests__/TodoCard.test.js` | TodoCard overdue tests (modified) |
| `packages/frontend/src/App.css` | `.todo-card-overdue` CSS class (modified) |
| `packages/frontend/src/styles/theme.css` | `--warning-color` design token (modified) |

---

## Overdue Logic at a Glance

```js
// packages/frontend/src/utils/todoUtils.js
export function isOverdue(todo, today = new Date().toISOString().slice(0, 10)) {
  if (!todo.dueDate) return false;
  if (todo.completed) return false;
  return todo.dueDate < today;  // ISO string comparison; today is NOT overdue
}
```

---

## Manual Test Checklist

1. Create a todo with a **past** due date → verify ⚠ badge appears beside the date
2. Create a todo with **today's** date → verify no badge
3. Create a todo with a **future** date → verify no badge
4. Create a todo with **no** due date → verify no badge
5. Toggle a past-due incomplete todo to **complete** → verify badge disappears immediately
6. Toggle the same todo back to **incomplete** → verify badge reappears immediately
7. Edit a past-due todo's due date to a **future** date → verify badge disappears
8. Edit a future-due todo's due date to a **past** date → verify badge appears
9. Switch to **dark mode** → verify warning color (amber `#ff8f00`) remains visible with sufficient contrast
