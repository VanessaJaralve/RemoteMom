import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';

import { GroceryScreen } from '../src/screens/GroceryScreen';
import { HealthScreen } from '../src/screens/HealthScreen';
import { KidScreen } from '../src/screens/KidScreen';
import { TodayScreen } from '../src/screens/TodayScreen';
import { TodosScreen } from '../src/screens/TodosScreen';
import { AppStateProvider } from '../src/state/AppState';

function renderSharedScreens(screens: React.ReactNode) {
  return render(<AppStateProvider>{screens}</AppStateProvider>);
}

describe('edit and delete flows', () => {
  it('deletes a task and removes it from Today', async () => {
    const { getByLabelText, queryByText } = await renderSharedScreens(
      <>
        <TodosScreen />
        <TodayScreen />
      </>
    );

    await waitFor(() =>
      expect(getByLabelText('Delete Review tomorrow morning priorities')).toBeOnTheScreen()
    );
    await fireEvent.press(getByLabelText('Delete Review tomorrow morning priorities'));

    expect(queryByText('Review tomorrow morning priorities')).toBeNull();
  });

  it('edits a task and updates Today', async () => {
    const { getAllByText, getByDisplayValue, getByLabelText, getByText, queryByText } =
      await renderSharedScreens(
        <>
          <TodosScreen />
          <TodayScreen />
        </>
      );

    await waitFor(() =>
      expect(getByLabelText('Edit Review tomorrow morning priorities')).toBeOnTheScreen()
    );
    await fireEvent.press(getByLabelText('Edit Review tomorrow morning priorities'));
    await fireEvent.changeText(getByDisplayValue('Review tomorrow morning priorities'), 'Plan Friday pickup');
    await fireEvent.press(getByText('Save Task'));

    expect(getAllByText('Plan Friday pickup')).toHaveLength(2);
    expect(queryByText('Review tomorrow morning priorities')).toBeNull();
  });

  it('deletes and edits grocery items', async () => {
    const { getAllByText, getByDisplayValue, getByLabelText, getByText, queryByText } =
      await renderSharedScreens(
        <>
          <GroceryScreen />
          <TodayScreen />
        </>
      );

    await waitFor(() => expect(getByLabelText('Delete Bread')).toBeOnTheScreen());
    await fireEvent.press(getByLabelText('Delete Bread'));
    expect(queryByText('Bread, Milk')).toBeNull();

    await fireEvent.press(getByLabelText('Edit Milk'));
    await fireEvent.changeText(getByDisplayValue('Milk'), 'Oat milk');
    await fireEvent.press(getByText('Save Grocery Item'));

    expect(getAllByText('Oat milk')).toHaveLength(2);
    expect(queryByText('Milk')).toBeNull();
  });

  it('deletes and edits kid schedule items', async () => {
    const { getAllByText, getByDisplayValue, getByLabelText, getByText, queryByText } =
      await renderSharedScreens(
        <>
          <KidScreen />
          <TodayScreen />
        </>
      );

    await waitFor(() => expect(getByLabelText('Delete School drop-off')).toBeOnTheScreen());
    await fireEvent.press(getByLabelText('Delete School drop-off'));
    expect(queryByText('School drop-off')).toBeNull();

    await fireEvent.press(getByLabelText('Edit Soccer practice'));
    await fireEvent.changeText(getByDisplayValue('Soccer practice'), 'Swim lesson');
    await fireEvent.press(getByText('Save Schedule Item'));

    expect(getAllByText('Swim lesson')).toHaveLength(2);
    expect(queryByText('Soccer practice')).toBeNull();
  });

  it('deletes and edits medicine entries', async () => {
    const { getAllByText, getByDisplayValue, getByLabelText, getByText, queryByText } =
      await renderSharedScreens(
        <>
          <HealthScreen />
          <TodayScreen />
        </>
      );

    await waitFor(() => expect(getByLabelText('Delete Vitamin D')).toBeOnTheScreen());
    await fireEvent.press(getByLabelText('Delete Vitamin D'));
    expect(queryByText('Vitamin D')).toBeNull();

    await fireEvent.press(getByLabelText('Edit Child Allergy Syrup'));
    await fireEvent.changeText(getByDisplayValue('Child Allergy Syrup'), 'Evening Allergy Syrup');
    await fireEvent.press(getByText('Save Medicine'));

    expect(getAllByText('Evening Allergy Syrup').length).toBeGreaterThan(1);
    expect(queryByText('Child Allergy Syrup')).toBeNull();
  });
});
