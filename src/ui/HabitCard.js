/** "Bugün" listesindeki alışkanlık satırı — ikon + ad + seri + işaret dairesi. */
import { Check, Flame } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { currentStreak } from '../lib/date';
import { getIcon } from '../lib/icons';
import { isDoneToday } from '../lib/habits';
import { radius, shadow, space } from '../theme/tokens';
import { useTheme } from '../theme/theme';
import { Txt } from './Text';

export function HabitCard({ habit, onToggle, onPress }) {
  const { colors, mode } = useTheme();
  const Icon = getIcon(habit.icon);
  const done = isDoneToday(habit);
  const streak = currentStreak(new Set(habit.completedDates));

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: space.md,
          padding: space.md,
          borderRadius: radius.xl,
          backgroundColor: colors.cardBg,
          borderWidth: StyleSheet.hairlineWidth * 2,
          borderColor: colors.cardBorder,
          opacity: done ? 0.7 : 1,
          ...shadow('sm', mode),
        },
        pressed && { transform: [{ scale: 0.985 }] },
      ]}
    >
      {/* İkon karosu */}
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: radius.md,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: habit.color + '26', // %15 alfa
        }}
      >
        <Icon size={22} color={habit.color} strokeWidth={2} />
      </View>

      {/* Ad + seri */}
      <View style={{ flex: 1 }}>
        <Txt
          variant="h3"
          numberOfLines={1}
          style={done ? { textDecorationLine: 'line-through' } : undefined}
          color={done ? colors.textSecondary : colors.textPrimary}
        >
          {habit.name}
        </Txt>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
          {streak > 0 ? (
            <>
              <Flame size={13} color={colors.warning} strokeWidth={2} />
              <Txt variant="caption" color={colors.textSecondary}>
                {streak} günlük seri
              </Txt>
            </>
          ) : (
            <Txt variant="caption" color={colors.textTertiary}>
              Bugün başla
            </Txt>
          )}
        </View>
      </View>

      {/* İşaret dairesi */}
      <Pressable
        onPress={onToggle}
        hitSlop={10}
        style={({ pressed }) => [
          {
            width: 32,
            height: 32,
            borderRadius: radius.full,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 2,
            borderColor: done ? colors.success : colors.borderStrong,
            backgroundColor: done ? colors.success : 'transparent',
          },
          pressed && { transform: [{ scale: 0.9 }] },
        ]}
      >
        {done && <Check size={18} color="#fff" strokeWidth={3} />}
      </Pressable>
    </Pressable>
  );
}
