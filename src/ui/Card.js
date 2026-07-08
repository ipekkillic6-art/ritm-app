/** Standart kart — solid zemin, hairline border, blur YOK (zuzi kuralı). */
import { Pressable, StyleSheet, View } from 'react-native';

import { radius, shadow, space } from '../theme/tokens';
import { useTheme } from '../theme/theme';

export function Card({ children, style, onPress, padded = true }) {
  const { colors, mode } = useTheme();
  const base = {
    backgroundColor: colors.cardBg,
    borderColor: colors.cardBorder,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderRadius: radius.xl,
    padding: padded ? space.lg : 0,
    ...shadow('sm', mode),
  };

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          base,
          style,
          pressed && { transform: [{ scale: 0.985 }] },
        ]}
      >
        {children}
      </Pressable>
    );
  }
  return <View style={[base, style]}>{children}</View>;
}
