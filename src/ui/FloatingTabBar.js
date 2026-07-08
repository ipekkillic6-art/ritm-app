/** Yüzen pill tab bar — cam/blur zemin, aktif sekme marka renginde.
 *  Kontrollü sürüm: expo-router yerine `active` + `onSelect` prop'larıyla çalışır. */
import { BlurView } from 'expo-blur';
import { CalendarCheck, TrendingUp, User } from 'lucide-react-native';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { radius, space } from '../theme/tokens';
import { useTheme } from '../theme/theme';
import { Txt } from './Text';

const ITEMS = [
  { key: 'home', icon: CalendarCheck, label: 'Bugün' },
  { key: 'stats', icon: TrendingUp, label: 'İstatistik' },
  { key: 'profile', icon: User, label: 'Profil' },
];

export function FloatingTabBar({ active = 'home', onSelect }) {
  const { colors, mode } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      pointerEvents="box-none"
      style={[styles.wrap, { bottom: Math.max(insets.bottom, 16) }]}
    >
      <BlurView
        intensity={mode === 'dark' ? 40 : 60}
        tint={mode === 'dark' ? 'dark' : 'light'}
        style={[styles.bar, { backgroundColor: colors.glassBg, borderColor: colors.glassBorder }]}
      >
        {ITEMS.map((it) => {
          const on = it.key === active;
          const tint = on ? colors.brand : colors.textTertiary;
          const Icon = it.icon;
          return (
            <Pressable
              key={it.key}
              onPress={() => !on && onSelect?.(it.key)}
              style={({ pressed }) => [
                styles.item,
                on && { backgroundColor: colors.brandSoft },
                pressed && { opacity: 0.7 },
              ]}
            >
              <Icon size={22} color={tint} strokeWidth={2} />
              <Txt variant="tiny" color={tint} style={{ marginTop: 3 }}>
                {it.label}
              </Txt>
            </Pressable>
          );
        })}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  bar: {
    flexDirection: 'row',
    gap: space.xs,
    padding: 6,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth * 2,
    overflow: 'hidden',
    ...Platform.select({
      web: { backdropFilter: 'blur(20px)' },
      default: {},
    }),
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: radius.xxl,
    minWidth: 76,
  },
});
