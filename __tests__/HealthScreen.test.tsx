import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import { HealthScreen } from '../src/screens/HealthScreen';
import type { Medicine } from '../src/models/Medicine';
import { AppStateProvider } from '../src/state/AppState';

function renderWithAppState(ui: React.ReactElement) {
  return render(<AppStateProvider>{ui}</AppStateProvider>);
}

describe('HealthScreen', () => {
  it('uses the exact Medicine model fields from the project brief', () => {
    const medicine: Medicine = {
      id: 'medicine-1',
      personName: 'Mom',
      medicineName: 'Vitamin D',
      dosage: '1 tablet',
      times: ['8:00 AM'],
      refillReminderThreshold: 5,
      lastTaken: null
    };

    expect(Object.keys(medicine)).toEqual([
      'id',
      'personName',
      'medicineName',
      'dosage',
      'times',
      'refillReminderThreshold',
      'lastTaken'
    ]);
  });

  it('renders the medicine tracker without notifications or Today Dashboard', async () => {
    const { getAllByText, getByText, queryByText } = await renderWithAppState(<HealthScreen />);

    expect(getByText('Medicine Tracker')).toBeOnTheScreen();
    expect(getByText('Add Medicine')).toBeOnTheScreen();
    expect(getAllByText('Mom').length).toBeGreaterThan(0);
    expect(getAllByText('Child').length).toBeGreaterThan(0);
    expect(queryByText('Firebase Notifications')).toBeNull();
    expect(queryByText('Today Dashboard')).toBeNull();
  });

  it('shows medicine safety copy at the point of entry', async () => {
    const { getByText, queryByText } = await renderWithAppState(<HealthScreen />);

    expect(getByText('Medicine safety note')).toBeOnTheScreen();
    expect(getByText('RemoteMom organizes medicine routines only.')).toBeOnTheScreen();
    expect(
      getByText('Names, dosage text, and times should match what you already know or were told.')
    ).toBeOnTheScreen();
    expect(
      getByText('RemoteMom does not recommend dosages, diagnose, or change medical instructions.')
    ).toBeOnTheScreen();
    expect(
      getByText('Marking a dose taken only records completion; it does not change the saved schedule.')
    ).toBeOnTheScreen();
    expect(queryByText('Recommended dosage')).toBeNull();
    expect(queryByText('Diagnosis')).toBeNull();
  });

  it('shows dosage, daily times, and refill threshold for sample medicines', async () => {
    const { getByText } = await renderWithAppState(<HealthScreen />);

    expect(getByText('Vitamin D')).toBeOnTheScreen();
    expect(getByText('1 tablet')).toBeOnTheScreen();
    expect(getByText('8:00 AM')).toBeOnTheScreen();
    expect(getByText('Refill alert at 5 doses left')).toBeOnTheScreen();
    expect(getByText('Child Allergy Syrup')).toBeOnTheScreen();
    expect(getByText('8:00 AM, 8:00 PM')).toBeOnTheScreen();
  });

  it('adds a medicine entry with parsed daily times and refill threshold', async () => {
    const { getAllByDisplayValue, getByLabelText, getByText } =
      await renderWithAppState(<HealthScreen />);

    await fireEvent.changeText(getByLabelText('Person name'), 'Child');
    await fireEvent.changeText(getByLabelText('Medicine name'), 'Probiotic');
    await fireEvent.changeText(getByLabelText('Dosage'), '1 packet');
    await fireEvent.changeText(getByLabelText('Daily times'), '7:00 AM, 7:00 PM');
    await fireEvent.changeText(getByLabelText('Refill reminder threshold'), '4');
    await fireEvent.press(getByText('Add Medicine'));

    expect(getByText('Probiotic')).toBeOnTheScreen();
    expect(getByText('1 packet')).toBeOnTheScreen();
    expect(getByText('7:00 AM, 7:00 PM')).toBeOnTheScreen();
    expect(getByText('Refill alert at 4 doses left')).toBeOnTheScreen();
    expect(getAllByDisplayValue('')).toHaveLength(5);
  });

  it('fills person and daily times from medicine form controls', async () => {
    const { getAllByText, getByLabelText, getByText } =
      await renderWithAppState(<HealthScreen />);

    await fireEvent.press(getByLabelText('Select Child medicine person'));
    await fireEvent.press(getByLabelText('Use twice daily medicine times'));
    await fireEvent.changeText(getByLabelText('Medicine name'), 'Probiotic');
    await fireEvent.changeText(getByLabelText('Dosage'), '1 packet');
    await fireEvent.changeText(getByLabelText('Refill reminder threshold'), '4');
    await fireEvent.press(getByText('Add Medicine'));

    expect(getByText('Probiotic')).toBeOnTheScreen();
    expect(getAllByText('Child').length).toBeGreaterThan(0);
    expect(getAllByText('8:00 AM, 8:00 PM').length).toBeGreaterThan(0);
  });

  it('marks one scheduled medicine dose as taken without changing the other daily dose', async () => {
    const { getAllByText, getByLabelText, getByText } =
      await renderWithAppState(<HealthScreen />);

    await fireEvent.press(getByLabelText('Mark Child Allergy Syrup 8:00 AM taken'));

    expect(getByText('Child Allergy Syrup')).toBeOnTheScreen();
    expect(getByText(/8:00 AM dose taken today:/)).toBeOnTheScreen();
    expect(getAllByText('8:00 PM dose still open')).toHaveLength(1);
  });
});
