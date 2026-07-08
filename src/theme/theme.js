/**
 * Tema sağlayıcı — koyu/açık/sistem tercihi.
 * useTheme() çözülmüş paleti + yardımcı token'ları döndürür.
 *
 * Not: ritm-desing'deki sürüm AsyncStorage ile kalıcıydı; onboarding için
 * kalıcılığa gerek yok, bu yüzden sadeleştirildi (sistem şeması, koyu-öncelikli).
 */
import { createContext, useContext, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';

import { getColors } from './tokens';

const Ctx = createContext(null);

export function ThemeProvider({ children }) {
  const system = useColorScheme() ?? 'dark';
  const [pref, setPref] = useState('system'); // 'system' | 'dark' | 'light'

  const mode = pref === 'system' ? system : pref;
  const colors = useMemo(() => getColors(mode), [mode]);

  const value = useMemo(
    () => ({ pref, mode, colors, setPref }),
    [pref, mode, colors],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTheme() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
