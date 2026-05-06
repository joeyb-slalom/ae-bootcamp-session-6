# Feature Specification: Overdue Todo Items

**Feature Branch**: `feature/001-overdue-todo-items`  
**Created**: 2026-05-06  
**Status**: Draft  
**Input**: User description: "Support for Overdue Todo Items — Users need a clear, visual way to identify which todos have not been completed by their due date."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visual Identification of Overdue Todos (Priority: P1)

A user opens their todo list and immediately sees which items are past their due date and still incomplete. Overdue todos are visually distinct from regular incomplete todos, allowing the user to prioritize their work without manually comparing dates.

**Why this priority**: This is the core value of the feature. Without visual distinction, users cannot quickly identify overdue items, which is the entire purpose of the feature.

**Independent Test**: Can be fully tested by creating todos with past due dates (incomplete) and verifying they render with an overdue visual indicator, while todos with future due dates do not.

**Acceptance Scenarios**:

1. **Given** a todo that is incomplete and has a due date in the past, **When** the user views the todo list, **Then** that todo is visually marked as overdue (e.g., distinct color, icon, or label)
2. **Given** a todo that is incomplete and has a due date in the future, **When** the user views the todo list, **Then** that todo does NOT show any overdue indicator
3. **Given** a todo that has no due date set, **When** the user views the todo list, **Then** that todo does NOT show any overdue indicator

---

### User Story 2 - Completed Todos Are Never Overdue (Priority: P2)

A user who has completed a task after its due date should not see that task flagged as overdue. Completing a todo removes the overdue status, even if the due date has already passed.

**Why this priority**: Showing a completed todo as overdue would create confusing noise and undermine the usefulness of the overdue indicator.

**Independent Test**: Can be tested by marking a todo with a past due date as complete, and verifying the overdue indicator disappears.

**Acceptance Scenarios**:

1. **Given** a todo that is completed and has a due date in the past, **When** the user views the todo list, **Then** that todo does NOT show an overdue indicator
2. **Given** a todo that is overdue (incomplete, past due date), **When** the user marks it as complete, **Then** the overdue indicator is removed immediately

---

### User Story 3 - Overdue Status Reflects Current Date (Priority: P3)

The overdue status is always based on the current date at the time the page is viewed, not the date the todo was created or last edited. As time passes, todos that were previously on time may become overdue without any user action.

**Why this priority**: Ensures the overdue indicator stays accurate over time without requiring manual refresh logic beyond standard page load.

**Independent Test**: Can be tested by setting a todo's due date to today's date and verifying it behaves according to the boundary rule on that specific day.

**Acceptance Scenarios**:

1. **Given** a todo whose due date was yesterday, **When** the user loads the todo list today, **Then** that todo is shown as overdue
2. **Given** a todo whose due date is today, **When** the user views the todo list, **Then** that todo does NOT show an overdue indicator (a todo is overdue only when its due date is strictly before today)

---

### Edge Cases

- What happens when a todo has no due date set? → It is never considered overdue.
- What happens when an overdue todo is marked complete? → The overdue indicator is removed immediately.
- What happens when a completed todo is marked incomplete again and its due date has passed? → It should immediately display as overdue.
- What happens when a user edits the due date of an overdue todo to a future date? → The overdue indicator is removed.
- What happens when a user edits the due date of a future todo to a past date? → The todo becomes immediately overdue.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST visually distinguish incomplete todo items whose due date is strictly before the current date from all other todo items
- **FR-002**: The system MUST NOT display overdue indicators on completed todo items, regardless of their due date
- **FR-003**: The system MUST NOT display overdue indicators on todo items that have no due date
- **FR-004**: The overdue status of a todo MUST be evaluated based on the current date each time the todo list is displayed
- **FR-005**: When a todo transitions from incomplete to complete, any overdue indicator MUST be removed without requiring a page reload
- **FR-006**: When a todo transitions from complete to incomplete and its due date is in the past, the overdue indicator MUST be applied without requiring a page reload
- **FR-007**: When a todo's due date is edited to a past date (while incomplete), the overdue indicator MUST be applied immediately
- **FR-008**: When a todo's due date is edited to a future date (while incomplete and previously overdue), the overdue indicator MUST be removed immediately
- **FR-009**: The overdue visual treatment MUST be distinguishable for users with color vision deficiencies (not rely on color alone)

### Key Entities

- **Todo Item**: An existing entity with a title, optional due date, and completion status. The overdue concept is derived from these existing attributes — no new stored data is required.
- **Overdue Status**: A computed, display-only state derived by comparing a todo's due date to the current date. Not persisted; evaluated at render time.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can identify all overdue incomplete todos without manually reading or comparing dates — verifiable by usability observation
- **SC-002**: 100% of incomplete todos with a due date in the past display the overdue indicator
- **SC-003**: 0% of completed todos display an overdue indicator, regardless of due date
- **SC-004**: 0% of todos without a due date display an overdue indicator
- **SC-005**: The overdue indicator updates instantly (within the same render cycle) when a user toggles completion status or edits a due date — no page reload required

## Assumptions

- The existing todo item data model includes a due date field (optional) and a completion status field — no backend or data model changes are required for this feature
- Overdue status is a purely client-side, computed, display-only concern; it does not need to be stored or calculated by the backend
- "Overdue" means the due date is strictly before the current calendar date; a todo due today is NOT overdue — users have the full day to complete it
- The visual treatment for overdue items will follow the existing UI design system and theme guidelines (light/dark mode compatible)
- The application is a single-user desktop-focused interface; no user-specific timezone preferences need to be handled — local browser date is used
- This feature does not introduce any filtering, sorting by overdue status, or grouping — overdue items remain in their existing display order
