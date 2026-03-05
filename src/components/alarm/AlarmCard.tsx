import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Alarm } from '../../types';
import { Toggle } from '../ui/Toggle';
import { formatTime, formatDays } from '../../utils/alarmUtils';

interface AlarmCardProps {
  alarm: Alarm;
  onToggle: (alarm: Alarm) => void;
  onEdit: (alarm: Alarm) => void;
  onDelete: (alarm: Alarm) => void;
}

export function AlarmCard({ alarm, onToggle, onEdit, onDelete }: AlarmCardProps) {
  return (
    <Pressable
      onPress={() => onEdit(alarm)}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.left}>
        <Text style={[styles.time, !alarm.enabled && styles.dimmed]}>
          {formatTime(alarm.time)}
        </Text>
        <Text style={[styles.meta, !alarm.enabled && styles.dimmed]}>
          {alarm.label ? `${alarm.label} · ` : ''}
          {formatDays(alarm.days)}
        </Text>
      </View>
      <View style={styles.right}>
        <Toggle
          value={alarm.enabled}
          onValueChange={() => onToggle(alarm)}
          size="sm"
        />
        <TouchableOpacity
          onPress={() => onDelete(alarm)}
          hitSlop={12}
          style={styles.deleteBtn}
        >
          <Ionicons name="trash-outline" size={16} color="#475569" />
        </TouchableOpacity>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#2D2D4E',
    marginBottom: 10,
  },
  cardPressed: {
    opacity: 0.8,
  },
  left: {
    flex: 1,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  time: {
    color: '#F8FAFC',
    fontSize: 32,
    fontWeight: '300',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  meta: {
    color: '#94A3B8',
    fontSize: 13,
  },
  dimmed: {
    opacity: 0.4,
  },
  deleteBtn: {
    padding: 4,
  },
});
