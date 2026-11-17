import AsyncStorage from '@react-native-async-storage/async-storage';

import { DEFAULT_CHILD_ID, sampleChildren } from '../data/sampleData';
import type { Child } from '../models/Child';
import type { GroceryItem } from '../models/GroceryItem';
import type { Medicine } from '../models/Medicine';
import type { MedicineDoseLog } from '../models/MedicineDoseLog';
import type { ScheduleItem } from '../models/ScheduleItem';
import type { Task, TaskLifeArea } from '../models/Task';

export const APP_STATE_STORAGE_KEY = 'remotemom:appState:v1';
export const CURRENT_APP_STATE_SCHEMA_VERSION = 2;

const PERSISTED_STATE_KEYS = new Set([
  'schemaVersion', 'children', 'tasks', 'groceryItems', 'scheduleItems', 'medicines',
  'medicineDoseLogs'
]);

export type PersistedAppState = {
  schemaVersion: typeof CURRENT_APP_STATE_SCHEMA_VERSION;
  children: Child[];
  tasks: Task[];
  groceryItems: GroceryItem[];
  scheduleItems: ScheduleItem[];
  medicines: Medicine[];
  medicineDoseLogs: MedicineDoseLog[];
};

export type PersistedAppStateLoadResult =
  | { status: 'empty' }
  | { status: 'loaded'; state: PersistedAppState }
  | {
      status: 'blocked';
      reason: 'read-failed' | 'invalid-data' | 'unsupported-version';
    };

// A later provider must finish earlier writes before reading the same key.
// Keep this queue outside React so it also covers unmount/remount and retries.
let storageOperations: Promise<void> = Promise.resolve();

