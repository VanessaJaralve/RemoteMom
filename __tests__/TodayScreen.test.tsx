import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import { TodayScreen } from '../src/screens/TodayScreen';
import { AppStateProvider } from '../src/state/AppState';

function renderWithAppState(ui: React.ReactElement) {
  return render(<AppStateProvider>{ui}</AppStateProvider>);
}

describe('TodayScreen', () => {
  it('renders a source-derived Today Dashboard timeline', async () => {
    const { getByText, queryByText } = await renderWithAppState(<TodayScreen />);

    expect(getByText('Daily command center')).toBeOnTheScreen();
    expect(getByText('Morning')).toBeOnTheScreen();
    expect(getByText('Evening')).toBeOnTheScreen();
    expect(queryByText('Placeholder timeline for daily priorities.')).toBeNull();
  });

  it('shows v2 priority summary and focus framing', async () => {
    const { getAllByText, getByText } = await renderWithAppState(<TodayScreen />);

    expect(getAllByText('Urgent').length).toBeGreaterThan(0);
    expect(getAllByText('Overdue').length).toBeGreaterThan(0);
    expect(getByText('Next up')).toBeOnTheScreen();
    expect(getByText('Focus for today')).toBeOnTheScreen();
  });

  it('pulls timeline items from to-dos, groceries, kid schedule, and medicine', async () => {
    const { getAllByText, getByText } = await renderWithAppState(<TodayScreen />);

    expect(getByText('Review tomorrow morning priorities')).toBeOnTheScreen();
    expect(getByText('Pack school folder')).toBeOnTheScreen();
    expect(getByText('Bread')).toBeOnTheScreen();
    expect(getByText('Milk')).toBeOnTheScreen();
    expect(getByText('School drop-off')).toBeOnTheScreen();
    expect(getByText('Soccer practice')).toBeOnTheScreen();
    expect(getByText('Vitamin D')).toBeOnTheScreen();
    expect(getAllByText('Child Allergy Syrup').length).toBeGreaterThan(0);
  });

  it('shows life-area color tag labels for the timeline', async () => {
    const { getAllByText } = await renderWithAppState(<TodayScreen />);

    expect(getAllByText('Work').length).toBeGreaterThan(0);
    expect(getAllByText('Kid').length).toBeGreaterThan(0);
    expect(getAllByText('Health').length).toBeGreaterThan(0);
    expect(getAllByText('Household').length).toBeGreaterThan(0);
  });

  it('does not add Firebase, calendar sync, notifications, or premium multi-child features', async () => {
    const { queryByText } = await renderWithAppState(<TodayScreen />);

    expect(queryByText('Firebase')).toBeNull();
    expect(queryByText('Google Calendar')).toBeNull();
    expect(queryByText('Notifications')).toBeNull();
    expect(queryByText('Multiple Children')).toBeNull();
  });

  it('marks a source task done from Today and removes it from the timeline', async () => {
    const { getByLabelText, queryByText } = await renderWithAppState(<TodayScreen />);

    await fireEvent.press(getByLabelText('Mark Review tomorrow morning priorities done from Today'));

    expect(queryByText('Review tomorrow morning priorities')).toBeNull();
  });

  it('checks a source grocery item from Today and keeps other groceries actionable', async () => {
    const { getByLabelText, getByText, queryByText } = await renderWithAppState(<TodayScreen />);

    expect(getByText('Bread')).toBeOnTheScreen();
    expect(getByText('Milk')).toBeOnTheScreen();

    await fireEvent.press(getByLabelText('Check Bread from Today'));

    expect(queryByText('Bread')).toBeNull();
    expect(getByText('Milk')).toBeOnTheScreen();
  });

  it('marks a source medicine taken from Today and updates the medicine timeline detail', async () => {
    const { getByLabelText, getByText } = await renderWithAppState(<TodayScreen />);

    await fireEvent.press(getByLabelText('Mark Vitamin D taken from Today'));

    expect(getByText(/Mom • 1 tablet • Last taken:/)).toBeOnTheScreen();
  });
});
