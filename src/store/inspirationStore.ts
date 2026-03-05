import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { InspirationPhoto, InstagramAccount } from '../types';

interface InspirationStore {
  photos: InspirationPhoto[];
  accounts: InstagramAccount[];
  loaded: boolean;
  loadPhotos: () => Promise<void>;
  addPhoto: (photo: InspirationPhoto) => Promise<void>;
  addPhotos: (photos: InspirationPhoto[]) => Promise<void>;
  deletePhoto: (id: string) => Promise<void>;
  addAccount: (account: InstagramAccount) => Promise<void>;
  updateAccount: (username: string, updates: Partial<InstagramAccount>) => Promise<void>;
  removeAccount: (username: string) => Promise<void>;
}

const PHOTOS_KEY = '@motivalarm:photos';
const ACCOUNTS_KEY = '@motivalarm:instagram_accounts';

export const useInspirationStore = create<InspirationStore>((set, get) => ({
  photos: [],
  accounts: [],
  loaded: false,

  loadPhotos: async () => {
    try {
      const [rawPhotos, rawAccounts] = await Promise.all([
        AsyncStorage.getItem(PHOTOS_KEY),
        AsyncStorage.getItem(ACCOUNTS_KEY),
      ]);
      set({
        photos: rawPhotos ? JSON.parse(rawPhotos) : [],
        accounts: rawAccounts ? JSON.parse(rawAccounts) : [],
        loaded: true,
      });
    } catch {
      set({ loaded: true });
    }
  },

  addPhoto: async (photo) => {
    const photos = [...get().photos, photo];
    set({ photos });
    await AsyncStorage.setItem(PHOTOS_KEY, JSON.stringify(photos));
  },

  addPhotos: async (newPhotos) => {
    const photos = [...get().photos, ...newPhotos];
    set({ photos });
    await AsyncStorage.setItem(PHOTOS_KEY, JSON.stringify(photos));
  },

  deletePhoto: async (id) => {
    const photos = get().photos.filter((p) => p.id !== id);
    set({ photos });
    await AsyncStorage.setItem(PHOTOS_KEY, JSON.stringify(photos));
  },

  addAccount: async (account) => {
    const accounts = [...get().accounts.filter((a) => a.username !== account.username), account];
    set({ accounts });
    await AsyncStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  },

  updateAccount: async (username, updates) => {
    const accounts = get().accounts.map((a) =>
      a.username === username ? { ...a, ...updates } : a
    );
    set({ accounts });
    await AsyncStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  },

  removeAccount: async (username) => {
    const accounts = get().accounts.filter((a) => a.username !== username);
    const photos = get().photos.filter((p) => p.instagramUsername !== username);
    set({ accounts, photos });
    await Promise.all([
      AsyncStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts)),
      AsyncStorage.setItem(PHOTOS_KEY, JSON.stringify(photos)),
    ]);
  },
}));
