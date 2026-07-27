type ReminderReadyEntity = {
  reminderEnabled?: boolean;
  reminderTime?: string;
};

export function formatReminderLabel(entity: ReminderReadyEntity) {
  if (!entity.reminderEnabled) {
    return 'Reminder off';
  }

  return entity.reminderTime ? `Reminder ready at ${entity.reminderTime}` : 'Reminder ready';
}
