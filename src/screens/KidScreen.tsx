import React, { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

import { EmptyState } from '../components/EmptyState';
import { LIFE_AREA_COLORS, SURFACE_COLORS } from '../constants/colors';
import type { ScheduleItem } from '../models/ScheduleItem';
import { useAppState } from '../state/AppState';
import { getSortMinutes } from '../utils/dateTime';
import { formatReminderLabel } from '../utils/reminders';

const COMPACT_HIT_SLOP = 10;

const SCHEDULE_TIME_PRESETS = [
  { label: 'School morning', startTime: '7:30 AM', endTime: '8:00 AM' },
  { label: 'Afternoon activity', startTime: '3:30 PM', endTime: '4:30 PM' },
  { label: 'Bedtime routine', startTime: '7:30 PM', endTime: '8:00 PM' }
];

function sortByStartTime(items: ScheduleItem[]) {
  return [...items].sort((leftItem, rightItem) => {
    const timeDifference =
      getSortMinutes(leftItem.startTime, 'morning') -
      getSortMinutes(rightItem.startTime, 'morning');

    return timeDifference || leftItem.startTime.localeCompare(rightItem.startTime);
  });
}

export function KidScreen() {
  const { addScheduleItem, deleteScheduleItem, scheduleItems, updateScheduleItem } = useAppState();
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [notes, setNotes] = useState('');
  const [recurring, setRecurring] = useState(false);
  const [recurrenceRule, setRecurrenceRule] = useState('');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [confirmingDeleteItemId, setConfirmingDeleteItemId] = useState<string | null>(null);

  const sortedScheduleItems = useMemo(() => sortByStartTime(scheduleItems), [scheduleItems]);

  const resetForm = () => {
    setTitle('');
    setStartTime('');
    setEndTime('');
    setNotes('');
    setRecurring(false);
    setRecurrenceRule('');
    setEditingItemId(null);
    setConfirmingDeleteItemId(null);
  };

  const handleSubmitScheduleItem = () => {
    const trimmedTitle = title.trim();
    const trimmedStartTime = startTime.trim();
    const trimmedEndTime = endTime.trim();
    const trimmedNotes = notes.trim();
    const trimmedRecurrenceRule = recurrenceRule.trim();

    if (!trimmedTitle || !trimmedStartTime || !trimmedEndTime) {
      return;
    }

    const scheduleInput = {
      title: trimmedTitle,
      startTime: trimmedStartTime,
      endTime: trimmedEndTime,
      recurring,
      recurrenceRule: recurring ? trimmedRecurrenceRule || 'recurring' : null,
      notes: trimmedNotes || undefined
    };

    if (editingItemId) {
      updateScheduleItem(editingItemId, scheduleInput);
    } else {
      addScheduleItem(scheduleInput);
    }

    resetForm();
  };

  const startEditingScheduleItem = (item: ScheduleItem) => {
    setEditingItemId(item.id);
    setTitle(item.title);
    setStartTime(item.startTime);
    setEndTime(item.endTime);
    setNotes(item.notes ?? '');
    setRecurring(item.recurring);
    setRecurrenceRule(item.recurrenceRule ?? '');
    setConfirmingDeleteItemId(null);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Child</Text>
        <Text style={styles.title}>Kid&apos;s Schedule</Text>
        <Text style={styles.summary}>One-child MVP schedule</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          accessibilityLabel="Schedule title"
          onChangeText={setTitle}
          placeholder="Activity or school item"
          style={styles.input}
          value={title}
        />
        <View style={styles.timeRow}>
          <TextInput
            accessibilityLabel="Start time"
            onChangeText={setStartTime}
            placeholder="Start time"
            style={[styles.input, styles.timeInput]}
            value={startTime}
          />
          <TextInput
            accessibilityLabel="End time"
            onChangeText={setEndTime}
            placeholder="End time"
            style={[styles.input, styles.timeInput]}
            value={endTime}
          />
        </View>
        <View style={styles.presetGroup}>
          <Text style={styles.presetLabel}>Quick time</Text>
          <View style={styles.presetRow}>
            {SCHEDULE_TIME_PRESETS.map((preset) => {
              const isSelected =
                startTime === preset.startTime && endTime === preset.endTime;

              return (
                <Pressable
                  accessibilityLabel={`Use ${preset.label.toLowerCase()} time preset`}
                  accessibilityRole="button"
                  key={preset.label}
                  onPress={() => {
                    setStartTime(preset.startTime);
                    setEndTime(preset.endTime);
                  }}
                  style={[styles.presetButton, isSelected && styles.presetButtonActive]}
                >
                  <Text
                    style={[
                      styles.presetButtonText,
                      isSelected && styles.presetButtonTextActive
                    ]}
                  >
                    {preset.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
        <TextInput
          accessibilityLabel="Schedule notes"
          onChangeText={setNotes}
          placeholder="Notes"
          style={styles.input}
          value={notes}
        />
        <Pressable
          accessibilityLabel="Mark schedule item recurring"
          accessibilityRole="checkbox"
          accessibilityState={{ checked: recurring }}
          hitSlop={COMPACT_HIT_SLOP}
          onPress={() => setRecurring((currentValue) => !currentValue)}
          style={[styles.recurringToggle, recurring && styles.recurringToggleActive]}
          testID="schedule-recurring-toggle"
        >
          <Text
            style={[
              styles.recurringToggleText,
              recurring && styles.recurringToggleTextActive
            ]}
          >
            {recurring ? 'Recurring activity' : 'Make recurring'}
          </Text>
        </Pressable>
        <TextInput
          accessibilityLabel="Recurrence rule"
          onChangeText={setRecurrenceRule}
          placeholder="Recurrence rule"
          style={styles.input}
          value={recurrenceRule}
        />
        <Pressable
          accessibilityRole="button"
          onPress={handleSubmitScheduleItem}
          style={styles.addButton}
        >
          <Text style={styles.addButtonText}>
            {editingItemId ? 'Save Schedule Item' : 'Add Schedule Item'}
          </Text>
        </Pressable>
        {editingItemId ? (
          <Pressable
            accessibilityLabel="Cancel schedule edit"
            accessibilityRole="button"
            onPress={resetForm}
            style={styles.cancelButton}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>
        ) : null}
      </View>

      <View style={styles.scheduleList}>
        {sortedScheduleItems.length === 0 ? (
          <EmptyState
            detail="Add school, pickup, practice, or routine items when they need to be visible."
            message="No child schedule items yet."
          />
        ) : null}
        {sortedScheduleItems.map((item) => (
          <View key={item.id} style={styles.scheduleCard}>
            <View style={styles.cardHeader}>
              <View style={styles.categoryTag}>
                <Text style={styles.categoryTagText}>Kid</Text>
              </View>
              {item.recurring ? <Text style={styles.recurringBadge}>Recurring</Text> : null}
            </View>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.timeText}>{item.startTime} - {item.endTime}</Text>
            {item.recurrenceRule ? (
              <Text style={styles.recurrenceText}>{item.recurrenceRule}</Text>
            ) : null}
            {item.notes ? <Text style={styles.notesText}>{item.notes}</Text> : null}
            <Text style={styles.reminderText}>{formatReminderLabel(item)}</Text>
            <View style={styles.itemActions}>
              {confirmingDeleteItemId === item.id ? (
                <>
                  <Pressable
                    accessibilityLabel={`Cancel delete ${item.title}`}
                    accessibilityRole="button"
                    onPress={() => setConfirmingDeleteItemId(null)}
                    style={styles.secondaryButton}
                  >
                    <Text style={styles.secondaryButtonText}>Cancel</Text>
                  </Pressable>
                  <Pressable
                    accessibilityLabel={`Confirm delete ${item.title}`}
                    accessibilityRole="button"
                    onPress={() => {
                      deleteScheduleItem(item.id);
                      setConfirmingDeleteItemId(null);
                    }}
                    style={styles.deleteButton}
                  >
                    <Text style={styles.deleteButtonText}>Confirm Delete</Text>
                  </Pressable>
                </>
              ) : (
                <>
                  <Pressable
                    accessibilityLabel={`Edit ${item.title}`}
                    accessibilityRole="button"
                    onPress={() => startEditingScheduleItem(item)}
                    style={styles.secondaryButton}
                  >
                    <Text style={styles.secondaryButtonText}>Edit</Text>
                  </Pressable>
                  <Pressable
                    accessibilityLabel={`Delete ${item.title}`}
                    accessibilityRole="button"
                    onPress={() => setConfirmingDeleteItemId(item.id)}
                    style={styles.deleteButton}
                  >
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </Pressable>
                </>
              )}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  addButton: {
    alignItems: 'center',
    backgroundColor: LIFE_AREA_COLORS.kid,
    borderRadius: 6,
    minHeight: 44,
    paddingHorizontal: 14,
    paddingVertical: 12,
    justifyContent: 'center'
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700'
  },
  cancelButton: {
    alignItems: 'center',
    borderColor: SURFACE_COLORS.border,
    borderRadius: 6,
    borderWidth: 1,
    minHeight: 44,
    paddingHorizontal: 14,
    paddingVertical: 12,
    justifyContent: 'center'
  },
  cancelButtonText: {
    color: SURFACE_COLORS.text,
    fontSize: 16,
    fontWeight: '700'
  },
  cardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between'
  },
  categoryTag: {
    alignSelf: 'flex-start',
    backgroundColor: LIFE_AREA_COLORS.kid,
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 3
  },
  categoryTagText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0,
    textTransform: 'uppercase'
  },
  container: {
    backgroundColor: SURFACE_COLORS.background,
    flex: 1
  },
  deleteButton: {
    alignItems: 'center',
    borderColor: '#B42318',
    borderRadius: 6,
    borderWidth: 1,
    flex: 1,
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  deleteButtonText: {
    color: '#B42318',
    fontSize: 13,
    fontWeight: '700'
  },
  content: {
    gap: 18,
    paddingHorizontal: 20,
    paddingVertical: 24
  },
  eyebrow: {
    color: LIFE_AREA_COLORS.kid,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0,
    textTransform: 'uppercase'
  },
  form: {
    backgroundColor: SURFACE_COLORS.card,
    borderColor: SURFACE_COLORS.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
    padding: 14
  },
  header: {
    gap: 6
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderColor: SURFACE_COLORS.border,
    borderRadius: 6,
    borderWidth: 1,
    color: SURFACE_COLORS.text,
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 12
  },
  itemActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  itemTitle: {
    color: SURFACE_COLORS.text,
    fontSize: 17,
    fontWeight: '700'
  },
  notesText: {
    color: SURFACE_COLORS.muted,
    fontSize: 14
  },
  recurrenceText: {
    color: LIFE_AREA_COLORS.kid,
    fontSize: 13,
    fontWeight: '700'
  },
  presetButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: SURFACE_COLORS.border,
    borderRadius: 6,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 9
  },
  presetButtonActive: {
    backgroundColor: LIFE_AREA_COLORS.kid,
    borderColor: LIFE_AREA_COLORS.kid
  },
  presetButtonText: {
    color: SURFACE_COLORS.text,
    fontSize: 13,
    fontWeight: '700'
  },
  presetButtonTextActive: {
    color: '#FFFFFF'
  },
  presetGroup: {
    gap: 8
  },
  presetLabel: {
    color: SURFACE_COLORS.muted,
    fontSize: 13,
    fontWeight: '700'
  },
  presetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  reminderText: {
    color: SURFACE_COLORS.muted,
    fontSize: 13,
    fontWeight: '700'
  },
  recurringBadge: {
    color: LIFE_AREA_COLORS.health,
    fontSize: 13,
    fontWeight: '700'
  },
  recurringToggle: {
    alignItems: 'center',
    backgroundColor: SURFACE_COLORS.card,
    borderColor: LIFE_AREA_COLORS.kid,
    borderRadius: 6,
    borderWidth: 1,
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  recurringToggleActive: {
    backgroundColor: LIFE_AREA_COLORS.kid
  },
  recurringToggleText: {
    color: LIFE_AREA_COLORS.kid,
    fontSize: 14,
    fontWeight: '700'
  },
  recurringToggleTextActive: {
    color: '#FFFFFF'
  },
  scheduleCard: {
    backgroundColor: SURFACE_COLORS.card,
    borderColor: SURFACE_COLORS.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
    padding: 14
  },
  scheduleList: {
    gap: 10
  },
  secondaryButton: {
    alignItems: 'center',
    borderColor: SURFACE_COLORS.muted,
    borderRadius: 6,
    borderWidth: 1,
    flex: 1,
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  secondaryButtonText: {
    color: SURFACE_COLORS.text,
    fontSize: 13,
    fontWeight: '700'
  },
  summary: {
    color: SURFACE_COLORS.muted,
    fontSize: 15
  },
  timeInput: {
    flex: 1
  },
  timeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  timeText: {
    color: SURFACE_COLORS.text,
    fontSize: 14,
    fontWeight: '700'
  },
  title: {
    color: SURFACE_COLORS.text,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 0
  }
});
