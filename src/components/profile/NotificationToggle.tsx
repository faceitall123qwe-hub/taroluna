import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { useNotifications } from '../../hooks/useNotifications';
import { colors, spacing } from '../../theme';
import { typography } from '../../theme';

export function NotificationToggle() {
  const { isEnabled, toggle } = useNotifications();

  return (
    <View style={styles.row}>
      <Text style={styles.icon}>🔔</Text>
      <Text style={styles.label}>Daily card reminder</Text>
      <Switch
        value={isEnabled}
        onValueChange={toggle}
        trackColor={{ false: colors.border.subtle, true: colors.accent.gold }}
        thumbColor={isEnabled ? colors.accent.goldLight : colors.text.muted}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  icon: {
    fontSize: 20,
  },
  label: {
    ...typography.body,
    color: colors.text.primary,
    flex: 1,
  },
});
