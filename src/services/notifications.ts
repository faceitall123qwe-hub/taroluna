import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { supabase } from './supabase';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const NOTIFICATION_ID = 'daily-card-of-day';

const notificationContent: Record<string, { title: string; body: string }> = {
  en: {
    title: 'Your card of the day is ready ✨',
    body: 'Tap to reveal your guidance for today',
  },
  ru: {
    title: 'Ваша карта дня готова ✨',
    body: 'Нажмите, чтобы узнать своё послание на сегодня',
  },
  pl: {
    title: 'Twoja karta dnia jest gotowa ✨',
    body: 'Dotknij, aby odkryć swoje wskazówki na dziś',
  },
};

export async function registerForPushNotifications(): Promise<string | null> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;

  if (existing !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return null;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('daily-card', {
      name: 'Daily Card of the Day',
      importance: Notifications.AndroidImportance.DEFAULT,
      sound: null,
    });
  }

  try {
    const token = await Notifications.getExpoPushTokenAsync();
    return token.data;
  } catch {
    // Fails on simulators — expected
    return null;
  }
}

export async function scheduleDailyCardNotification(language: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(NOTIFICATION_ID).catch(() => {});

  const lang = language in notificationContent ? language : 'en';
  const { title, body } = notificationContent[lang];

  await Notifications.scheduleNotificationAsync({
    identifier: NOTIFICATION_ID,
    content: { title, body, data: { screen: '/(tabs)' } },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 9,
      minute: 0,
    },
  });
}

export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function savePushToken(userId: string, token: string): Promise<void> {
  await supabase
    .from('profiles')
    .update({ push_token: token } as never)
    .eq('id', userId);
}
