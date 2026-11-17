import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, cleanup, fireEvent, render, waitFor } from '@testing-library/react-native';
import { Text } from 'react-native';

import { TodayScreen } from '../src/screens/TodayScreen';
import { TodosScreen } from '../src/screens/TodosScreen';
import { AppStateProvider, useAppState } from '../src/state/AppState';

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn()
  }
}));

const STORAGE_KEY = 'remotemom:appState:v1';

const emptyPersistedState = {
  tasks: [],
  groceryItems: [],
  scheduleItems: [],
  medicines: []
};

const currentEmptyState = {
  schemaVersion: 2,
  children: [],
  ...emptyPersistedState,
  medicineDoseLogs: []
};

const SAVE_WARNING = 'Your latest changes aren’t saved yet.';
let storedValue: string | null;
let pendingSettlements: Array<() => void>;

function deferred<T>(cleanupValue: T) {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  pendingSettlements.push(() => resolve(cleanupValue));
  return { promise, resolve, reject };
}

function savedTask(title: string) {
  return { id: 'synthetic-saved-task', title, lifeArea: 'work', isDone: false };
}

function AddTaskOnMount({ onMount }: { onMount: () => void }) {
  const { addTask } = useAppState();

  useEffect(() => {
    onMount();
    addTask({ title: 'Synthetic task added after opening', lifeArea: 'work' });
  }, []);

  return <Text>Editable child mounted</Text>;
}

function renderWithAppState(ui: React.ReactElement) {
  return render(<AppStateProvider>{ui}</AppStateProvider>);
}

