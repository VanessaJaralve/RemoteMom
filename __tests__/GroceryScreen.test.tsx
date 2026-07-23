import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import { GroceryScreen } from '../src/screens/GroceryScreen';
import type { GroceryItem } from '../src/models/GroceryItem';

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
    const { getByText, queryByText } = await render(<GroceryScreen />);

    expect(getByText('Grocery List')).toBeOnTheScreen();
    expect(getByText('Add Grocery Item')).toBeOnTheScreen();
    expect(queryByText('Kid Schedule')).toBeNull();
    expect(queryByText('Medicine Tracker')).toBeNull();
    expect(queryByText('Today Dashboard')).toBeNull();
  });

  it('sorts grocery items by category heading', async () => {
    const { getAllByText } = await render(<GroceryScreen />);
    const categoryHeadings = getAllByText(/^(bakery|dairy|produce)$/i).map(
      (heading) => heading.props.children
    );

    expect(categoryHeadings).toEqual(['bakery', 'dairy', 'produce']);
  });

  it('adds a grocery item with category and recurring flag', async () => {
    const { getAllByDisplayValue, getAllByText, getByLabelText, getByText } =
      await render(<GroceryScreen />);

    await fireEvent.changeText(getByLabelText('Grocery item name'), 'Dish soap');
    await fireEvent.changeText(getByLabelText('Grocery category'), 'household');
    await fireEvent.press(getByLabelText('Mark item recurring'));
    await fireEvent.press(getByText('Add Grocery Item'));

    expect(getByText('Dish soap')).toBeOnTheScreen();
    expect(getByText('household')).toBeOnTheScreen();
    expect(getAllByText('Recurring').length).toBeGreaterThan(0);
    expect(getAllByDisplayValue('')).toHaveLength(2);
  });

  it('toggles a grocery item checked and keeps it visible', async () => {
    const { getByLabelText, getByText } = await render(<GroceryScreen />);

    await fireEvent.press(getByLabelText('Check Apples'));

    expect(getByText('Apples')).toBeOnTheScreen();
    expect(getByText('Checked')).toBeOnTheScreen();
  });
});
