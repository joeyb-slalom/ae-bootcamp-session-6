import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TodoCard from '../TodoCard';

describe('TodoCard Component', () => {
  const mockTodo = {
    id: 1,
    title: 'Test Todo',
    dueDate: '2025-12-25',
    completed: 0,
    createdAt: '2025-11-01T00:00:00Z'
  };

  const mockHandlers = {
    onToggle: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render todo title and due date', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
    expect(screen.getByText(/December 25, 2025/)).toBeInTheDocument();
  });

  it('should render unchecked checkbox when todo is incomplete', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('should render checked checkbox when todo is complete', () => {
    const completedTodo = { ...mockTodo, completed: 1 };
    render(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('should call onToggle when checkbox is clicked', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(mockHandlers.onToggle).toHaveBeenCalledWith(mockTodo.id);
  });

  it('should show edit button', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const editButton = screen.getByLabelText(/Edit/);
    expect(editButton).toBeInTheDocument();
  });

  it('should show delete button', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const deleteButton = screen.getByLabelText(/Delete/);
    expect(deleteButton).toBeInTheDocument();
  });

  it('should call onDelete when delete button is clicked and confirmed', () => {
    window.confirm = jest.fn(() => true);
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const deleteButton = screen.getByLabelText(/Delete/);
    fireEvent.click(deleteButton);
    
    expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockTodo.id);
  });

  it('should enter edit mode when edit button is clicked', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const editButton = screen.getByLabelText(/Edit/);
    fireEvent.click(editButton);
    
    expect(screen.getByDisplayValue('Test Todo')).toBeInTheDocument();
  });

  it('should apply completed class when todo is completed', () => {
    const completedTodo = { ...mockTodo, completed: 1 };
    const { container } = render(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    
    const card = container.querySelector('.todo-card');
    expect(card).toHaveClass('completed');
  });

  it('should not render due date when dueDate is null', () => {
    const todoNoDate = { ...mockTodo, dueDate: null };
    render(<TodoCard todo={todoNoDate} {...mockHandlers} isLoading={false} />);
    
    expect(screen.queryByText(/Due:/)).not.toBeInTheDocument();
  });

  it('should cancel editing when Cancel is clicked', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);

    fireEvent.click(screen.getByLabelText(/Edit/));
    expect(screen.getByDisplayValue('Test Todo')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
    expect(screen.queryByDisplayValue('Test Todo')).not.toBeInTheDocument();
  });

  it('should call onEdit and exit edit mode when Save is clicked with valid title', async () => {
    mockHandlers.onEdit.mockResolvedValueOnce();
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);

    fireEvent.click(screen.getByLabelText(/Edit/));

    const titleInput = screen.getByDisplayValue('Test Todo');
    fireEvent.change(titleInput, { target: { value: 'Updated Todo' } });

    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(mockHandlers.onEdit).toHaveBeenCalledWith(mockTodo.id, 'Updated Todo', mockTodo.dueDate);
    });
  });

  it('should show error when saving with empty title', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);

    fireEvent.click(screen.getByLabelText(/Edit/));
    const titleInput = screen.getByDisplayValue('Test Todo');
    fireEvent.change(titleInput, { target: { value: '   ' } });
    fireEvent.click(screen.getByText('Save'));

    expect(screen.getByText('Title cannot be empty')).toBeInTheDocument();
  });

  it('should show error when saving with title exceeding 255 characters', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);

    fireEvent.click(screen.getByLabelText(/Edit/));
    const titleInput = screen.getByDisplayValue('Test Todo');
    fireEvent.change(titleInput, { target: { value: 'a'.repeat(256) } });
    fireEvent.click(screen.getByText('Save'));

    expect(screen.getByText('Title cannot exceed 255 characters')).toBeInTheDocument();
  });

  it('should show error when onEdit fails', async () => {
    mockHandlers.onEdit.mockRejectedValueOnce(new Error('Server error'));
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);

    fireEvent.click(screen.getByLabelText(/Edit/));
    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(screen.getByText('Server error')).toBeInTheDocument();
    });
  });

  it('should update editDueDate when date input changes in edit mode', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);

    fireEvent.click(screen.getByLabelText(/Edit/));
    const dateInput = screen.getByLabelText('Edit due date');
    fireEvent.change(dateInput, { target: { value: '2026-06-01' } });

    expect(dateInput.value).toBe('2026-06-01');
  });
});

describe('TodoCard – overdue indicator (US1/US2)', () => {
  const mockHandlers = {
    onToggle: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('US1: applies todo-card-overdue class for an incomplete todo with a past due date', () => {
    const overdueTodo = { id: 2, title: 'Overdue', dueDate: '2020-01-01', completed: 0, createdAt: '' };
    const { container } = render(<TodoCard todo={overdueTodo} {...mockHandlers} isLoading={false} />);
    expect(container.querySelector('.todo-card')).toHaveClass('todo-card-overdue');
  });

  it('US1: renders ⚠ badge with aria-label="Overdue" when todo is overdue', () => {
    const overdueTodo = { id: 2, title: 'Overdue', dueDate: '2020-01-01', completed: 0, createdAt: '' };
    render(<TodoCard todo={overdueTodo} {...mockHandlers} isLoading={false} />);
    expect(screen.getByLabelText('Overdue')).toBeInTheDocument();
  });

  it('US1: does NOT apply todo-card-overdue class for a non-overdue incomplete todo', () => {
    const futureTodo = { id: 3, title: 'Future', dueDate: '2099-12-31', completed: 0, createdAt: '' };
    const { container } = render(<TodoCard todo={futureTodo} {...mockHandlers} isLoading={false} />);
    expect(container.querySelector('.todo-card')).not.toHaveClass('todo-card-overdue');
  });

  it('US1: does NOT render ⚠ badge for a non-overdue incomplete todo', () => {
    const futureTodo = { id: 3, title: 'Future', dueDate: '2099-12-31', completed: 0, createdAt: '' };
    render(<TodoCard todo={futureTodo} {...mockHandlers} isLoading={false} />);
    expect(screen.queryByLabelText('Overdue')).not.toBeInTheDocument();
  });

  it('US2: does NOT apply todo-card-overdue class for a completed todo with a past due date', () => {
    const completedOverdue = { id: 4, title: 'Done', dueDate: '2020-01-01', completed: 1, createdAt: '' };
    const { container } = render(<TodoCard todo={completedOverdue} {...mockHandlers} isLoading={false} />);
    expect(container.querySelector('.todo-card')).not.toHaveClass('todo-card-overdue');
  });

  it('US2: does NOT render ⚠ badge for a completed todo with a past due date', () => {
    const completedOverdue = { id: 4, title: 'Done', dueDate: '2020-01-01', completed: 1, createdAt: '' };
    render(<TodoCard todo={completedOverdue} {...mockHandlers} isLoading={false} />);
    expect(screen.queryByLabelText('Overdue')).not.toBeInTheDocument();
  });

  it('US2: ⚠ badge appears when re-rendered from completed to incomplete (past due)', () => {
    const completedOverdue = { id: 5, title: 'Toggle', dueDate: '2020-01-01', completed: 1, createdAt: '' };
    const { rerender } = render(<TodoCard todo={completedOverdue} {...mockHandlers} isLoading={false} />);
    expect(screen.queryByLabelText('Overdue')).not.toBeInTheDocument();

    const incompleteOverdue = { ...completedOverdue, completed: 0 };
    rerender(<TodoCard todo={incompleteOverdue} {...mockHandlers} isLoading={false} />);
    expect(screen.getByLabelText('Overdue')).toBeInTheDocument();
  });
});
