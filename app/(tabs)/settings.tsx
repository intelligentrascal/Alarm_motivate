import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSettingsStore } from '../../src/store/settingsStore';
import { Toggle } from '../../src/components/ui/Toggle';
import { requestNotificationPermissions } from '../../src/utils/notifications';

const SNOOZE_OPTIONS = [5, 10, 15, 20];
const SLIDESHOW_OPTIONS = [4, 6, 8, 12];

function SettingRow({
  icon,
  label,
  value,
  onPress,
  right,
}: {
  icon: string;
  label: string;
  value?: string;
  onPress?: () => void;
  right?: React.ReactNode;
}) {
  return (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.rowLeft}>
        <Text style={styles.rowIcon}>{icon}</Text>
        <View>
          <Text style={styles.rowLabel}>{label}</Text>
          {value && <Text style={styles.rowValue}>{value}</Text>}
        </View>
      </View>
      {right ?? (onPress && <Ionicons name="chevron-forward" size={16} color="#475569" />)}
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const { settings, updateSettings } = useSettingsStore();

  const handleRequestNotifications = async () => {
    const granted = await requestNotificationPermissions();
    await updateSettings({ notificationsGranted: granted });
    if (granted) {
      Alert.alert('Notifications enabled', 'Your alarms will ring even when the app is closed.');
    } else {
      Alert.alert(
        'Permission denied',
        'Please enable notifications in Settings > MotivAlarm.',
        [
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Text style={styles.title}>Settings</Text>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Notifications */}
        <Text style={styles.sectionLabel}>NOTIFICATIONS</Text>
        <View style={styles.card}>
          <SettingRow
            icon="🔔"
            label="Allow Notifications"
            value={settings.notificationsGranted ? 'Enabled' : 'Tap to enable'}
            right={
              <Toggle
                value={settings.notificationsGranted}
                onValueChange={handleRequestNotifications}
                size="sm"
              />
            }
          />
        </View>

        {!settings.notificationsGranted && (
          <Text style={styles.hint}>
            Enable notifications so your alarms fire even when the app is closed.
            {Platform.OS === 'ios' ? ' Required on iOS.' : ''}
          </Text>
        )}

        {/* Alarm defaults */}
        <Text style={styles.sectionLabel}>ALARM DEFAULTS</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Text style={styles.rowIcon}>💤</Text>
              <Text style={styles.rowLabel}>Snooze duration</Text>
            </View>
            <View style={styles.optionRow}>
              {SNOOZE_OPTIONS.map((n) => (
                <TouchableOpacity
                  key={n}
                  style={[
                    styles.optionPill,
                    settings.defaultSnoozeDuration === n && styles.optionPillActive,
                  ]}
                  onPress={() => updateSettings({ defaultSnoozeDuration: n })}
                >
                  <Text
                    style={[
                      styles.optionText,
                      settings.defaultSnoozeDuration === n && styles.optionTextActive,
                    ]}
                  >
                    {n}m
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={[styles.row, styles.rowBorder]}>
            <View style={styles.rowLeft}>
              <Text style={styles.rowIcon}>🖼️</Text>
              <Text style={styles.rowLabel}>Slideshow speed</Text>
            </View>
            <View style={styles.optionRow}>
              {SLIDESHOW_OPTIONS.map((n) => (
                <TouchableOpacity
                  key={n}
                  style={[
                    styles.optionPill,
                    settings.slideshowInterval === n && styles.optionPillActive,
                  ]}
                  onPress={() => updateSettings({ slideshowInterval: n })}
                >
                  <Text
                    style={[
                      styles.optionText,
                      settings.slideshowInterval === n && styles.optionTextActive,
                    ]}
                  >
                    {n}s
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Instagram proxy */}
        <Text style={styles.sectionLabel}>INSTAGRAM</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Text style={styles.rowIcon}>🔗</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowLabel}>Proxy URL</Text>
                <Text style={styles.rowValueSmall} numberOfLines={1}>
                  {settings.instagramProxyUrl}
                </Text>
              </View>
            </View>
          </View>
          <Text style={[styles.hint, { marginTop: 8, marginHorizontal: 0 }]}>
            Deploy the included Cloudflare Worker to enable Instagram photo fetching.
          </Text>
        </View>

        {/* About */}
        <Text style={styles.sectionLabel}>ABOUT</Text>
        <View style={styles.card}>
          <SettingRow icon="✨" label="MotivAlarm" value="Version 1.0.0" />
          <View style={[styles.row, styles.rowBorder]}>
            <View style={styles.rowLeft}>
              <Text style={styles.rowIcon}>💡</Text>
              <Text style={styles.rowLabel}>Wake up to your vision</Text>
            </View>
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
  title: {
    color: '#F8FAFC',
    fontSize: 28,
    fontWeight: '700',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  content: {
    paddingHorizontal: 16,
  },
  sectionLabel: {
    color: '#475569',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginTop: 20,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2D2D4E',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  rowBorder: {
    borderTopWidth: 1,
    borderTopColor: '#2D2D4E',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  rowIcon: {
    fontSize: 18,
    width: 24,
    textAlign: 'center',
  },
  rowLabel: {
    color: '#F8FAFC',
    fontSize: 15,
  },
  rowValue: {
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 1,
  },
  rowValueSmall: {
    color: '#475569',
    fontSize: 11,
    marginTop: 2,
  },
  optionRow: {
    flexDirection: 'row',
    gap: 6,
  },
  optionPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#252540',
  },
  optionPillActive: {
    backgroundColor: '#7C3AED',
  },
  optionText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
  optionTextActive: {
    color: '#fff',
  },
  hint: {
    color: '#475569',
    fontSize: 12,
    marginHorizontal: 4,
    marginBottom: 8,
    lineHeight: 18,
  },
});
