import * as FileSystem from 'expo-file-system/legacy';
import { InspirationPhoto } from '../types';
import { generateId } from './alarmUtils';

export interface InstagramPhoto {
  url: string;
  thumbnail: string;
}

export async function fetchInstagramPhotos(
  username: string,
  proxyUrl: string
): Promise<InstagramPhoto[]> {
  const url = `${proxyUrl}?u=${encodeURIComponent(username)}`;
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Instagram photos: ${response.status}`);
  }

  const data = await response.json();
  return data.photos as InstagramPhoto[];
}

export async function downloadInstagramPhotos(
  photos: InstagramPhoto[],
  username: string
): Promise<InspirationPhoto[]> {
  const dir = `${FileSystem.documentDirectory}inspiration/instagram/${username}/`;
  await FileSystem.makeDirectoryAsync(dir, { intermediates: true });

  const results: InspirationPhoto[] = [];

  for (const photo of photos.slice(0, 20)) {
    try {
      const id = generateId();
      const filename = `${id}.jpg`;
      const localPath = `${dir}${filename}`;
      const thumbPath = `${dir}thumb_${filename}`;

      const { uri } = await FileSystem.downloadAsync(photo.url, localPath);

      // Use thumbnail URL if different, else same
      let thumbUri = uri;
      if (photo.thumbnail && photo.thumbnail !== photo.url) {
        const { uri: tUri } = await FileSystem.downloadAsync(photo.thumbnail, thumbPath);
        thumbUri = tUri;
      }

      results.push({
        id,
        localUri: uri,
        thumbnailUri: thumbUri,
        source: 'instagram',
        instagramUsername: username,
        addedAt: Date.now(),
      });
    } catch {
      // Skip failed downloads
    }
  }

  return results;
}

export async function saveGalleryPhoto(uri: string): Promise<InspirationPhoto> {
  const id = generateId();
  const dir = `${FileSystem.documentDirectory}inspiration/gallery/`;
  await FileSystem.makeDirectoryAsync(dir, { intermediates: true });

  const ext = uri.split('.').pop()?.split('?')[0] || 'jpg';
  const localPath = `${dir}${id}.${ext}`;
  await FileSystem.copyAsync({ from: uri, to: localPath });

  return {
    id,
    localUri: localPath,
    thumbnailUri: localPath,
    source: 'gallery',
    addedAt: Date.now(),
  };
}
