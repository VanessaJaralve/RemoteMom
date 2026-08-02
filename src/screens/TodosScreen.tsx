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
import type { Task, TaskLifeArea } from '../models/Task';
import { useAppState } from '../state/AppState';
import { formatReminderLabel } from '../utils/reminders';

const TASK_LIFE_AREAS: TaskLifeArea[] = ['work', 'kid', 'household', 'self'];

const TASK_LIFE_AREA_LABELS: Record<TaskLifeArea, string> = {
  work: 'Work',
  kid: 'Kid',
  household: 'Household',
  self: 'Self'
};

const TASK_LIFE_AREA_COLORS: Record<TaskLifeArea, string> = {
  work: LIFE_AREA_COLORS.work,
  kid: LIFE_AREA_COLORS.kid,
  household: LIFE_AREA_COLORS.household,
  self: LIFE_AREA_COLORS.health
};

const COMPACT_HIT_SLOP = 10;

export function TodosScreen() {
  const { addTask, deleteTask, tasks, toggleTaskDone, updateTask } = useAppState();
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [selectedLifeArea, setSelectedLifeArea] = useState<TaskLifeArea>('work');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [confirmingDeleteTaskId, setConfirmingDeleteTaskId] = useState<string | null>(null);

  const incompleteCount = useMemo(() => tasks.filter((task) => !task.isDone).length, [tasks]);

  const resetForm = () => {
    setTitle('');
    setDueDate('');
    setSelectedLifeArea('work');
    setEditingTaskId(null);
    setConfirmingDeleteTaskId(null);
  };

  const handleSubmitTask = () => {
    const trimmedTitle = title.trim();
    const trimmedDueDate = dueDate.trim();

    if (!trimmedTitle) {
      return;
    }

    const taskInput = {
      title: trimmedTitle,
      lifeArea: selectedLifeArea,
      dueDate: trimmedDueDate || undefined
    };

    if (editingTaskId) {
      updateTask(editingTaskId, taskInput);
    } else {
      addTask(taskInput);
    }

    resetForm();
  };

  const startEditingTask = (task: Task) => {
    setEditingTaskId(task.id);
    setTitle(task.title);
    setDueDate(task.dueDate ?? '');
    setSelectedLifeArea(task.lifeArea);
    setConfirmingDeleteTaskId(null);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.eyebrow}>To-Dos</Text>
        <Text style={styles.title}>Universal To-Do List</Text>
        <Text style={styles.summary}>
          {incompleteCount} open {incompleteCount === 1 ? 'task' : 'tasks'}
        </Text>
      </View>

      <View style={styles.form}>
        <TextInput
          accessibilityLabel="Task title"
          onChangeText={setTitle}
          placeholder="Add a task"
          style={styles.input}
          value={title}
        />

        <View style={styles.lifeAreaSelector}>
          {TASK_LIFE_AREAS.map((lifeArea) => {
            const isSelected = selectedLifeArea === lifeArea;

            return (
              <Pressable
                accessibilityLabel={`Select ${TASK_LIFE_AREA_LABELS[lifeArea]} life area`}
                key={lifeArea}
                onPress={() => setSelectedLifeArea(lifeArea)}
                style={[
                  styles.lifeAreaButton,
                  {
                    backgroundColor: isSelected
                      ? TASK_LIFE_AREA_COLORS[lifeArea]
                      : SURFACE_COLORS.card,
                    borderColor: TASK_LIFE_AREA_COLORS[lifeArea]
                  }
                ]}
              >
                <Text
                  style={[
                    styles.lifeAreaButtonText,
                    { color: isSelected ? '#FFFFFF' : TASK_LIFE_AREA_COLORS[lifeArea] }
                  ]}
                >
                  {TASK_LIFE_AREA_LABELS[lifeArea]}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <TextInput
          accessibilityLabel="Due date"
          onChangeText={setDueDate}
          placeholder="Optional due date"
          style={styles.input}
          value={dueDate}
        />

        <Pressable
          accessibilityRole="button"
          onPress={handleSubmitTask}
          style={styles.addButton}
        >
          <Text style={styles.addButtonText}>{editingTaskId ? 'Save Task' : 'Add Task'}</Text>
        </Pressable>
        {editingTaskId ? (
          <Pressable
            accessibilityLabel="Cancel task edit"
            accessibilityRole="button"
            onPress={resetForm}
            style={styles.cancelButton}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>
        ) : null}
      </View>

      <View style={styles.list}>
        {tasks.length === 0 ? (
          <EmptyState
            detail="Add a task when something needs a place outside your head."
            message="Nothing open right now."
          />
        ) : null}
        {tasks.map((task) => (
          <View key={task.id} style={styles.taskCard}>
            <View style={styles.taskMainRow}>
              <Pressable
                accessibilityLabel={`Mark ${task.title} ${task.isDone ? 'not done' : 'done'}`}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: task.isDone }}
                hitSlop={COMPACT_HIT_SLOP}
                onPress={() => toggleTaskDone(task.id)}
                style={[
                  styles.checkbox,
                  task.isDone && {
                    backgroundColor: TASK_LIFE_AREA_COLORS[task.lifeArea],
                    borderColor: TASK_LIFE_AREA_COLORS[task.lifeArea]
                  }
                ]}
              >
                <Text style={styles.checkboxText}>{task.isDone ? '✓' : ''}</Text>
              </Pressable>

              <View style={styles.taskBody}>
                <View
                  style={[
                    styles.taskTag,
                    { backgroundColor: TASK_LIFE_AREA_COLORS[task.lifeArea] }
                  ]}
                >
                  <Text style={styles.taskTagText}>{TASK_LIFE_AREA_LABELS[task.lifeArea]}</Text>
                </View>
                <Text style={[styles.taskTitle, task.isDone && styles.taskTitleDone]}>
                  {task.title}
                </Text>
                {task.dueDate ? <Text style={styles.taskDueDate}>Due {task.dueDate}</Text> : null}
                <Text style={styles.reminderText}>{formatReminderLabel(task)}</Text>
                {task.isDone ? <Text style={styles.doneText}>Done</Text> : null}
              </View>
            </View>

            <View style={styles.itemActions}>
              {confirmingDeleteTaskId === task.id ? (
                <>
                  <Pressable
                    accessibilityLabel={`Cancel delete ${task.title}`}
                    accessibilityRole="button"
                    onPress={() => setConfirmingDeleteTaskId(null)}
                    style={styles.secondaryButton}
                  >
                    <Text style={styles.secondaryButtonText}>Cancel</Text>
                  </Pressable>
                  <Pressable
                    accessibilityLabel={`Confirm delete ${task.title}`}
                    accessibilityRole="button"
                    onPress={() => {
                      deleteTask(task.id);
                      setConfirmingDeleteTaskId(null);
                    }}
                    style={styles.deleteButton}
                  >
                    <Text style={styles.deleteButtonText}>Confirm Delete</Text>
                  </Pressable>
                </>
              ) : (
                <>
                  <Pressable
                    accessibilityLabel={`Edit ${task.title}`}
                    accessibilityRole="button"
                    onPress={() => startEditingTask(task)}
                    style={styles.secondaryButton}
                  >
                    <Text style={styles.secondaryButtonText}>Edit</Text>
                  </Pressable>
                  <Pressable
                    accessibilityLabel={`Delete ${task.title}`}
                    accessibilityRole="button"
                    onPress={() => setConfirmingDeleteTaskId(task.id)}
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
    backgroundColor: LIFE_AREA_COLORS.work,
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
  checkbox: {
    alignItems: 'center',
    borderColor: SURFACE_COLORS.muted,
    borderRadius: 4,
    borderWidth: 2,
    height: 26,
    justifyContent: 'center',
    width: 26
  },
  checkboxText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 18
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
  doneText: {
    color: LIFE_AREA_COLORS.health,
    fontSize: 13,
    fontWeight: '700'
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
  eyebrow: {
    color: LIFE_AREA_COLORS.work,
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
  lifeAreaButton: {
    borderRadius: 6,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 10,
    paddingVertical: 8
  },
  lifeAreaButtonText: {
    fontSize: 13,
    fontWeight: '700'
  },
  lifeAreaSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  list: {
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
  reminderText: {
    color: SURFACE_COLORS.muted,
    fontSize: 13,
    fontWeight: '700'
  },
  summary: {
    color: SURFACE_COLORS.muted,
    fontSize: 15
  },
  taskBody: {
    flex: 1,
    gap: 5
  },
  taskCard: {
    backgroundColor: SURFACE_COLORS.card,
    borderColor: SURFACE_COLORS.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
    padding: 12
  },
  taskDueDate: {
    color: SURFACE_COLORS.muted,
    fontSize: 13
  },
  taskMainRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12
  },
  taskTag: {
    alignSelf: 'flex-start',
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 3
  },
  taskTagText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0,
    textTransform: 'uppercase'
  },
  taskTitle: {
    color: SURFACE_COLORS.text,
    fontSize: 16,
    fontWeight: '700'
  },
  taskTitleDone: {
    color: SURFACE_COLORS.muted,
    textDecorationLine: 'line-through'
  },
  title: {
    color: SURFACE_COLORS.text,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 0
  }
});
