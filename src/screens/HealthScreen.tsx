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
import type { Medicine } from '../models/Medicine';
import { useAppState } from '../state/AppState';

function parseTimes(timesText: string) {
  return timesText
    .split(',')
    .map((time) => time.trim())
    .filter(Boolean);
}

export function HealthScreen() {
  const { addMedicine, deleteMedicine, markMedicineTaken, medicines, updateMedicine } =
    useAppState();
  const [personName, setPersonName] = useState('');
  const [medicineName, setMedicineName] = useState('');
  const [dosage, setDosage] = useState('');
  const [timesText, setTimesText] = useState('');
  const [refillReminderThreshold, setRefillReminderThreshold] = useState('');
  const [editingMedicineId, setEditingMedicineId] = useState<string | null>(null);

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

      <View style={styles.form}>
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
            <Text style={styles.lastTaken}>
              {medicine.lastTaken ? `Last taken: ${medicine.lastTaken}` : 'Last taken: Not yet'}
            </Text>
            <Pressable
              accessibilityLabel={`Mark ${medicine.medicineName} taken`}
              accessibilityRole="button"
              onPress={() => markMedicineTaken(medicine.id)}
              style={styles.takenButton}
            >
              <Text style={styles.takenButtonText}>Mark Taken</Text>
            </Pressable>
            <View style={styles.itemActions}>
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
                onPress={() => deleteMedicine(medicine.id)}
                style={styles.deleteButton}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </Pressable>
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
    paddingHorizontal: 10,
    paddingVertical: 7
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
  lastTaken: {
    color: SURFACE_COLORS.muted,
    fontSize: 14
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
  secondaryButton: {
    alignItems: 'center',
    borderColor: SURFACE_COLORS.muted,
    borderRadius: 6,
    borderWidth: 1,
    flex: 1,
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 7
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
