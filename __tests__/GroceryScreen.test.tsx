import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import { GroceryScreen } from '../src/screens/GroceryScreen';
import type { GroceryItem } from '../src/models/GroceryItem';
import { AppStateProvider } from '../src/state/AppState';

function renderWithAppState(ui: React.ReactElement) {
  return render(<AppStateProvider>{ui}</AppStateProvider>);
}

function collectTextContent(node: unknown): string[] {
  if (typeof node === 'string') {
    return [node];
  }

  if (!node || typeof node !== 'object') {
    return [];
  }

  const children = (node as { children?: unknown[] }).children ?? [];

  return children.flatMap(collectTextContent);
}

describe('GroceryScreen', () => {
  it('uses the exact GroceryItem model fields from the project brief', () => {
    const item: GroceryItem = {
      id: 'grocery-1',
      itemName: 'Greek yogurt',
      category: 'dairy',
      isChecked: false,
      isRecurring: true
    };

    expect(Object.keys(item)).toEqual([
      'id',
      'itemName',
      'category',
      'isChecked',
      'isRecurring'
    ]);
  });

  it('renders the grocery list module without future modules', async () => {
    const { getByText, queryByText } = await renderWithAppState(<GroceryScreen />);

    expect(getByText('Grocery List')).toBeOnTheScreen();
    expect(getByText('Add Grocery Item')).toBeOnTheScreen();
    expect(queryByText('Kid Schedule')).toBeNull();
    expect(queryByText('Medicine Tracker')).toBeNull();
    expect(queryByText('Today Dashboard')).toBeNull();
  });

  it('sorts grocery sections by category', async () => {
    const { toJSON } = await renderWithAppState(<GroceryScreen />);
    const screenText = collectTextContent(toJSON());
    const breadIndex = screenText.indexOf('Bread');
    const milkIndex = screenText.indexOf('Milk');
    const applesIndex = screenText.indexOf('Apples');

    expect(breadIndex).toBeGreaterThan(-1);
    expect(milkIndex).toBeGreaterThan(breadIndex);
    expect(applesIndex).toBeGreaterThan(milkIndex);
  });

  it('adds a grocery item with category and recurring flag', async () => {
    const { getAllByDisplayValue, getAllByText, getByLabelText, getByText } =
      await renderWithAppState(<GroceryScreen />);

    await fireEvent.changeText(getByLabelText('Grocery item name'), 'Dish soap');
    await fireEvent.changeText(getByLabelText('Grocery category'), 'household');
    await fireEvent.press(getByLabelText('Mark item recurring'));
    await fireEvent.press(getByText('Add Grocery Item'));

    expect(getByText('Dish soap')).toBeOnTheScreen();
    expect(getAllByText('household').length).toBeGreaterThan(0);
    expect(getAllByText('Recurring').length).toBeGreaterThan(0);
    expect(getAllByDisplayValue('')).toHaveLength(2);
  });

  it('fills grocery category from category selection controls', async () => {
    const { getAllByDisplayValue, getAllByText, getByLabelText, getByText } =
      await renderWithAppState(<GroceryScreen />);

    await fireEvent.changeText(getByLabelText('Grocery item name'), 'Laundry detergent');
    await fireEvent.press(getByLabelText('Select household grocery category'));
    await fireEvent.press(getByText('Add Grocery Item'));

    expect(getByText('Laundry detergent')).toBeOnTheScreen();
    expect(getAllByText('household').length).toBeGreaterThan(0);
    expect(getAllByDisplayValue('')).toHaveLength(2);
  });

  it('toggles a grocery item checked and keeps it visible', async () => {
    const { getByLabelText, getByText } = await renderWithAppState(<GroceryScreen />);

    await fireEvent.press(getByLabelText('Check Apples'));

    expect(getByText('Apples')).toBeOnTheScreen();
    expect(getByText('Checked')).toBeOnTheScreen();
  });
});
