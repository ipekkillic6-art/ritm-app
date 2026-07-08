import { Bell, X } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, Switch, TextInput, View } from 'react-native';

import { FREQ_LABEL } from '../lib/habits';
import { getIcon, HABIT_COLORS, ICON_CHOICES } from '../lib/icons';
import { font, radius, space } from '../theme/tokens';
import { useTheme } from '../theme/theme';
import { Button } from '../ui/Button';
import { Chip } from '../ui/Chip';
import { IconButton } from '../ui/IconButton';
import { Screen } from '../ui/Screen';
import { Txt } from '../ui/Text';
import { TimePicker } from '../ui/TimePicker';
import { WeekdayPicker } from '../ui/WeekdayPicker';

const FREQS = ['daily', 'weekdays', 'custom'];

export function AddHabitScreen({ onClose, onSave }) {
  const { colors } = useTheme();
  const [name, setName] = useState('');
  const [icon, setIcon] = useState(ICON_CHOICES[0]);
  const [color, setColor] = useState(HABIT_COLORS[0]);
  const [freq, setFreq] = useState('daily');
  const [note, setNote] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [unit, setUnit] = useState('');
  const [goalDays, setGoalDays] = useState([]);
  const [reminderOn, setReminderOn] = useState(false);
  const [reminderTime, setReminderTime] = useState('20:00');

  const canSave = name.trim().length > 0;
  const goalNum = Number(goalAmount);
  const hasGoal = goalNum > 0 && goalDays.length > 0;
  const perDay = hasGoal ? Math.round((goalNum / goalDays.length) * 10) / 10 : 0;

  const save = () => {
    if (!canSave) return;
    onSave?.({
      name: name.trim(),
      icon,
      color,
      freq,
      note: note.trim() || undefined,
      ...(hasGoal
        ? {
            goal: goalNum,
            unit: unit.trim() || 'birim',
            goalDays: [...goalDays].sort((a, b) => a - b),
            reminder: reminderOn ? { enabled: true, time: reminderTime } : undefined,
          }
        : {}),
    });
  };

  const inputStyle = {
    backgroundColor: colors.cardBg,
    borderColor: colors.border,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderRadius: radius.md,
    paddingHorizontal: space.lg,
    color: colors.textPrimary,
    fontFamily: font.regular,
    fontSize: 15,
  };

  const Preview = getIcon(icon);

  return (
    <Screen scroll bottomInset={space.xl} contentStyle={{ paddingTop: space.sm }}>
      <View style={[styles.handle, { backgroundColor: colors.textMuted }]} />

      <View style={styles.header}>
        <Txt variant="h1" style={{ flex: 1 }}>Yeni alışkanlık</Txt>
        <IconButton icon={X} color={colors.textSecondary} onPress={onClose} />
      </View>

      <View style={styles.preview}>
        <View style={[styles.previewIcon, { backgroundColor: color + '26' }]}>
          <Preview size={30} color={color} strokeWidth={2} />
        </View>
        <Txt variant="h3" color={name ? colors.textPrimary : colors.textTertiary}>{name || 'Alışkanlık adı'}</Txt>
      </View>

      <Txt variant="caption" color={colors.textSecondary} style={styles.label}>AD</Txt>
      <TextInput value={name} onChangeText={setName} placeholder="Örn. Su iç, 10 dk yürü…" placeholderTextColor={colors.textTertiary} style={[inputStyle, { height: 48 }]} maxLength={40} />

      <Txt variant="caption" color={colors.textSecondary} style={styles.label}>İKON</Txt>
      <View style={styles.iconGrid}>
        {ICON_CHOICES.map((key) => {
          const Ic = getIcon(key);
          const on = key === icon;
          return (
            <Pressable key={key} onPress={() => setIcon(key)} style={[styles.iconTile, { backgroundColor: on ? colors.brandSoft : colors.cardBg, borderColor: on ? colors.brand : colors.border }]}>
              <Ic size={22} color={on ? colors.brand : colors.textSecondary} strokeWidth={2} />
            </Pressable>
          );
        })}
      </View>

      <Txt variant="caption" color={colors.textSecondary} style={styles.label}>RENK</Txt>
      <View style={styles.colorRow}>
        {HABIT_COLORS.map((c) => (
          <Pressable key={c} onPress={() => setColor(c)} style={[styles.swatch, { backgroundColor: c, borderColor: color === c ? colors.textPrimary : 'transparent' }]} />
        ))}
      </View>

      <Txt variant="caption" color={colors.textSecondary} style={styles.label}>SIKLIK</Txt>
      <View style={styles.chipRow}>
        {FREQS.map((f) => (
          <Chip key={f} label={FREQ_LABEL[f]} selected={freq === f} onPress={() => setFreq(f)} />
        ))}
      </View>

      <Txt variant="caption" color={colors.textSecondary} style={styles.label}>HAFTALIK HEDEF (İSTEĞE BAĞLI)</Txt>
      <View style={styles.goalRow}>
        <TextInput
          value={goalAmount}
          onChangeText={(t) => setGoalAmount(t.replace(/[^0-9]/g, ''))}
          placeholder="60"
          placeholderTextColor={colors.textTertiary}
          keyboardType="number-pad"
          style={[inputStyle, { height: 48, width: 90, textAlign: 'center' }]}
          maxLength={5}
        />
        <TextInput
          value={unit}
          onChangeText={setUnit}
          placeholder="birim (sayfa, km, dk…)"
          placeholderTextColor={colors.textTertiary}
          style={[inputStyle, { height: 48, flex: 1 }]}
          maxLength={12}
        />
      </View>
      <View style={{ marginTop: space.sm }}>
        <WeekdayPicker value={goalDays} onChange={setGoalDays} />
      </View>
      {hasGoal && (
        <Txt variant="caption" color={colors.textTertiary} style={{ marginTop: space.sm }}>
          Seçili {goalDays.length} güne bölünür → günlük ~{perDay} {unit.trim() || 'birim'}
        </Txt>
      )}

      {hasGoal && (
        <>
          <View style={styles.reminderRow}>
            <Bell size={18} color={reminderOn ? colors.brand : colors.textSecondary} strokeWidth={2} />
            <Txt variant="body" style={{ flex: 1 }}>Hedefi hatırlat</Txt>
            <Switch
              value={reminderOn}
              onValueChange={setReminderOn}
              trackColor={{ false: colors.trackBg, true: colors.brand }}
              thumbColor="#fff"
            />
          </View>
          {reminderOn && <TimePicker value={reminderTime} onChange={setReminderTime} />}
        </>
      )}

      <Txt variant="caption" color={colors.textSecondary} style={styles.label}>NOT (İSTEĞE BAĞLI)</Txt>
      <TextInput value={note} onChangeText={setNote} placeholder="Kısa bir hatırlatma…" placeholderTextColor={colors.textTertiary} multiline style={[inputStyle, { height: 84, paddingTop: space.md, textAlignVertical: 'top' }]} maxLength={120} />

      <Button label="Alışkanlık ekle" onPress={save} disabled={!canSave} fullWidth style={{ marginTop: space.xxl }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  handle: { width: 36, height: 4, borderRadius: radius.full, alignSelf: 'center', marginBottom: space.md, opacity: 0.6 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: space.xl },
  preview: { alignItems: 'center', gap: space.md, marginBottom: space.xl },
  previewIcon: { width: 60, height: 60, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center' },
  label: { marginTop: space.lg, marginBottom: space.sm, letterSpacing: 0.5 },
  iconGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  iconTile: { width: 52, height: 52, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', borderWidth: StyleSheet.hairlineWidth * 2 },
  colorRow: { flexDirection: 'row', flexWrap: 'wrap', gap: space.md },
  swatch: { width: 40, height: 40, borderRadius: radius.full, borderWidth: 3 },
  chipRow: { flexDirection: 'row', gap: space.sm, flexWrap: 'wrap' },
  goalRow: { flexDirection: 'row', gap: space.sm },
  reminderRow: { flexDirection: 'row', alignItems: 'center', gap: space.md, marginTop: space.lg },
});
