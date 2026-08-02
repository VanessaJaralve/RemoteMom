import React from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { LIFE_AREA_COLORS, SURFACE_COLORS } from '../constants/colors';

const FEEDBACK_EMAIL = 'vanessa.jaralve@gmail.com';
const FEEDBACK_URL = `mailto:${FEEDBACK_EMAIL}?subject=RemoteMom%20beta%20feedback`;

const PRIVACY_POINTS = [
  {
    title: 'Your app data stays on this device for now.',
    body:
      'The MVP stores your to-dos, groceries, child schedule, and medicine routine locally. It is not backed up to RemoteMom cloud storage yet.'
  },
  {
    title: 'RemoteMom does not provide medical advice.',
    body:
      'Medicine names, dosages, and times are entered by you. RemoteMom helps organize routines but does not recommend doses, diagnose, or change medical instructions.'
  },
  {
    title: 'Survey and feedback answers are collected separately.',
    body:
      "Waitlist, validation, and feedback responses may be saved in Vanessa's Google Sheet so the beta can improve without collecting your private app entries."
  }
];

type MoreScreenProps = {
  openFeedbackUrl?: (url: string) => void;
};

export function MoreScreen({ openFeedbackUrl }: MoreScreenProps) {
  const feedbackOpener = openFeedbackUrl ?? Linking?.openURL;

  const handleFeedbackPress = () => {
    void feedbackOpener?.(FEEDBACK_URL);
  };

  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Beta trust</Text>
        <Text style={styles.title}>Privacy & Feedback</Text>
        <Text style={styles.summary}>
          A plain-language note about what RemoteMom stores today, what it does not do yet, and how
          to send feedback.
        </Text>
      </View>

      <View style={styles.cardList}>
        {PRIVACY_POINTS.map((point) => (
          <View key={point.title} style={styles.infoCard}>
            <Text style={styles.cardTitle}>{point.title}</Text>
            <Text style={styles.cardBody}>{point.body}</Text>
          </View>
        ))}
      </View>

      <View style={styles.feedbackPanel}>
        <View style={styles.feedbackCopy}>
          <Text style={styles.feedbackTitle}>Send beta feedback</Text>
          <Text style={styles.feedbackText}>
            Share what felt useful, confusing, or missing. The email draft does not attach your
            task, child, grocery, schedule, or medicine details.
          </Text>
        </View>
        <Pressable
          accessibilityLabel="Send RemoteMom beta feedback"
          accessibilityRole="button"
          onPress={handleFeedbackPress}
          style={({ pressed }) => [styles.feedbackButton, pressed ? styles.buttonPressed : null]}
        >
          <Text style={styles.feedbackButtonText}>Email feedback</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  buttonPressed: {
    opacity: 0.72
  },
  cardBody: {
    color: SURFACE_COLORS.muted,
    fontSize: 14,
    lineHeight: 20
  },
  cardList: {
    gap: 10
  },
  cardTitle: {
    color: SURFACE_COLORS.text,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22
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
  eyebrow: {
    color: LIFE_AREA_COLORS.work,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0,
    textTransform: 'uppercase'
  },
  feedbackButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#0F8A94',
    borderRadius: 6,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 14,
    paddingVertical: 12
  },
  feedbackButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700'
  },
  feedbackCopy: {
    gap: 5
  },
  feedbackPanel: {
    backgroundColor: '#E7F5F4',
    borderColor: '#BFE3E0',
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
    padding: 14
  },
  feedbackText: {
    color: SURFACE_COLORS.muted,
    fontSize: 14,
    lineHeight: 20
  },
  feedbackTitle: {
    color: SURFACE_COLORS.text,
    fontSize: 17,
    fontWeight: '700'
  },
  header: {
    gap: 6
  },
  infoCard: {
    backgroundColor: SURFACE_COLORS.card,
    borderColor: SURFACE_COLORS.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: 7,
    padding: 14
  },
  summary: {
    color: SURFACE_COLORS.muted,
    fontSize: 15,
    lineHeight: 21
  },
  title: {
    color: SURFACE_COLORS.text,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 0
  }
});
