import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { LIFE_AREA_COLORS, SURFACE_COLORS } from '../constants/colors';
import type { GroceryItem } from '../models/GroceryItem';
import type { Medicine } from '../models/Medicine';
import type { ScheduleItem } from '../models/ScheduleItem';
import type { Task, TaskLifeArea } from '../models/Task';
import { useAppState } from '../state/AppState';

type TodayLifeArea = TaskLifeArea | 'health';

type TimelineItem = {
  id: string;
  lifeArea: TodayLifeArea;
  label: string;
  title: string;
  detail: string;
  time: string;
};

const LIFE_AREA_LABELS: Record<TodayLifeArea, string> = {
  work: 'Work',
  kid: 'Kid',
  household: 'Household',
  self: 'Health',
  health: 'Health'
};

const LIFE_AREA_TAG_COLORS: Record<TodayLifeArea, string> = {
  work: LIFE_AREA_COLORS.work,
  kid: LIFE_AREA_COLORS.kid,
  household: LIFE_AREA_COLORS.household,
  self: LIFE_AREA_COLORS.health,
  health: LIFE_AREA_COLORS.health
};

type TimelineSource = {
  tasks: Task[];
  groceryItems: GroceryItem[];
  scheduleItems: ScheduleItem[];
  medicines: Medicine[];
};

function buildTimelineItems({
  tasks,
  groceryItems,
  scheduleItems,
  medicines
}: TimelineSource): TimelineItem[] {
  const medicineItems = medicines.flatMap((medicine) =>
    medicine.times.map((time) => ({
      id: `${medicine.id}-${time}`,
      lifeArea: 'health' as const,
      label: LIFE_AREA_LABELS.health,
      title: medicine.medicineName,
      detail: `${medicine.personName} • ${medicine.dosage}${
        medicine.lastTaken ? ` • Last taken: ${medicine.lastTaken}` : ''
      }`,
      time
    }))
  );

  const childScheduleItems = scheduleItems.map((item) => ({
    id: item.id,
    lifeArea: 'kid' as const,
    label: LIFE_AREA_LABELS.kid,
    title: item.title,
    detail: `${item.startTime} - ${item.endTime}${item.notes ? ` • ${item.notes}` : ''}`,
    time: item.startTime
  }));

  const taskItems = tasks
    .filter((task) => !task.isDone)
    .map((task) => ({
      id: task.id,
      lifeArea: task.lifeArea,
      label: LIFE_AREA_LABELS[task.lifeArea],
      title: task.title,
      detail: task.dueDate ? `Due ${task.dueDate}` : 'Open to-do',
      time: task.dueDate ?? 'Today'
    }));

  const groceryNeeds = groceryItems.filter(
    (item) => !item.isChecked && item.isRecurring
  );
  const recurringGroceryItems =
    groceryNeeds.length > 0
      ? [
          {
            id: 'grocery-recurring',
            lifeArea: 'household' as const,
            label: LIFE_AREA_LABELS.household,
            title: 'Buy recurring grocery staples',
            detail: groceryNeeds.map((item) => item.itemName).join(', '),
            time: 'Shopping list'
          }
      ]
      : [];

  return [...medicineItems, ...childScheduleItems, ...taskItems, ...recurringGroceryItems];
}

export function TodayScreen() {
  const { groceryItems, medicines, scheduleItems, tasks } = useAppState();
  const timelineItems = useMemo(
    () => buildTimelineItems({ tasks, groceryItems, scheduleItems, medicines }),
    [groceryItems, medicines, scheduleItems, tasks]
  );

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Today</Text>
        <Text style={styles.title}>Today Dashboard</Text>
        <Text style={styles.summary}>
          {timelineItems.length} items across work, child, health, and household.
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Daily Timeline</Text>

      <View style={styles.timeline}>
        {timelineItems.map((item) => (
          <View key={item.id} style={styles.timelineCard}>
            <View style={styles.cardHeader}>
              <View
                style={[
                  styles.lifeAreaTag,
                  { backgroundColor: LIFE_AREA_TAG_COLORS[item.lifeArea] }
                ]}
              >
                <Text style={styles.lifeAreaTagText}>{item.label}</Text>
              </View>
              <Text style={styles.timeText}>{item.time}</Text>
            </View>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemDetail}>{item.detail}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  cardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between'
  },
  container: {
    backgroundColor: SURFACE_COLORS.background,
    flex: 1
  },
  content: {
    gap: 16,
    paddingHorizontal: 20,
    paddingVertical: 24
  },
  eyebrow: {
    color: LIFE_AREA_COLORS.work,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0,
    textTransform: 'uppercase'
  },
  header: {
    gap: 6
  },
  itemDetail: {
    color: SURFACE_COLORS.muted,
    fontSize: 14
  },
  itemTitle: {
    color: SURFACE_COLORS.text,
    fontSize: 17,
    fontWeight: '700'
  },
  lifeAreaTag: {
    alignSelf: 'flex-start',
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 3
  },
  lifeAreaTagText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0,
    textTransform: 'uppercase'
  },
  sectionTitle: {
    color: SURFACE_COLORS.text,
    fontSize: 18,
    fontWeight: '700'
  },
  summary: {
    color: SURFACE_COLORS.muted,
    fontSize: 15
  },
  timeText: {
    color: SURFACE_COLORS.muted,
    fontSize: 13,
    fontWeight: '700'
  },
  timeline: {
    gap: 10
  },
  timelineCard: {
    backgroundColor: SURFACE_COLORS.card,
    borderColor: SURFACE_COLORS.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
    padding: 12
  },
  title: {
    color: SURFACE_COLORS.text,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 0
  }
});
