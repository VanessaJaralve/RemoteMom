import React, { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

import { LIFE_AREA_COLORS, SURFACE_COLORS } from '../constants/colors';
import type { Task, TaskLifeArea } from '../models/Task';

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

const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Review tomorrow morning priorities',
    lifeArea: 'work',
    dueDate: 'Tonight',
    isDone: false
  },
  {
    id: 'task-2',
    title: 'Pack school folder',
    lifeArea: 'kid',
    isDone: false
  }
];

export function TodosScreen() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [selectedLifeArea, setSelectedLifeArea] = useState<TaskLifeArea>('work');

  const incompleteCount = useMemo(() => tasks.filter((task) => !task.isDone).length, [tasks]);

  const addTask = () => {
    const trimmedTitle = title.trim();
    const trimmedDueDate = dueDate.trim();

    if (!trimmedTitle) {
      return;
    }

    const task: Task = {
      id: `task-${Date.now()}`,
      title: trimmedTitle,
      lifeArea: selectedLifeArea,
      dueDate: trimmedDueDate || undefined,
      isDone: false
    };

    setTasks((currentTasks) => [task, ...currentTasks]);
    setTitle('');
    setDueDate('');
    setSelectedLifeArea('work');
  };

  const toggleTaskDone = (taskId: string) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, isDone: !task.isDone } : task
      )
    );
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
          onPress={addTask}
          style={styles.addButton}
        >
          <Text style={styles.addButtonText}>Add Task</Text>
        </Pressable>
      </View>

      <View style={styles.list}>
        {tasks.map((task) => (
          <View key={task.id} style={styles.taskRow}>
            <Pressable
              accessibilityLabel={`Mark ${task.title} ${task.isDone ? 'not done' : 'done'}`}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: task.isDone }}
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
            </View>

            {task.isDone ? <Text style={styles.doneText}>Done</Text> : null}
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
    paddingHorizontal: 14,
    paddingVertical: 12
  },
  addButtonText: {
    color: '#FFFFFF',
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
  eyebrow: {
    color: LIFE_AREA_COLORS.work,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0,
    textTransform: 'uppercase'
  },
  form: {
    gap: 12
  },
  header: {
    gap: 6
  },
  input: {
    backgroundColor: SURFACE_COLORS.card,
    borderColor: SURFACE_COLORS.border,
    borderRadius: 6,
    borderWidth: 1,
    color: SURFACE_COLORS.text,
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 12
  },
  lifeAreaButton: {
    borderRadius: 6,
    borderWidth: 1,
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
  summary: {
    color: SURFACE_COLORS.muted,
    fontSize: 15
  },
  taskBody: {
    flex: 1,
    gap: 5
  },
  taskDueDate: {
    color: SURFACE_COLORS.muted,
    fontSize: 13
  },
  taskRow: {
    alignItems: 'flex-start',
    backgroundColor: SURFACE_COLORS.card,
    borderColor: SURFACE_COLORS.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 12
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
