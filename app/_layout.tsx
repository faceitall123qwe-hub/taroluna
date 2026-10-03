import 'react-native-url-polyfill/auto';
import 'react-native-reanimated';
import '../src/i18n';
import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Slot, useRouter } from 'expo-router';
import * as Notifications from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts,
  CormorantGaramond_300Light,
  CormorantGaramond_600SemiBold,
  CormorantGaramond_600SemiBold_Italic,
} from '@expo-google-fonts/cormorant-garamond';
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';
import { supabase } from '../src/services/supabase';
import { getUserProfile } from '../src/services/supabase';
import { initRevenueCat, identifyUser } from '../src/services/revenuecat';
import { registerForPushNotifications, scheduleDailyCardNotification, savePushToken } from '../src/services/notifications';
import { useStore } from '../src/store/useStore';
import { colors } from '../src/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const setUser = useStore((s) => s.setUser);
  const setProfile = useStore((s) => s.setProfile);
  const reset = useStore((s) => s.reset);

  const [fontsLoaded] = useFonts({
    CormorantGaramond_300Light,
    CormorantGaramond_600SemiBold,
    CormorantGaramond_600SemiBold_Italic,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });

  useEffect(() => {
    initRevenueCat().catch(() => {});

    const responseSub = Notifications.addNotificationResponseReceivedListener((response) => {
      const screen = response.notification.request.content.data?.screen;
      if (screen) router.replace(screen as any);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'PASSWORD_RECOVERY') {
          router.replace('/auth/reset-password');
          return;
        }
        if (session?.user) {
          setUser(session.user);
          let lang = 'en';
          try {
            const profile = await getUserProfile(session.user.id);
            setProfile(profile);
            lang = profile?.language ?? 'en';
          } catch {
            setProfile(null);
          }
          identifyUser(session.user.id).catch(() => {});
          registerForPushNotifications().then((token) => {
            if (!token) return;
            scheduleDailyCardNotification(lang).catch(() => {});
            savePushToken(session.user.id, token).catch(() => {});
          }).catch(() => {});
          router.replace('/(tabs)');
        } else {
          reset();
          router.replace('/auth');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
      responseSub.remove();
    };
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.accent.gold} size="large" />
      </View>
    );
  }

  SplashScreen.hideAsync();

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <Slot />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  loading: {
    flex: 1,
    backgroundColor: colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
