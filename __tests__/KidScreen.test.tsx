import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import { KidScreen } from '../src/screens/KidScreen';
import type { ScheduleItem } from '../src/models/ScheduleItem';
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

describe('KidScreen', () => {
  it('uses the exact ScheduleItem model fields from the project brief', () => {
    const scheduleItem: ScheduleItem = {
      id: 'schedule-1',
      title: 'Piano lesson',
      category: 'kid',
      startTime: '4:00 PM',
      endTime: '5:00 PM',
      recurring: true,
      recurrenceRule: 'every Tuesday',
      notes: 'Bring practice book'
    };

    expect(Object.keys(scheduleItem)).toEqual([
      'id',
      'title',
      'category',
      'startTime',
      'endTime',
      'recurring',
      'recurrenceRule',
      'notes'
    ]);
  });

  it('renders one-child MVP kid schedule without future modules', async () => {
    const { getByText, queryByText } = await renderWithAppState(<KidScreen />);

    expect(getByText("Kid's Schedule")).toBeOnTheScreen();
    expect(getByText('Child')).toBeOnTheScreen();
    expect(getByText('Add Schedule Item')).toBeOnTheScreen();
    expect(queryByText('Medicine Tracker')).toBeNull();
    expect(queryByText('Today Dashboard')).toBeNull();
    expect(queryByText('Multiple Children')).toBeNull();
  });

  it('shows recurring schedule items with time and notes', async () => {
    const { getAllByText, getByText } = await renderWithAppState(<KidScreen />);

    expect(getByText('Soccer practice')).toBeOnTheScreen();
    expect(getByText('3:30 PM - 4:30 PM')).toBeOnTheScreen();
    expect(getAllByText('Recurring').length).toBeGreaterThan(0);
    expect(getByText('every Wednesday')).toBeOnTheScreen();
    expect(getByText('Bring water bottle')).toBeOnTheScreen();
  });

  it('adds a recurring child schedule item with notes', async () => {
    const { getAllByDisplayValue, getAllByText, getByLabelText, getByText } =
      await renderWithAppState(<KidScreen />);

    await fireEvent.changeText(getByLabelText('Schedule title'), 'Art class');
    await fireEvent.changeText(getByLabelText('Start time'), '2:00 PM');
    await fireEvent.changeText(getByLabelText('End time'), '3:00 PM');
    await fireEvent.changeText(getByLabelText('Schedule notes'), 'Pack smock');
    await fireEvent.press(getByLabelText('Mark schedule item recurring'));
    await fireEvent.changeText(getByLabelText('Recurrence rule'), 'every Friday');
    await fireEvent.press(getByText('Add Schedule Item'));

    expect(getByText('Art class')).toBeOnTheScreen();
    expect(getByText('2:00 PM - 3:00 PM')).toBeOnTheScreen();
    expect(getByText('Pack smock')).toBeOnTheScreen();
    expect(getByText('every Friday')).toBeOnTheScreen();
    expect(getAllByText('Recurring').length).toBeGreaterThan(0);
    expect(getAllByDisplayValue('')).toHaveLength(5);
  });

  it('fills start and end times from child schedule presets', async () => {
    const { getByDisplayValue, getByLabelText } = await renderWithAppState(<KidScreen />);

    await fireEvent.press(getByLabelText('Use school morning time preset'));

    expect(getByDisplayValue('7:30 AM')).toBeOnTheScreen();
    expect(getByDisplayValue('8:00 AM')).toBeOnTheScreen();
  });

  it('sorts schedule items by parsed start time instead of alphabetical time text', async () => {
    const screen = await renderWithAppState(<KidScreen />);
    const { getByLabelText, getByText, toJSON } = screen;

    await fireEvent.changeText(getByLabelText('Schedule title'), 'Noon pickup');
    await fireEvent.changeText(getByLabelText('Start time'), '12:00 PM');
    await fireEvent.changeText(getByLabelText('End time'), '12:30 PM');
    await fireEvent.press(getByText('Add Schedule Item'));

    const screenText = collectTextContent(toJSON());
    const dropOffIndex = screenText.indexOf('School drop-off');
    const noonIndex = screenText.indexOf('Noon pickup');
    const soccerIndex = screenText.indexOf('Soccer practice');

    expect(dropOffIndex).toBeGreaterThan(-1);
    expect(noonIndex).toBeGreaterThan(dropOffIndex);
    expect(soccerIndex).toBeGreaterThan(noonIndex);
  });
});
