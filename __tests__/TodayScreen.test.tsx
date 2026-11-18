import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fireEvent, render, waitFor, within } from '@testing-library/react-native';

import type { Medicine } from '../src/models/Medicine';
import type { MedicineDoseLog } from '../src/models/MedicineDoseLog';
import { TodayScreen } from '../src/screens/TodayScreen';
import { TodosScreen } from '../src/screens/TodosScreen';
import { AppStateProvider } from '../src/state/AppState';
import {
  APP_STATE_STORAGE_KEY,
  CURRENT_APP_STATE_SCHEMA_VERSION
} from '../src/state/persistence';

function renderWithAppState(ui: React.ReactElement) {
  return render(<AppStateProvider>{ui}</AppStateProvider>);
}

describe('TodayScreen', () => {
  it('renders a source-derived Today Dashboard timeline', async () => {
    const { getByText, queryByText } = await renderWithAppState(<TodayScreen />);

    expect(getByText('Daily command center')).toBeOnTheScreen();
    expect(getByText('Morning')).toBeOnTheScreen();
    expect(getByText('Evening')).toBeOnTheScreen();
    expect(queryByText('Placeholder timeline for daily priorities.')).toBeNull();
  });

  it('shows RemoteMom identity and the core mental-load promise first', async () => {
    const { getByText } = await renderWithAppState(<TodayScreen />);

    expect(getByText('RemoteMom')).toBeOnTheScreen();
    expect(getByText('Manage the day without carrying it all in your head.')).toBeOnTheScreen();
  });

  it('shows v2 priority summary and focus framing', async () => {
    const { getAllByText, getByText } = await renderWithAppState(<TodayScreen />);

    expect(getAllByText('Urgent').length).toBeGreaterThan(0);
    expect(getAllByText('Overdue').length).toBeGreaterThan(0);
    expect(getByText('Next up')).toBeOnTheScreen();
    expect(getByText('Focus for today')).toBeOnTheScreen();
  });

  it('pulls timeline items from to-dos, groceries, kid schedule, and medicine', async () => {
    const { getAllByText, getByText } = await renderWithAppState(<TodayScreen />);

    expect(getByText('Review tomorrow morning priorities')).toBeOnTheScreen();
    expect(getByText('Pack school folder')).toBeOnTheScreen();
    expect(getByText('Bread')).toBeOnTheScreen();
    expect(getByText('Milk')).toBeOnTheScreen();
    expect(getByText('School drop-off')).toBeOnTheScreen();
    expect(getByText('Soccer practice')).toBeOnTheScreen();
    expect(getByText('Vitamin D')).toBeOnTheScreen();
    expect(getAllByText('Child Allergy Syrup').length).toBeGreaterThan(0);
  });

  it('shows life-area color tag labels for the timeline', async () => {
    const { getAllByText } = await renderWithAppState(<TodayScreen />);

    expect(getAllByText('Work').length).toBeGreaterThan(0);
    expect(getAllByText('Kid').length).toBeGreaterThan(0);
    expect(getAllByText('Health').length).toBeGreaterThan(0);
    expect(getAllByText('Household').length).toBeGreaterThan(0);
  });

  it('does not add Firebase, calendar sync, notifications, or premium multi-child features', async () => {
    const { queryByText } = await renderWithAppState(<TodayScreen />);

    expect(queryByText('Firebase')).toBeNull();
    expect(queryByText('Google Calendar')).toBeNull();
    expect(queryByText('Notifications')).toBeNull();
    expect(queryByText('Multiple Children')).toBeNull();
  });

  it('marks a source task done from Today and removes it from the timeline', async () => {
    const { getByLabelText, queryByText } = await renderWithAppState(<TodayScreen />);

    await fireEvent.press(getByLabelText('Mark Review tomorrow morning priorities done from Today'));

    expect(queryByText('Review tomorrow morning priorities')).toBeNull();
  });

  it('checks a source grocery item from Today and keeps other groceries actionable', async () => {
    const { getByLabelText, getByText, queryByText } = await renderWithAppState(<TodayScreen />);

    expect(getByText('Bread')).toBeOnTheScreen();
    expect(getByText('Milk')).toBeOnTheScreen();

    await fireEvent.press(getByLabelText('Check Bread from Today'));

    expect(queryByText('Bread')).toBeNull();
    expect(getByText('Milk')).toBeOnTheScreen();
  });

  it('marks a source medicine dose taken from Today and updates only that scheduled time', async () => {
    const { getAllByText, getByLabelText, getByText } = await renderWithAppState(<TodayScreen />);

    await fireEvent.press(getByLabelText('Mark Child Allergy Syrup 8:00 AM taken from Today'));

    expect(getByText(/Child • 5 ml • Taken today:/)).toBeOnTheScreen();
    expect(getAllByText('Child • 5 ml')).toHaveLength(1);
  });

  it('does not treat a parseable future due date as urgent', async () => {
    const { getAllByText, getByLabelText, getByText } = await renderWithAppState(
      <>
        <TodosScreen />
        <TodayScreen />
      </>
    );
    const urgentCountBefore = getAllByText('Urgent').length;

    await fireEvent.changeText(getByLabelText('Task title'), 'Plan summer camp');
    await fireEvent.changeText(getByLabelText('Due date'), '2099-01-01');
    await fireEvent.press(getByText('Add Task'));

    expect(getAllByText('Plan summer camp').length).toBeGreaterThan(0);
    expect(getAllByText('Urgent')).toHaveLength(urgentCountBefore);
  });
});

