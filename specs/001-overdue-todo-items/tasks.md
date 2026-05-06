---
description: "Task list for Overdue Todo Items feature implementation"
---

# Tasks: Overdue Todo Items

**Input**: Design documents from `/specs/001-overdue-todo-items/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, quickstart.md ✅

**Tests**: Included — required by constitution principle III (TDD) and plan.md coverage gate (≥ 80%).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependency on incomplete tasks)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Exact file paths are included in all descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the new `utils/` directory structure required by the feature.

- [ ] T001 Create `packages/frontend/src/utils/todoUtils.js` and `packages/frontend/src/utils/__tests__/todoUtils.test.js` as empty stubs (export placeholder, empty test file) to establish directory structure

**Checkpoint**: utils/ directory exists — foundational work and user story implementation can proceed

---

## Phase 2: Foundational (Blocking Prerequisite)

**Purpose**: Add the CSS design token that the overdue visual treatment depends on. ALL user stories require this token before they can be fully rendered.

**⚠️ CRITICAL**: No user story visual work can be verified without this phase complete.

- [ ] T002 Add `--warning-color` CSS custom property to `packages/frontend/src/styles/theme.css` — light value: `#e65100`, dark value (inside `.dark` or `[data-theme="dark"]` selector): `#ff8f00`, following the existing token naming and selector pattern

**Checkpoint**: Warning color token is available — user story implementation can now begin

---

## Phase 3: User Story 1 - Visual Identification of Overdue Todos (Priority: P1) 🎯 MVP

**Goal**: Incomplete todos with a due date strictly before today render with a warning-color accent and a `⚠` icon badge near the due date. Todos with no due date, a future due date, or today's date show no indicator.

**Independent Test**: Render a `TodoCard` with `{ completed: 0, dueDate: '2020-01-01' }` and verify the `⚠` badge and `todo-card-overdue` class are present. Render with `{ completed: 0, dueDate: '2099-12-31' }` and verify they are absent.

### Tests for User Story 1 ⚠️ Write FIRST — must FAIL before implementation

- [ ] T003 [P] [US1] Write failing unit tests for `isOverdue()` covering: (a) incomplete + past dueDate → `true`, (b) incomplete + future dueDate → `false`, (c) incomplete + no dueDate → `false` — in `packages/frontend/src/utils/__tests__/todoUtils.test.js`
- [ ] T004 [P] [US1] Write failing `TodoCard` tests verifying: (a) `todo-card-overdue` CSS class applied to card wrapper when overdue, (b) `⚠` badge element with `aria-label="Overdue"` rendered near due date when overdue, (c) neither class nor badge renders for a non-overdue incomplete todo — in `packages/frontend/src/components/__tests__/TodoCard.test.js`

### Implementation for User Story 1

- [ ] T005 [US1] Implement and export `isOverdue(todo, today = new Date().toISOString().slice(0, 10))` in `packages/frontend/src/utils/todoUtils.js`: return `false` if no `dueDate`, return `false` if `todo.completed` is truthy, return `todo.dueDate < today`
- [ ] T006 [P] [US1] Add `.todo-card-overdue` CSS ruleset to `packages/frontend/src/App.css`: left-border accent using `var(--warning-color)`, due-date text color override using `var(--warning-color)`, following existing `.todo-card` selector pattern
- [ ] T007 [US1] Update `packages/frontend/src/components/TodoCard.js`: import `isOverdue` from `../utils/todoUtils`, call `isOverdue(todo)` in render, conditionally append `todo-card-overdue` class to card wrapper, conditionally render `<span role="img" aria-label="Overdue">⚠</span>` adjacent to the due date `<p>` element

**Checkpoint**: User Story 1 is fully functional — incomplete past-due todos display the visual indicator; other todos do not

---

## Phase 4: User Story 2 - Completed Todos Are Never Overdue (Priority: P2)

**Goal**: Completed todo items never show the overdue indicator, even when their due date is in the past. Toggling an overdue todo to complete removes the indicator immediately (React re-render handles this automatically).

**Independent Test**: Render a `TodoCard` with `{ completed: 1, dueDate: '2020-01-01' }` and verify neither the `todo-card-overdue` class nor the `⚠` badge is present.

### Tests for User Story 2

- [ ] T008 [P] [US2] Add `todoUtils.test.js` unit tests verifying `isOverdue()` returns `false` for: (a) `{ completed: 1, dueDate: '2020-01-01' }`, (b) `{ completed: true, dueDate: '2020-01-01' }` — in `packages/frontend/src/utils/__tests__/todoUtils.test.js`
- [ ] T009 [P] [US2] Add `TodoCard.test.js` tests verifying: (a) a completed todo with a past dueDate renders without `todo-card-overdue` class and without `⚠` badge, (b) passing from completed `→` incomplete (re-render with completed=0) causes the badge to appear — in `packages/frontend/src/components/__tests__/TodoCard.test.js`

*(No new implementation needed — `isOverdue()` already returns false when `todo.completed` is truthy, and React re-renders `TodoCard` automatically on prop change.)*

**Checkpoint**: User Stories 1 AND 2 are independently verified; completed todos never show the indicator

---

