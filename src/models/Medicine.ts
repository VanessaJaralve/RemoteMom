export type Medicine = {
  id: string;
  personName: string;
  medicineName: string;
  dosage: string;
  times: string[];
  refillReminderThreshold: number;
  reminderEnabled?: boolean;
  lastTaken: string | null;
};