describe('local persistence', () => {
  beforeEach(() => {
    storedValue = null;
    pendingSettlements = [];
    (AsyncStorage.getItem as jest.Mock).mockReset().mockImplementation(async () => storedValue);
    (AsyncStorage.setItem as jest.Mock).mockReset().mockImplementation(async (_key, value) => {
      storedValue = value;
    });
    (AsyncStorage.removeItem as jest.Mock).mockReset();
    (AsyncStorage.clear as jest.Mock).mockReset();
  });

  afterEach(async () => {
    await act(async () => {
      pendingSettlements.forEach((settle) => settle());
    });
    await cleanup();
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

    expect(latestSavedState.schemaVersion).toBe(2);
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

  it('migrates saved child schedule and medicine records onto the default child id', async () => {
    const legacyState = {
      schemaVersion: 1,
      tasks: [],
      groceryItems: [],
      scheduleItems: [
        {
          id: 'legacy-schedule-1',
          title: 'Legacy school pickup',
          category: 'kid',
          startTime: '3:00 PM',
          endTime: '3:30 PM',
          recurring: false,
          recurrenceRule: null
        }
      ],
      medicines: [
        {
          id: 'legacy-medicine-1',
          personName: 'Child',
          medicineName: 'Legacy vitamins',
          dosage: '1 gummy',
          times: ['8:00 AM'],
          refillReminderThreshold: 2,
          lastTaken: null
        }
      ],
      medicineDoseLogs: []
    };

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(legacyState));

    await renderWithAppState(<TodayScreen />);

    await waitFor(() => expect(AsyncStorage.setItem).toHaveBeenCalled());

    const latestSavedState = JSON.parse(
      (AsyncStorage.setItem as jest.Mock).mock.calls.at(-1)[1]
    );

    expect(latestSavedState.children).toEqual([{ id: 'child-default', name: 'Child' }]);
    expect(latestSavedState.scheduleItems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: 'Legacy school pickup',
          childId: 'child-default'
        })
      ])
    );
    expect(latestSavedState.medicines).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          medicineName: 'Legacy vitamins',
          childId: 'child-default'
        })
      ])
    );
  });

  it('protects malformed saved collections instead of replacing them with samples', async () => {
    const malformedState = {
      schemaVersion: 1,
      tasks: 'not an array',
      groceryItems: [],
      scheduleItems: [],
      medicines: [],
      medicineDoseLogs: []
    };

    storedValue = JSON.stringify(malformedState);
    const originalValue = storedValue;

    const { getByText, queryByText } = await renderWithAppState(<TodayScreen />);

    await waitFor(() => expect(getByText('We couldn’t open your saved data')).toBeOnTheScreen());
    expect(queryByText('Review tomorrow morning priorities')).toBeNull();
    expect(queryByText('Bread')).toBeNull();
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
    expect(AsyncStorage.removeItem).not.toHaveBeenCalled();
    expect(storedValue).toBe(originalValue);
  });

  it('protects an unsupported saved version without rendering sample data', async () => {
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

    storedValue = JSON.stringify(unsupportedState);
    const originalValue = storedValue;

    const { getByText, queryByText } = await renderWithAppState(<TodayScreen />);

    await waitFor(() => expect(getByText('We couldn’t open your saved data')).toBeOnTheScreen());
    expect(queryByText('Review tomorrow morning priorities')).toBeNull();
    expect(queryByText('Future schema task')).toBeNull();
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
    expect(storedValue).toBe(originalValue);
  });

  it('protects the whole payload when one saved record is malformed', async () => {
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

    storedValue = JSON.stringify(partiallyMalformedState);
    const originalValue = storedValue;

    const { getByText, queryByText } = await renderWithAppState(<TodayScreen />);

    await waitFor(() => expect(getByText('We couldn’t open your saved data')).toBeOnTheScreen());
    expect(queryByText('Valid saved task')).toBeNull();
    expect(queryByText('Bad saved task')).toBeNull();
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
    expect(storedValue).toBe(originalValue);
  });

  it('uses sample data when no saved local state exists', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    const { getByText } = await renderWithAppState(<TodayScreen />);

    await waitFor(() => expect(getByText('Review tomorrow morning priorities')).toBeOnTheScreen());
    expect(getByText('Bread')).toBeOnTheScreen();
    expect(getByText('Milk')).toBeOnTheScreen();
  });

  it.each(['{bad-json', ''])('preserves invalid stored text %p and offers retry', async (rawState) => {
    storedValue = rawState;

    const { getByText, queryByText } = await renderWithAppState(<TodosScreen />);

    await waitFor(() => expect(getByText('We couldn’t open your saved data')).toBeOnTheScreen());
    expect(getByText('Try again')).toBeOnTheScreen();
    expect(queryByText('Add Task')).toBeNull();
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
    expect(AsyncStorage.clear).not.toHaveBeenCalled();
    expect(storedValue).toBe(rawState);
  });

  it('keeps child screens and their mutations gated until saved data has loaded', async () => {
    const originalState = {
      ...currentEmptyState,
      tasks: [savedTask('Synthetic original task')]
    };
    const pendingRead = deferred<string | null>(JSON.stringify(originalState));
    (AsyncStorage.getItem as jest.Mock).mockImplementationOnce(() => pendingRead.promise);
    const onChildMount = jest.fn();

    const view = await renderWithAppState(
      <>
        <TodosScreen />
        <AddTaskOnMount onMount={onChildMount} />
      </>
    );

    expect(view.getByText('Opening your saved data')).toBeOnTheScreen();
    expect(view.queryByLabelText('Task title')).toBeNull();
    expect(view.queryByText('Add Task')).toBeNull();
    expect(onChildMount).not.toHaveBeenCalled();
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();

    await act(async () => pendingRead.resolve(JSON.stringify(originalState)));

    await waitFor(() => expect(onChildMount).toHaveBeenCalledTimes(1));
    expect(view.getByText('Synthetic original task')).toBeOnTheScreen();
    await waitFor(() => {
      const saved = JSON.parse(storedValue!);
      expect(saved.tasks.map((task: { title: string }) => task.title)).toEqual(
        expect.arrayContaining(['Synthetic original task', 'Synthetic task added after opening'])
      );
      expect(saved.tasks).toHaveLength(2);
    });
  });

  it('restores valid empty collections and keeps them empty after reopening', async () => {
    storedValue = JSON.stringify(currentEmptyState);

    const first = await renderWithAppState(<TodayScreen />);
    await waitFor(() => expect(first.queryByText('Opening your saved data')).toBeNull());
    expect(first.queryByText('Review tomorrow morning priorities')).toBeNull();
    expect(first.queryByText('Bread')).toBeNull();
    await first.unmount();

    const reopened = await renderWithAppState(<TodayScreen />);
    await waitFor(() => expect(reopened.queryByText('Opening your saved data')).toBeNull());
    expect(reopened.queryByText('Review tomorrow morning priorities')).toBeNull();
    expect(reopened.queryByText('Bread')).toBeNull();
    expect(JSON.parse(storedValue!)).toEqual(currentEmptyState);
  });

  it('retries a failed read without writing samples over the saved state', async () => {
    const originalState = {
      ...currentEmptyState,
      tasks: [savedTask('Synthetic task recovered after retry')]
    };
    storedValue = JSON.stringify(originalState);
    (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(new Error('Synthetic storage unavailable'));

    const view = await renderWithAppState(<TodosScreen />);
    await waitFor(() => expect(view.getByText('We couldn’t open your saved data')).toBeOnTheScreen());
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
    expect(view.queryByLabelText('Task title')).toBeNull();

    await fireEvent.press(view.getByText('Try again'));

    await waitFor(() => expect(view.getByText('Synthetic task recovered after retry')).toBeOnTheScreen());
    expect(view.queryByText('We couldn’t open your saved data')).toBeNull();
    expect(JSON.parse(storedValue!).tasks).toEqual(originalState.tasks);
  });

  it('keeps unsaved edits in memory and retries the latest state', async () => {
    storedValue = JSON.stringify(currentEmptyState);
    const view = await renderWithAppState(<TodosScreen />);
    await waitFor(() => expect(view.getByLabelText('Task title')).toBeOnTheScreen());
    await act(async () => {});
    (AsyncStorage.setItem as jest.Mock).mockRejectedValue(new Error('Synthetic device full'));

    await fireEvent.changeText(view.getByLabelText('Task title'), 'Synthetic first unsaved task');
    await fireEvent.press(view.getByText('Add Task'));
    await waitFor(() => expect(view.getByText(SAVE_WARNING)).toBeOnTheScreen());
    expect(view.getByText('Keep RemoteMom open and try saving again.')).toBeOnTheScreen();

    await fireEvent.changeText(view.getByLabelText('Task title'), 'Synthetic latest unsaved task');
    await fireEvent.press(view.getByText('Add Task'));
    await waitFor(() => expect(view.getByText('Synthetic latest unsaved task')).toBeOnTheScreen());
    await act(async () => {});
    expect(JSON.parse(storedValue!).tasks).toEqual([]);

    const retry = deferred<void>(undefined);
    (AsyncStorage.setItem as jest.Mock).mockImplementation((_key, value) =>
      retry.promise.then(() => { storedValue = value; })
    );
    await fireEvent.press(view.getByText('Retry saving'));
    expect(view.getByText(SAVE_WARNING)).toBeOnTheScreen();

    await act(async () => retry.resolve(undefined));

    await waitFor(() => expect(view.queryByText(SAVE_WARNING)).toBeNull());
    expect(JSON.parse(storedValue!).tasks.map((task: { title: string }) => task.title)).toEqual(
      expect.arrayContaining(['Synthetic first unsaved task', 'Synthetic latest unsaved task'])
    );
    expect(view.getByText('Synthetic first unsaved task')).toBeOnTheScreen();
  });

  it('does not clear a save warning when an older retry succeeds before a newer queued edit', async () => {
    storedValue = JSON.stringify(currentEmptyState);
    const view = await renderWithAppState(<TodosScreen />);
    await waitFor(() => expect(view.getByLabelText('Task title')).toBeOnTheScreen());
    await act(async () => {});
    (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(new Error('Synthetic write failure'));

    await fireEvent.changeText(view.getByLabelText('Task title'), 'Synthetic retry task');
    await fireEvent.press(view.getByText('Add Task'));
    await waitFor(() => expect(view.getByText(SAVE_WARNING)).toBeOnTheScreen());

    const olderRetry = deferred<void>(undefined);
    const latestWrite = deferred<void>(undefined);
    (AsyncStorage.setItem as jest.Mock)
      .mockClear()
      .mockImplementationOnce((_key, value) => olderRetry.promise.then(() => { storedValue = value; }))
      .mockImplementationOnce((_key, value) => latestWrite.promise.then(() => { storedValue = value; }));

    await fireEvent.press(view.getByText('Retry saving'));
    await waitFor(() => expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1));
    await fireEvent.changeText(view.getByLabelText('Task title'), 'Synthetic newer queued task');
    await fireEvent.press(view.getByText('Add Task'));
    expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
    expect(view.getByText(SAVE_WARNING)).toBeOnTheScreen();

    await act(async () => olderRetry.resolve(undefined));

    await waitFor(() => expect(AsyncStorage.setItem).toHaveBeenCalledTimes(2));
    expect(view.getByText(SAVE_WARNING)).toBeOnTheScreen();
    await act(async () => latestWrite.resolve(undefined));

    await waitFor(() => expect(view.queryByText(SAVE_WARNING)).toBeNull());
    expect(JSON.parse(storedValue!).tasks.map((task: { title: string }) => task.title)).toEqual(
      expect.arrayContaining(['Synthetic retry task', 'Synthetic newer queued task'])
    );
  });

  it('waits for a previous provider’s pending write before hydrating a remounted provider', async () => {
    storedValue = JSON.stringify(currentEmptyState);
    const first = await renderWithAppState(<TodosScreen />);
    await waitFor(() => expect(first.getByLabelText('Task title')).toBeOnTheScreen());
    await act(async () => {});
    const pendingWrite = deferred<void>(undefined);
    (AsyncStorage.setItem as jest.Mock).mockImplementationOnce((_key, value) =>
      pendingWrite.promise.then(() => { storedValue = value; })
    );

    await fireEvent.changeText(first.getByLabelText('Task title'), 'Synthetic task saved across remount');
    await fireEvent.press(first.getByText('Add Task'));
    await waitFor(() => expect(AsyncStorage.setItem).toHaveBeenLastCalledWith(
      STORAGE_KEY, expect.stringContaining('Synthetic task saved across remount')
    ));
    await first.unmount();
    (AsyncStorage.getItem as jest.Mock).mockClear();

    const reopened = await renderWithAppState(<TodosScreen />);
    expect(reopened.getByText('Opening your saved data')).toBeOnTheScreen();
    expect(reopened.queryByLabelText('Task title')).toBeNull();
    expect(AsyncStorage.getItem).not.toHaveBeenCalled();

    await act(async () => pendingWrite.resolve(undefined));

    await waitFor(() => expect(reopened.getByText('Synthetic task saved across remount')).toBeOnTheScreen());
    expect(JSON.parse(storedValue!).tasks).toEqual([
      expect.objectContaining({ title: 'Synthetic task saved across remount' })
    ]);
  });
});
