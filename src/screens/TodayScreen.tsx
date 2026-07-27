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
  priority: 'urgent' | 'overdue' | 'normal';
  title: string;
  detail: string;
  time: string;
  sortMinutes: number;
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

const LEGEND_LIFE_AREAS: TodayLifeArea[] = ['work', 'kid', 'household', 'health'];

type TimelineSource = {
  tasks: Task[];
  groceryItems: GroceryItem[];
  scheduleItems: ScheduleItem[];
  medicines: Medicine[];
};

type TimelineSection = {
  label: string;
  timeRange: string;
  items: TimelineItem[];
};

const FALLBACK_SORT_MINUTES = {
  morning: 8 * 60,
  evening: 17 * 60 + 30
} as const;

function parseTimeToMinutes(time: string) {
  const match = time.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i);

  if (!match) {
    return null;
  }

  const [, hourText, minuteText, meridiemText] = match;
  const hour = Number(hourText);
  const minutes = Number(minuteText ?? '0');
  const meridiem = meridiemText.toUpperCase();
  const normalizedHour = hour === 12 ? 0 : hour;

  return normalizedHour * 60 + minutes + (meridiem === 'PM' ? 12 * 60 : 0);
}

function getSortMinutes(time: string, fallback: keyof typeof FALLBACK_SORT_MINUTES) {
  return parseTimeToMinutes(time) ?? FALLBACK_SORT_MINUTES[fallback];
}

function sortTimelineItems(items: TimelineItem[]) {
  return [...items].sort((first, second) => first.sortMinutes - second.sortMinutes);
}

