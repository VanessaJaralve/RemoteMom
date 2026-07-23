import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { LIFE_AREA_COLORS, SURFACE_COLORS } from '../constants/colors';

type LifeArea = keyof typeof LIFE_AREA_COLORS;

type ScreenPlaceholderProps = {
  title: string;
  description: string;
  tagLabel: string;
  lifeArea: LifeArea;
};

export function ScreenPlaceholder({
  title,
  description,
  tagLabel,
  lifeArea
}: ScreenPlaceholderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View
          accessibilityLabel={`${tagLabel} life area tag`}
          style={[styles.tag, { backgroundColor: LIFE_AREA_COLORS[lifeArea] }]}
        >
          <Text style={styles.tagText}>{tagLabel}</Text>
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SURFACE_COLORS.background,
    paddingHorizontal: 20,
    paddingVertical: 28
  },
  content: {
    gap: 14
  },
  description: {
    color: SURFACE_COLORS.muted,
    fontSize: 16,
    lineHeight: 24
  },
  tag: {
    alignSelf: 'flex-start',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0,
    textTransform: 'uppercase'
  },
  title: {
    color: SURFACE_COLORS.text,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 0
  }
});
