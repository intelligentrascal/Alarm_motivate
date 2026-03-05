import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Image,
  Animated,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { InspirationPhoto } from '../../types';
import { shuffleArray } from '../../utils/alarmUtils';

interface PhotoSlideshowProps {
  photos: InspirationPhoto[];
  intervalSeconds?: number;
}

const { width, height } = Dimensions.get('window');

export function PhotoSlideshow({ photos, intervalSeconds = 6 }: PhotoSlideshowProps) {
  const shuffled = useRef(shuffleArray(photos));
  const [currentIdx, setCurrentIdx] = useState(0);
  const [nextIdx, setNextIdx] = useState(1 % Math.max(photos.length, 1));

  const currentOpacity = useRef(new Animated.Value(1)).current;
  const nextOpacity = useRef(new Animated.Value(0)).current;
  const kenBurnsScale = useRef(new Animated.Value(1)).current;
  const kenBurnsX = useRef(new Animated.Value(0)).current;

  const startKenBurns = () => {
    const randX = (Math.random() - 0.5) * 20;
    kenBurnsScale.setValue(1);
    kenBurnsX.setValue(0);

    Animated.parallel([
      Animated.timing(kenBurnsScale, {
        toValue: 1.12,
        duration: intervalSeconds * 1000,
        useNativeDriver: true,
      }),
      Animated.timing(kenBurnsX, {
        toValue: randX,
        duration: intervalSeconds * 1000,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const crossfade = () => {
    const n = shuffled.current.length;
    if (n === 0) return;

    Animated.sequence([
      Animated.timing(nextOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(currentOpacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentIdx((prev) => {
        const newCurrent = (prev + 1) % n;
        setNextIdx((newCurrent + 1) % n);
        currentOpacity.setValue(1);
        nextOpacity.setValue(0);
        startKenBurns();
        return newCurrent;
      });
    });
  };

  useEffect(() => {
    if (photos.length === 0) return;
    shuffled.current = shuffleArray(photos);
    startKenBurns();
    const timer = setInterval(crossfade, intervalSeconds * 1000);
    return () => clearInterval(timer);
  }, [photos, intervalSeconds]);

  if (photos.length === 0) {
    return (
      <LinearGradient
        colors={['#0A0A0F', '#1A0A2E', '#2D1A4E']}
        style={StyleSheet.absoluteFill}
      />
    );
  }

  const currentPhoto = shuffled.current[currentIdx];
  const nextPhoto = shuffled.current[nextIdx];

  return (
    <View style={StyleSheet.absoluteFill}>
      {/* Current photo with Ken Burns */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            opacity: currentOpacity,
            transform: [
              { scale: kenBurnsScale },
              { translateX: kenBurnsX },
            ],
          },
        ]}
      >
        {currentPhoto && (
          <Image
            source={{ uri: currentPhoto.localUri }}
            style={styles.photo}
            resizeMode="cover"
          />
        )}
      </Animated.View>

      {/* Next photo fading in */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { opacity: nextOpacity },
        ]}
      >
        {nextPhoto && (
          <Image
            source={{ uri: nextPhoto.localUri }}
            style={styles.photo}
            resizeMode="cover"
          />
        )}
      </Animated.View>

      {/* Dark overlay for readability */}
      <LinearGradient
        colors={['transparent', 'transparent', 'rgba(0,0,0,0.8)']}
        style={styles.overlay}
        locations={[0, 0.4, 1]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  photo: {
    width,
    height,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
});
