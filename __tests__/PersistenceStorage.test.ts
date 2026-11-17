import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  APP_STATE_STORAGE_KEY,
  loadPersistedAppState,
  savePersistedAppState
} from '../src/state/persistence';
import type { PersistedAppState } from '../src/state/persistence';

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn()
  }
}));

function emptyState(): PersistedAppState {
  return {
    schemaVersion: 2,
    children: [],
    tasks: [],
    groceryItems: [],
    scheduleItems: [],
    medicines: [],
    medicineDoseLogs: []
  };
}

function stateWithTask(title: string): PersistedAppState {
  return {
    ...emptyState(),
    tasks: [{ id: 'synthetic-task-id', title, lifeArea: 'work', isDone: false }]
  };
}

let storedValue: string | null;
let pendingSettlements: Array<() => void>;
let pendingOperations: Array<Promise<unknown>>;

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

function track<T>(operation: Promise<T>): Promise<T> {
  pendingOperations.push(operation);
  return operation;
}

describe('persistence storage adapter', () => {
  beforeEach(() => {
    storedValue = null;
    pendingSettlements = [];
    pendingOperations = [];
    (AsyncStorage.getItem as jest.Mock).mockReset().mockImplementation(async () => storedValue);
    (AsyncStorage.setItem as jest.Mock).mockReset().mockImplementation(async (_key, value) => {
      storedValue = value;
    });
    (AsyncStorage.removeItem as jest.Mock).mockReset();
    (AsyncStorage.clear as jest.Mock).mockReset();
  });

  afterEach(async () => {
    pendingSettlements.forEach((settle) => settle());
    await Promise.allSettled(pendingOperations);
    jest.restoreAllMocks();
  });

  it('uses empty only for an absent storage key', async () => {
    expect(await loadPersistedAppState()).toEqual({ status: 'empty' });
    expect(AsyncStorage.getItem).toHaveBeenCalledWith(APP_STATE_STORAGE_KEY);
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  it.each(['', '{bad-json', 'null', '[]', '"synthetic text"'])
    ('blocks invalid stored text %p and leaves the original value untouched', async (rawState) => {
      storedValue = rawState;

      expect(await loadPersistedAppState()).toEqual({ status: 'blocked', reason: 'invalid-data' });
      expect(storedValue).toBe(rawState);
      expect(AsyncStorage.setItem).not.toHaveBeenCalled();
      expect(AsyncStorage.removeItem).not.toHaveBeenCalled();
      expect(AsyncStorage.clear).not.toHaveBeenCalled();
    });

  it('distinguishes read failure from an absent key without changing the saved value', async () => {
    storedValue = JSON.stringify(stateWithTask('Synthetic existing task'));
    const originalValue = storedValue;
    (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(new Error('Synthetic read failure'));

    expect(await loadPersistedAppState()).toEqual({ status: 'blocked', reason: 'read-failed' });
    expect(storedValue).toBe(originalValue);
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
    expect(await loadPersistedAppState()).toEqual({
      status: 'loaded', state: stateWithTask('Synthetic existing task')
    });
  });

  it('preserves an unsupported version for a compatible app to open later', async () => {
    storedValue = JSON.stringify({ ...stateWithTask('Synthetic future task'), schemaVersion: 99 });
    const originalValue = storedValue;

    expect(await loadPersistedAppState()).toEqual({ status: 'blocked', reason: 'unsupported-version' });
    expect(storedValue).toBe(originalValue);
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  it('protects unknown top-level saved fields instead of discarding them during normalization', async () => {
    storedValue = JSON.stringify({
      ...emptyState(),
      syntheticFutureCollection: [{ id: 'synthetic-future-record', title: 'Synthetic retained content' }]
    });
    const originalValue = storedValue;

    expect(await loadPersistedAppState()).toEqual({ status: 'blocked', reason: 'invalid-data' });
    expect(storedValue).toBe(originalValue);
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  it('protects an overflowing JSON number from being saved back as null', async () => {
    storedValue = JSON.stringify({
      ...emptyState(),
      medicines: [{
        id: 'synthetic-medicine', personName: 'Synthetic person', medicineName: 'Synthetic item',
        dosage: 'Synthetic saved instructions', times: [],
        refillReminderThreshold: 0, lastTaken: null
      }]
    }).replace('"refillReminderThreshold":0', '"refillReminderThreshold":1e309');
    const originalValue = storedValue;

    expect(await loadPersistedAppState()).toEqual({ status: 'blocked', reason: 'invalid-data' });
    expect(storedValue).toBe(originalValue);
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  it.each(['tasks', 'groceryItems', 'scheduleItems', 'medicines'] as const)
    ('blocks a missing required %s collection without replacing it', async (collection) => {
      const state: Record<string, unknown> = { ...emptyState() };
      delete state[collection];
      storedValue = JSON.stringify(state);
      const originalValue = storedValue;

      expect(await loadPersistedAppState()).toEqual({ status: 'blocked', reason: 'invalid-data' });
      expect(storedValue).toBe(originalValue);
      expect(AsyncStorage.setItem).not.toHaveBeenCalled();
    });

  it.each(['children', 'tasks', 'groceryItems', 'scheduleItems', 'medicines', 'medicineDoseLogs'] as const)
    ('blocks a malformed present %s collection without replacing it', async (collection) => {
      storedValue = JSON.stringify({ ...emptyState(), [collection]: null });
      const originalValue = storedValue;

      expect(await loadPersistedAppState()).toEqual({ status: 'blocked', reason: 'invalid-data' });
      expect(storedValue).toBe(originalValue);
      expect(AsyncStorage.setItem).not.toHaveBeenCalled();
    });

  it.each([
    ['children', { id: 'synthetic-child', name: 'Synthetic child' }],
    ['tasks', { id: 'synthetic-task', title: 'Synthetic task', lifeArea: 'work', isDone: false }],
    ['groceryItems', {
      id: 'synthetic-grocery', itemName: 'Synthetic grocery', category: 'Pantry',
      isChecked: false, isRecurring: false
    }],
    ['scheduleItems', {
      id: 'synthetic-schedule', title: 'Synthetic work block', category: 'work',
      startTime: '9:00 AM', endTime: '10:00 AM', recurring: false, recurrenceRule: null
    }],
    ['medicines', {
      id: 'synthetic-medicine', personName: 'Synthetic person', medicineName: 'Synthetic item',
      dosage: 'Synthetic recorded instructions', times: ['9:00 AM'],
      refillReminderThreshold: 2, lastTaken: null
    }],
    ['medicineDoseLogs', {
      id: 'synthetic-dose', medicineId: 'synthetic-medicine', scheduledTime: '9:00 AM',
      takenDate: '2026-01-01', takenAt: '2026-01-01T09:00:00.000Z'
    }]
  ])('protects all saved records when one %s member is invalid', async (collection, validRecord) => {
    storedValue = JSON.stringify({ ...emptyState(), [collection as string]: [validRecord, { id: 'invalid-member' }] });
    const originalValue = storedValue;

    expect(await loadPersistedAppState()).toEqual({ status: 'blocked', reason: 'invalid-data' });
    expect(storedValue).toBe(originalValue);
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  it('restores explicit empty collections, including children, without inserting samples', async () => {
    storedValue = JSON.stringify(emptyState());

    expect(await loadPersistedAppState()).toEqual({ status: 'loaded', state: emptyState() });
  });

  it('preserves valid children and linked records when no default child is present', async () => {
    const state: PersistedAppState = {
      ...emptyState(),
      children: [{ id: 'synthetic-child-a', name: 'Synthetic child A' }],
      scheduleItems: [{
        id: 'synthetic-child-schedule', title: 'Synthetic activity', category: 'kid',
        childId: 'synthetic-child-a', startTime: '3:00 PM', endTime: '4:00 PM',
        recurring: false, recurrenceRule: null, notes: 'Synthetic saved note'
      }],
      medicines: [{
        id: 'synthetic-child-medicine', personName: 'Child', medicineName: 'Synthetic item',
        childId: 'synthetic-child-a', dosage: 'Synthetic saved instructions',
        times: ['8:00 AM'], refillReminderThreshold: 2, lastTaken: null
      }]
    };
    storedValue = JSON.stringify(state);

    expect(await loadPersistedAppState()).toEqual({ status: 'loaded', state });
  });

  it.each([undefined, 1])('migrates legacy schema %p without losing ids or entered instructions', async (schemaVersion) => {
    const legacySchedule = {
      id: 'synthetic-legacy-schedule', title: 'Synthetic legacy activity', category: 'kid',
      startTime: '3:00 PM', endTime: '4:00 PM', recurring: false,
      recurrenceRule: null, notes: 'Synthetic original note'
    };
    const legacyMedicine = {
      id: 'synthetic-legacy-medicine', personName: 'Child', medicineName: 'Synthetic legacy item',
      dosage: 'Synthetic original instructions', times: ['8:00 AM'],
      refillReminderThreshold: 2, lastTaken: null
    };
    storedValue = JSON.stringify({
      schemaVersion, tasks: [], groceryItems: [],
      scheduleItems: [legacySchedule], medicines: [legacyMedicine]
    });

    expect(await loadPersistedAppState()).toEqual({
      status: 'loaded',
      state: {
        ...emptyState(),
        children: [{ id: 'child-default', name: 'Child' }],
        scheduleItems: [{ ...legacySchedule, childId: 'child-default' }],
        medicines: [{ ...legacyMedicine, childId: 'child-default' }]
      }
    });
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  it('appends a needed legacy default child without replacing existing children', async () => {
    const originalChildren = [{ id: 'synthetic-child-a', name: 'Synthetic child A' }];
    storedValue = JSON.stringify({
      ...emptyState(), schemaVersion: 1, children: originalChildren,
      scheduleItems: [{
        id: 'synthetic-legacy-schedule', title: 'Synthetic legacy activity', category: 'kid',
        startTime: '3:00 PM', endTime: '4:00 PM', recurring: false, recurrenceRule: null
      }]
    });

    const loaded = await loadPersistedAppState();

    expect(loaded.status).toBe('loaded');
    if (loaded.status === 'loaded') {
      expect(loaded.state.children).toEqual([
        ...originalChildren, { id: 'child-default', name: 'Child' }
      ]);
      expect(loaded.state.scheduleItems[0].childId).toBe('child-default');
    }
  });

  it('reports a failed save without deleting or changing the existing stored value', async () => {
    storedValue = JSON.stringify(stateWithTask('Synthetic original task'));
    const originalValue = storedValue;
    (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(new Error('Synthetic write failure'));

    expect(await savePersistedAppState(stateWithTask('Synthetic unsaved task'))).toBe(false);
    expect(storedValue).toBe(originalValue);
    expect(AsyncStorage.removeItem).not.toHaveBeenCalled();
    expect(AsyncStorage.clear).not.toHaveBeenCalled();
  });

  it('serializes overlapping writes and the next read so the latest snapshot survives', async () => {
    const firstState = stateWithTask('Synthetic first snapshot');
    const latestState = stateWithTask('Synthetic latest snapshot');
    const pendingFirstWrite = deferred<void>(undefined);
    (AsyncStorage.setItem as jest.Mock).mockImplementationOnce((_key, value) =>
      pendingFirstWrite.promise.then(() => { storedValue = value; })
    );

    const firstSave = track(savePersistedAppState(firstState));
    const latestSave = track(savePersistedAppState(latestState));
    const readAfterSaves = track(loadPersistedAppState());
    await Promise.resolve();

    expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
    expect(AsyncStorage.getItem).not.toHaveBeenCalled();
    pendingFirstWrite.resolve(undefined);

    expect(await firstSave).toBe(true);
    expect(await latestSave).toBe(true);
    expect(await readAfterSaves).toEqual({ status: 'loaded', state: latestState });
    expect(JSON.parse(storedValue!)).toEqual(latestState);
    expect((AsyncStorage.setItem as jest.Mock).mock.calls.map((call) => JSON.parse(call[1]))).toEqual([
      firstState, latestState
    ]);
  });

  it('does not let a queued write overtake a pending read', async () => {
    const originalState = stateWithTask('Synthetic original snapshot');
    const latestState = stateWithTask('Synthetic next snapshot');
    storedValue = JSON.stringify(originalState);
    const pendingRead = deferred<string | null>(storedValue);
    (AsyncStorage.getItem as jest.Mock).mockImplementationOnce(() => pendingRead.promise);

    const read = track(loadPersistedAppState());
    const save = track(savePersistedAppState(latestState));
    await Promise.resolve();

    expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1);
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
    pendingRead.resolve(JSON.stringify(originalState));

    expect(await read).toEqual({ status: 'loaded', state: originalState });
    expect(await save).toBe(true);
    expect(JSON.parse(storedValue!)).toEqual(latestState);
  });

  it('continues queued writes and reads after an earlier write fails', async () => {
    const pendingWrite = deferred<void>(undefined);
    (AsyncStorage.setItem as jest.Mock).mockImplementationOnce(() => pendingWrite.promise);
    const latestState = stateWithTask('Synthetic recovered snapshot');

    const failedSave = track(savePersistedAppState(stateWithTask('Synthetic rejected snapshot')));
    const recoveredSave = track(savePersistedAppState(latestState));
    const readAfterRecovery = track(loadPersistedAppState());
    await Promise.resolve();
    pendingWrite.reject(new Error('Synthetic write failure'));

    expect(await failedSave).toBe(false);
    expect(await recoveredSave).toBe(true);
    expect(await readAfterRecovery).toEqual({ status: 'loaded', state: latestState });
  });

  it('does not log saved contents or native errors when reads and writes fail', async () => {
    const log = jest.spyOn(console, 'log').mockImplementation(() => {});
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const error = jest.spyOn(console, 'error').mockImplementation(() => {});
    const privateError = new Error('Synthetic private storage detail');
    (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(privateError);
    (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(privateError);

    expect(await loadPersistedAppState()).toEqual({ status: 'blocked', reason: 'read-failed' });
    expect(await savePersistedAppState(stateWithTask('Synthetic private task'))).toBe(false);
    expect(log).not.toHaveBeenCalled();
    expect(warn).not.toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();
  });
});
