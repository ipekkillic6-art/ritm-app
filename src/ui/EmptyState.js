/** Boş durum — ikon + başlık + alt metin + CTA. */
import { View } from 'react-native';

import { space } from '../theme/tokens';
import { useTheme } from '../theme/theme';
import { Button } from './Button';
import { Txt } from './Text';

export function EmptyState({ icon: Icon, title, subtitle, cta, onCta }) {
  const { colors } = useTheme();
  return (
    <View style={{ alignItems: 'center', paddingVertical: space.huge }}>
      <Icon size={48} color={colors.textTertiary} strokeWidth={1.5} />
      <Txt variant="h3" style={{ marginTop: space.lg }}>
        {title}
      </Txt>
      {subtitle && (
        <Txt
          variant="bodySm"
          color={colors.textSecondary}
          style={{ marginTop: space.sm, textAlign: 'center', maxWidth: 280 }}
        >
          {subtitle}
        </Txt>
      )}
      {cta && (
        <Button label={cta} onPress={onCta} style={{ marginTop: space.xxl }} />
      )}
    </View>
  );
}
