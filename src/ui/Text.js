/** Merkezi tipografi bileşeni — tüm metinler bunu kullanır. */
import { Text as RNText } from 'react-native';

import { font } from '../theme/tokens';
import { useTheme } from '../theme/theme';

const SPEC = {
  display: { fontFamily: font.hExtrabold, fontSize: 32, lineHeight: 38, letterSpacing: -0.5 },
  h1: { fontFamily: font.hBold, fontSize: 26, lineHeight: 31, letterSpacing: -0.4 },
  h2: { fontFamily: font.hBold, fontSize: 20, lineHeight: 25, letterSpacing: -0.2 },
  h3: { fontFamily: font.hSemibold, fontSize: 17, lineHeight: 22 },
  body: { fontFamily: font.regular, fontSize: 15, lineHeight: 22 },
  bodyMd: { fontFamily: font.medium, fontSize: 15, lineHeight: 22 },
  bodySm: { fontFamily: font.regular, fontSize: 14, lineHeight: 20 },
  caption: { fontFamily: font.medium, fontSize: 13, lineHeight: 17 },
  micro: { fontFamily: font.semibold, fontSize: 11, lineHeight: 14 },
  tiny: { fontFamily: font.medium, fontSize: 10, lineHeight: 12 },
};

export function Txt({ variant = 'body', color, style, children, ...rest }) {
  const { colors } = useTheme();
  return (
    <RNText
      {...rest}
      style={[SPEC[variant], { color: color ?? colors.textPrimary }, style]}
    >
      {children}
    </RNText>
  );
}
