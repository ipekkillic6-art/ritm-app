/**
 * Haftalık miktar hedefi + günlere bölüştürme (yeniden dağıtımlı).
 *
 * Bir alışkanlığa haftalık bir miktar hedefi (ör. 60 sayfa) ve haftanın planlı
 * günleri (ör. Pzt/Çar/Cum) verilir. Hedef bu günlere bölünür (60/3 = 20).
 * Planlı bir gün KAÇIRILIRSA (geçmişte ve işaretlenmemişse), o günün payı kalan
 * planlı günlere dağıtılır.
 *
 * Dağıtım yalnız `completedDates` + bugünden deterministik hesaplanır; ayrıca
 * miktar saklamaya gerek yoktur. Kronolojik simülasyon:
 *   - Her planlı gün için hedef = kalanHedef / (o günden hafta sonuna planlı gün sayısı)
 *   - Gün tamamlandıysa VEYA bugün/gelecekse: kalanHedef'ten düşülür (yapıldı/yapılacak sayılır)
 *   - Gün geçmiş ve yapılmadıysa (kaçırıldı): düşülmez → payı sonraki günlere yayılır
 */
import { addDays, dateFromKey, keyOf } from './date';

/** İçinde bulunulan haftanın Pazartesi'si (yerel, gece yarısı). */
export function startOfWeek(ref = new Date()) {
  const diff = (ref.getDay() + 6) % 7; // Pzt = 0
  const mon = addDays(ref, -diff);
  mon.setHours(0, 0, 0, 0);
  return mon;
}

/** Bu haftanın planlı günlerinin tarih anahtarları (kronolojik, Pzt→Paz). */
export function scheduledDatesThisWeek(goalDays, ref = new Date()) {
  const mon = startOfWeek(ref);
  const out = [];
  for (let i = 0; i < 7; i++) {
    const d = addDays(mon, i);
    if (goalDays.includes(d.getDay())) out.push(keyOf(d));
  }
  return out;
}

/** Bir alışkanlığın bu haftaki hedef dağılımı. Hedef yoksa null döner. */
export function weeklyGoalBreakdown(habit, ref = new Date()) {
  if (!habit.goal || !habit.goalDays || habit.goalDays.length === 0) return null;

  const done = new Set(habit.completedDates);
  const dates = scheduledDatesThisWeek(habit.goalDays, ref);
  const N = dates.length;
  if (N === 0) return null;

  const todayK = keyOf(ref);
  let remaining = habit.goal;
  let completedAmount = 0;

  const days = dates.map((k, i) => {
    const daysLeftIncl = N - i;
    const target = remaining / daysLeftIncl;
    const isDone = done.has(k);
    const isPast = k < todayK;
    const isToday = k === todayK;
    const isFuture = k > todayK;

    // Tamamlandıysa ya da bugün/gelecekse hedef "karşılanacak" sayılır → kalandan düş.
    // Geçmiş + yapılmamış (kaçırılmış) günün payı kalır → sonraki günlere dağılır.
    if (isDone || !isPast) remaining -= target;
    if (isDone) completedAmount += target;

    return { key: k, weekday: dateFromKey(k).getDay(), target, isDone, isPast, isToday, isFuture };
  });

  const todayEntry = days.find((d) => d.isToday);

  return {
    goal: habit.goal,
    unit: habit.unit || 'birim',
    perDay: habit.goal / N,
    days,
    completedAmount,
    outstanding: Math.max(0, habit.goal - completedAmount),
    todayScheduled: !!todayEntry,
    todayDone: todayEntry ? todayEntry.isDone : false,
    todayTarget: todayEntry ? todayEntry.target : 0,
  };
}
