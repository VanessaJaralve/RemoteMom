import type { MedicineDoseLog } from '../models/MedicineDoseLog';

export function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

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
