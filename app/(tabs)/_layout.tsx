import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { colors, typography } from '../../src/theme';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

function tabIcon(focused: boolean, name: IoniconsName, outlineName: IoniconsName) {
  return (
    <Ionicons
      name={focused ? name : outlineName}
      size={24}
      color={focused ? colors.accent.gold : colors.text.muted}
    />
  );
}

export default function TabsLayout() {
  const { t } = useTranslation();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background.secondary,
          borderTopColor: colors.border.subtle,
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: colors.accent.gold,
        tabBarInactiveTintColor: colors.text.muted,
        tabBarLabelStyle: {
          ...typography.caption,
          letterSpacing: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('nav.home', 'Home'),
          tabBarIcon: ({ focused }) => tabIcon(focused, 'home', 'home-outline'),
        }}
      />
      <Tabs.Screen
        name="spread"
        options={{
          title: t('nav.spread', 'Spread'),
          tabBarIcon: ({ focused }) => tabIcon(focused, 'layers', 'layers-outline'),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: t('nav.history', 'History'),
          tabBarIcon: ({ focused }) => tabIcon(focused, 'time', 'time-outline'),
        }}
      />
      <Tabs.Screen
        name="cards"
        options={{
          title: 'Cards',
          tabBarIcon: ({ focused }) => tabIcon(focused, 'albums', 'albums-outline'),
        }}
      />
      <Tabs.Screen
        name="zodiac"
        options={{
          title: 'Zodiac',
          tabBarIcon: ({ focused }) => tabIcon(focused, 'star', 'star-outline'),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('nav.profile', 'Profile'),
          tabBarIcon: ({ focused }) => tabIcon(focused, 'person', 'person-outline'),
        }}
      />
    </Tabs>
  );
}