describe('Today medicine timing', () => {
  const medicine: Medicine = {
    id: 'synthetic-medicine',
    personName: 'Mom',
    medicineName: 'Example entry',
    dosage: 'User-entered instructions',
    times: ['8:00 AM', '8:00 PM'],
    refillReminderThreshold: 0,
    lastTaken: null
  };
  const todayLog: MedicineDoseLog = {
    id: 'synthetic-dose-log',
    medicineId: medicine.id,
    scheduledTime: '8:00 AM',
    takenDate: '2026-11-18',
    takenAt: 'Recorded completion'
  };

  beforeEach(() => {
    jest.useFakeTimers({
      now: new Date(2026, 10, 18, 10, 0, 30),
      doNotFake: ['nextTick', 'queueMicrotask', 'setImmediate', 'clearImmediate']
    });
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  async function renderMedicineTimes(times: string[], medicineDoseLogs: MedicineDoseLog[] = []) {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
      JSON.stringify({
        schemaVersion: CURRENT_APP_STATE_SCHEMA_VERSION,
        children: [],
        tasks: [],
        groceryItems: [],
        scheduleItems: [],
        medicines: [{ ...medicine, times }],
        medicineDoseLogs
      })
    );

    return renderWithAppState(<TodayScreen />);
  }

  function withinParentView(element: Parameters<typeof within>[0]) {
    let parent = element.parent;
    while (parent && parent.type !== 'View') {
      parent = parent.parent;
    }
    if (!parent) {
      throw new Error('Expected a containing View');
    }
    return within(parent);
  }

  it.each([
    { time: '8:00 PM', status: 'Planned', overdueCount: 0 },
    { time: '8:00 AM', status: 'Overdue', overdueCount: 1 },
    { time: '10:00 AM', status: 'Planned', overdueCount: 0 },
    { time: 'after breakfast', status: 'Planned', overdueCount: 0 },
    { time: '13:00 PM', status: 'Planned', overdueCount: 0 },
    { time: '', status: 'Planned', overdueCount: 0 }
  ])('shows $time as $status at local 10:00 AM', async ({ time, status, overdueCount }) => {
    const { getAllByText, getByText } = await renderMedicineTimes([time]);
    const card = withinParentView(getByText(medicine.medicineName));
    const overdueSummary = withinParentView(getAllByText('Overdue')[0]);

    expect(card.getByText(status)).toBeOnTheScreen();
    expect(overdueSummary.getByText(String(overdueCount))).toBeOnTheScreen();
    expect(card.getByText('Mom • User-entered instructions')).toBeOnTheScreen();
    if (time) {
      expect(getByText(time)).toBeOnTheScreen();
    }
  });

  it.each([
    { description: 'today and this dose', log: todayLog, completed: true },
    {
      description: 'yesterday',
      log: { ...todayLog, takenDate: '2026-11-17' },
      completed: false
    },
    {
      description: 'another scheduled time',
      log: { ...todayLog, scheduledTime: '8:00 PM' },
      completed: false
    },
    {
      description: 'another medicine',
      log: { ...todayLog, medicineId: 'other-medicine' },
      completed: false
    }
  ])('uses only a matching completion log: $description', async ({ log, completed }) => {
    const { getAllByText, getByLabelText, getByText, queryByLabelText, queryByText } =
      await renderMedicineTimes(['8:00 AM'], [log]);
    const card = withinParentView(getByText(medicine.medicineName));
    const actionLabel = 'Mark Example entry 8:00 AM taken from Today';
    const overdueSummary = withinParentView(getAllByText('Overdue')[0]);

    expect(card.getByText(completed ? 'Planned' : 'Overdue')).toBeOnTheScreen();
    expect(overdueSummary.getByText(completed ? '0' : '1')).toBeOnTheScreen();
    if (completed) {
      expect(
        getByText('Mom • User-entered instructions • Taken today: Recorded completion')
      ).toBeOnTheScreen();
      expect(queryByLabelText(actionLabel)).toBeNull();
    } else {
      expect(getByLabelText(actionLabel)).toBeOnTheScreen();
      expect(queryByText(/Taken today:/)).toBeNull();
    }
  });

  it('keeps past and future doses independent when one is marked taken', async () => {
    const existingLog = { ...todayLog, takenDate: '2026-11-17' };
    const { getAllByText, getByLabelText, getByText, queryByLabelText } =
      await renderMedicineTimes(medicine.times, [existingLog]);
    const morningRow = withinParentView(getByText('8:00 AM'));
    const eveningRow = withinParentView(getByText('8:00 PM'));

    expect(morningRow.getByText('Overdue')).toBeOnTheScreen();
    expect(eveningRow.getByText('Planned')).toBeOnTheScreen();
    expect(withinParentView(getAllByText('Overdue')[0]).getByText('1')).toBeOnTheScreen();

    await fireEvent.press(getByLabelText('Mark Example entry 8:00 AM taken from Today'));

    expect(withinParentView(getByText('8:00 AM')).getByText('Planned')).toBeOnTheScreen();
    expect(withinParentView(getByText('8:00 AM')).getByText(/Taken today:/)).toBeOnTheScreen();
    expect(queryByLabelText('Mark Example entry 8:00 AM taken from Today')).toBeNull();
    expect(getByLabelText('Mark Example entry 8:00 PM taken from Today')).toBeOnTheScreen();
    expect(withinParentView(getByText('8:00 PM')).getByText('Planned')).toBeOnTheScreen();
    expect(withinParentView(getByText('Overdue')).getByText('0')).toBeOnTheScreen();

    await waitFor(() => {
      const [key, raw] = (AsyncStorage.setItem as jest.Mock).mock.calls.at(-1);
      const savedState = JSON.parse(raw);

      expect(key).toBe(APP_STATE_STORAGE_KEY);
      expect(savedState.medicines).toEqual([medicine]);
      expect(savedState.medicineDoseLogs).toEqual([
        expect.objectContaining({
          medicineId: medicine.id,
          scheduledTime: '8:00 AM',
          takenDate: '2026-11-18'
        }),
        existingLog
      ]);
    });
  });
});
