import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';
import { colors } from '../../theme';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const STAR_COUNT = 30;

interface Star {
  x: number;
  y: number;
  size: number;
  // base opacity so dim stars don't pulse as brightly
  baseOpacity: number;
  // twinkle duration in ms
  duration: number;
}

function generateStars(): Star[] {
  const stars: Star[] = [];
  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
      x: Math.random() * SCREEN_W,
      y: Math.random() * SCREEN_H,
      size: Math.random() * 2.5 + 0.8,
      baseOpacity: Math.random() * 0.5 + 0.15,
      duration: Math.random() * 2000 + 1500,
    });
  }
  return stars;
}

interface StarBackgroundProps {
  children?: React.ReactNode;
}

export function StarBackground({ children }: StarBackgroundProps) {
  // Positions are stable — generated once, never change
  const starsRef = useRef<Star[]>(generateStars());
  const anims = useRef<Animated.Value[]>(
    starsRef.current.map((s) => new Animated.Value(s.baseOpacity))
  ).current;

  useEffect(() => {
    const animations = starsRef.current.map((star, i) => {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(anims[i], {
            toValue: star.baseOpacity + 0.45,
            duration: star.duration,
            useNativeDriver: true,
          }),
          Animated.timing(anims[i], {
            toValue: star.baseOpacity,
            duration: star.duration,
            useNativeDriver: true,
          }),
        ])
      );
      // Stagger start so stars don't pulse in sync
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          loop.start();
          resolve();
        }, (i * 120) % 3000);
      });
    });

    // Kick off staggered starts
    animations.forEach((p) => p);

    return () => {
      anims.forEach((a) => a.stopAnimation());
    };
  }, [anims]);

  return (
    <View style={styles.container}>
      {starsRef.current.map((star, i) => (
        <Animated.View
          key={i}
          style={[
            styles.star,
            {
              left: star.x,
              top: star.y,
              width: star.size,
              height: star.size,
              borderRadius: star.size / 2,
              opacity: anims[i],
            },
          ]}
        />
      ))}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  star: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
  },
});
