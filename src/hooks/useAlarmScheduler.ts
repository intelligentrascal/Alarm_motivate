import { useCallback } from 'react';
import { Alarm } from '../types';
import { useAlarmStore } from '../store/alarmStore';
import {
  scheduleAlarmNotifications,
  cancelAlarmNotifications,
} from '../utils/notifications';

export function useAlarmScheduler() {
  const { updateAlarm } = useAlarmStore();

  const enableAlarm = useCallback(
    async (alarm: Alarm) => {
      // Cancel any existing notifications first
      if (alarm.notificationIds.length > 0) {
        await cancelAlarmNotifications(alarm.notificationIds);
      }
      const notificationIds = await scheduleAlarmNotifications(alarm);
      await updateAlarm(alarm.id, { enabled: true, notificationIds });
    },
    [updateAlarm]
  );

  const disableAlarm = useCallback(
    async (alarm: Alarm) => {
      if (alarm.notificationIds.length > 0) {
        await cancelAlarmNotifications(alarm.notificationIds);
      }
      await updateAlarm(alarm.id, { enabled: false, notificationIds: [] });
    },
    [updateAlarm]
  );

  const toggleAlarm = useCallback(
    async (alarm: Alarm) => {
      if (alarm.enabled) {
        await disableAlarm(alarm);
      } else {
        await enableAlarm(alarm);
      }
    },
    [enableAlarm, disableAlarm]
  );

  const rescheduleAlarm = useCallback(
    async (alarm: Alarm) => {
      if (alarm.enabled) {
        await enableAlarm(alarm);
      }
    },
    [enableAlarm]
  );

  const removeAlarm = useCallback(
    async (alarm: Alarm) => {
      if (alarm.notificationIds.length > 0) {
        await cancelAlarmNotifications(alarm.notificationIds);
      }
    },
    []
  );

  return { enableAlarm, disableAlarm, toggleAlarm, rescheduleAlarm, removeAlarm };
}
