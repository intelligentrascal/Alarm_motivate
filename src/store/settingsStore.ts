import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppSettings } from '../types';

const DEFAULTS: AppSettings = {
  defaultSnoozeDuration: 10,
  slideshowInterval: 6,
  notificationsGranted: false,
  onboardingComplete: false,
  instagramProxyUrl: 'https://motivalarm-proxy.workers.dev',
};

interface SettingsStore {
  settings: AppSettings;
  loaded: boolean;
  loadSettings: () => Promise<void>;
  updateSettings: (updates: Partial<AppSettings>) => Promise<void>;
}

const STORAGE_KEY = '@motivalarm:settings';

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  settings: DEFAULTS,
  loaded: false,

  loadSettings: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const saved = raw ? JSON.parse(raw) : {};
      set({ settings: { ...DEFAULTS, ...saved }, loaded: true });
    } catch {
      set({ loaded: true });
    }
  },

  updateSettings: async (updates) => {
    const settings = { ...get().settings, ...updates };
    set({ settings });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  },
}));
