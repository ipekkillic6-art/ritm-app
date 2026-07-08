/** Basit saat seçici — saat/dakika için yukarı-aşağı adım. Cross-platform. */
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { radius, space } from '../theme/tokens';
import { useTheme } from '../theme/theme';
import { Txt } from './Text';

const pad = (n) => String(n).padStart(2, '0');
const MIN_STEP = 5;

function Stepper({ value, onInc, onDec }) {
  const { colors } = useTheme();
  const btn = ({ pressed }) => [
    styles.btn,
    { backgroundColor: colors.cardBg, borderColor: colors.border },
    pressed && { opacity: 0.6 },
  ];
  return (
    <View style={styles.col}>
      <Pressable onPress={onInc} hitSlop={6} style={btn}>
        <ChevronUp size={20} color={colors.brand} strokeWidth={2.5} />
      </Pressable>
      <View style={[styles.value, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
        <Txt variant="h1">{value}</Txt>
      </View>
      <Pressable onPress={onDec} hitSlop={6} style={btn}>
        <ChevronDown size={20} color={colors.brand} strokeWidth={2.5} />
      </Pressable>
    </View>
  );
}

export function TimePicker({ value = '20:00', onChange }) {
  const { colors } = useTheme();
  const [h, m] = value.split(':').map(Number);

  const setH = (nh) => onChange(`${pad((nh + 24) % 24)}:${pad(m)}`);
  const setM = (nm) => onChange(`${pad(h)}:${pad((nm + 60) % 60)}`);

  // Dakikayı 5'lik ızgaraya oturt
  const incM = () => setM(m - (m % MIN_STEP) + MIN_STEP);
  const decM = () => setM(m % MIN_STEP === 0 ? m - MIN_STEP : m - (m % MIN_STEP));

  return (
    <View style={styles.row}>
      <Stepper value={pad(h)} onInc={() => setH(h + 1)} onDec={() => setH(h - 1)} />
      <Txt variant="display" color={colors.textSecondary} style={{ marginHorizontal: space.sm }}>:</Txt>
      <Stepper value={pad(m)} onInc={incM} onDec={decM} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: space.md },
  col: { alignItems: 'center', gap: space.sm },
  btn: {
    width: 56,
    height: 34,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth * 2,
  },
  value: {
    width: 56,
    height: 52,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth * 2,
  },
});
