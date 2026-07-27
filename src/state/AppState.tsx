import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import {
  sampleGroceryItems,
  sampleMedicines,
  sampleScheduleItems,
  sampleTasks
} from '../data/sampleData';
import type { GroceryItem } from '../models/GroceryItem';
import type { Medicine } from '../models/Medicine';
import type { ScheduleItem } from '../models/ScheduleItem';
import type { Task, TaskLifeArea } from '../models/Task';
import { loadPersistedAppState, savePersistedAppState } from './persistence';

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
  markMedicineTaken: (medicineId: string) => void;
};

const AppStateContext = createContext<AppStateContextValue | null>(null);

function createId(prefix: string) {
  return `${prefix}-${Date.now()}`;
}

function formatLastTaken(date: Date) {
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>(sampleGroceryItems);
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>(sampleScheduleItems);
  const [medicines, setMedicines] = useState<Medicine[]>(sampleMedicines);
  const [hasLoadedPersistedState, setHasLoadedPersistedState] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function restoreAppState() {
      const persistedState = await loadPersistedAppState();

      if (!isMounted) {
        return;
      }

      if (persistedState) {
        setTasks(persistedState.tasks);
        setGroceryItems(persistedState.groceryItems);
        setScheduleItems(persistedState.scheduleItems);
        setMedicines(persistedState.medicines);
      }

      setHasLoadedPersistedState(true);
    }

    void restoreAppState();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!hasLoadedPersistedState) {
      return;
    }

    void savePersistedAppState({
      tasks,
      groceryItems,
      scheduleItems,
      medicines
    });
  }, [groceryItems, hasLoadedPersistedState, medicines, scheduleItems, tasks]);

  const value = useMemo<AppStateContextValue>(
    () => ({
      tasks,
      groceryItems,
      scheduleItems,
      medicines,
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
          dosage: input.dosage,
          times: input.times,
          refillReminderThreshold: input.refillReminderThreshold,
          reminderEnabled: false,
          lastTaken: null
        };

        setMedicines((currentMedicines) => [medicine, ...currentMedicines]);
      },
      updateMedicine: (medicineId, input) => {
        setMedicines((currentMedicines) =>
          currentMedicines.map((medicine) =>
            medicine.id === medicineId
              ? {
                  ...medicine,
                  personName: input.personName,
                  medicineName: input.medicineName,
                  dosage: input.dosage,
                  times: input.times,
                  refillReminderThreshold: input.refillReminderThreshold
                }
              : medicine
          )
        );
      },
      deleteMedicine: (medicineId) => {
        setMedicines((currentMedicines) =>
          currentMedicines.filter((medicine) => medicine.id !== medicineId)
        );
      },
      markMedicineTaken: (medicineId) => {
        const lastTaken = formatLastTaken(new Date());

        setMedicines((currentMedicines) =>
          currentMedicines.map((medicine) =>
            medicine.id === medicineId ? { ...medicine, lastTaken } : medicine
          )
        );
      }
    }),
    [groceryItems, medicines, scheduleItems, tasks]
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);

  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider');
  }

  return context;
}
