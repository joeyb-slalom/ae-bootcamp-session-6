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
