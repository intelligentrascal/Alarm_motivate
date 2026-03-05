import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Alarm } from '../../types';
import { formatTime } from '../../utils/alarmUtils';

interface AlarmControlsProps {
  alarm: Alarm;
  onDismiss: () => void;
  onSnooze: () => void;
}

export function AlarmControls({ alarm, onDismiss, onSnooze }: AlarmControlsProps) {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.15, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const handleDismiss = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onDismiss();
  };

  const handleSnooze = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onSnooze();
  };

  return (
    <View style={styles.container}>
      {/* Alarm icon + time */}
      <View style={styles.header}>
        <Animated.View style={{ transform: [{ scale: pulse }] }}>
          <Ionicons name="alarm" size={32} color="#F59E0B" />
        </Animated.View>
        <Text style={styles.time}>{formatTime(alarm.time)}</Text>
        {alarm.label ? <Text style={styles.label}>{alarm.label}</Text> : null}
      </View>

      {/* Controls */}
      <BlurView intensity={30} tint="dark" style={styles.blur}>
        <TouchableOpacity style={styles.snoozeBtn} onPress={handleSnooze} activeOpacity={0.8}>
          <Ionicons name="time-outline" size={20} color="#94A3B8" />
          <Text style={styles.snoozeText}>Snooze {alarm.snoozeDuration}m</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.dismissBtn} onPress={handleDismiss} activeOpacity={0.8}>
          <Text style={styles.dismissText}>I'm Awake!</Text>
        </TouchableOpacity>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  header: {
    alignItems: 'center',
    paddingBottom: 24,
    gap: 6,
  },
  time: {
    color: '#F8FAFC',
    fontSize: 56,
    fontWeight: '200',
    letterSpacing: -2,
  },
  label: {
    color: '#94A3B8',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  blur: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 48,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    overflow: 'hidden',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderBottomWidth: 0,
  },
  snoozeBtn: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.08)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  snoozeText: {
    color: '#94A3B8',
    fontSize: 15,
    fontWeight: '600',
  },
  dismissBtn: {
    flex: 2,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  dismissText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
