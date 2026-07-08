import { LinearGradient } from 'expo-linear-gradient';
import { Award, CheckCircle2, Flame, TrendingUp } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { addDays, bestStreak, currentStreak, keyOf, last7Days } from '../lib/date';
import { getIcon } from '../lib/icons';
import { brandGradient, radius, space } from '../theme/tokens';
import { useTheme } from '../theme/theme';
import { Card } from '../ui/Card';
import { Screen } from '../ui/Screen';
import { SectionHeader } from '../ui/SectionHeader';
import { Txt } from '../ui/Text';
import { MOCK_HABITS } from './mock';

const WINDOW = 30;

export function StatsScreen({ habits = MOCK_HABITS }) {
  const { colors } = useTheme();
  const week = last7Days();
  const today = keyOf(new Date());

  const weekData = week.map((d) => {
    const count = habits.filter((h) => h.completedDates.includes(d.key)).length;
    return { ...d, ratio: habits.length ? count / habits.length : 0 };
  });
  const maxBar = Math.max(0.001, ...weekData.map((d) => d.ratio));

  const streaks = habits.map((h) => currentStreak(new Set(h.completedDates)));
  const bests = habits.map((h) => bestStreak(new Set(h.completedDates)));
  const curStreak = streaks.length ? Math.max(...streaks) : 0;
  const longest = bests.length ? Math.max(...bests) : 0;
  const totalDone = habits.reduce((s, h) => s + h.completedDates.length, 0);

  const windowKeys = new Set(Array.from({ length: WINDOW }, (_, i) => keyOf(addDays(new Date(), -i))));
  const doneInWindow = habits.reduce((s, h) => s + h.completedDates.filter((d) => windowKeys.has(d)).length, 0);
  const rate = habits.length ? Math.round((doneInWindow / (habits.length * WINDOW)) * 100) : 0;

  const tiles = [
    { icon: Flame, label: 'Güncel seri', value: `${curStreak}`, unit: 'gün', color: colors.warning },
    { icon: Award, label: 'En uzun seri', value: `${longest}`, unit: 'gün', color: colors.pink },
    { icon: TrendingUp, label: 'Tamamlanma', value: `%${rate}`, unit: '30 gün', color: colors.brand },
    { icon: CheckCircle2, label: 'Toplam', value: `${totalDone}`, unit: 'işaret', color: colors.success },
  ];

  return (
    <Screen scroll bottomInset={120} contentStyle={{ paddingTop: space.sm }}>
      <View style={{ paddingBottom: space.xl }}>
        <Txt variant="h1">İstatistik</Txt>
        <Txt variant="bodySm" color={colors.textSecondary} style={{ marginTop: 4 }}>
          İlerlemene kuşbakışı bir bakış.
        </Txt>
      </View>

      <Card>
        <Txt variant="h3">Bu hafta</Txt>
        <Txt variant="caption" color={colors.textSecondary} style={{ marginTop: 2 }}>Günlük tamamlanma oranı</Txt>
        <View style={styles.chart}>
          {weekData.map((d) => {
            const h = 8 + (d.ratio / maxBar) * 96;
            const isToday = d.key === today;
            return (
              <View key={d.key} style={styles.barCol}>
                <View style={styles.barTrack}>
                  <LinearGradient colors={brandGradient} start={{ x: 0, y: 1 }} end={{ x: 0, y: 0 }} style={{ height: h, width: '100%', borderRadius: radius.sm }} />
                </View>
                <Txt variant="micro" color={isToday ? colors.brand : colors.textTertiary} style={{ marginTop: space.sm }}>{d.label}</Txt>
              </View>
            );
          })}
        </View>
      </Card>

      <View style={styles.grid}>
        {tiles.map((t) => {
          const Icon = t.icon;
          return (
            <Card key={t.label} style={styles.tile}>
              <View style={[styles.tileIcon, { backgroundColor: t.color + '26' }]}>
                <Icon size={18} color={t.color} strokeWidth={2} />
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4, marginTop: space.md }}>
                <Txt variant="h1">{t.value}</Txt>
                <Txt variant="caption" color={colors.textTertiary}>{t.unit}</Txt>
              </View>
              <Txt variant="caption" color={colors.textSecondary}>{t.label}</Txt>
            </Card>
          );
        })}
      </View>

      <View style={{ marginTop: space.xxl }}>
        <SectionHeader title="Alışkanlıklar" />
        <View style={{ gap: space.md }}>
          {habits.map((h) => {
            const inWin = h.completedDates.filter((d) => windowKeys.has(d)).length;
            const pct = Math.round((inWin / WINDOW) * 100);
            const Icon = getIcon(h.icon);
            return (
              <Card key={h.id} style={{ flexDirection: 'row', alignItems: 'center', gap: space.md }}>
                <View style={[styles.hIcon, { backgroundColor: h.color + '26' }]}>
                  <Icon size={20} color={h.color} strokeWidth={2} />
                </View>
                <View style={{ flex: 1, gap: 6 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Txt variant="bodyMd">{h.name}</Txt>
                    <Txt variant="caption" color={colors.textSecondary}>%{pct}</Txt>
                  </View>
                  <View style={[styles.miniTrack, { backgroundColor: colors.trackBg }]}>
                    <View style={{ width: `${pct}%`, height: '100%', borderRadius: radius.full, backgroundColor: h.color }} />
                  </View>
                </View>
              </Card>
            );
          })}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  chart: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 132, marginTop: space.lg },
  barCol: { flex: 1, alignItems: 'center' },
  barTrack: { width: 22, height: 104, justifyContent: 'flex-end' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.md, marginTop: space.md },
  tile: { width: '47.8%', gap: 2 },
  tileIcon: { width: 36, height: 36, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  hIcon: { width: 40, height: 40, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  miniTrack: { height: 8, borderRadius: radius.full, overflow: 'hidden' },
});
