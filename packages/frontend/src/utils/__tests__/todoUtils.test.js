import { isOverdue } from '../todoUtils';

describe('isOverdue()', () => {
  // US1: Visual Identification of Overdue Todos
  describe('US1 – basic overdue logic', () => {
    it('returns true for incomplete todo with a past due date', () => {
      expect(isOverdue({ completed: 0, dueDate: '2020-01-01' }, '2026-05-06')).toBe(true);
    });

    it('returns false for incomplete todo with a future due date', () => {
      expect(isOverdue({ completed: 0, dueDate: '2099-12-31' }, '2026-05-06')).toBe(false);
    });

    it('returns false for incomplete todo with no due date', () => {
      expect(isOverdue({ completed: 0, dueDate: null }, '2026-05-06')).toBe(false);
    });

    it('returns false for incomplete todo with undefined due date', () => {
      expect(isOverdue({ completed: 0 }, '2026-05-06')).toBe(false);
    });
  });

  // US2: Completed Todos Are Never Overdue
  describe('US2 – completed todos are never overdue', () => {
    it('returns false for completed (1) todo with a past due date', () => {
      expect(isOverdue({ completed: 1, dueDate: '2020-01-01' }, '2026-05-06')).toBe(false);
    });

    it('returns false for completed (true) todo with a past due date', () => {
      expect(isOverdue({ completed: true, dueDate: '2020-01-01' }, '2026-05-06')).toBe(false);
    });
  });

  // US3: Overdue Status Reflects Current Date (boundary rules)
  describe('US3 – boundary: today is NOT overdue', () => {
    it('returns false when dueDate equals today', () => {
      expect(isOverdue({ completed: 0, dueDate: '2026-05-06' }, '2026-05-06')).toBe(false);
    });

    it('returns true when dueDate is one day before today', () => {
      expect(isOverdue({ completed: 0, dueDate: '2026-05-05' }, '2026-05-06')).toBe(true);
    });

    it('uses injectable today parameter for deterministic testing', () => {
      expect(isOverdue({ completed: 0, dueDate: '2024-01-01' }, '2024-01-02')).toBe(true);
      expect(isOverdue({ completed: 0, dueDate: '2024-01-01' }, '2024-01-01')).toBe(false);
    });
  });
});
