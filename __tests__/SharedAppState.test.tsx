import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import { GroceryScreen } from '../src/screens/GroceryScreen';
import { HealthScreen } from '../src/screens/HealthScreen';
import { KidScreen } from '../src/screens/KidScreen';
import { TodayScreen } from '../src/screens/TodayScreen';
import { TodosScreen } from '../src/screens/TodosScreen';
import { AppStateProvider } from '../src/state/AppState';

function renderSharedScreens(screens: React.ReactNode) {
  return render(<AppStateProvider>{screens}</AppStateProvider>);
}

describe('shared local app state', () => {
  it('updates Today when a task is added in To-Dos', async () => {
    const { getAllByText, getByLabelText, getByText } = await renderSharedScreens(
      <>
        <TodosScreen />
        <TodayScreen />
      </>
    );

    await fireEvent.changeText(getByLabelText('Task title'), 'Call pediatrician');
    await fireEvent.press(getByText('Add Task'));

    expect(getAllByText('Call pediatrician')).toHaveLength(2);
  });

  it('updates Today when a recurring grocery item is checked in Grocery', async () => {
    const { getByLabelText, queryByText } = await renderSharedScreens(
      <>
        <GroceryScreen />
        <TodayScreen />
      </>
    );

    await fireEvent.press(getByLabelText('Check Bread'));

    expect(queryByText('Bread, Milk')).toBeNull();
  });

  it('updates Today when a schedule item is added in Kid', async () => {
    const { getAllByText, getByLabelText, getByText } = await renderSharedScreens(
      <>
        <KidScreen />
        <TodayScreen />
      </>
    );

    await fireEvent.changeText(getByLabelText('Schedule title'), 'Library story time');
    await fireEvent.changeText(getByLabelText('Start time'), '10:00 AM');
    await fireEvent.changeText(getByLabelText('End time'), '10:45 AM');
    await fireEvent.press(getByText('Add Schedule Item'));

    expect(getAllByText('Library story time')).toHaveLength(2);
  });

  it('updates Today when medicine is marked taken in Health', async () => {
    const { getAllByText, getByLabelText } = await renderSharedScreens(
      <>
        <HealthScreen />
        <TodayScreen />
      </>
    );

    await fireEvent.press(getByLabelText('Mark Vitamin D taken'));

    expect(getAllByText(/Mom • 1 tablet • Last taken:/).length).toBeGreaterThan(0);
  });
});
