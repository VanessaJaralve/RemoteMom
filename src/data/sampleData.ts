import type { GroceryItem } from '../models/GroceryItem';
import type { Medicine } from '../models/Medicine';
import type { ScheduleItem } from '../models/ScheduleItem';
import type { Task } from '../models/Task';

export const sampleTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Review tomorrow morning priorities',
    lifeArea: 'work',
    dueDate: 'Tonight',
    isDone: false
  },
  {
    id: 'task-2',
    title: 'Pack school folder',
    lifeArea: 'kid',
    isDone: false
  }
];

export const sampleGroceryItems: GroceryItem[] = [
  {
    id: 'grocery-1',
    itemName: 'Bread',
    category: 'bakery',
    isChecked: false,
    isRecurring: true
  },
  {
    id: 'grocery-2',
    itemName: 'Milk',
    category: 'dairy',
    isChecked: false,
    isRecurring: true
  },
  {
    id: 'grocery-3',
    itemName: 'Apples',
    category: 'produce',
    isChecked: false,
    isRecurring: false
  }
];

export const sampleScheduleItems: ScheduleItem[] = [
  {
    id: 'schedule-1',
    title: 'School drop-off',
    category: 'kid',
    startTime: '7:45 AM',
    endTime: '8:10 AM',
    recurring: true,
    recurrenceRule: 'every weekday',
    notes: 'Backpack and lunchbox'
  },
  {
    id: 'schedule-2',
    title: 'Soccer practice',
    category: 'kid',
    startTime: '3:30 PM',
    endTime: '4:30 PM',
    recurring: true,
    recurrenceRule: 'every Wednesday',
    notes: 'Bring water bottle'
  }
];

export const sampleMedicines: Medicine[] = [
  {
    id: 'medicine-1',
    personName: 'Mom',
    medicineName: 'Vitamin D',
    dosage: '1 tablet',
    times: ['8:00 AM'],
    refillReminderThreshold: 5,
    lastTaken: null
  },
  {
    id: 'medicine-2',
    personName: 'Child',
    medicineName: 'Child Allergy Syrup',
    dosage: '5 ml',
    times: ['8:00 AM', '8:00 PM'],
    refillReminderThreshold: 3,
    lastTaken: null
  }
];
