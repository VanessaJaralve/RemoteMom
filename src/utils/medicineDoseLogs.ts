import type { MedicineDoseLog } from '../models/MedicineDoseLog';
import { getLocalDateKey } from './dateTime';

export function formatDoseTakenAt(date = new Date()) {
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

function sanitizeDoseLogIdPart(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function createMedicineDoseLogId(
  medicineId: string,
  scheduledTime: string,
  takenDate: string
) {
  return `dose-${medicineId}-${takenDate}-${sanitizeDoseLogIdPart(scheduledTime)}`;
}

export function findMedicineDoseLog(
  logs: MedicineDoseLog[],
  medicineId: string,
  scheduledTime: string,
  takenDate = getLocalDateKey()
) {
  return (
    logs.find(
      (log) =>
        log.medicineId === medicineId &&
        log.scheduledTime === scheduledTime &&
        log.takenDate === takenDate
    ) ?? null
  );
}
