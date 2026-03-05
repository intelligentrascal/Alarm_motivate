import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, Animated, StyleSheet, View } from 'react-native';
import * as Haptics from 'expo-haptics';

interface ToggleProps {
  value: boolean;
  onValueChange: (val: boolean) => void;
  size?: 'sm' | 'md';
}

export function Toggle({ value, onValueChange, size = 'md' }: ToggleProps) {
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;
  const isSmall = size === 'sm';

  const trackW = isSmall ? 40 : 51;
  const trackH = isSmall ? 22 : 28;
  const thumbSize = isSmall ? 16 : 22;
  const thumbTravel = trackW - thumbSize - (isSmall ? 5 : 6);

  useEffect(() => {
    Animated.spring(anim, {
      toValue: value ? 1 : 0,
      useNativeDriver: true,
      overshootClamping: true,
    }).start();
  }, [value]);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onValueChange(!value);
  };

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [isSmall ? 3 : 3, thumbTravel],
  });

  const trackBg = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#2D2D4E', '#7C3AED'],
  });

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
      <Animated.View
        style={[
          styles.track,
          { width: trackW, height: trackH, borderRadius: trackH / 2, backgroundColor: trackBg },
        ]}
      >
        <Animated.View
          style={[
            styles.thumb,
            {
              width: thumbSize,
              height: thumbSize,
              borderRadius: thumbSize / 2,
              transform: [{ translateX }],
            },
          ]}
        />
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  track: {
    justifyContent: 'center',
  },
  thumb: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
});