function queueStorageOperation<T>(operation: () => Promise<T>): Promise<T> {
  const result = storageOperations.then(operation);
  storageOperations = result.then(() => undefined, () => undefined);
  return result;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

function isOptionalString(value: unknown): value is string | undefined {
  return value === undefined || isString(value);
}

function isOptionalBoolean(value: unknown): value is boolean | undefined {
  return value === undefined || isBoolean(value);
}

function isArrayOf<T>(value: unknown, isItem: (item: unknown) => item is T): value is T[] {
  return Array.isArray(value) && value.every(isItem);
}

function isTaskLifeArea(value: unknown): value is TaskLifeArea {
  return value === 'work' || value === 'kid' || value === 'household' || value === 'self';
}

function getNormalizedSchemaVersion(value: Record<string, unknown>) {
  if (value.schemaVersion === undefined) {
    return CURRENT_APP_STATE_SCHEMA_VERSION;
  }

  return value.schemaVersion === CURRENT_APP_STATE_SCHEMA_VERSION || value.schemaVersion === 1
    ? CURRENT_APP_STATE_SCHEMA_VERSION
    : null;
}

function isChild(value: unknown): value is Child {
  return isRecord(value) && isString(value.id) && isString(value.name);
}

function isTask(value: unknown): value is Task {
  return (
    isRecord(value) &&
    isString(value.id) &&
    isString(value.title) &&
    isTaskLifeArea(value.lifeArea) &&
    isOptionalString(value.dueDate) &&
    isOptionalString(value.reminderTime) &&
    isOptionalBoolean(value.reminderEnabled) &&
    isBoolean(value.isDone)
  );
}

function isGroceryItem(value: unknown): value is GroceryItem {
  return (
    isRecord(value) &&
    isString(value.id) &&
    isString(value.itemName) &&
    isString(value.category) &&
    isBoolean(value.isChecked) &&
    isBoolean(value.isRecurring) &&
    isOptionalString(value.reminderTime) &&
    isOptionalBoolean(value.reminderEnabled)
  );
}

function isScheduleItem(value: unknown): value is ScheduleItem {
  return (
    isRecord(value) &&
    isString(value.id) &&
    isString(value.title) &&
    (value.category === 'work' || value.category === 'kid') &&
    isString(value.startTime) &&
    isString(value.endTime) &&
    isBoolean(value.recurring) &&
    (value.recurrenceRule === null || isString(value.recurrenceRule)) &&
    isOptionalString(value.childId) &&
    isOptionalString(value.notes) &&
    isOptionalBoolean(value.reminderEnabled)
  );
}

function isMedicine(value: unknown): value is Medicine {
  return (
    isRecord(value) &&
    isString(value.id) &&
    isString(value.personName) &&
    isString(value.medicineName) &&
    isString(value.dosage) &&
    Array.isArray(value.times) &&
    value.times.every(isString) &&
    typeof value.refillReminderThreshold === 'number' &&
    Number.isFinite(value.refillReminderThreshold) &&
    isOptionalBoolean(value.reminderEnabled) &&
    isOptionalString(value.childId) &&
    (value.lastTaken === null || isString(value.lastTaken))
  );
}

function isMedicineDoseLog(value: unknown): value is MedicineDoseLog {
  return (
    isRecord(value) &&
    isString(value.id) &&
    isString(value.medicineId) &&
    isString(value.scheduledTime) &&
    isString(value.takenDate) &&
    isString(value.takenAt)
  );
}

function normalizeChildren(
  children: Child[] | undefined,
  scheduleItems: ScheduleItem[],
  medicines: Medicine[]
) {
  if (children === undefined) {
    return sampleChildren;
  }

  const needsDefaultChild =
    scheduleItems.some((item) => item.childId === DEFAULT_CHILD_ID) ||
    medicines.some((medicine) => medicine.childId === DEFAULT_CHILD_ID);

  return needsDefaultChild && !children.some((child) => child.id === DEFAULT_CHILD_ID)
    ? [...children, ...sampleChildren]
    : children;
}

function normalizeScheduleItem(item: ScheduleItem): ScheduleItem {
  return item.category === 'kid' && !item.childId
    ? { ...item, childId: DEFAULT_CHILD_ID }
    : item;
}

function normalizeMedicine(medicine: Medicine): Medicine {
  return medicine.personName.trim().toLowerCase() === 'child' && !medicine.childId
    ? { ...medicine, childId: DEFAULT_CHILD_ID }
    : medicine;
}

function normalizePersistedAppState(value: unknown): PersistedAppStateLoadResult {
  if (!isRecord(value)) {
    return { status: 'blocked', reason: 'invalid-data' };
  }

  const schemaVersion = getNormalizedSchemaVersion(value);

  if (!schemaVersion) {
    return { status: 'blocked', reason: 'unsupported-version' };
  }

  if (
    Object.keys(value).some((key) => !PERSISTED_STATE_KEYS.has(key)) ||
    !isArrayOf(value.tasks, isTask) ||
    !isArrayOf(value.groceryItems, isGroceryItem) ||
    !isArrayOf(value.scheduleItems, isScheduleItem) ||
    !isArrayOf(value.medicines, isMedicine) ||
    (value.children !== undefined && !isArrayOf(value.children, isChild)) ||
    (value.medicineDoseLogs !== undefined &&
      !isArrayOf(value.medicineDoseLogs, isMedicineDoseLog))
  ) {
    // Never filter and save a shortened copy over the only stored payload.
    return { status: 'blocked', reason: 'invalid-data' };
  }

  const scheduleItems = value.scheduleItems.map(normalizeScheduleItem);
  const medicines = value.medicines.map(normalizeMedicine);

  return {
    status: 'loaded',
    state: {
      schemaVersion,
      children: normalizeChildren(value.children, scheduleItems, medicines),
      tasks: value.tasks,
      groceryItems: value.groceryItems,
      scheduleItems,
      medicines,
      medicineDoseLogs: value.medicineDoseLogs ?? []
    }
  };
}

export function loadPersistedAppState(): Promise<PersistedAppStateLoadResult> {
  return queueStorageOperation<PersistedAppStateLoadResult>(async () => {
    let rawState: string | null;
    try {
      rawState = await AsyncStorage.getItem(APP_STATE_STORAGE_KEY);
    } catch {
      return { status: 'blocked', reason: 'read-failed' };
    }

    // An empty string is damaged data, not an absent storage key.
    if (rawState === null) {
      return { status: 'empty' };
    }

    try {
      const parsedState: unknown = JSON.parse(rawState);
      return normalizePersistedAppState(parsedState);
    } catch {
      return { status: 'blocked', reason: 'invalid-data' };
    }
  });
}

export function savePersistedAppState(state: PersistedAppState): Promise<boolean> {
  let serializedState: string;
  try {
    serializedState = JSON.stringify(state);
  } catch {
    return Promise.resolve(false);
  }

  return queueStorageOperation(async () => {
    try {
      await AsyncStorage.setItem(APP_STATE_STORAGE_KEY, serializedState);
      return true;
    } catch {
      // Report failure without logging private app data or the native error.
      return false;
    }
  });
}
