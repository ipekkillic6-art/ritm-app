/** Birincil / ikincil buton. Renkli gölge yalnız birincil CTA'da. */
import { Pressable, StyleSheet } from 'react-native';

import { radius, shadow, space } from '../theme/tokens';
import { useTheme } from '../theme/theme';
import { Txt } from './Text';

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'lg',
  icon: Icon,
  disabled,
  fullWidth,
  style,
}) {
  const { colors, mode } = useTheme();
  const isPrimary = variant === 'primary';
  const padV = size === 'lg' ? 16 : 11;
  const iconSize = size === 'lg' ? 20 : 18;

  const base = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.sm,
    paddingVertical: padV,
    paddingHorizontal: space.xxl,
    borderRadius: radius.lg,
    backgroundColor: isPrimary ? colors.brand : 'transparent',
    borderWidth: isPrimary ? 0 : StyleSheet.hairlineWidth * 2,
    borderColor: colors.borderStrong,
    alignSelf: fullWidth ? 'stretch' : 'flex-start',
    ...(isPrimary ? shadow('brand', mode) : {}),
  };

  const textColor = isPrimary ? colors.onBrand : colors.textPrimary;

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      style={({ pressed }) => [
        base,
        disabled && { opacity: 0.35 },
        pressed && !disabled && { transform: [{ scale: 0.97 }], opacity: 0.92 },
        style,
      ]}
    >
      {Icon && <Icon size={iconSize} color={textColor} strokeWidth={2} />}
      <Txt variant={size === 'lg' ? 'h3' : 'caption'} color={textColor}>
        {label}
      </Txt>
    </Pressable>
  );
}
