/** Mock alışkanlık verisi (tarayıcıda canlı geçmiş üretir). */
import { addDays, keyOf } from '../lib/date';

function dates(pattern, span = 24) {
  const out = [];
  const now = new Date();
  for (let i = span; i >= 0; i--) if (pattern(i)) out.push(keyOf(addDays(now, -i)));
  return out;
}

const created = keyOf(addDays(new Date(), -30));

export const MOCK_HABITS = [
  {
    id: 'h-water', name: 'Su iç', icon: 'droplet', color: '#3B82F6', freq: 'daily',
    note: 'Günde 8 bardak su. Sabah bir bardakla başla.', createdAt: created,
    // Haftalık hedef: 56 bardak, her gün → günlük 8 bardak
    goal: 56, unit: 'bardak', goalDays: [1, 2, 3, 4, 5, 6, 0],
    completedDates: dates((i) => i !== 0 && i % 7 !== 3),
  },
  {
    id: 'h-workout', name: 'Spor yap', icon: 'dumbbell', color: '#EF4444', freq: 'weekdays',
    note: 'Haftada 150 dakika hareket — hafta içi.', createdAt: created,
    // Haftalık hedef: 150 dk, hafta içi → günlük 30 dk
    goal: 150, unit: 'dk', goalDays: [1, 2, 3, 4, 5],
    completedDates: dates((i) => i % 5 !== 2),
  },
  {
    id: 'h-read', name: 'Kitap oku', icon: 'book', color: '#F59E0B', freq: 'custom',
    note: 'Haftada 60 sayfa — Pzt/Çar/Cum.', createdAt: created,
    // Haftalık hedef: 60 sayfa, Pzt(1)/Çar(3)/Cum(5) → günlük 20 sayfa
    goal: 60, unit: 'sayfa', goalDays: [1, 3, 5],
    completedDates: dates((i) => i % 2 === 0),
  },
  {
    id: 'h-meditate', name: 'Meditasyon', icon: 'brain', color: '#10B981', freq: 'daily',
    note: 'Haftada 70 dakika nefes çalışması.', createdAt: created,
    // Haftalık hedef: 70 dk, her gün → günlük 10 dk
    goal: 70, unit: 'dk', goalDays: [1, 2, 3, 4, 5, 6, 0],
    completedDates: dates((i) => i !== 0 && i < 12 && i % 3 !== 0),
  },
  {
    id: 'h-sleep', name: 'Erken yat', icon: 'moon', color: '#EC4899', freq: 'daily',
    note: 'Haftada 7 gece erken yat.', createdAt: created,
    // Haftalık hedef: 7 gece, her gün → günlük 1 gece
    goal: 7, unit: 'gece', goalDays: [1, 2, 3, 4, 5, 6, 0],
    completedDates: dates((i) => i % 3 === 1),
  },
];

export const MOCK_HABIT = MOCK_HABITS[0];
