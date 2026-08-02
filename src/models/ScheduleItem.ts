export type ScheduleCategory = 'work' | 'kid';

export type ScheduleItem = {
  id: string;
  title: string;
  category: ScheduleCategory;
  startTime: string;
  endTime: string;
  recurring: boolean;
  recurrenceRule: string | null;
  reminderEnabled?: boolean;
  childId?: string;
  notes?: string;
};
