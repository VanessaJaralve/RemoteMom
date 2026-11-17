import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { LIFE_AREA_COLORS, SURFACE_COLORS } from '../constants/colors';
import {
  DEFAULT_CHILD_ID,
  sampleChildren,
  sampleGroceryItems,
  sampleMedicines,
  sampleScheduleItems,
  sampleTasks
} from '../data/sampleData';
import type { Child } from '../models/Child';
import type { GroceryItem } from '../models/GroceryItem';
import type { Medicine } from '../models/Medicine';
import type { MedicineDoseLog } from '../models/MedicineDoseLog';
import type { ScheduleItem } from '../models/ScheduleItem';
import type { Task, TaskLifeArea } from '../models/Task';
import { getLocalDateKey } from '../utils/dateTime';
import {
  createMedicineDoseLogId,
  formatDoseTakenAt
} from '../utils/medicineDoseLogs';
import {
  CURRENT_APP_STATE_SCHEMA_VERSION,
  loadPersistedAppState,
  savePersistedAppState
} from './persistence';
import type { PersistedAppStateLoadResult } from './persistence';

type RestoreStatus =
  | { status: 'loading' | 'ready' }
  | Extract<PersistedAppStateLoadResult, { status: 'blocked' }>;

type AddTaskInput = {
  title: string;
  lifeArea: TaskLifeArea;
  dueDate?: string;
};

type UpdateTaskInput = AddTaskInput;

type AddGroceryItemInput = {
  itemName: string;
  category: string;
  isRecurring: boolean;
};

type UpdateGroceryItemInput = AddGroceryItemInput;

type AddScheduleItemInput = {
  title: string;
  startTime: string;
  endTime: string;
  recurring: boolean;
  recurrenceRule: string | null;
  notes?: string;
};

type UpdateScheduleItemInput = AddScheduleItemInput;

type AddMedicineInput = {
  personName: string;
  medicineName: string;
  dosage: string;
  times: string[];
  refillReminderThreshold: number;
};

type UpdateMedicineInput = AddMedicineInput;

type AppStateContextValue = {
  tasks: Task[];
  groceryItems: GroceryItem[];
  scheduleItems: ScheduleItem[];
  medicines: Medicine[];
  medicineDoseLogs: MedicineDoseLog[];
  children: Child[];
  addTask: (input: AddTaskInput) => void;
  updateTask: (taskId: string, input: UpdateTaskInput) => void;
  deleteTask: (taskId: string) => void;
  toggleTaskDone: (taskId: string) => void;
  addGroceryItem: (input: AddGroceryItemInput) => void;
  updateGroceryItem: (itemId: string, input: UpdateGroceryItemInput) => void;
  deleteGroceryItem: (itemId: string) => void;
  toggleGroceryItemChecked: (itemId: string) => void;
  addScheduleItem: (input: AddScheduleItemInput) => void;
  updateScheduleItem: (itemId: string, input: UpdateScheduleItemInput) => void;
  deleteScheduleItem: (itemId: string) => void;
  addMedicine: (input: AddMedicineInput) => void;
  updateMedicine: (medicineId: string, input: UpdateMedicineInput) => void;
  deleteMedicine: (medicineId: string) => void;
  markMedicineTaken: (medicineId: string, scheduledTime: string) => void;
};

const AppStateContext = createContext<AppStateContextValue | null>(null);

function createId(prefix: string) {
  return `${prefix}-${Date.now()}`;
}

