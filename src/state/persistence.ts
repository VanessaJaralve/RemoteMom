import AsyncStorage from '@react-native-async-storage/async-storage';

import type { GroceryItem } from '../models/GroceryItem';
import type { Medicine } from '../models/Medicine';
import type { MedicineDoseLog } from '../models/MedicineDoseLog';
import type { ScheduleItem } from '../models/ScheduleItem';
import type { Task } from '../models/Task';

export const APP_STATE_STORAGE_KEY = 'remotemom:appState:v1';

export type PersistedAppState = {
  tasks: Task[];
  groceryItems: GroceryItem[];
  scheduleItems: ScheduleItem[];
  medicines: Medicine[];
  medicineDoseLogs: MedicineDoseLog[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function normalizePersistedAppState(value: unknown): PersistedAppState | null {
  if (!isRecord(value)) {
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
    tasks: value.tasks as Task[],
    groceryItems: value.groceryItems as GroceryItem[],
    scheduleItems: value.scheduleItems as ScheduleItem[],
    medicines: value.medicines as Medicine[],
    medicineDoseLogs: Array.isArray(value.medicineDoseLogs)
      ? (value.medicineDoseLogs as MedicineDoseLog[])
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
