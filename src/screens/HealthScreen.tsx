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
import type { Medicine } from '../models/Medicine';
import { useAppState } from '../state/AppState';
import { findMedicineDoseLog } from '../utils/medicineDoseLogs';
import { formatReminderLabel } from '../utils/reminders';

function parseTimes(timesText: string) {
  return timesText
    .split(',')
    .map((time) => time.trim())
    .filter(Boolean);
}

const MEDICINE_PERSON_OPTIONS = ['Mom', 'Child'];

const MEDICINE_TIME_PRESETS = [
  { label: 'Once daily', timesText: '8:00 AM' },
  { label: 'Twice daily', timesText: '8:00 AM, 8:00 PM' },
  { label: 'Bedtime', timesText: '8:00 PM' }
];

export function HealthScreen() {
  const {
    addMedicine,
    deleteMedicine,
    markMedicineTaken,
    medicineDoseLogs,
    medicines,
    updateMedicine
  } = useAppState();
  const [personName, setPersonName] = useState('');
  const [medicineName, setMedicineName] = useState('');
  const [dosage, setDosage] = useState('');
  const [timesText, setTimesText] = useState('');
  const [refillReminderThreshold, setRefillReminderThreshold] = useState('');
  const [editingMedicineId, setEditingMedicineId] = useState<string | null>(null);
  const [confirmingDeleteMedicineId, setConfirmingDeleteMedicineId] = useState<string | null>(null);

  const trackedPeople = useMemo(
    () => Array.from(new Set(medicines.map((medicine) => medicine.personName))),
    [medicines]
  );

  const resetForm = () => {
    setPersonName('');
    setMedicineName('');
    setDosage('');
    setTimesText('');
    setRefillReminderThreshold('');
    setEditingMedicineId(null);
    setConfirmingDeleteMedicineId(null);
  };

  const handleSubmitMedicine = () => {
    const trimmedPersonName = personName.trim();
    const trimmedMedicineName = medicineName.trim();
    const trimmedDosage = dosage.trim();
    const times = parseTimes(timesText);
    const threshold = Number.parseInt(refillReminderThreshold.trim(), 10);

    if (!trimmedPersonName || !trimmedMedicineName || !trimmedDosage || times.length === 0) {
      return;
    }

    const medicineInput = {
      personName: trimmedPersonName,
      medicineName: trimmedMedicineName,
      dosage: trimmedDosage,
      times,
      refillReminderThreshold: Number.isNaN(threshold) ? 0 : threshold
    };

    if (editingMedicineId) {
      updateMedicine(editingMedicineId, medicineInput);
    } else {
      addMedicine(medicineInput);
    }

    resetForm();
  };

  const startEditingMedicine = (medicine: Medicine) => {
    setEditingMedicineId(medicine.id);
    setPersonName(medicine.personName);
    setMedicineName(medicine.medicineName);
    setDosage(medicine.dosage);
    setTimesText(medicine.times.join(', '));
    setRefillReminderThreshold(String(medicine.refillReminderThreshold));
    setConfirmingDeleteMedicineId(null);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Health</Text>
        <Text style={styles.title}>Medicine Tracker</Text>
        <Text style={styles.summary}>Reminder times are labels until notifications are added.</Text>
      </View>

      <View style={styles.peopleRow}>
        {trackedPeople.map((person) => (
          <View key={person} style={styles.personPill}>
            <Text style={styles.personPillText}>{person}</Text>
          </View>
        ))}
      </View>

      <View style={styles.safetyNote}>
        <Text style={styles.safetyTitle}>Medicine safety note</Text>
        <Text style={styles.safetyText}>RemoteMom organizes medicine routines only.</Text>
        <Text style={styles.safetyText}>
          Names, dosage text, and times should match what you already know or were told.
        </Text>
        <Text style={styles.safetyText}>
          RemoteMom does not recommend dosages, diagnose, or change medical instructions.
        </Text>
        <Text style={styles.safetyText}>
          Marking a dose taken only records completion; it does not change the saved schedule.
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.presetGroup}>
          <Text style={styles.presetLabel}>Who this is for</Text>
          <View style={styles.presetRow}>
            {MEDICINE_PERSON_OPTIONS.map((person) => {
              const isSelected = personName === person;

              return (
                <Pressable
                  accessibilityLabel={`Select ${person} medicine person`}
                  accessibilityRole="button"
                  key={person}
                  onPress={() => setPersonName(person)}
                  style={[styles.presetButton, isSelected && styles.presetButtonActive]}
                >
                  <Text
                    style={[
                      styles.presetButtonText,
                      isSelected && styles.presetButtonTextActive
                    ]}
                  >
                    {person}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
        <TextInput
          accessibilityLabel="Person name"
          onChangeText={setPersonName}
          placeholder="Mom or Child"
          style={styles.input}
          value={personName}
        />
        <TextInput
          accessibilityLabel="Medicine name"
          onChangeText={setMedicineName}
          placeholder="Medicine name"
          style={styles.input}
          value={medicineName}
        />
        <TextInput
          accessibilityLabel="Dosage"
          onChangeText={setDosage}
          placeholder="Dosage"
          style={styles.input}
          value={dosage}
        />
        <TextInput
          accessibilityLabel="Daily times"
          onChangeText={setTimesText}
          placeholder="Daily times, comma-separated"
          style={styles.input}
          value={timesText}
        />
        <View style={styles.presetGroup}>
          <Text style={styles.presetLabel}>Frequency shortcuts</Text>
          <View style={styles.presetRow}>
            {MEDICINE_TIME_PRESETS.map((preset) => {
              const isSelected = timesText === preset.timesText;

              return (
                <Pressable
                  accessibilityLabel={`Use ${preset.label.toLowerCase()} medicine times`}
                  accessibilityRole="button"
                  key={preset.label}
                  onPress={() => setTimesText(preset.timesText)}
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
          accessibilityLabel="Refill reminder threshold"
          onChangeText={setRefillReminderThreshold}
          placeholder="Refill reminder threshold"
          style={styles.input}
          value={refillReminderThreshold}
        />
        <Pressable
          accessibilityRole="button"
          onPress={handleSubmitMedicine}
          style={styles.addButton}
        >
          <Text style={styles.addButtonText}>
            {editingMedicineId ? 'Save Medicine' : 'Add Medicine'}
          </Text>
        </Pressable>
        {editingMedicineId ? (
          <Pressable
            accessibilityLabel="Cancel medicine edit"
            accessibilityRole="button"
            onPress={resetForm}
            style={styles.cancelButton}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>
        ) : null}
      </View>

      <View style={styles.medicineList}>
        {medicines.length === 0 ? (
          <EmptyState
            detail="Add only routines you already know and want to keep visible."
            message="No medicine routines added yet."
          />
        ) : null}
        {medicines.map((medicine) => (
          <View key={medicine.id} style={styles.medicineCard}>
            <View style={styles.cardHeader}>
              <View style={styles.personTag}>
                <Text style={styles.personTagText}>{medicine.personName}</Text>
              </View>
              <Text style={styles.refillText}>
                Refill alert at {medicine.refillReminderThreshold} doses left
              </Text>
            </View>
            <Text style={styles.medicineName}>{medicine.medicineName}</Text>
            <Text style={styles.dosage}>{medicine.dosage}</Text>
            <Text style={styles.times}>{medicine.times.join(', ')}</Text>
            <Text style={styles.reminderText}>{formatReminderLabel(medicine)}</Text>
            <View style={styles.doseList}>
              {medicine.times.map((time) => {
                const doseLog = findMedicineDoseLog(medicineDoseLogs, medicine.id, time);

                return (
                  <View key={time} style={styles.doseRow}>
                    <Text style={styles.doseStatus}>
                      {doseLog
                        ? `${time} dose taken today: ${doseLog.takenAt}`
                        : `${time} dose still open`}
                    </Text>
                    {doseLog ? null : (
                      <Pressable
                        accessibilityLabel={`Mark ${medicine.medicineName} ${time} taken`}
                        accessibilityRole="button"
                        onPress={() => markMedicineTaken(medicine.id, time)}
                        style={styles.takenButton}
                      >
                        <Text style={styles.takenButtonText}>Mark {time} taken</Text>
                      </Pressable>
                    )}
                  </View>
                );
              })}
            </View>
            <View style={styles.itemActions}>
              {confirmingDeleteMedicineId === medicine.id ? (
                <>
                  <Pressable
                    accessibilityLabel={`Cancel delete ${medicine.medicineName}`}
                    accessibilityRole="button"
                    onPress={() => setConfirmingDeleteMedicineId(null)}
                    style={styles.secondaryButton}
                  >
                    <Text style={styles.secondaryButtonText}>Cancel</Text>
                  </Pressable>
                  <Pressable
                    accessibilityLabel={`Confirm delete ${medicine.medicineName}`}
                    accessibilityRole="button"
                    onPress={() => {
                      deleteMedicine(medicine.id);
                      setConfirmingDeleteMedicineId(null);
                    }}
                    style={styles.deleteButton}
                  >
                    <Text style={styles.deleteButtonText}>Confirm Delete</Text>
                  </Pressable>
                </>
              ) : (
                <>
                  <Pressable
                    accessibilityLabel={`Edit ${medicine.medicineName}`}
                    accessibilityRole="button"
                    onPress={() => startEditingMedicine(medicine)}
                    style={styles.secondaryButton}
                  >
                    <Text style={styles.secondaryButtonText}>Edit</Text>
                  </Pressable>
                  <Pressable
                    accessibilityLabel={`Delete ${medicine.medicineName}`}
                    accessibilityRole="button"
                    onPress={() => setConfirmingDeleteMedicineId(medicine.id)}
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
    backgroundColor: LIFE_AREA_COLORS.health,
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
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between'
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
  dosage: {
    color: SURFACE_COLORS.text,
    fontSize: 15,
    fontWeight: '700'
  },
  doseList: {
    gap: 8
  },
  doseRow: {
    alignItems: 'flex-start',
    backgroundColor: '#F7FBFA',
    borderColor: '#D8EDEB',
    borderRadius: 6,
    borderWidth: 1,
    gap: 8,
    padding: 10
  },
  doseStatus: {
    color: SURFACE_COLORS.text,
    fontSize: 14,
    fontWeight: '600'
  },
  eyebrow: {
    color: LIFE_AREA_COLORS.health,
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
  medicineCard: {
    backgroundColor: SURFACE_COLORS.card,
    borderColor: SURFACE_COLORS.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: 9,
    padding: 14
  },
  medicineList: {
    gap: 10
  },
  medicineName: {
    color: SURFACE_COLORS.text,
    fontSize: 17,
    fontWeight: '700'
  },
  peopleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
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
    backgroundColor: LIFE_AREA_COLORS.health,
    borderColor: LIFE_AREA_COLORS.health
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
  personPill: {
    backgroundColor: LIFE_AREA_COLORS.health,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  personPillText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700'
  },
  personTag: {
    alignSelf: 'flex-start',
    backgroundColor: LIFE_AREA_COLORS.health,
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 3
  },
  personTagText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0,
    textTransform: 'uppercase'
  },
  refillText: {
    color: SURFACE_COLORS.muted,
    fontSize: 13,
    fontWeight: '700'
  },
  reminderText: {
    color: SURFACE_COLORS.muted,
    fontSize: 13,
    fontWeight: '700'
  },
  safetyNote: {
    backgroundColor: '#FFF8E5',
    borderColor: '#E7D08A',
    borderRadius: 8,
    borderWidth: 1,
    gap: 5,
    padding: 14
  },
  safetyText: {
    color: SURFACE_COLORS.muted,
    fontSize: 13,
    lineHeight: 19
  },
  safetyTitle: {
    color: SURFACE_COLORS.text,
    fontSize: 15,
    fontWeight: '700'
  },
  summary: {
    color: SURFACE_COLORS.muted,
    fontSize: 15
  },
  takenButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderColor: LIFE_AREA_COLORS.health,
    borderRadius: 6,
    borderWidth: 1,
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 9
  },
  takenButtonText: {
    color: LIFE_AREA_COLORS.health,
    fontSize: 14,
    fontWeight: '700'
  },
  times: {
    color: LIFE_AREA_COLORS.health,
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
