import AsyncStorage from '@react-native-async-storage/async-storage';

import type { GroceryItem } from '../models/GroceryItem';
import type { Medicine } from '../models/Medicine';
import type { MedicineDoseLog } from '../models/MedicineDoseLog';
import type { ScheduleItem } from '../models/ScheduleItem';
import type { Task, TaskLifeArea } from '../models/Task';

export const APP_STATE_STORAGE_KEY = 'remotemom:appState:v1';
export const CURRENT_APP_STATE_SCHEMA_VERSION = 1;

export type PersistedAppState = {
  schemaVersion: typeof CURRENT_APP_STATE_SCHEMA_VERSION;
  tasks: Task[];
  groceryItems: GroceryItem[];
  scheduleItems: ScheduleItem[];
  medicines: Medicine[];
  medicineDoseLogs: MedicineDoseLog[];
};

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

function isTaskLifeArea(value: unknown): value is TaskLifeArea {
  return value === 'work' || value === 'kid' || value === 'household' || value === 'self';
}

function getNormalizedSchemaVersion(value: Record<string, unknown>) {
  if (value.schemaVersion === undefined) {
    return CURRENT_APP_STATE_SCHEMA_VERSION;
  }

  return value.schemaVersion === CURRENT_APP_STATE_SCHEMA_VERSION
    ? CURRENT_APP_STATE_SCHEMA_VERSION
    : null;
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
    isOptionalBoolean(value.reminderEnabled) &&
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

function normalizePersistedAppState(value: unknown): PersistedAppState | null {
  if (!isRecord(value)) {
    return null;
  }

  const schemaVersion = getNormalizedSchemaVersion(value);

  if (!schemaVersion) {
    return null;
  }

  if (
    !Array.isArray(value.tasks) ||
    !Array.isArray(value.groceryItems) ||
    !Array.isArray(value.scheduleItems) ||
    !Array.isArray(value.medicines)
  ) {
    return null;
  }

  return {
    schemaVersion,
    tasks: value.tasks.filter(isTask),
    groceryItems: value.groceryItems.filter(isGroceryItem),
    scheduleItems: value.scheduleItems.filter(isScheduleItem),
    medicines: value.medicines.filter(isMedicine),
    medicineDoseLogs: Array.isArray(value.medicineDoseLogs)
      ? value.medicineDoseLogs.filter(isMedicineDoseLog)
      : []
  };
}

export async function loadPersistedAppState() {
  try {
    const rawState = await AsyncStorage.getItem(APP_STATE_STORAGE_KEY);

    if (!rawState) {
      return null;
    }

    const parsedState: unknown = JSON.parse(rawState);

    return normalizePersistedAppState(parsedState);
  } catch {
    return null;
  }
}

export async function savePersistedAppState(state: PersistedAppState) {
  try {
    await AsyncStorage.setItem(APP_STATE_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Local UI state should remain usable even if the device write fails.
  }
}
