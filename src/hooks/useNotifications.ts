import { useEffect, useState, useCallback } from 'react';
import * as Notifications from 'expo-notifications';
import { useStore } from '../store/useStore';
import {
  registerForPushNotifications,
  scheduleDailyCardNotification,
  cancelAllNotifications,
  savePushToken,
} from '../services/notifications';
import { supabase } from '../services/supabase';

export function useNotifications() {
  const user = useStore((s) => s.user);
  const language = useStore((s) => s.language);
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    async function init() {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        const { status: newStatus } = await Notifications.requestPermissionsAsync();
        if (newStatus !== 'granted') {
          setIsEnabled(false);
          return;
        }
      }
      await scheduleDailyCardNotification(language).catch(() => {});
      const token = await registerForPushNotifications().catch(() => null);
      if (token && user) {
        savePushToken(user.id, token).catch(() => {});
      }
    }
    init();
  }, [language]);

  const toggle = useCallback(async (enabled: boolean) => {
    setIsEnabled(enabled);
    if (enabled) {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        setIsEnabled(false);
        return;
      }
      await scheduleDailyCardNotification(language).catch(() => {});
      const token = await registerForPushNotifications().catch(() => null);
      if (user) {
        if (token) savePushToken(user.id, token).catch(() => {});
        supabase.from('profiles').update({ notifications_enabled: true } as never).eq('id', user.id).then(() => {});
      }
    } else {
      await cancelAllNotifications().catch(() => {});
      if (user) {
        supabase.from('profiles').update({ notifications_enabled: false } as never).eq('id', user.id).then(() => {});
      }
    }
  }, [user, language]);

  return { isEnabled, toggle };
}
