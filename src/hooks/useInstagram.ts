import { useState, useCallback } from 'react';
import { useInspirationStore } from '../store/inspirationStore';
import { useSettingsStore } from '../store/settingsStore';
import { fetchInstagramPhotos, downloadInstagramPhotos } from '../utils/instagram';
import { InstagramAccount } from '../types';

export function useInstagram() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addPhotos, addAccount, updateAccount } = useInspirationStore();
  const { settings } = useSettingsStore();

  const fetchPhotos = useCallback(
    async (username: string) => {
      setLoading(true);
      setError(null);

      try {
        const cleanUsername = username.replace('@', '').trim().toLowerCase();
        const photos = await fetchInstagramPhotos(
          cleanUsername,
          settings.instagramProxyUrl
        );

        if (photos.length === 0) {
          setError('No photos found. Make sure the account is public.');
          return false;
        }

        const saved = await downloadInstagramPhotos(photos, cleanUsername);

        const account: InstagramAccount = {
          username: cleanUsername,
          lastFetched: Date.now(),
          photoCount: saved.length,
        };

        await addAccount(account);
        await addPhotos(saved);
        return true;
      } catch (e: any) {
        setError(e.message || 'Failed to fetch Instagram photos');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [settings.instagramProxyUrl, addPhotos, addAccount]
  );

  const refreshAccount = useCallback(
    async (username: string) => {
      await fetchPhotos(username);
      await updateAccount(username, { lastFetched: Date.now() });
    },
    [fetchPhotos, updateAccount]
  );

  return { fetchPhotos, refreshAccount, loading, error };
}
