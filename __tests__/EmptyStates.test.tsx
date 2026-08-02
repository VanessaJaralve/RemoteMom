import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { render, waitFor } from '@testing-library/react-native';

import { sampleChildren } from '../src/data/sampleData';
import { GroceryScreen } from '../src/screens/GroceryScreen';
import { HealthScreen } from '../src/screens/HealthScreen';
import { KidScreen } from '../src/screens/KidScreen';
import { TodayScreen } from '../src/screens/TodayScreen';
import { TodosScreen } from '../src/screens/TodosScreen';
import { AppStateProvider } from '../src/state/AppState';

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn()
  }
}));

const emptyPersistedState = {
  schemaVersion: 2,
  children: sampleChildren,
  tasks: [],
  groceryItems: [],
  scheduleItems: [],
  medicines: [],
  medicineDoseLogs: []
};

function renderWithEmptyAppState(ui: React.ReactElement) {
  (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(emptyPersistedState));

  return render(<AppStateProvider>{ui}</AppStateProvider>);
}

describe('calm empty states', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows a supportive Today empty state when nothing needs attention', async () => {
    const { getByText } = await renderWithEmptyAppState(<TodayScreen />);

    await waitFor(() => expect(getByText('Nothing needs attention right now.')).toBeOnTheScreen());
  });

  it('shows a supportive To-Dos empty state when there are no tasks', async () => {
    const { getByText } = await renderWithEmptyAppState(<TodosScreen />);

    await waitFor(() => expect(getByText('Nothing open right now.')).toBeOnTheScreen());
  });

  it('shows a supportive Grocery empty state when the list is clear', async () => {
    const { getByText } = await renderWithEmptyAppState(<GroceryScreen />);

    await waitFor(() => expect(getByText('Your grocery list is clear.')).toBeOnTheScreen());
  });

  it('shows a supportive Child Schedule empty state when there are no schedule items', async () => {
    const { getByText } = await renderWithEmptyAppState(<KidScreen />);

    await waitFor(() => expect(getByText('No child schedule items yet.')).toBeOnTheScreen());
  });

  it('shows a supportive Health empty state when there are no medicine routines', async () => {
    const { getByText } = await renderWithEmptyAppState(<HealthScreen />);

    await waitFor(() => expect(getByText('No medicine routines added yet.')).toBeOnTheScreen());
  });
});
