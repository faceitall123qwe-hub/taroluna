import React, { useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { colors, spacing, borderRadius, typography } from '../../theme';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
}

const HEIGHT: Record<Size, number> = { sm: 48, md: 56, lg: 64 };

const HORIZONTAL_PADDING: Record<Size, number> = {
  sm: spacing.md,
  md: spacing.lg,
  lg: spacing.xl,
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
}: ButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 40,
      bounciness: 0,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
      bounciness: 4,
    }).start();
  };

  const isDisabled = disabled || loading;

  return (
    <TouchableWithoutFeedback
      onPress={isDisabled ? undefined : onPress}
      onPressIn={isDisabled ? undefined : handlePressIn}
      onPressOut={isDisabled ? undefined : handlePressOut}
      accessible
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      accessibilityLabel={title}
    >
      <Animated.View
        style={[
          styles.base,
          variantStyle[variant],
          { height: HEIGHT[size], paddingHorizontal: HORIZONTAL_PADDING[size] },
          isDisabled && styles.disabled,
          { transform: [{ scale }] },
        ]}
      >
        {variant === 'primary' && !isDisabled && (
          <View style={[StyleSheet.absoluteFill, styles.goldGradientSim, { borderRadius: borderRadius.md }]} />
        )}
        {loading ? (
          <ActivityIndicator
            color={variant === 'primary' ? colors.text.inverse : colors.accent.goldLight}
            size="small"
          />
        ) : (
          <Text
            style={[
              size === 'sm' ? styles.textSm : styles.text,
              textColor[variant],
              isDisabled && styles.textDisabled,
            ]}
          >
            {title}
          </Text>
        )}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  // Primary: filled gold — simulated gradient via layered Views
  primary: {
    backgroundColor: colors.accent.gold,
    borderWidth: 0,
  },
  // Layered lighter tone on top half for gradient feel
  goldGradientSim: {
    backgroundColor: 'transparent',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 245, 200, 0.25)',
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.accent.gold,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  disabled: {
    opacity: 0.45,
  },
  text: {
    ...typography.button,
  },
  textSm: {
    ...typography.buttonSm,
  },
  textDisabled: {
    opacity: 0.7,
  },
});

const variantStyle: Record<Variant, object> = {
  primary: styles.primary,
  secondary: styles.secondary,
  ghost: styles.ghost,
};

const textColor: Record<Variant, object> = StyleSheet.create({
  primary: { color: colors.text.inverse },
  secondary: { color: colors.accent.goldLight },
  ghost: { color: colors.text.secondary },
});
