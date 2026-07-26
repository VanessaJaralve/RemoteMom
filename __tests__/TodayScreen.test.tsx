import React from 'react';
import { render } from '@testing-library/react-native';

import { TodayScreen } from '../src/screens/TodayScreen';
import { AppStateProvider } from '../src/state/AppState';

function renderWithAppState(ui: React.ReactElement) {
  return render(<AppStateProvider>{ui}</AppStateProvider>);
}

describe('TodayScreen', () => {
  it('renders a read-only Today Dashboard timeline', async () => {
    const { getByText, queryByText } = await renderWithAppState(<TodayScreen />);

    expect(getByText('Today Dashboard')).toBeOnTheScreen();
    expect(getByText('Daily Timeline')).toBeOnTheScreen();
    expect(queryByText('Placeholder timeline for daily priorities.')).toBeNull();
  });

  it('pulls timeline items from to-dos, groceries, kid schedule, and medicine', async () => {
    const { getAllByText, getByText } = await renderWithAppState(<TodayScreen />);

    expect(getByText('Review tomorrow morning priorities')).toBeOnTheScreen();
    expect(getByText('Pack school folder')).toBeOnTheScreen();
    expect(getByText('Buy recurring grocery staples')).toBeOnTheScreen();
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
});
