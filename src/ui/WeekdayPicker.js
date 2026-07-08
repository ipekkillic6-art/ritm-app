/** Hafta günü seçici — Pzt'den başlar; değerler getDay() indeksidir (0=Paz). */
import { Pressable, StyleSheet, View } from 'react-native';

import { radius, space } from '../theme/tokens';
import { useTheme } from '../theme/theme';
import { Txt } from './Text';

const WEEKDAY_PICKS = [
  { label: 'Pzt', value: 1 },
  { label: 'Sal', value: 2 },
  { label: 'Çar', value: 3 },
  { label: 'Per', value: 4 },
  { label: 'Cum', value: 5 },
  { label: 'Cmt', value: 6 },
  { label: 'Paz', value: 0 },
];

export function WeekdayPicker({ value = [], onChange, minOne = false }) {
  const { colors } = useTheme();

  const toggle = (v) => {
    const next = value.includes(v) ? value.filter((d) => d !== v) : [...value, v];
    if (minOne && next.length === 0) return; // en az bir gün kalsın
    onChange(next.sort((a, b) => a - b));
  };

  return (
    <View style={styles.row}>
      {WEEKDAY_PICKS.map((d) => {
        const on = value.includes(d.value);
        return (
          <Pressable
            key={d.value}
            onPress={() => toggle(d.value)}
            style={[styles.pick, { backgroundColor: on ? colors.brand : colors.cardBg, borderColor: on ? colors.brand : colors.border }]}
          >
            <Txt variant="caption" color={on ? colors.onBrand : colors.textSecondary}>{d.label}</Txt>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: space.sm, flexWrap: 'wrap' },
  pick: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: radius.md, borderWidth: StyleSheet.hairlineWidth * 2, minWidth: 44, alignItems: 'center' },
});
