import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Alarm } from '../types';
import { getNextAlarmTime } from './alarmUtils';

export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
    },
  });
  return status === 'granted';
}

export async function setupNotificationChannel() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('alarms', {
      name: 'Alarms',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#7C3AED',
      sound: 'default',
      enableVibrate: true,
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      bypassDnd: true,
    });
  }
}

export function setupNotificationHandler() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

export async function scheduleAlarmNotifications(alarm: Alarm): Promise<string[]> {
  const ids: string[] = [];

  if (alarm.days.length === 0) {
    // One-time alarm
    const trigger = getNextAlarmTime(alarm);
    if (!trigger) return ids;

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: alarm.label || '⏰ Wake Up!',
        body: 'Your alarm is ringing. View your inspiration.',
        data: { type: 'alarm', alarmId: alarm.id },
        sound: alarm.sound !== 'silent' ? 'default' : undefined,
        vibrate: alarm.vibrate ? [0, 500, 200, 500] : undefined,
        priority: 'max' as any,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: trigger,
        channelId: 'alarms',
      },
    });
    ids.push(id);
  } else {
    // Recurring alarm — schedule for each day of the week
    const [h, m] = alarm.time.split(':').map(Number);
    for (const day of alarm.days) {
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: alarm.label || '⏰ Wake Up!',
          body: 'Your alarm is ringing. View your inspiration.',
          data: { type: 'alarm', alarmId: alarm.id },
          sound: alarm.sound !== 'silent' ? 'default' : undefined,
          vibrate: alarm.vibrate ? [0, 500, 200, 500] : undefined,
          priority: 'max' as any,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
          weekday: day + 1, // expo-notifications uses 1=Sun..7=Sat
          hour: h,
          minute: m,
          channelId: 'alarms',
        },
      });
      ids.push(id);
    }
  }

  return ids;
}

export async function cancelAlarmNotifications(notificationIds: string[]) {
  await Promise.all(notificationIds.map((id) => Notifications.cancelScheduledNotificationAsync(id)));
}
