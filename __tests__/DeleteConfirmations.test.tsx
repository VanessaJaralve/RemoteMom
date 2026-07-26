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

describe('delete confirmations', () => {
  it('requires confirmation before deleting a task', async () => {
    const { getAllByText, getByLabelText, queryByLabelText, queryByText } =
      await renderSharedScreens(
      <>
        <TodosScreen />
        <TodayScreen />
      </>
      );

    await waitFor(() =>
      expect(getByLabelText('Delete Review tomorrow morning priorities')).toBeOnTheScreen()
    );
    await fireEvent.press(getByLabelText('Delete Review tomorrow morning priorities'));

    expect(getAllByText('Review tomorrow morning priorities').length).toBeGreaterThan(0);
    expect(getByLabelText('Confirm delete Review tomorrow morning priorities')).toBeOnTheScreen();

    await fireEvent.press(getByLabelText('Cancel delete Review tomorrow morning priorities'));
    expect(queryByLabelText('Confirm delete Review tomorrow morning priorities')).toBeNull();

    await fireEvent.press(getByLabelText('Delete Review tomorrow morning priorities'));
    await fireEvent.press(getByLabelText('Confirm delete Review tomorrow morning priorities'));

    expect(queryByText('Review tomorrow morning priorities')).toBeNull();
  });

  it('requires confirmation before deleting a grocery item', async () => {
    const { getAllByText, getByLabelText, queryByLabelText, queryByText } =
      await renderSharedScreens(
      <>
        <GroceryScreen />
        <TodayScreen />
      </>
      );

    await waitFor(() => expect(getByLabelText('Delete Bread')).toBeOnTheScreen());
    await fireEvent.press(getByLabelText('Delete Bread'));

    expect(getAllByText('Bread').length).toBeGreaterThan(0);
    expect(getByLabelText('Confirm delete Bread')).toBeOnTheScreen();

    await fireEvent.press(getByLabelText('Cancel delete Bread'));
    expect(queryByLabelText('Confirm delete Bread')).toBeNull();

    await fireEvent.press(getByLabelText('Delete Bread'));
    await fireEvent.press(getByLabelText('Confirm delete Bread'));

    expect(queryByText('Bread')).toBeNull();
  });

  it('requires confirmation before deleting a kid schedule item', async () => {
    const { getAllByText, getByLabelText, queryByLabelText, queryByText } =
      await renderSharedScreens(
      <>
        <KidScreen />
        <TodayScreen />
      </>
      );

    await waitFor(() => expect(getByLabelText('Delete School drop-off')).toBeOnTheScreen());
    await fireEvent.press(getByLabelText('Delete School drop-off'));

    expect(getAllByText('School drop-off').length).toBeGreaterThan(0);
    expect(getByLabelText('Confirm delete School drop-off')).toBeOnTheScreen();

    await fireEvent.press(getByLabelText('Cancel delete School drop-off'));
    expect(queryByLabelText('Confirm delete School drop-off')).toBeNull();

    await fireEvent.press(getByLabelText('Delete School drop-off'));
    await fireEvent.press(getByLabelText('Confirm delete School drop-off'));

    expect(queryByText('School drop-off')).toBeNull();
  });

  it('requires confirmation before deleting a medicine entry', async () => {
    const { getAllByText, getByLabelText, queryByLabelText, queryByText } =
      await renderSharedScreens(
      <>
        <HealthScreen />
        <TodayScreen />
      </>
      );

    await waitFor(() => expect(getByLabelText('Delete Vitamin D')).toBeOnTheScreen());
    await fireEvent.press(getByLabelText('Delete Vitamin D'));

    expect(getAllByText('Vitamin D').length).toBeGreaterThan(0);
    expect(getByLabelText('Confirm delete Vitamin D')).toBeOnTheScreen();

    await fireEvent.press(getByLabelText('Cancel delete Vitamin D'));
    expect(queryByLabelText('Confirm delete Vitamin D')).toBeNull();

    await fireEvent.press(getByLabelText('Delete Vitamin D'));
    await fireEvent.press(getByLabelText('Confirm delete Vitamin D'));

    expect(queryByText('Vitamin D')).toBeNull();
  });
});
