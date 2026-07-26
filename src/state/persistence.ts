import AsyncStorage from '@react-native-async-storage/async-storage';

import type { GroceryItem } from '../models/GroceryItem';
import type { Medicine } from '../models/Medicine';
import type { ScheduleItem } from '../models/ScheduleItem';
import type { Task } from '../models/Task';

export const APP_STATE_STORAGE_KEY = 'remotemom:appState:v1';

export type PersistedAppState = {
  tasks: Task[];
  groceryItems: GroceryItem[];
  scheduleItems: ScheduleItem[];
  medicines: Medicine[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isPersistedAppState(value: unknown): value is PersistedAppState {
  if (!isRecord(value)) {
    return false;
  }

  return (
    Array.isArray(value.tasks) &&
    Array.isArray(value.groceryItems) &&
    Array.isArray(value.scheduleItems) &&
    Array.isArray(value.medicines)
  );
}

export async function loadPersistedAppState() {
  try {
    const rawState = await AsyncStorage.getItem(APP_STATE_STORAGE_KEY);

    if (!rawState) {
      return null;
    }

    const parsedState: unknown = JSON.parse(rawState);

    return isPersistedAppState(parsedState) ? parsedState : null;
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
