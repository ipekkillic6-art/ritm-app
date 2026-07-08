/** Seçim çipi — seçili durumda solid marka dolgusu. */
import { Pressable, StyleSheet } from 'react-native';

import { radius } from '../theme/tokens';
import { useTheme } from '../theme/theme';
import { Txt } from './Text';

export function Chip({ label, selected, onPress }) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          paddingVertical: 10,
          paddingHorizontal: 18,
          borderRadius: radius.lg,
          borderWidth: StyleSheet.hairlineWidth * 2,
          backgroundColor: selected ? colors.brand : colors.cardBg,
          borderColor: selected ? colors.brand : colors.border,
        },
        pressed && { transform: [{ scale: 0.97 }] },
      ]}
    >
      <Txt variant="caption" color={selected ? colors.onBrand : colors.textSecondary}>
        {label}
      </Txt>
    </Pressable>
  );
}
