import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fireEvent, render, waitFor } from '@testing-library/react-native';

import { HealthScreen } from '../src/screens/HealthScreen';
import { KidScreen } from '../src/screens/KidScreen';
import { AppStateProvider } from '../src/state/AppState';
import { DEFAULT_CHILD_ID, sampleChildren, sampleMedicines } from '../src/data/sampleData';

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn()
  }
}));

const STORAGE_KEY = 'remotemom:appState:v1';

function renderWithAppState(ui: React.ReactElement) {
  return render(<AppStateProvider>{ui}</AppStateProvider>);
}

function getLatestSavedState() {
  return JSON.parse((AsyncStorage.setItem as jest.Mock).mock.calls.at(-1)[1]);
}

describe('internal default child data', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
  });

  it('defines one stable default child without exposing multi-child UI', async () => {
    const { queryByText } = await renderWithAppState(<KidScreen />);

    expect(sampleChildren).toEqual([{ id: DEFAULT_CHILD_ID, name: 'Child' }]);
    expect(queryByText('Multiple Children')).toBeNull();
  });

  it('saves new child schedule items with the default child id', async () => {
    const { getByLabelText, getByText } = await renderWithAppState(<KidScreen />);

    await waitFor(() => expect(AsyncStorage.getItem).toHaveBeenCalledWith(STORAGE_KEY));

    await fireEvent.changeText(getByLabelText('Schedule title'), 'Reading time');
    await fireEvent.changeText(getByLabelText('Start time'), '6:00 PM');
    await fireEvent.changeText(getByLabelText('End time'), '6:30 PM');
    await fireEvent.press(getByText('Add Schedule Item'));

    await waitFor(() => expect(AsyncStorage.setItem).toHaveBeenCalled());

    expect(getLatestSavedState().scheduleItems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: 'Reading time',
          childId: DEFAULT_CHILD_ID
        })
      ])
    );
  });

  it('saves child medicine entries with the default child id only for Child person entries', async () => {
    const { getByLabelText, getByText } = await renderWithAppState(<HealthScreen />);

    await waitFor(() => expect(AsyncStorage.getItem).toHaveBeenCalledWith(STORAGE_KEY));

    await fireEvent.changeText(getByLabelText('Person name'), 'Child');
    await fireEvent.changeText(getByLabelText('Medicine name'), 'Probiotic');
    await fireEvent.changeText(getByLabelText('Dosage'), '1 packet');
    await fireEvent.changeText(getByLabelText('Daily times'), '7:00 AM');
    await fireEvent.changeText(getByLabelText('Refill reminder threshold'), '4');
    await fireEvent.press(getByText('Add Medicine'));

    await waitFor(() => expect(AsyncStorage.setItem).toHaveBeenCalled());

    expect(getLatestSavedState().medicines).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          medicineName: 'Probiotic',
          childId: DEFAULT_CHILD_ID
        })
      ])
    );
    expect(sampleMedicines.find((medicine) => medicine.personName === 'Mom')).not.toHaveProperty(
      'childId'
    );
  });
});
