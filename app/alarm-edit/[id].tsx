import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Haptics from 'expo-haptics';
import { useAlarmStore } from '../../src/store/alarmStore';
import { useSettingsStore } from '../../src/store/settingsStore';
import { useAlarmScheduler } from '../../src/hooks/useAlarmScheduler';
import { DayToggle } from '../../src/components/alarm/DayToggle';
import { Toggle } from '../../src/components/ui/Toggle';
import { Alarm, SoundOption } from '../../src/types';
import { generateId, formatTime, DAY_NAMES } from '../../src/utils/alarmUtils';

const SOUND_OPTIONS: { key: SoundOption; label: string; icon: string }[] = [
  { key: 'alarm', label: 'Alarm', icon: '🔔' },
  { key: 'gentle', label: 'Gentle', icon: '🎵' },
  { key: 'silent', label: 'Silent', icon: '🔕' },
];

export default function AlarmEditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { alarms, addAlarm, updateAlarm } = useAlarmStore();
  const { settings } = useSettingsStore();
  const { enableAlarm, rescheduleAlarm } = useAlarmScheduler();

  const isNew = id === 'new';
  const existingAlarm = alarms.find((a) => a.id === id);

  // Form state
  const [time, setTime] = useState<Date>(() => {
    if (existingAlarm) {
      const [h, m] = existingAlarm.time.split(':').map(Number);
      const d = new Date();
      d.setHours(h, m, 0, 0);
      return d;
    }
    const d = new Date();
    d.setMinutes(d.getMinutes() + 30, 0, 0);
    return d;
  });
  const [label, setLabel] = useState(existingAlarm?.label ?? '');
  const [days, setDays] = useState<number[]>(existingAlarm?.days ?? []);
  const [sound, setSound] = useState<SoundOption>(existingAlarm?.sound ?? 'alarm');
  const [snoozeDuration, setSnoozeDuration] = useState(
    existingAlarm?.snoozeDuration ?? settings.defaultSnoozeDuration
  );
  const [vibrate, setVibrate] = useState(existingAlarm?.vibrate ?? true);
  const [showPicker, setShowPicker] = useState(Platform.OS === 'ios');

  const timeString = `${time.getHours().toString().padStart(2, '0')}:${time
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;

  const handleSave = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const alarmData: Omit<Alarm, 'id' | 'createdAt' | 'notificationIds'> = {
      time: timeString,
      label: label.trim(),
      enabled: true,
      days,
      sound,
      snoozeDuration,
      vibrate,
    };

    if (isNew) {
      const newAlarm: Alarm = {
        ...alarmData,
        id: generateId(),
        notificationIds: [],
        createdAt: Date.now(),
      };
      await addAlarm(newAlarm);
      await enableAlarm(newAlarm);
    } else if (existingAlarm) {
      await updateAlarm(existingAlarm.id, alarmData);
      await rescheduleAlarm({ ...existingAlarm, ...alarmData });
    }

    router.back();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="close" size={24} color="#94A3B8" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isNew ? 'New Alarm' : 'Edit Alarm'}</Text>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Time picker */}
        <View style={styles.timeSection}>
          {(Platform.OS === 'android' && !showPicker) && (
            <TouchableOpacity
              style={styles.timeDisplay}
              onPress={() => setShowPicker(true)}
            >
              <Text style={styles.timeText}>{formatTime(timeString)}</Text>
              <Ionicons name="pencil" size={16} color="#7C3AED" style={{ marginTop: 8 }} />
            </TouchableOpacity>
          )}

          {showPicker && (
            <DateTimePicker
              value={time}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(_, selectedDate) => {
                if (Platform.OS === 'android') setShowPicker(false);
                if (selectedDate) setTime(selectedDate);
              }}
              style={styles.picker}
              textColor="#F8FAFC"
              themeVariant="dark"
            />
          )}
        </View>

        {/* Label */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Label</Text>
          <TextInput
            style={styles.labelInput}
            placeholder="Morning routine, gym, etc."
            placeholderTextColor="#475569"
            value={label}
            onChangeText={setLabel}
            maxLength={40}
            returnKeyType="done"
          />
        </View>

        {/* Repeat days */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Repeat</Text>
          <DayToggle selectedDays={days} onChange={setDays} />
          <Text style={styles.repeatHint}>
            {days.length === 0 ? 'One-time alarm' : `Repeats: ${days.map((d) => DAY_NAMES[d]).join(', ')}`}
          </Text>
        </View>

        {/* Sound */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sound</Text>
          <View style={styles.soundRow}>
            {SOUND_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.key}
                style={[styles.soundPill, sound === opt.key && styles.soundPillActive]}
                onPress={() => setSound(opt.key)}
              >
                <Text style={styles.soundIcon}>{opt.icon}</Text>
                <Text style={[styles.soundLabel, sound === opt.key && styles.soundLabelActive]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Snooze */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Snooze duration</Text>
          <View style={styles.snoozeRow}>
            {[5, 10, 15, 20].map((n) => (
              <TouchableOpacity
                key={n}
                style={[styles.snoozePill, snoozeDuration === n && styles.snoozePillActive]}
                onPress={() => setSnoozeDuration(n)}
              >
                <Text style={[styles.snoozeText, snoozeDuration === n && styles.snoozeTextActive]}>
                  {n}m
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Vibrate */}
        <View style={styles.section}>
          <View style={styles.toggleRow}>
            <View>
              <Text style={styles.toggleLabel}>Vibrate</Text>
              <Text style={styles.toggleSub}>Vibration on alarm</Text>
            </View>
            <Toggle value={vibrate} onValueChange={setVibrate} />
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0A0A0F',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#2D2D4E',
  },
  headerTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
  },
  saveBtn: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  content: {
    padding: 20,
  },
  timeSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  timeDisplay: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  timeText: {
    color: '#F8FAFC',
    fontSize: 64,
    fontWeight: '200',
    letterSpacing: -2,
  },
  picker: {
    width: '100%',
    height: 180,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  labelInput: {
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    padding: 14,
    color: '#F8FAFC',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#2D2D4E',
  },
  repeatHint: {
    color: '#475569',
    fontSize: 12,
    marginTop: 8,
  },
  soundRow: {
    flexDirection: 'row',
    gap: 10,
  },
  soundPill: {
    flex: 1,
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#2D2D4E',
  },
  soundPillActive: {
    borderColor: '#7C3AED',
    backgroundColor: 'rgba(124,58,237,0.1)',
  },
  soundIcon: {
    fontSize: 20,
  },
  soundLabel: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  soundLabelActive: {
    color: '#7C3AED',
  },
  snoozeRow: {
    flexDirection: 'row',
    gap: 10,
  },
  snoozePill: {
    flex: 1,
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2D2D4E',
  },
  snoozePillActive: {
    borderColor: '#7C3AED',
    backgroundColor: 'rgba(124,58,237,0.1)',
  },
  snoozeText: {
    color: '#94A3B8',
    fontSize: 15,
    fontWeight: '600',
  },
  snoozeTextActive: {
    color: '#7C3AED',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2D2D4E',
  },
  toggleLabel: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '600',
  },
  toggleSub: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
});
