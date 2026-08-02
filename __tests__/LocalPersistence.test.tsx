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

  it('saves shared state with the current schema version', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    const { getByLabelText, getByText } = await renderWithAppState(<TodosScreen />);

    await waitFor(() => expect(AsyncStorage.getItem).toHaveBeenCalledWith(STORAGE_KEY));

    await fireEvent.changeText(getByLabelText('Task title'), 'Prep beta notes');
    await fireEvent.press(getByText('Add Task'));

    await waitFor(() => expect(AsyncStorage.setItem).toHaveBeenCalled());

    const latestSavedState = JSON.parse(
      (AsyncStorage.setItem as jest.Mock).mock.calls.at(-1)[1]
    );

    expect(latestSavedState.schemaVersion).toBe(1);
    expect(latestSavedState.tasks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: 'Prep beta notes'
        })
      ])
    );
  });

  it('restores older saved local state without medicine dose logs', async () => {
    const savedState = {
      ...emptyPersistedState,
      medicines: [
        {
          id: 'saved-medicine-1',
          personName: 'Child',
          medicineName: 'Evening Antibiotic',
          dosage: '5 ml',
          times: ['8:00 AM', '8:00 PM'],
          refillReminderThreshold: 2,
          lastTaken: null
        }
      ]
    };

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(savedState));

    const { getAllByText, getByLabelText, getByText } = await renderWithAppState(<TodayScreen />);

    await waitFor(() => expect(getAllByText('Evening Antibiotic').length).toBeGreaterThan(0));
    await fireEvent.press(getByLabelText('Mark Evening Antibiotic 8:00 AM taken from Today'));

    expect(getByText(/Child • 5 ml • Taken today:/)).toBeOnTheScreen();
  });

  it('migrates legacy saved local state without schema version', async () => {
    const legacyState = {
      ...emptyPersistedState,
      tasks: [
        {
          id: 'legacy-task-1',
          title: 'Call school office',
          lifeArea: 'kid',
          dueDate: 'Today',
          isDone: false
        }
      ]
    };

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(legacyState));

    const { getByText } = await renderWithAppState(<TodayScreen />);

    await waitFor(() => expect(getByText('Call school office')).toBeOnTheScreen());
  });

  it('uses sample data when saved collections are malformed', async () => {
    const malformedState = {
      schemaVersion: 1,
      tasks: 'not an array',
      groceryItems: [],
      scheduleItems: [],
      medicines: [],
      medicineDoseLogs: []
    };

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(malformedState));

    const { getByText } = await renderWithAppState(<TodayScreen />);

    await waitFor(() => expect(getByText('Review tomorrow morning priorities')).toBeOnTheScreen());
    expect(getByText('Bread')).toBeOnTheScreen();
  });

  it('uses sample data when saved schema version is unsupported', async () => {
    const unsupportedState = {
      schemaVersion: 99,
      tasks: [
        {
          id: 'future-task-1',
          title: 'Future schema task',
          lifeArea: 'work',
          isDone: false
        }
      ],
      groceryItems: [],
      scheduleItems: [],
      medicines: [],
      medicineDoseLogs: []
    };

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(unsupportedState));

    const { getByText, queryByText } = await renderWithAppState(<TodayScreen />);

    await waitFor(() => expect(getByText('Review tomorrow morning priorities')).toBeOnTheScreen());
    expect(queryByText('Future schema task')).toBeNull();
  });

  it('restores valid records while dropping malformed saved records', async () => {
    const partiallyMalformedState = {
      schemaVersion: 1,
      tasks: [
        {
          id: 'valid-task-1',
          title: 'Valid saved task',
          lifeArea: 'work',
          isDone: false
        },
        {
          id: 'bad-task-1',
          title: 'Bad saved task',
          lifeArea: 'invalid-area',
          isDone: false
        }
      ],
      groceryItems: [],
      scheduleItems: [],
      medicines: [],
      medicineDoseLogs: []
    };

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify(partiallyMalformedState)
    );

    const { getByText, queryByText } = await renderWithAppState(<TodayScreen />);

    await waitFor(() => expect(getByText('Valid saved task')).toBeOnTheScreen());
    expect(queryByText('Bad saved task')).toBeNull();
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
