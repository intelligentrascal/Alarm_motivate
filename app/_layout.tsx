import '../global.css';
import React, { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAlarmStore } from '../src/store/alarmStore';
import { useInspirationStore } from '../src/store/inspirationStore';
import { useSettingsStore } from '../src/store/settingsStore';
import { setupNotificationChannel, setupNotificationHandler } from '../src/utils/notifications';

export default function RootLayout() {
  const router = useRouter();
  const { loadAlarms } = useAlarmStore();
  const { loadPhotos } = useInspirationStore();
  const { loadSettings } = useSettingsStore();

  useEffect(() => {
    // Load all persisted data
    Promise.all([loadAlarms(), loadPhotos(), loadSettings()]);

    // Setup notification infrastructure
    setupNotificationHandler();
    setupNotificationChannel();

    // Handle notification tap → open alarm firing screen
    const sub = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data as any;
      if (data?.type === 'alarm' && data?.alarmId) {
        router.push({
          pathname: '/alarm-firing',
          params: { alarmId: data.alarmId },
        });
      }
    });

    // Handle notification received while app is open
    const foregroundSub = Notifications.addNotificationReceivedListener((notification) => {
      const data = notification.request.content.data as any;
      if (data?.type === 'alarm' && data?.alarmId) {
        router.push({
          pathname: '/alarm-firing',
          params: { alarmId: data.alarmId },
        });
      }
    });

    return () => {
      sub.remove();
      foregroundSub.remove();
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#0A0A0F' }}>
      <StatusBar style="light" backgroundColor="#0A0A0F" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0A0A0F' },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="alarm-edit/[id]" />
        <Stack.Screen
          name="alarm-firing"
          options={{
            animation: 'fade',
            presentation: 'fullScreenModal',
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}