function buildTimelineItems({
  tasks,
  groceryItems,
  scheduleItems,
  medicines
}: TimelineSource): TimelineItem[] {
  const medicineItems = medicines.flatMap((medicine) =>
    medicine.times.map((time) => {
      const sortMinutes = getSortMinutes(time, 'morning');

      return {
        id: `${medicine.id}-${time}`,
        lifeArea: 'health' as const,
        label: LIFE_AREA_LABELS.health,
        priority: medicine.lastTaken ? ('normal' as const) : ('overdue' as const),
        title: medicine.medicineName,
        detail: `${medicine.personName} • ${medicine.dosage}${
          medicine.lastTaken ? ` • Last taken: ${medicine.lastTaken}` : ''
        }`,
        time,
        sortMinutes
      };
    })
  );

  const childScheduleItems = scheduleItems.map((item) => ({
    id: item.id,
    lifeArea: 'kid' as const,
    label: LIFE_AREA_LABELS.kid,
    priority: 'normal' as const,
    title: item.title,
    detail: `${item.startTime} - ${item.endTime}${item.notes ? ` • ${item.notes}` : ''}`,
    time: item.startTime,
    sortMinutes: getSortMinutes(item.startTime, 'morning')
  }));

  const taskItems = tasks
    .filter((task) => !task.isDone)
    .map((task) => ({
      id: task.id,
      lifeArea: task.lifeArea,
      label: LIFE_AREA_LABELS[task.lifeArea],
      priority: task.dueDate ? ('urgent' as const) : ('normal' as const),
      title: task.title,
      detail: task.dueDate ? `Due ${task.dueDate}` : 'Open to-do',
      time: task.dueDate ?? 'Today',
      sortMinutes: task.dueDate ? FALLBACK_SORT_MINUTES.evening : FALLBACK_SORT_MINUTES.morning
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
            priority: 'urgent' as const,
            title: 'Buy recurring grocery staples',
            detail: groceryNeeds.map((item) => item.itemName).join(', '),
            time: '5:30 PM',
            sortMinutes: FALLBACK_SORT_MINUTES.evening
          }
      ]
      : [];

  return sortTimelineItems([
    ...medicineItems,
    ...childScheduleItems,
    ...taskItems,
    ...recurringGroceryItems
  ]);
}

function buildTimelineSections(timelineItems: TimelineItem[]): TimelineSection[] {
  const morningItems = timelineItems.filter((item) => item.sortMinutes < 12 * 60);
  const eveningItems = timelineItems.filter((item) => item.sortMinutes >= 12 * 60);

  return [
    {
      label: 'Morning',
      timeRange: '6:00 AM - 12:00 PM',
      items: morningItems
    },
    {
      label: 'Evening',
      timeRange: '12:00 PM - 10:00 PM',
      items: eveningItems
    }
  ];
}

export function TodayScreen() {
  const { groceryItems, medicines, scheduleItems, tasks } = useAppState();
  const timelineItems = useMemo(
    () => buildTimelineItems({ tasks, groceryItems, scheduleItems, medicines }),
    [groceryItems, medicines, scheduleItems, tasks]
  );
  const timelineSections = useMemo(() => buildTimelineSections(timelineItems), [timelineItems]);
  const urgentCount = timelineItems.filter((item) => item.priority === 'urgent').length;
  const overdueCount = timelineItems.filter((item) => item.priority === 'overdue').length;
  const nextUpCount = Math.min(3, timelineItems.length);

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Today</Text>
        <Text style={styles.title}>Daily command center</Text>
        <Text style={styles.summary}>
          {timelineItems.length} items across work, child, health, and household.
        </Text>
      </View>

      <View style={styles.priorityStrip}>
        <View style={styles.priorityItem}>
          <Text style={[styles.priorityCount, styles.urgentText]}>{urgentCount}</Text>
          <Text style={styles.priorityLabel}>Urgent</Text>
        </View>
        <View style={styles.priorityDivider} />
        <View style={styles.priorityItem}>
          <Text style={[styles.priorityCount, styles.overdueText]}>{overdueCount}</Text>
          <Text style={styles.priorityLabel}>Overdue</Text>
        </View>
        <View style={styles.priorityDivider} />
        <View style={styles.priorityItem}>
          <Text style={[styles.priorityCount, styles.nextUpText]}>{nextUpCount}</Text>
          <Text style={styles.priorityLabel}>Next up</Text>
        </View>
      </View>

      <View style={styles.timeline}>
        {timelineSections.map((section) => (
          <View key={section.label} style={styles.timelineSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{section.label}</Text>
              <Text style={styles.sectionTime}>{section.timeRange}</Text>
            </View>

            {section.items.length > 0 ? (
              section.items.map((item) => (
                <View key={item.id} style={styles.timelineRow}>
                  <Text style={styles.timelineTime}>{item.time}</Text>
                  <View
                    style={[
                      styles.timelineDot,
                      { backgroundColor: LIFE_AREA_TAG_COLORS[item.lifeArea] }
                    ]}
                  />
                  <View style={styles.timelineCard}>
                    <View style={styles.cardHeader}>
                      <View
                        style={[
                          styles.lifeAreaTag,
                          { backgroundColor: LIFE_AREA_TAG_COLORS[item.lifeArea] }
                        ]}
                      >
                        <Text style={styles.lifeAreaTagText}>{item.label}</Text>
                      </View>
                      <Text
                        style={[
                          styles.priorityBadge,
                          item.priority === 'urgent' ? styles.urgentBadge : null,
                          item.priority === 'overdue' ? styles.overdueBadge : null
                        ]}
                      >
                        {item.priority === 'normal'
                          ? 'Planned'
                          : item.priority === 'urgent'
                            ? 'Urgent'
                            : 'Overdue'}
                      </Text>
                    </View>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    <Text style={styles.itemDetail}>{item.detail}</Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>No planned items in this part of the day.</Text>
            )}
          </View>
        ))}
      </View>

      <View style={styles.focusPanel}>
        <View style={styles.focusIcon}>
          <Text style={styles.focusIconText}>*</Text>
        </View>
        <View style={styles.focusCopy}>
          <Text style={styles.focusTitle}>Focus for today</Text>
          <Text style={styles.focusText}>
            Stay ahead of {urgentCount} urgent item{urgentCount === 1 ? '' : 's'} and close the
            day with the child and health routines visible.
          </Text>
        </View>
      </View>

      <View style={styles.areaLegend}>
        {LEGEND_LIFE_AREAS.map((lifeArea) => (
          <View key={lifeArea} style={styles.legendItem}>
            <View
              style={[
                styles.legendSwatch,
                { backgroundColor: LIFE_AREA_TAG_COLORS[lifeArea] }
              ]}
            />
            <Text style={styles.legendText}>{LIFE_AREA_LABELS[lifeArea]}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  areaLegend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  cardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between'
  },
  container: {
    backgroundColor: SURFACE_COLORS.background,
    flex: 1
  },
  content: {
    gap: 18,
    paddingHorizontal: 20,
    paddingVertical: 24
  },
  emptyText: {
    color: SURFACE_COLORS.muted,
    fontSize: 14,
    lineHeight: 20
  },
  eyebrow: {
    color: LIFE_AREA_COLORS.work,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0,
    textTransform: 'uppercase'
  },
  focusCopy: {
    flex: 1,
    gap: 4
  },
  focusIcon: {
    alignItems: 'center',
    backgroundColor: '#E7F5F4',
    borderRadius: 8,
    height: 44,
    justifyContent: 'center',
    width: 44
  },
  focusIconText: {
    color: '#0F8A94',
    fontSize: 24,
    fontWeight: '700'
  },
  focusPanel: {
    alignItems: 'center',
    backgroundColor: SURFACE_COLORS.card,
    borderColor: SURFACE_COLORS.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 14
  },
  focusText: {
    color: SURFACE_COLORS.muted,
    fontSize: 14,
    lineHeight: 20
  },
  focusTitle: {
    color: SURFACE_COLORS.text,
    fontSize: 16,
    fontWeight: '700'
  },
  header: {
    gap: 6
  },
  itemDetail: {
    color: SURFACE_COLORS.muted,
    fontSize: 14,
    lineHeight: 20
  },
  itemTitle: {
    color: SURFACE_COLORS.text,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22
  },
  legendItem: {
    alignItems: 'center',
    backgroundColor: SURFACE_COLORS.card,
    borderColor: SURFACE_COLORS.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8
  },
  legendSwatch: {
    borderRadius: 5,
    height: 10,
    width: 10
  },
  legendText: {
    color: SURFACE_COLORS.muted,
    fontSize: 12,
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
  nextUpText: {
    color: '#0F8A94'
  },
  overdueBadge: {
    backgroundColor: '#FFF2DE',
    color: '#B85518'
  },
  overdueText: {
    color: '#C46A16'
  },
  priorityBadge: {
    backgroundColor: '#EFECE6',
    borderRadius: 5,
    color: SURFACE_COLORS.muted,
    fontSize: 11,
    fontWeight: '700',
    overflow: 'hidden',
    paddingHorizontal: 8,
    paddingVertical: 3,
    textTransform: 'capitalize'
  },
  priorityCount: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 28
  },
  priorityDivider: {
    backgroundColor: SURFACE_COLORS.border,
    height: 52,
    width: 1
  },
  priorityItem: {
    alignItems: 'center',
    flex: 1,
    gap: 4
  },
  priorityLabel: {
    color: SURFACE_COLORS.muted,
    fontSize: 13,
    fontWeight: '700'
  },
  priorityStrip: {
    alignItems: 'center',
    backgroundColor: SURFACE_COLORS.card,
    borderColor: SURFACE_COLORS.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 14
  },
  sectionHeader: {
    alignItems: 'baseline',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  sectionTime: {
    color: SURFACE_COLORS.muted,
    fontSize: 13,
    fontWeight: '600'
  },
  sectionTitle: {
    color: SURFACE_COLORS.text,
    fontSize: 18,
    fontWeight: '700'
  },
  summary: {
    color: SURFACE_COLORS.muted,
    fontSize: 15,
    lineHeight: 21
  },
  timeline: {
    gap: 18
  },
  timelineCard: {
    backgroundColor: SURFACE_COLORS.card,
    borderColor: SURFACE_COLORS.border,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    gap: 8,
    padding: 14
  },
  timelineDot: {
    borderRadius: 5,
    height: 10,
    marginTop: 18,
    width: 10
  },
  timelineRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 8
  },
  timelineSection: {
    gap: 10
  },
  timelineTime: {
    color: SURFACE_COLORS.text,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
    paddingTop: 13,
    width: 58
  },
  title: {
    color: SURFACE_COLORS.text,
    fontSize: 30,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 36
  },
  urgentBadge: {
    backgroundColor: '#FDE9E4',
    color: LIFE_AREA_COLORS.kid
  },
  urgentText: {
    color: LIFE_AREA_COLORS.kid
  }
});
