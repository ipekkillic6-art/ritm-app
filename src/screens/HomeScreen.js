import { Plus, Sparkles } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { greeting, longDateLabel } from '../lib/date';
import { isDoneToday } from '../lib/habits';
import { space } from '../theme/tokens';
import { useTheme } from '../theme/theme';
import { Card } from '../ui/Card';
import { EmptyState } from '../ui/EmptyState';
import { HabitCard } from '../ui/HabitCard';
import { IconButton } from '../ui/IconButton';
import { ProgressRing } from '../ui/ProgressRing';
import { Screen } from '../ui/Screen';
import { SectionHeader } from '../ui/SectionHeader';
import { Txt } from '../ui/Text';

export function HomeScreen({ habits, onToggle, onAdd, onOpen }) {
  const { colors } = useTheme();

  const doneCount = habits.filter(isDoneToday).length;
  const total = habits.length;
  const progress = total ? doneCount / total : 0;
  const allDone = total > 0 && doneCount === total;
  const sorted = [...habits].sort((a, b) => Number(isDoneToday(a)) - Number(isDoneToday(b)));

  return (
    <Screen scroll bottomInset={120} contentStyle={{ paddingTop: space.sm }}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Txt variant="caption" color={colors.textSecondary}>{longDateLabel()}</Txt>
          <Txt variant="h1" style={{ marginTop: 2 }}>{greeting()}</Txt>
        </View>
        <IconButton icon={Plus} onPress={onAdd} />
      </View>

      {total > 0 && (
        <Card style={{ flexDirection: 'row', alignItems: 'center', gap: space.xl }}>
          <ProgressRing progress={progress} size={104} stroke={11}>
            <View style={{ alignItems: 'center' }}>
              <Txt variant="h1" color={colors.brand}>{Math.round(progress * 100)}</Txt>
              <Txt variant="tiny" color={colors.textTertiary}>YÜZDE</Txt>
            </View>
          </ProgressRing>
          <View style={{ flex: 1, gap: 4 }}>
            <Txt variant="h3">{allDone ? 'Bugün tamam!' : `${doneCount}/${total} tamamlandı`}</Txt>
            <Txt variant="bodySm" color={colors.textSecondary}>
              {allDone ? 'Harika iş — tüm alışkanlıkların bugün için hazır.' : `Bugün ${total - doneCount} alışkanlık seni bekliyor.`}
            </Txt>
          </View>
        </Card>
      )}

      <View style={{ marginTop: space.xxl }}>
        <SectionHeader title="Bugün" />
        {total === 0 ? (
          <EmptyState icon={Sparkles} title="Henüz alışkanlık yok" subtitle="İlk alışkanlığını ekleyerek serine başla." cta="Alışkanlık ekle" onCta={onAdd} />
        ) : (
          <View style={{ gap: space.md }}>
            {sorted.map((h) => (
              <HabitCard key={h.id} habit={h} onToggle={() => onToggle(h.id)} onPress={() => onOpen(h.id)} />
            ))}
          </View>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingBottom: space.xl },
});
