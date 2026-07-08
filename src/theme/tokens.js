/**
 * Ritm — Tasarım Token'ları
 *
 * Karışım tasarım dili:
 *  - İskelet & disiplin: zuzi (UI_RULES.md) — solid kartlar, hairline border,
 *    blur yalnız nav/overlay'de, 4px'lik spacing ızgarası, yumuşak hareket.
 *  - Aksan: debato — başlıklarda Inter Tight, mor (violet) ağırlıklı marka.
 *  - Marka gradyanı: kırmızı (#EF4444) → turuncu (#F97316).
 *
 * Tüm renkler { dark, light } olarak tanımlıdır; getColors(mode) düz bir
 * palet döndürür. Uygulama koyu-tema önceliklidir, açık tema da desteklenir.
 */

/* ------------------------------------------------------------------ */
/* Ham marka & semantik renkler                                       */
/* ------------------------------------------------------------------ */

export const brandGradient = ['#EF4444', '#F97316']; // dekoratif: kırmızı → turuncu
export const streakGradient = ['#F59E0B', '#EC4899']; // seri/ateş vurgusu

/* ------------------------------------------------------------------ */
/* Moda göre çözülmüş renk paleti                                     */
/* ------------------------------------------------------------------ */

export function getColors(mode) {
  const dark = mode === 'dark';
  return {
    mode,

    // Zemin (3 duraklı dikey gradyan)
    screenBg: dark
      ? ['#140a0a', '#1f0f0f', '#120808']
      : ['#FDF6F6', '#FAF1F1', '#FFFFFF'],

    // Marka (interaktif = solid kırmızı; gradyan yalnız dekoratif)
    brand: dark ? '#EF4444' : '#DC2626',
    brandStrong: dark ? '#DC2626' : '#B91C1C',
    brandSoft: dark ? 'rgba(239,68,68,0.18)' : 'rgba(220,38,38,0.12)',
    brandBorder: dark ? 'rgba(239,68,68,0.40)' : 'rgba(220,38,38,0.35)',
    onBrand: '#FFFFFF',

    // İkincil aksan (pembe) — seriler, öne çıkan metrikler
    pink: dark ? '#EC4899' : '#DB2777',
    pinkSoft: dark ? 'rgba(236,72,153,0.15)' : 'rgba(219,39,119,0.12)',

    // Semantik
    success: dark ? '#10B981' : '#059669',
    successSoft: dark ? 'rgba(16,185,129,0.16)' : 'rgba(5,150,105,0.12)',
    warning: dark ? '#F59E0B' : '#D97706',
    warningSoft: dark ? 'rgba(245,158,11,0.16)' : 'rgba(217,119,6,0.12)',
    error: dark ? '#EF4444' : '#DC2626',
    info: dark ? '#3B82F6' : '#2563EB',

    // Metin
    textPrimary: dark ? '#FFFFFF' : '#1C1C1E',
    textSecondary: dark ? 'rgba(255,255,255,0.70)' : 'rgba(0,0,0,0.60)',
    textTertiary: dark ? 'rgba(255,255,255,0.50)' : 'rgba(0,0,0,0.40)',
    textMuted: dark ? 'rgba(255,255,255,0.30)' : 'rgba(0,0,0,0.25)',

    // Yüzeyler / kartlar (solid — blur YOK)
    cardBg: dark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.80)',
    cardBorder: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
    elevatedBg: dark ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.92)',

    // Cam (yalnız nav & overlay)
    glassBg: dark ? 'rgba(30,20,45,0.55)' : 'rgba(255,255,255,0.72)',
    glassBorder: dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)',
    overlay: dark ? 'rgba(0,0,0,0.60)' : 'rgba(0,0,0,0.30)',
    sheetBg: dark ? '#1a1025' : '#FFFFFF',

    // Kenarlıklar & ayraçlar
    border: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
    borderStrong: dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.10)',
    divider: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',

    // İlerleme rayı / iskelet
    trackBg: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
  };
}

/* ------------------------------------------------------------------ */
/* Tipografi — Inter (gövde) + Inter Tight (başlık, debato aksanı)     */
/* ------------------------------------------------------------------ */

export const font = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  // Başlıklar — Inter Tight, negatif harf aralığı
  hSemibold: 'InterTight_600SemiBold',
  hBold: 'InterTight_700Bold',
  hExtrabold: 'InterTight_800ExtraBold',
};

/* ------------------------------------------------------------------ */
/* Spacing — 4px taban ızgarası                                       */
/* ------------------------------------------------------------------ */

export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
};

/* Standart ekran yatay boşluğu */
export const SCREEN_PAD = 24;

/* ------------------------------------------------------------------ */
/* Border radius ölçeği                                               */
/* ------------------------------------------------------------------ */

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  pill: 32,
  full: 9999,
};

/* ------------------------------------------------------------------ */
/* Gölgeler (RN + web uyumlu)                                          */
/* ------------------------------------------------------------------ */

export function shadow(level, mode = 'dark') {
  const dark = mode === 'dark';
  switch (level) {
    case 'sm':
      return {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: dark ? 0.2 : 0.06,
        shadowRadius: 8,
        elevation: 2,
      };
    case 'md':
      return {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: dark ? 0.3 : 0.08,
        shadowRadius: 16,
        elevation: 6,
      };
    case 'lg':
      return {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: dark ? 0.4 : 0.12,
        shadowRadius: 32,
        elevation: 12,
      };
    case 'brand':
      // Renkli gölge YALNIZ birincil CTA'da
      return {
        shadowColor: '#EF4444',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: dark ? 0.4 : 0.25,
        shadowRadius: 24,
        elevation: 10,
      };
    default:
      return {};
  }
}