function getChildIdForPersonName(personName: string) {
  return personName.trim().toLowerCase() === 'child' ? DEFAULT_CHILD_ID : undefined;
}

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>(sampleGroceryItems);
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>(sampleScheduleItems);
  const [medicines, setMedicines] = useState<Medicine[]>(sampleMedicines);
  const [medicineDoseLogs, setMedicineDoseLogs] = useState<MedicineDoseLog[]>([]);
  const [trackedChildren, setTrackedChildren] = useState<Child[]>(sampleChildren);
  const [restoreStatus, setRestoreStatus] = useState<RestoreStatus>({ status: 'loading' });
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [saveAttempt, setSaveAttempt] = useState(0);
  const [saveFailed, setSaveFailed] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function restoreAppState() {
      const result = await loadPersistedAppState();

      if (!isMounted) {
        return;
      }

      if (result.status === 'blocked') {
        setRestoreStatus(result);
        return;
      }

      if (result.status === 'loaded') {
        const persistedState = result.state;
        setTasks(persistedState.tasks);
        setGroceryItems(persistedState.groceryItems);
        setScheduleItems(persistedState.scheduleItems);
        setMedicines(persistedState.medicines);
        setMedicineDoseLogs(persistedState.medicineDoseLogs);
        setTrackedChildren(persistedState.children);
      }

      setRestoreStatus({ status: 'ready' });
    }

    void restoreAppState();

    return () => {
      isMounted = false;
    };
  }, [loadAttempt]);

  useEffect(() => {
    if (restoreStatus.status !== 'ready') {
      return;
    }

    let isLatestRequest = true;
    void savePersistedAppState({
      schemaVersion: CURRENT_APP_STATE_SCHEMA_VERSION,
      tasks,
      groceryItems,
      scheduleItems,
      medicines,
      medicineDoseLogs,
      children: trackedChildren
    }).then((saved) => {
      if (isLatestRequest) {
        setSaveFailed(!saved);
      }
    });

    return () => {
      isLatestRequest = false;
    };
  }, [
    groceryItems,
    restoreStatus.status,
    medicineDoseLogs,
    medicines,
    scheduleItems,
    tasks,
    trackedChildren,
    saveAttempt
  ]);

  const value = useMemo<AppStateContextValue>(
    () => ({
      tasks,
      groceryItems,
      scheduleItems,
      medicines,
      medicineDoseLogs,
      children: trackedChildren,
      addTask: (input) => {
        const task: Task = {
          id: createId('task'),
          title: input.title,
          lifeArea: input.lifeArea,
          dueDate: input.dueDate,
          reminderEnabled: false,
          isDone: false
        };

        setTasks((currentTasks) => [task, ...currentTasks]);
      },
      updateTask: (taskId, input) => {
        setTasks((currentTasks) =>
          currentTasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  title: input.title,
                  lifeArea: input.lifeArea,
                  dueDate: input.dueDate
                }
              : task
          )
        );
      },
      deleteTask: (taskId) => {
        setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId));
      },
      toggleTaskDone: (taskId) => {
        setTasks((currentTasks) =>
          currentTasks.map((task) =>
            task.id === taskId ? { ...task, isDone: !task.isDone } : task
          )
        );
      },
      addGroceryItem: (input) => {
        const groceryItem: GroceryItem = {
          id: createId('grocery'),
          itemName: input.itemName,
          category: input.category,
          isChecked: false,
          isRecurring: input.isRecurring,
          reminderEnabled: false
        };

        setGroceryItems((currentItems) => [...currentItems, groceryItem]);
      },
      updateGroceryItem: (itemId, input) => {
        setGroceryItems((currentItems) =>
          currentItems.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  itemName: input.itemName,
                  category: input.category,
                  isRecurring: input.isRecurring
                }
              : item
          )
        );
      },
      deleteGroceryItem: (itemId) => {
        setGroceryItems((currentItems) => currentItems.filter((item) => item.id !== itemId));
      },
      toggleGroceryItemChecked: (itemId) => {
        setGroceryItems((currentItems) =>
          currentItems.map((item) =>
            item.id === itemId ? { ...item, isChecked: !item.isChecked } : item
          )
        );
      },
      addScheduleItem: (input) => {
        const scheduleItem: ScheduleItem = {
          id: createId('schedule'),
          title: input.title,
          category: 'kid',
          childId: DEFAULT_CHILD_ID,
          startTime: input.startTime,
          endTime: input.endTime,
          recurring: input.recurring,
          recurrenceRule: input.recurrenceRule,
          reminderEnabled: false,
          notes: input.notes
        };

        setScheduleItems((currentItems) => [...currentItems, scheduleItem]);
      },
      updateScheduleItem: (itemId, input) => {
        setScheduleItems((currentItems) =>
          currentItems.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  title: input.title,
                  childId: DEFAULT_CHILD_ID,
                  startTime: input.startTime,
                  endTime: input.endTime,
                  recurring: input.recurring,
                  recurrenceRule: input.recurrenceRule,
                  notes: input.notes
                }
              : item
          )
        );
      },
      deleteScheduleItem: (itemId) => {
        setScheduleItems((currentItems) => currentItems.filter((item) => item.id !== itemId));
      },
      addMedicine: (input) => {
        const medicine: Medicine = {
          id: createId('medicine'),
          personName: input.personName,
          medicineName: input.medicineName,
          childId: getChildIdForPersonName(input.personName),
          dosage: input.dosage,
          times: input.times,
          refillReminderThreshold: input.refillReminderThreshold,
          reminderEnabled: false,
          lastTaken: null
        };

        setMedicines((currentMedicines) => [medicine, ...currentMedicines]);
      },
      updateMedicine: (medicineId, input) => {
        const scheduledTimes = new Set(input.times);

        setMedicines((currentMedicines) =>
          currentMedicines.map((medicine) =>
            medicine.id === medicineId
              ? {
                  ...medicine,
                  personName: input.personName,
                  medicineName: input.medicineName,
                  childId: getChildIdForPersonName(input.personName),
                  dosage: input.dosage,
                  times: input.times,
                  refillReminderThreshold: input.refillReminderThreshold
                }
              : medicine
          )
        );
        setMedicineDoseLogs((currentLogs) =>
          currentLogs.filter(
            (log) => log.medicineId !== medicineId || scheduledTimes.has(log.scheduledTime)
          )
        );
      },
      deleteMedicine: (medicineId) => {
        setMedicines((currentMedicines) =>
          currentMedicines.filter((medicine) => medicine.id !== medicineId)
        );
        setMedicineDoseLogs((currentLogs) =>
          currentLogs.filter((log) => log.medicineId !== medicineId)
        );
      },
      markMedicineTaken: (medicineId, scheduledTime) => {
        const now = new Date();
        const takenDate = getLocalDateKey(now);
        const takenAt = formatDoseTakenAt(now);
        const doseLog: MedicineDoseLog = {
          id: createMedicineDoseLogId(medicineId, scheduledTime, takenDate),
          medicineId,
          scheduledTime,
          takenDate,
          takenAt
        };

        setMedicineDoseLogs((currentLogs) =>
          [
            doseLog,
            ...currentLogs.filter(
              (log) =>
                !(
                  log.medicineId === medicineId &&
                  log.scheduledTime === scheduledTime &&
                  log.takenDate === takenDate
                )
            )
          ]
        );
      }
    }),
    [groceryItems, medicineDoseLogs, medicines, scheduleItems, tasks, trackedChildren]
  );

  // Consumers cannot edit sample state while a restore is pending or blocked.
  if (restoreStatus.status !== 'ready') {
    return (
      <ScrollView contentContainerStyle={styles.recovery}>
        <Text accessibilityRole="header" style={styles.heading}>
          {restoreStatus.status === 'loading'
            ? 'Opening your saved data'
            : 'We couldn’t open your saved data'}
        </Text>
        {restoreStatus.status === 'loading' ? (
          <Text accessibilityLiveRegion="polite" style={styles.message}>
            One moment while RemoteMom opens your lists.
          </Text>
        ) : (
          <>
            <Text accessibilityRole="alert" style={styles.message}>
              {restoreStatus.reason === 'unsupported-version'
                ? 'This version of RemoteMom can’t read your saved data. We haven’t replaced it. Use the app version that saved it, or a newer version, then try again.'
                : 'We haven’t replaced your saved data. Try again to open your lists.'}
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                setRestoreStatus({ status: 'loading' });
                setLoadAttempt((attempt) => attempt + 1);
              }}
              style={styles.retryButton}
            >
              <Text style={styles.retryLabel}>Try again</Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    );
  }

  return (
    <AppStateContext.Provider value={value}>
      <View style={styles.app}>
        {saveFailed ? (
          <View style={styles.saveWarning}>
            <Text accessibilityRole="alert" accessibilityLiveRegion="polite" style={styles.message}>
              Your latest changes aren’t saved yet.
            </Text>
            <Text style={styles.message}>Keep RemoteMom open and try saving again.</Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => setSaveAttempt((attempt) => attempt + 1)}
              style={styles.retryButton}
            >
              <Text style={styles.retryLabel}>Retry saving</Text>
            </Pressable>
          </View>
        ) : null}
        {children}
      </View>
    </AppStateContext.Provider>
  );
}

const styles = StyleSheet.create({
  app: { flex: 1 },
  recovery: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: SURFACE_COLORS.background,
    padding: 24,
    paddingTop: 64,
    paddingBottom: 48
  },
  heading: {
    color: SURFACE_COLORS.text,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16
  },
  message: { color: SURFACE_COLORS.text, fontSize: 16, lineHeight: 24 },
  saveWarning: {
    backgroundColor: SURFACE_COLORS.background,
    borderBottomColor: SURFACE_COLORS.border,
    borderBottomWidth: 1,
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 12
  },
  retryButton: {
    alignSelf: 'flex-start',
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: 20,
    marginTop: 12,
    borderRadius: 12,
    backgroundColor: LIFE_AREA_COLORS.work
  },
  retryLabel: { color: SURFACE_COLORS.card, fontSize: 16, fontWeight: '700' }
});

export function useAppState() {
  const context = useContext(AppStateContext);

  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider');
  }

  return context;
}
