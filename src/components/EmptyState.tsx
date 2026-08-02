import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { SURFACE_COLORS } from '../constants/colors';

type EmptyStateProps = {
  message: string;
  detail: string;
};

export function EmptyState({ message, detail }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
      <Text style={styles.detail}>{detail}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: SURFACE_COLORS.card,
    borderColor: SURFACE_COLORS.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
    padding: 14
  },
  detail: {
    color: SURFACE_COLORS.muted,
    fontSize: 14,
    lineHeight: 20
  },
  message: {
    color: SURFACE_COLORS.text,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22
  }
});
