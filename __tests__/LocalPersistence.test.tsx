import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fireEvent, render, waitFor } from '@testing-library/react-native';

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

const STORAGE_KEY = 'remotemom:appState:v1';

const emptyPersistedState = {
  tasks: [],
  groceryItems: [],
  scheduleItems: [],
  medicines: []
};

function renderWithAppState(ui: React.ReactElement) {
  return render(<AppStateProvider>{ui}</AppStateProvider>);
}

describe('local persistence', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('restores saved local state into Today', async () => {
    const savedState = {
      ...emptyPersistedState,
      tasks: [
        {
          id: 'saved-task-1',
          title: 'Pay camp tuition',
          lifeArea: 'kid',
          dueDate: 'Today',
          isDone: false
        }
      ]
    };

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(savedState));

    const { getByText, queryByText } = await renderWithAppState(<TodayScreen />);

    await waitFor(() => expect(getByText('Pay camp tuition')).toBeOnTheScreen());
    expect(queryByText('Review tomorrow morning priorities')).toBeNull();
  });

  it('saves shared state after a task is added', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    const { getByLabelText, getByText } = await renderWithAppState(<TodosScreen />);

    await waitFor(() => expect(AsyncStorage.getItem).toHaveBeenCalledWith(STORAGE_KEY));

    await fireEvent.changeText(getByLabelText('Task title'), 'Book dentist');
    await fireEvent.press(getByText('Add Task'));

    await waitFor(() =>
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEY,
        expect.stringContaining('Book dentist')
      )
    );
  });

  it('uses sample data when no saved local state exists', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    const { getByText } = await renderWithAppState(<TodayScreen />);

    await waitFor(() => expect(getByText('Review tomorrow morning priorities')).toBeOnTheScreen());
    expect(getByText('Bread')).toBeOnTheScreen();
    expect(getByText('Milk')).toBeOnTheScreen();
  });

  it('uses sample data when saved local state is invalid', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('{bad-json');

    const { getByText } = await renderWithAppState(<TodayScreen />);

    await waitFor(() => expect(getByText('Review tomorrow morning priorities')).toBeOnTheScreen());
    expect(getByText('Bread')).toBeOnTheScreen();
    expect(getByText('Milk')).toBeOnTheScreen();
  });
});
