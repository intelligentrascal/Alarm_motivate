export interface Alarm {
  id: string;
  time: string; // "HH:MM" 24h
  label: string;
  enabled: boolean;
  days: number[]; // 0=Sun..6=Sat, empty = one-time
  sound: 'alarm' | 'gentle' | 'silent';
  snoozeDuration: number; // minutes
  vibrate: boolean;
  notificationIds: string[];
  createdAt: number;
}

export interface InspirationPhoto {
  id: string;
  localUri: string; // expo-file-system permanent path
  thumbnailUri: string;
  source: 'gallery' | 'instagram';
  instagramUsername?: string;
  addedAt: number;
}

export interface InstagramAccount {
  username: string;
  lastFetched: number;
  photoCount: number;
}

export interface AppSettings {
  defaultSnoozeDuration: number; // minutes
  slideshowInterval: number; // seconds
  notificationsGranted: boolean;
  onboardingComplete: boolean;
  instagramProxyUrl: string;
}

export type SoundOption = 'alarm' | 'gentle' | 'silent';
export type TabRoute = 'index' | 'alarms' | 'inspiration' | 'settings';
