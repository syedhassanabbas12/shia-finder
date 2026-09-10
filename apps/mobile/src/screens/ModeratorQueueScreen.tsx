import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppState } from '../state/AppState';
import { getTheme } from '../theme';
import Button from '../components/Button';

export default function ModeratorQueueScreen() {
  const { editQueue, theme } = useAppState();
  const t = getTheme(theme);

  if (!editQueue) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: t.colors.bg, padding: 24 }} edges={['top']}>
        <Text style={{ fontSize: 13, color: t.colors.neutral700, textAlign: 'center' }}>
          Moderator tools need an account with moderator rights — turn on "Moderator tools" from the You tab once
          Supabase is wired up.
        </Text>
      </SafeAreaView>
    );
  }

  const { queue, approve, reject } = editQueue;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.colors.bg }} edges={['top']}>
      <View style={[styles.header, { borderBottomColor: t.colors.divider }]}>
        <Text style={{ fontSize: 9.5, letterSpacing: 1.2, textTransform: 'uppercase', color: t.colors.accent, marginBottom: 4 }}>Moderator</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <Text style={{ fontFamily: 'CormorantGaramond_600SemiBold', fontSize: 22, color: t.colors.text }}>Review queue</Text>
          <Text style={{ fontSize: 11.5, color: t.colors.neutral700 }}>{queue.length} waiting</Text>
        </View>
      </View>
      <ScrollView style={{ padding: 18 }}>
        {queue.map((q) => (
          <View key={q.id} style={[styles.card, { borderColor: t.colors.divider }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: t.colors.accent }}>{q.field}</Text>
              <Text style={{ fontSize: 10.5, color: t.colors.neutral700 }}>{new Date(q.submittedAt).toLocaleDateString()}</Text>
            </View>
            <Text style={{ fontFamily: 'CormorantGaramond_600SemiBold', fontSize: 17, color: t.colors.text }}>{q.mosqueId}</Text>
            <Text><Text style={{ fontSize: 9.5, color: t.colors.neutral700 }}>was  </Text><Text style={{ textDecorationLine: 'line-through', color: t.colors.neutral700 }}>{q.fromValue}</Text></Text>
            <Text><Text style={{ fontSize: 9.5, color: t.colors.accent }}>now  </Text><Text style={{ color: t.colors.accent700 }}>{q.toValue}</Text></Text>
            <Text style={{ fontSize: 11.5, color: t.colors.neutral700, fontStyle: 'italic', borderLeftWidth: 1, borderLeftColor: t.colors.divider, paddingLeft: 9 }}>{q.source}</Text>
            <Text style={{ fontSize: 11, color: t.colors.neutral700 }}>{q.submittedBy}</Text>
            <View style={{ flexDirection: 'row', gap: 9, marginTop: 4 }}>
              <Button theme={theme} variant="primary" label="Confirm" onPress={() => approve(q.id)} style={{ flex: 1 }} />
              <Button theme={theme} variant="secondary" label="Not yet" onPress={() => reject(q.id)} />
            </View>
          </View>
        ))}
        {queue.length === 0 && (
          <View style={[styles.empty, { borderColor: t.colors.divider }]}>
            <Text style={{ fontFamily: 'CormorantGaramond_600SemiBold', fontSize: 19, color: t.colors.text, marginBottom: 6 }}>All caught up</Text>
            <Text style={{ fontSize: 12.5, color: t.colors.neutral700, textAlign: 'center' }}>
              Jazak Allah. Records lose their verified mark after a year and come back here for a fresh look.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 18, paddingVertical: 12, borderBottomWidth: 1 },
  card: { borderWidth: 1, borderRadius: 4, padding: 13, gap: 6, marginBottom: 12 },
  empty: { alignItems: 'center', padding: 36, borderWidth: 1, borderRadius: 4 },
});
