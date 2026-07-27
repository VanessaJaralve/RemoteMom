import React from 'react';
import { render } from '@testing-library/react-native';

import {
  sampleGroceryItems,
  sampleMedicines,
  sampleScheduleItems,
  sampleTasks
} from '../src/data/sampleData';
import { GroceryScreen } from '../src/screens/GroceryScreen';
import { HealthScreen } from '../src/screens/HealthScreen';
import { KidScreen } from '../src/screens/KidScreen';
import { TodosScreen } from '../src/screens/TodosScreen';
import { AppStateProvider } from '../src/state/AppState';

function renderWithAppState(ui: React.ReactElement) {
  return render(<AppStateProvider>{ui}</AppStateProvider>);
}

describe('reminder-ready fields', () => {
  it('adds local reminder metadata to sample data without scheduling notifications', () => {
    expect(sampleTasks[0]).toEqual(
      expect.objectContaining({
        reminderEnabled: true,
        reminderTime: '8:00 PM'
      })
    );
    expect(sampleGroceryItems[0]).toEqual(
      expect.objectContaining({
        reminderEnabled: true,
        reminderTime: '5:30 PM'
      })
    );
    expect(sampleScheduleItems[0]).toEqual(
      expect.objectContaining({
        reminderEnabled: true
      })
    );
    expect(sampleMedicines[0]).toEqual(
      expect.objectContaining({
        reminderEnabled: true
      })
    );
  });

  it('shows reminder labels in To-Dos without notification copy', async () => {
    const { getByText, queryByText } = await renderWithAppState(<TodosScreen />);

    expect(getByText('Reminder ready at 8:00 PM')).toBeOnTheScreen();
    expect(getByText('Reminder off')).toBeOnTheScreen();
    expect(queryByText('Notifications')).toBeNull();
  });

  it('shows reminder labels in Grocery without notification copy', async () => {
    const { getAllByText, getByText, queryByText } = await renderWithAppState(<GroceryScreen />);

    expect(getAllByText('Reminder ready at 5:30 PM').length).toBeGreaterThan(0);
    expect(getByText('Reminder off')).toBeOnTheScreen();
    expect(queryByText('Notifications')).toBeNull();
  });

  it('shows reminder labels in Kid Schedule and Health without notification copy', async () => {
    const { getAllByText, queryByText } = await renderWithAppState(
      <>
        <KidScreen />
        <HealthScreen />
      </>
    );

    expect(getAllByText('Reminder ready').length).toBeGreaterThan(0);
    expect(getAllByText('Reminder off').length).toBeGreaterThan(0);
    expect(queryByText('Notifications')).toBeNull();
  });
});