## Phase 5: User Story 3 - Overdue Status Reflects Current Date (Priority: P3)

**Goal**: Overdue status is always evaluated against the current local calendar date. A todo due today is NOT overdue (boundary rule: `dueDate < today`, strict less-than). As days pass, previously on-time todos can become overdue without user action.

**Independent Test**: Call `isOverdue({ completed: 0, dueDate: '2026-05-06' }, '2026-05-06')` and expect `false`; call `isOverdue({ completed: 0, dueDate: '2026-05-05' }, '2026-05-06')` and expect `true`.

### Tests for User Story 3

- [ ] T010 [US3] Add `todoUtils.test.js` boundary tests using the injected `today` parameter: (a) `dueDate === today` → `false` (not overdue), (b) `dueDate` is one day before `today` → `true` (overdue), (c) default `today` parameter is injected so test is deterministic — in `packages/frontend/src/utils/__tests__/todoUtils.test.js`

*(No new implementation needed — ISO date string comparison `dueDate < today` correctly handles the boundary, and the injectable `today` parameter makes this deterministically testable.)*

**Checkpoint**: All three user stories are independently verified and functional

---

## Final Phase: Polish & Cross-Cutting Concerns

**Purpose**: Coverage gate validation and end-to-end manual smoke test.

- [ ] T011 Run the full test suite from repo root (`npm test`) and verify frontend coverage report shows ≥ 80% for `packages/frontend/src`; fix any failing tests
- [ ] T012 [P] Complete all 9 scenarios in the manual test checklist in `specs/001-overdue-todo-items/quickstart.md` (past/today/future/no-date todos, toggle complete/incomplete, edit due date, dark mode)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS visual rendering in all user stories
- **User Story phases (Phase 3–5)**: All depend on Phase 2 completion
  - US1 (Phase 3) must complete before US2/US3 phases (US2/US3 tests depend on the implementation from US1)
  - US2 (Phase 4) and US3 (Phase 5) can proceed in parallel after US1 implementation is complete
- **Polish (Final Phase)**: Depends on all desired user stories complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Phase 2 — core implementation; no dependencies on US2/US3
- **User Story 2 (P2)**: Depends on US1 implementation (`isOverdue` + `TodoCard` changes) — verification-only phase
- **User Story 3 (P3)**: Depends on US1 implementation (`isOverdue` exists with injectable `today`) — verification-only phase

### Within Each Phase

1. Tests MUST be written first and confirmed FAILING before implementation (TDD)
2. `isOverdue()` (T005) must be complete before `TodoCard.js` update (T007)
3. CSS class (T006) can be written in parallel with `isOverdue()` (T005)
4. US2 and US3 test tasks (T008–T010) can be added to existing test files in parallel

---

## Parallel Execution Examples

### Phase 3 — User Story 1 (parallel test writing)

```bash
# Terminal 1
# Write isOverdue() unit tests
# packages/frontend/src/utils/__tests__/todoUtils.test.js → T003

# Terminal 2
# Write TodoCard overdue rendering tests
# packages/frontend/src/components/__tests__/TodoCard.test.js → T004
```

### Phase 3 — User Story 1 (parallel implementation)

```bash
# Terminal 1
# Implement isOverdue() utility
# packages/frontend/src/utils/todoUtils.js → T005

# Terminal 2
# Add .todo-card-overdue CSS class
# packages/frontend/src/App.css → T006

# After T005 complete:
# Update TodoCard.js → T007
```

### Phase 4 — User Story 2 (parallel test additions)

```bash
# Terminal 1
# Add isOverdue completed-todo tests
# packages/frontend/src/utils/__tests__/todoUtils.test.js → T008

# Terminal 2
# Add TodoCard completed-todo tests
# packages/frontend/src/components/__tests__/TodoCard.test.js → T009
```

---

## Implementation Strategy

**MVP scope**: Phase 3 (User Story 1) alone delivers the core user value — visible overdue indicators on past-due incomplete todos. This is independently shippable.

**Incremental delivery**:
1. Phase 1–3: Ship MVP (overdue indicator visible, tests passing)
2. Phase 4: Add completed-todo exclusion verification (behavior already works; this phase confirms it with tests)
3. Phase 5: Add boundary-rule verification (behavior already works; this phase pins the today-is-not-overdue contract with a test)
4. Final Phase: Coverage validation + manual smoke test

**Files touched** (frontend only — backend unchanged):

| File | Change Type | Phase |
|------|-------------|-------|
| `packages/frontend/src/styles/theme.css` | MODIFY — add `--warning-color` token | Phase 2 |
| `packages/frontend/src/utils/todoUtils.js` | NEW — `isOverdue()` utility | Phase 3 |
| `packages/frontend/src/utils/__tests__/todoUtils.test.js` | NEW — unit tests (US1/US2/US3) | Phase 3–5 |
| `packages/frontend/src/App.css` | MODIFY — add `.todo-card-overdue` class | Phase 3 |
| `packages/frontend/src/components/TodoCard.js` | MODIFY — call `isOverdue()`, render badge | Phase 3 |
| `packages/frontend/src/components/__tests__/TodoCard.test.js` | MODIFY — add overdue tests | Phase 3–4 |
