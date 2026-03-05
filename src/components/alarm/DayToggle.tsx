import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { DAY_SHORT } from '../../utils/alarmUtils';

interface DayToggleProps {
  selectedDays: number[];
  onChange: (days: number[]) => void;
}

export function DayToggle({ selectedDays, onChange }: DayToggleProps) {
  const toggle = (day: number) => {
    Haptics.selectionAsync();
    if (selectedDays.includes(day)) {
      onChange(selectedDays.filter((d) => d !== day));
    } else {
      onChange([...selectedDays, day].sort());
    }
  };

  return (
    <View style={styles.row}>
      {DAY_SHORT.map((label, idx) => {
        const active = selectedDays.includes(idx);
        return (
          <TouchableOpacity
            key={idx}
            onPress={() => toggle(idx)}
            style={[styles.pill, active && styles.pillActive]}
            activeOpacity={0.8}
          >
            <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 6,
  },
  pill: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1A1A2E',
    borderWidth: 1,
    borderColor: '#2D2D4E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillActive: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  label: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  labelActive: {
    color: '#fff',
  },
});
