import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { StarBackground } from '../../src/components/ui/StarBackground';
import { ReadingHistoryItem } from '../../src/components/reading/ReadingHistoryItem';
import { useReadings } from '../../src/hooks/useReadings';
import { colors, spacing, typography } from '../../src/theme';
import type { ReadingWithCards } from '../../src/hooks/useReadings';

export default function HistoryScreen() {
  const { t } = useTranslation();
  const { readings, isLoading, refetch } = useReadings();

  return (
    <StarBackground>
      <View style={styles.header}>
        <Text style={styles.title}>{t('history.title')}</Text>
      </View>

      {isLoading && readings.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.accent.gold} />
        </View>
      ) : (
        <FlatList<ReadingWithCards>
          data={readings}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ReadingHistoryItem reading={item} />}
          contentContainerStyle={readings.length === 0 ? styles.emptyContainer : styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refetch}
              tintColor={colors.accent.gold}
              colors={[colors.accent.gold]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>☽</Text>
              <Text style={styles.emptyTitle}>{t('history.empty')}</Text>
              <Text style={styles.emptySubtitle}>{t('history.emptySubtitle')}</Text>
            </View>
          }
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </StarBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: spacing.xxxl,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    ...typography.h2,
    color: colors.text.primary,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: spacing.xxl,
  },
  emptyContainer: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxxl,
  },
  emptyIcon: {
    fontSize: 56,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    ...typography.body,
    color: colors.text.muted,
    textAlign: 'center',
  },
  separator: {
    height: spacing.sm,
  },
});
