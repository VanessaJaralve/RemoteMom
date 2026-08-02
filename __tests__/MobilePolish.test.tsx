import React from 'react';
import { render } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';

import { GroceryScreen } from '../src/screens/GroceryScreen';
import { HealthScreen } from '../src/screens/HealthScreen';
import { KidScreen } from '../src/screens/KidScreen';
import { TodosScreen } from '../src/screens/TodosScreen';
import { AppStateProvider } from '../src/state/AppState';

function renderWithAppState(ui: React.ReactElement) {
  return render(<AppStateProvider>{ui}</AppStateProvider>);
}

function flattenStyle(style: unknown) {
  return StyleSheet.flatten(style as never) as Record<string, number | string | undefined>;
}

function expectComfortableActionButton(style: unknown) {
  const flattenedStyle = flattenStyle(style);

  expect(flattenedStyle.minHeight).toBeGreaterThanOrEqual(44);
  expect(flattenedStyle.paddingVertical).toBeGreaterThanOrEqual(10);
  expect(flattenedStyle.paddingHorizontal).toBeGreaterThanOrEqual(12);
}

describe('mobile spacing and tap targets', () => {
  it('gives small checkbox controls a comfortable hit area without resizing the visual box', async () => {
    const { getByLabelText } = await renderWithAppState(<TodosScreen />);
    const checkbox = getByLabelText('Mark Review tomorrow morning priorities done');

    expect(checkbox.props.hitSlop).toEqual(10);
  });

  it('uses roomy mobile action buttons on To-Dos and Grocery cards', async () => {
    const todosScreen = await renderWithAppState(<TodosScreen />);
    const groceryScreen = await renderWithAppState(<GroceryScreen />);

    expectComfortableActionButton(todosScreen.getByLabelText('Edit Review tomorrow morning priorities').props.style);
    expectComfortableActionButton(todosScreen.getByLabelText('Delete Review tomorrow morning priorities').props.style);
    expectComfortableActionButton(groceryScreen.getByLabelText('Edit Apples').props.style);
    expectComfortableActionButton(groceryScreen.getByLabelText('Delete Apples').props.style);
  });

  it('uses roomy mobile action buttons on Kid and Health cards', async () => {
    const kidScreen = await renderWithAppState(<KidScreen />);
    const healthScreen = await renderWithAppState(<HealthScreen />);

    expectComfortableActionButton(kidScreen.getByLabelText('Edit School drop-off').props.style);
    expectComfortableActionButton(kidScreen.getByLabelText('Delete School drop-off').props.style);
    expectComfortableActionButton(healthScreen.getByLabelText('Edit Vitamin D').props.style);
    expectComfortableActionButton(healthScreen.getByLabelText('Delete Vitamin D').props.style);
  });

  it('gives recurring toggles a comfortable mobile hit area', async () => {
    const groceryScreen = await renderWithAppState(<GroceryScreen />);
    const kidScreen = await renderWithAppState(<KidScreen />);

    const groceryToggle = groceryScreen.getByTestId('grocery-recurring-toggle');
    const kidToggle = kidScreen.getByTestId('schedule-recurring-toggle');

    expect(groceryToggle.props.hitSlop).toEqual(10);
    expect(kidToggle.props.hitSlop).toEqual(10);
  });
});
