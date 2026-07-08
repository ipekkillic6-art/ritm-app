import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import {
  InterTight_600SemiBold,
  InterTight_700Bold,
  InterTight_800ExtraBold,
} from '@expo-google-fonts/inter-tight';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { todayKey } from './src/lib/date';
import { makeHabit } from './src/lib/habits';
import { cancelReminders, initNotifications, scheduleGoalReminders } from './src/lib/notifications';
import { AddHabitScreen } from './src/screens/AddHabitScreen';
import { HabitDetailScreen } from './src/screens/HabitDetailScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { MOCK_HABITS } from './src/screens/mock';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { StatsScreen } from './src/screens/StatsScreen';
import { ThemeProvider, useTheme } from './src/theme/theme';
import { FloatingTabBar } from './src/ui/FloatingTabBar';

/** Sekmeli kabuk — alışkanlık state'ini tutar, ekranları ve ekle modalını yönetir. */
function TabShell({ onReplayOnboarding }) {
  const [tab, setTab] = useState('home');
  const [adding, setAdding] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [habits, setHabits] = useState(MOCK_HABITS);

  // Bildirim davranışını (native) bir kez ayarla
  useEffect(() => {
    initNotifications();
  }, []);

  // Belirli bir günü işaretle/kaldır
  const toggleDate = (id, key) =>
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h;
        const has = h.completedDates.includes(key);
        return {
          ...h,
          completedDates: has ? h.completedDates.filter((d) => d !== key) : [...h.completedDates, key],
        };
      }),
    );

  const toggle = (id) => toggleDate(id, todayKey());

  const addHabit = (form) => {
    const h = makeHabit(form);
    setHabits((prev) => [h, ...prev]);
    setAdding(false);
    setTab('home');
    // Hatırlatıcı varsa planla (native), dönen id'leri sakla
    if (h.reminder?.enabled) {
      scheduleGoalReminders(h).then((ids) => {
        if (ids.length) setHabits((prev) => prev.map((x) => (x.id === h.id ? { ...x, reminderIds: ids } : x)));
      });
    }
  };

  const deleteHabit = (id) => {
    const h = habits.find((x) => x.id === id);
    if (h?.reminderIds) cancelReminders(h.reminderIds);
    setHabits((prev) => prev.filter((x) => x.id !== id));
    setSelectedId(null);
  };

  // Hatırlatıcıyı aç/kapat/güncelle: reminder=null → kapat
  const setReminder = async (habit, reminder) => {
    await cancelReminders(habit.reminderIds);
    const updated = { ...habit, reminder: reminder || undefined };
    const ids = reminder?.enabled ? await scheduleGoalReminders(updated) : [];
    setHabits((prev) => prev.map((x) => (x.id === habit.id ? { ...updated, reminderIds: ids } : x)));
  };

  // Hedef/hatırlatıcı günlerini değiştir; hatırlatıcı açıksa yeniden planla
  const setGoalDays = async (habit, days) => {
    if (!days.length) return; // en az bir gün
    const updated = { ...habit, goalDays: days };
    if (habit.reminder?.enabled) {
      await cancelReminders(habit.reminderIds);
      const ids = await scheduleGoalReminders(updated);
      setHabits((prev) => prev.map((x) => (x.id === habit.id ? { ...updated, reminderIds: ids } : x)));
    } else {
      setHabits((prev) => prev.map((x) => (x.id === habit.id ? updated : x)));
    }
  };

  const selected = habits.find((h) => h.id === selectedId);

  return (
    <View style={{ flex: 1 }}>
      {tab === 'home' && <HomeScreen habits={habits} onToggle={toggle} onAdd={() => setAdding(true)} onOpen={setSelectedId} />}
      {tab === 'stats' && <StatsScreen habits={habits} />}
      {tab === 'profile' && <ProfileScreen habits={habits} onReplayOnboarding={onReplayOnboarding} />}
      <FloatingTabBar active={tab} onSelect={setTab} />

      {/* Alışkanlık detayı — tam ekran katman */}
      {selected && (
        <View style={StyleSheet.absoluteFill}>
          <HabitDetailScreen
            habit={selected}
            onBack={() => setSelectedId(null)}
            onDelete={() => deleteHabit(selected.id)}
            onToggleDate={(key) => toggleDate(selected.id, key)}
            onToggleToday={() => toggle(selected.id)}
            onSetReminder={(r) => setReminder(selected, r)}
            onSetGoalDays={(days) => setGoalDays(selected, days)}
          />
        </View>
      )}

      {/* Ekle modalı — tab kabuğunun üzerinde tam ekran katman */}
      {adding && (
        <View style={StyleSheet.absoluteFill}>
          <AddHabitScreen onClose={() => setAdding(false)} onSave={addHabit} />
        </View>
      )}
    </View>
  );
}

function Root() {
  const { mode } = useTheme();
  // Basit ekran yönlendirmesi (expo-router yok): onboarding -> tab kabuğu
  const [route, setRoute] = useState('onboarding');

  return (
    <>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      {route === 'onboarding' ? (
        <OnboardingScreen onStart={() => setRoute('app')} />
      ) : (
        <TabShell onReplayOnboarding={() => setRoute('onboarding')} />
      )}
    </>
  );
}

export default function App() {
  const [loaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    InterTight_600SemiBold,
    InterTight_700Bold,
    InterTight_800ExtraBold,
  });

  if (!loaded) return null;

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <Root />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
