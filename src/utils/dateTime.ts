export type TimeFallback = 'morning' | 'evening';

export type DueDateStatus = 'unscheduled' | 'overdue' | 'today' | 'future';

const FALLBACK_SORT_MINUTES: Record<TimeFallback, number> = {
  morning: 8 * 60,
  evening: 17 * 60 + 30
};

export function parseTimeToMinutes(time: string) {
  const match = time.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i);

  if (!match) {
    return null;
  }

  const [, hourText, minuteText, meridiemText] = match;
  const hour = Number(hourText);
  const minutes = Number(minuteText ?? '0');
  const meridiem = meridiemText.toUpperCase();

  if (hour < 1 || hour > 12 || minutes < 0 || minutes > 59) {
    return null;
  }

  const normalizedHour = hour === 12 ? 0 : hour;

  return normalizedHour * 60 + minutes + (meridiem === 'PM' ? 12 * 60 : 0);
}

export function getSortMinutes(time: string, fallback: TimeFallback) {
  return parseTimeToMinutes(time) ?? FALLBACK_SORT_MINUTES[fallback];
}

export function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function parseDateOnlyKey(value: string) {
  const match = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (!match) {
    return null;
  }

  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return getLocalDateKey(date);
}

export function classifyDueDate(dueDate?: string, today = new Date()): DueDateStatus {
  const normalizedDueDate = dueDate?.trim().toLowerCase();

  if (!normalizedDueDate) {
    return 'unscheduled';
  }

  if (['today', 'tonight'].includes(normalizedDueDate)) {
    return 'today';
  }

  if (normalizedDueDate === 'tomorrow') {
    return 'future';
  }

  const dueDateKey = parseDateOnlyKey(normalizedDueDate);

  if (!dueDateKey) {
    return 'today';
  }

  const todayKey = getLocalDateKey(today);

  if (dueDateKey < todayKey) {
    return 'overdue';
  }

  if (dueDateKey > todayKey) {
    return 'future';
  }

  return 'today';
}
