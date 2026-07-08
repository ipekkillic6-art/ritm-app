/**
 * Hedef hatırlatıcıları — expo-notifications ile haftalık yerel bildirim.
 *
 * NOT: expo-notifications YALNIZ iOS/Android'de çalışır (web'de değil). Tüm
 * çağrılar Platform ile korunur; web'de sessizce no-op döner. Cihazda (Expo Go
 * veya derleme) planlı günlerde seçilen saatte bildirim düşer.
 *
 * Haftalık tetikleyici weekday: 1=Pazar … 7=Cumartesi. Bizim goalDays getDay()
 * indeksidir (0=Pazar … 6=Cumartesi) → weekday = getDay() + 1.
 */
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

const isWeb = Platform.OS === 'web';
let handlerSet = false;

/** Bildirim davranışını ayarla (uygulama açıkken de banner göster). */
export function initNotifications() {
  if (isWeb || handlerSet) return;
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
  handlerSet = true;
}

/** İzin iste/kontrol et. */
export async function ensurePermission() {
  if (isWeb) return false;
  const { status } = await Notifications.getPermissionsAsync();
  if (status === 'granted') return true;
  const req = await Notifications.requestPermissionsAsync();
  return req.status === 'granted';
}

/** Bir alışkanlığın planlı günleri için haftalık hatırlatıcılar kur. Bildirim id'lerini döndürür. */
export async function scheduleGoalReminders(habit) {
  if (isWeb || !habit.reminder?.enabled || !habit.goalDays?.length) return [];
  initNotifications();
  const ok = await ensurePermission();
  if (!ok) return [];

  const [hour, minute] = habit.reminder.time.split(':').map(Number);
  const perDay = Math.round(habit.goal / habit.goalDays.length);
  const ids = [];
  for (const day of habit.goalDays) {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: `${habit.name} zamanı`,
        body: `Bugünkü hedef: ${perDay} ${habit.unit || ''}`.trim(),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday: (day % 7) + 1, // getDay() 0=Paz → weekday 1
        hour,
        minute,
      },
    });
    ids.push(id);
  }
  return ids;
}

/** Verilen id'lere sahip planlı bildirimleri iptal et. */
export async function cancelReminders(ids = []) {
  if (isWeb) return;
  for (const id of ids) {
    try {
      await Notifications.cancelScheduledNotificationAsync(id);
    } catch {
      // yoksay
    }
  }
}
