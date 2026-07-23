import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import { TodosScreen } from '../src/screens/TodosScreen';
import type { Task } from '../src/models/Task';

describe('TodosScreen', () => {
  it('uses the exact Task model fields from the project brief', () => {
    const task: Task = {
      id: 'task-1',
      title: 'Send client update',
      lifeArea: 'work',
      dueDate: '2026-07-24',
      isDone: false
    };

    expect(Object.keys(task)).toEqual(['id', 'title', 'lifeArea', 'dueDate', 'isDone']);
  });

  it('renders the universal to-do list module without other modules', async () => {
    const { getByText, queryByText } = await render(<TodosScreen />);

    expect(getByText('Universal To-Do List')).toBeOnTheScreen();
    expect(getByText('Add Task')).toBeOnTheScreen();
    expect(queryByText('Grocery List')).toBeNull();
    expect(queryByText('Medicine Tracker')).toBeNull();
    expect(queryByText('Kid Schedule')).toBeNull();
    expect(queryByText('Today Dashboard')).toBeNull();
  });

  it('adds a task with title, life area, and optional due date', async () => {
    const { getAllByDisplayValue, getAllByText, getByLabelText, getByText } =
      await render(<TodosScreen />);

    await fireEvent.changeText(getByLabelText('Task title'), 'Buy recital shoes');
    await fireEvent.press(getByLabelText('Select Kid life area'));
    await fireEvent.changeText(getByLabelText('Due date'), 'Friday');
    await fireEvent.press(getByText('Add Task'));

    expect(getByText('Buy recital shoes')).toBeOnTheScreen();
    expect(getAllByText('Kid').length).toBeGreaterThan(0);
    expect(getByText('Due Friday')).toBeOnTheScreen();
    expect(getAllByDisplayValue('')).toHaveLength(2);
  });

  it('toggles a task done and keeps it visible', async () => {
    const { getByLabelText, getByText } = await render(<TodosScreen />);

    await fireEvent.changeText(getByLabelText('Task title'), 'Prep Monday slides');
    await fireEvent.press(getByText('Add Task'));
    await fireEvent.press(getByLabelText('Mark Prep Monday slides done'));

    expect(getByText('Prep Monday slides')).toBeOnTheScreen();
    expect(getByText('Done')).toBeOnTheScreen();
  });
});
