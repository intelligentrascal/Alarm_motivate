import { useRef, useCallback } from 'react';
import { Audio } from 'expo-av';
import { SoundOption } from '../types';

const SOUND_ASSETS: Record<SoundOption, any> = {
  alarm: require('../../assets/sounds/alarm.mp3'),
  gentle: require('../../assets/sounds/gentle.mp3'),
  silent: null,
};

export function useAudio() {
  const soundRef = useRef<Audio.Sound | null>(null);

  const playAlarm = useCallback(async (soundOption: SoundOption) => {
    if (soundOption === 'silent') return;

    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: false,
      });

      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }

      const asset = SOUND_ASSETS[soundOption];
      if (!asset) return;

      const { sound } = await Audio.Sound.createAsync(asset, {
        shouldPlay: true,
        isLooping: true,
        volume: 1.0,
      });
      soundRef.current = sound;
    } catch (e) {
      console.warn('Audio error:', e);
    }
  }, []);

  const stopAlarm = useCallback(async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
    } catch (e) {
      console.warn('Stop audio error:', e);
    }
  }, []);

  return { playAlarm, stopAlarm };
}
