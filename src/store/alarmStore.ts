import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alarm } from '../types';

interface AlarmStore {
  alarms: Alarm[];
  activeAlarmId: string | null;
  loaded: boolean;
  loadAlarms: () => Promise<void>;
  addAlarm: (alarm: Alarm) => Promise<void>;
  updateAlarm: (id: string, updates: Partial<Alarm>) => Promise<void>;
  deleteAlarm: (id: string) => Promise<void>;
  setActiveAlarm: (id: string | null) => void;
}

const STORAGE_KEY = '@motivalarm:alarms';

export const useAlarmStore = create<AlarmStore>((set, get) => ({
  alarms: [],
  activeAlarmId: null,
  loaded: false,

  loadAlarms: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const alarms: Alarm[] = raw ? JSON.parse(raw) : [];
      set({ alarms, loaded: true });
    } catch {
      set({ loaded: true });
    }
  },

  addAlarm: async (alarm) => {
    const alarms = [...get().alarms, alarm];
    set({ alarms });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(alarms));
  },

  updateAlarm: async (id, updates) => {
    const alarms = get().alarms.map((a) =>
      a.id === id ? { ...a, ...updates } : a
    );
    set({ alarms });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(alarms));
  },

  deleteAlarm: async (id) => {
    const alarms = get().alarms.filter((a) => a.id !== id);
    set({ alarms });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(alarms));
  },

  setActiveAlarm: (id) => set({ activeAlarmId: id }),
}));
