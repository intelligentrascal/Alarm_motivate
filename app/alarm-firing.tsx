import React, { useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  BackHandler,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Notifications from 'expo-notifications';
import * as Haptics from 'expo-haptics';
import { useAlarmStore } from '../src/store/alarmStore';
import { useInspirationStore } from '../src/store/inspirationStore';
import { useSettingsStore } from '../src/store/settingsStore';
import { useAudio } from '../src/hooks/useAudio';
import { useAlarmScheduler } from '../src/hooks/useAlarmScheduler';
import { PhotoSlideshow } from '../src/components/firing/PhotoSlideshow';
import { AlarmControls } from '../src/components/firing/AlarmControls';
import { scheduleAlarmNotifications, cancelAlarmNotifications } from '../src/utils/notifications';

export default function AlarmFiringScreen() {
  const { alarmId } = useLocalSearchParams<{ alarmId: string }>();
  const router = useRouter();
  const { alarms, updateAlarm } = useAlarmStore();
  const { photos } = useInspirationStore();
  const { settings } = useSettingsStore();
  const { playAlarm, stopAlarm } = useAudio();
  const { disableAlarm } = useAlarmScheduler();

  const alarm = alarms.find((a) => a.id === alarmId);

  useEffect(() => {
    if (!alarm) return;

    // Play alarm sound
    playAlarm(alarm.sound);

    // Vibration pattern
    if (alarm.vibrate) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }

    // Prevent Android back button from dismissing without explicit action
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);

    return () => {
      stopAlarm();
      backHandler.remove();
    };
  }, [alarm?.id]);

  const handleDismiss = useCallback(async () => {
    if (!alarm) return;

    await stopAlarm();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // If one-time alarm, disable it
    if (alarm.days.length === 0) {
      await disableAlarm(alarm);
    }

    router.replace('/(tabs)');
  }, [alarm, stopAlarm, disableAlarm]);

  const handleSnooze = useCallback(async () => {
    if (!alarm) return;

    await stopAlarm();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Cancel current notification if any
    if (alarm.notificationIds.length > 0) {
      await cancelAlarmNotifications(alarm.notificationIds);
    }

    // Schedule snooze notification
    const snoozeDate = new Date(Date.now() + alarm.snoozeDuration * 60 * 1000);
    const [, m] = [
      snoozeDate.getHours(),
      snoozeDate.getMinutes(),
    ];

    // Create a temporary snooze alarm
    const snoozeAlarm = {
      ...alarm,
      time: `${snoozeDate.getHours().toString().padStart(2, '0')}:${snoozeDate
        .getMinutes()
        .toString()
        .padStart(2, '0')}`,
      days: [], // one-time
    };

    const notifIds = await scheduleAlarmNotifications(snoozeAlarm);
    await updateAlarm(alarm.id, { notificationIds: notifIds });

    router.replace('/(tabs)');
  }, [alarm, stopAlarm, updateAlarm]);

  if (!alarm) {
    // Fallback: no alarm data found, just go back
    router.replace('/(tabs)');
    return null;
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <PhotoSlideshow
        photos={photos}
        intervalSeconds={settings.slideshowInterval}
      />
      <AlarmControls
        alarm={alarm}
        onDismiss={handleDismiss}
        onSnooze={handleSnooze}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0F',
  },
});
