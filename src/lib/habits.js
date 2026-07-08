/** Alışkanlık yardımcıları. (ritm-desing'de bunlar store/habits içindeydi;
 *  ritm'de onboarding + home için store gerekmediğinden sade tutuldu.) */
import { todayKey } from './date';

/** Bugün tamamlandı mı? */
export function isDoneToday(h) {
  return h.completedDates.includes(todayKey());
}

/** Sıklık etiketleri. */
export const FREQ_LABEL = {
  daily: 'Her gün',
  weekdays: 'Hafta içi',
  custom: 'Özel',
};

/** Basit benzersiz kimlik. */
export function uid() {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

/** Form verisinden yeni bir alışkanlık nesnesi kurar. */
export function makeHabit({ name, icon, color, freq, note, goal, unit, goalDays, reminder }) {
  return {
    id: uid(),
    name,
    icon,
    color,
    freq,
    note: note || undefined,
    // Haftalık hedef (isteğe bağlı)
    goal: goal || undefined,
    unit: goal ? unit || 'birim' : undefined,
    goalDays: goal ? goalDays : undefined,
    // Hedef hatırlatıcısı (isteğe bağlı) — { enabled, time }
    reminder: goal && reminder?.enabled ? reminder : undefined,
    createdAt: todayKey(),
    completedDates: [],
  };
}
