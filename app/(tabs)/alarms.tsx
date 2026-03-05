import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAlarmStore } from '../../src/store/alarmStore';
import { useAlarmScheduler } from '../../src/hooks/useAlarmScheduler';
import { AlarmCard } from '../../src/components/alarm/AlarmCard';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { Alarm } from '../../src/types';

export default function AlarmsScreen() {
  const router = useRouter();
  const { alarms, deleteAlarm } = useAlarmStore();
  const { toggleAlarm, removeAlarm } = useAlarmScheduler();

  const handleAdd = () => {
    router.push({ pathname: '/alarm-edit/[id]', params: { id: 'new' } });
  };

  const handleEdit = (alarm: Alarm) => {
    router.push({ pathname: '/alarm-edit/[id]', params: { id: alarm.id } });
  };

  const handleDelete = (alarm: Alarm) => {
    Alert.alert('Delete Alarm', `Delete "${alarm.label || formatTime(alarm.time)}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await removeAlarm(alarm);
          await deleteAlarm(alarm.id);
        },
      },
    ]);
  };

  const sortedAlarms = [...alarms].sort((a, b) => a.time.localeCompare(b.time));

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Alarms</Text>
        <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
          <Ionicons name="add" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {sortedAlarms.length === 0 ? (
        <EmptyState
          icon="⏰"
          title="No alarms yet"
          subtitle="Tap + to create your first motivational alarm"
        />
      ) : (
        <ScrollView
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        >
          {sortedAlarms.map((alarm) => (
            <AlarmCard
              key={alarm.id}
              alarm={alarm}
              onToggle={toggleAlarm}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
          <View style={{ height: 20 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function formatTime(time: string) {
  const [h, m] = time.split(':').map(Number);
  const period = h < 12 ? 'AM' : 'PM';
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, '0')} ${period}`;
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0A0A0F',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 28,
    fontWeight: '700',
  },
  addBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
});
