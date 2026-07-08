import { Bell, Check, ChevronLeft, Flame, Target, Trash2 } from 'lucide-react-native';
import { Platform, Pressable, StyleSheet, Switch, View } from 'react-native';

import { bestStreak, currentStreak, keyOf, monthGrid, monthLabel, WEEKDAYS_SHORT } from '../lib/date';
import { weeklyGoalBreakdown } from '../lib/goal';
import { FREQ_LABEL, isDoneToday } from '../lib/habits';
import { getIcon } from '../lib/icons';
import { radius, space } from '../theme/tokens';
import { useTheme } from '../theme/theme';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { IconButton } from '../ui/IconButton';
import { Screen } from '../ui/Screen';
import { Txt } from '../ui/Text';
import { TimePicker } from '../ui/TimePicker';
import { WeekdayPicker } from '../ui/WeekdayPicker';

const WEEKDAYS = ['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pz'];

export function HabitDetailScreen({ habit, onBack, onDelete, onToggleDate, onToggleToday, onSetReminder, onSetGoalDays }) {
  const { colors } = useTheme();

  const done = new Set(habit.completedDates);
  const todayKey = keyOf(new Date());
  const streak = currentStreak(done);
  const best = bestStreak(done);
  const total = habit.completedDates.length;
  const doneToday = isDoneToday(habit);
  const Icon = getIcon(habit.icon);

  const now = new Date();
  const grid = monthGrid(now.getFullYear(), now.getMonth());

  const stats = [
    { label: 'Güncel seri', value: streak },
    { label: 'En uzun', value: best },
    { label: 'Toplam', value: total },
  ];

  const goal = weeklyGoalBreakdown(habit);
  const goalPct = goal ? Math.min(100, Math.round((goal.completedAmount / goal.goal) * 100)) : 0;
  const reminderOn = !!habit.reminder?.enabled;
  const reminderTime = habit.reminder?.time || '20:00';

  return (
    <Screen scroll bottomInset={40} contentStyle={{ paddingTop: space.xs }}>
      <View style={styles.nav}>
        <IconButton icon={ChevronLeft} onPress={onBack} />
        <Txt variant="h3" numberOfLines={1} style={{ flex: 1, textAlign: 'center' }}>{habit.name}</Txt>
        <IconButton icon={Trash2} color={colors.error} onPress={onDelete} />
      </View>

      <Card style={{ alignItems: 'center', paddingVertical: space.xxl, marginTop: space.md }}>
        <View style={[styles.heroIcon, { backgroundColor: habit.color + '26' }]}>
          <Icon size={30} color={habit.color} strokeWidth={2} />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm, marginTop: space.lg }}>
          <Flame size={30} color={colors.warning} strokeWidth={2} />
          <Txt variant="display" color={colors.textPrimary}>{streak}</Txt>
        </View>
        <Txt variant="caption" color={colors.textSecondary}>günlük seri · {FREQ_LABEL[habit.freq]}</Txt>
      </Card>

      <View style={styles.statRow}>
        {stats.map((s) => (
          <Card key={s.label} style={styles.stat}>
            <Txt variant="h1" color={colors.brand}>{s.value}</Txt>
            <Txt variant="caption" color={colors.textSecondary}>{s.label}</Txt>
          </Card>
        ))}
      </View>

      {goal && (
        <Card style={{ marginTop: space.md }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm }}>
            <Target size={18} color={colors.brand} strokeWidth={2} />
            <Txt variant="h3" style={{ flex: 1 }}>Haftalık Hedef</Txt>
            <Txt variant="caption" color={colors.textSecondary}>{goal.goal} {goal.unit}/hafta</Txt>
          </View>

          {/* Bugünün hedefi (yeniden dağıtımlı) */}
          <View style={{ marginTop: space.lg }}>
            {goal.todayScheduled ? (
              goal.todayDone ? (
                <Txt variant="bodyMd" color={colors.success}>Bugünkü hedef tamamlandı ✓</Txt>
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
                  <Txt variant="caption" color={colors.textSecondary}>Bugün:</Txt>
                  <Txt variant="h2" color={colors.brand}>{Math.round(goal.todayTarget)}</Txt>
                  <Txt variant="caption" color={colors.textSecondary}>{goal.unit}</Txt>
                </View>
              )
            ) : (
              <Txt variant="bodySm" color={colors.textTertiary}>Bugün planlı değil.</Txt>
            )}
          </View>

          {/* İlerleme çubuğu */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: space.lg, marginBottom: 6 }}>
            <Txt variant="caption" color={colors.textSecondary}>Bu hafta</Txt>
            <Txt variant="caption" color={colors.textSecondary}>{Math.round(goal.completedAmount)}/{goal.goal} {goal.unit}</Txt>
          </View>
          <View style={[styles.goalTrack, { backgroundColor: colors.trackBg }]}>
            <View style={{ width: `${goalPct}%`, height: '100%', borderRadius: radius.full, backgroundColor: colors.brand }} />
          </View>

          {/* Planlı günler — her biri (dağıtılmış) hedefiyle, dokununca işaretlenir */}
          <View style={styles.goalDays}>
            {goal.days.map((d) => {
              const label = WEEKDAYS_SHORT[d.weekday];
              const fill = d.isDone ? habit.color : colors.trackBg;
              return (
                <Pressable
                  key={d.key}
                  disabled={d.isFuture}
                  onPress={() => onToggleDate(d.key)}
                  style={styles.goalDayCol}
                >
                  <Txt variant="micro" color={d.isToday ? colors.brand : colors.textTertiary}>{label}</Txt>
                  <View
                    style={[
                      styles.goalPill,
                      {
                        backgroundColor: fill,
                        borderWidth: d.isToday ? 2 : StyleSheet.hairlineWidth * 2,
                        borderColor: d.isToday ? colors.brand : colors.border,
                        opacity: d.isFuture ? 0.4 : d.isPast && !d.isDone ? 0.55 : 1,
                      },
                    ]}
                  >
                    {d.isDone ? (
                      <Check size={16} color="#fff" strokeWidth={3} />
                    ) : (
                      <Txt variant="caption" color={colors.textSecondary}>{Math.round(d.target)}</Txt>
                    )}
                  </View>
                </Pressable>
              );
            })}
          </View>
          <Txt variant="micro" color={colors.textMuted} style={{ marginTop: space.sm, textAlign: 'center' }}>
            Bir gün kaçırılırsa payı kalan günlere dağıtılır.
          </Txt>

          {/* Hatırlatıcı */}
          <View style={[styles.reminderRow, { borderTopColor: colors.divider }]}>
            <Bell size={18} color={reminderOn ? colors.brand : colors.textSecondary} strokeWidth={2} />
            <View style={{ flex: 1 }}>
              <Txt variant="body">Hedefi hatırlat</Txt>
              {reminderOn && (
                <Txt variant="caption" color={colors.textSecondary}>
                  Planlı günlerde {reminderTime}
                </Txt>
              )}
            </View>
            <Switch
              value={reminderOn}
              onValueChange={(v) => onSetReminder(v ? { enabled: true, time: reminderTime } : null)}
              trackColor={{ false: colors.trackBg, true: colors.brand }}
              thumbColor="#fff"
            />
          </View>
          {reminderOn && (
            <>
              <TimePicker value={reminderTime} onChange={(t) => onSetReminder({ enabled: true, time: t })} />
              <Txt variant="caption" color={colors.textSecondary} style={{ marginTop: space.lg, marginBottom: space.sm }}>
                Hatırlatılacak günler
              </Txt>
              <WeekdayPicker value={habit.goalDays} onChange={onSetGoalDays} minOne />
              {Platform.OS === 'web' && (
                <Txt variant="micro" color={colors.textMuted} style={{ marginTop: space.sm, textAlign: 'center' }}>
                  Bildirimler yalnız telefonda (Expo Go/derleme) tetiklenir.
                </Txt>
              )}
            </>
          )}
        </Card>
      )}

      <Card style={{ marginTop: space.md }}>
        <Txt variant="h3" style={{ marginBottom: space.lg }}>{monthLabel(now.getFullYear(), now.getMonth())}</Txt>
        <View style={styles.weekRow}>
          {WEEKDAYS.map((w) => (
            <View key={w} style={styles.cell}><Txt variant="micro" color={colors.textTertiary}>{w}</Txt></View>
          ))}
        </View>
        <View style={styles.calGrid}>
          {grid.map((key, i) => {
            if (!key) return <View key={`e${i}`} style={styles.cell} />;
            const isDone = done.has(key);
            const isToday = key === todayKey;
            const isFuture = key > todayKey;
            const dayNum = Number(key.slice(-2));
            return (
              <Pressable key={key} disabled={isFuture} onPress={() => onToggleDate(key)} style={styles.cell}>
                <View style={[styles.day, { backgroundColor: isDone ? habit.color : colors.trackBg, borderWidth: isToday ? 2 : 0, borderColor: colors.brand, opacity: isFuture ? 0.35 : 1 }]}>
                  <Txt variant="micro" color={isDone ? '#fff' : colors.textSecondary}>{dayNum}</Txt>
                </View>
              </Pressable>
            );
          })}
        </View>
      </Card>

      {habit.note ? (
        <Card style={{ marginTop: space.md }}>
          <Txt variant="caption" color={colors.textTertiary} style={{ marginBottom: 4 }}>NOT</Txt>
          <Txt variant="body" color={colors.textSecondary}>{habit.note}</Txt>
        </Card>
      ) : null}

      <Button
        label={doneToday ? 'Bugünü geri al' : 'Bugün yaptım'}
        icon={doneToday ? undefined : Check}
        variant={doneToday ? 'secondary' : 'primary'}
        onPress={onToggleToday}
        fullWidth
        style={{ marginTop: space.xl }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  nav: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingVertical: space.sm },
  heroIcon: { width: 60, height: 60, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center' },
  statRow: { flexDirection: 'row', gap: space.md, marginTop: space.md },
  stat: { flex: 1, alignItems: 'center', gap: 2 },
  weekRow: { flexDirection: 'row' },
  calGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: `${100 / 7}%`, aspectRatio: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 3 },
  day: { width: 34, height: 34, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center' },
  goalTrack: { height: 10, borderRadius: radius.full, overflow: 'hidden' },
  goalDays: { flexDirection: 'row', justifyContent: 'space-between', marginTop: space.lg },
  goalDayCol: { alignItems: 'center', gap: 6 },
  goalPill: { width: 38, height: 38, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  reminderRow: { flexDirection: 'row', alignItems: 'center', gap: space.md, marginTop: space.lg, paddingTop: space.lg, borderTopWidth: StyleSheet.hairlineWidth },
});
