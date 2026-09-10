import { useMemo, useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { formatCheckedLine, isStale, withDistance, formatDistance, formatWalk } from '@mihrab/core';
import { useAppState } from '../state/AppState';
import { getTheme } from '../theme';
import VerifiedBadge from '../components/VerifiedBadge';
import Button from '../components/Button';

const PRAYER_ORDER = ['fajr', 'zohr', 'asr', 'maghrib', 'isha'] as const;
const PRAYER_LABEL: Record<(typeof PRAYER_ORDER)[number], string> = { fajr: 'Fajr', zohr: 'Zohr', asr: 'Asr', maghrib: 'Maghrib', isha: 'Isha' };

export default function DetailScreen({ route, navigation }: any) {
  const { id } = route.params;
  const { mosques, position, favorites, auth, theme } = useAppState();
  const t = getTheme(theme);
  const [directionsOpen, setDirectionsOpen] = useState(false);

  const mosque = mosques.find((m) => m.id === id);
  const [withDist] = useMemo(() => (mosque ? withDistance([mosque], position) : []), [mosque, position]);

  if (!mosque || !withDist) return null;
  const stale = isStale(mosque.checked, mosque.verified);
  const isFav = favorites?.favoriteIds.includes(mosque.id) ?? false;

  const requireAuth = (action: () => void) => {
    if (!auth?.session) { Alert.alert('Sign in required', 'Sign in to save favourites, log visits, or suggest edits.'); return; }
    action();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.colors.bg }} edges={['top']}>
      <View style={[styles.header, { borderBottomColor: t.colors.divider }]}>
        <Pressable onPress={() => navigation.goBack()} style={{ padding: 8 }}><Text style={{ color: t.colors.text, fontSize: 20 }}>‹</Text></Pressable>
        <Text style={{ flex: 1, fontSize: 9.5, letterSpacing: 1.2, textTransform: 'uppercase', color: t.colors.neutral700 }}>register/{mosque.slug}.md</Text>
        <Pressable onPress={() => requireAuth(() => favorites!.toggle(mosque.id))} style={{ padding: 8 }}>
          <Text style={{ color: isFav ? t.colors.accent : t.colors.text, fontSize: 18 }}>{isFav ? '♥' : '♡'}</Text>
        </Pressable>
      </View>

      <ScrollView style={{ paddingHorizontal: 18 }}>
        <View style={[styles.plate, { backgroundColor: t.colors.neutral200 }]}>
          <Text style={{ fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: t.colors.neutral600, textAlign: 'center' }}>
            No photograph yet — send one in
          </Text>
        </View>

        <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 27, color: t.colors.text, marginTop: 12, marginBottom: 5 }}>{mosque.name}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7, flexWrap: 'wrap', marginBottom: 9 }}>
          {!stale && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              <VerifiedBadge color={t.colors.accent} />
              <Text style={{ fontSize: 11, color: t.colors.accent, textTransform: 'uppercase' }}>Verified</Text>
            </View>
          )}
          {stale && (
            <View style={{ borderWidth: 1, borderColor: t.colors.accent, borderRadius: 3, paddingHorizontal: 8, paddingVertical: 2 }}>
              <Text style={{ fontSize: 10, color: t.colors.accent }}>Needs a check</Text>
            </View>
          )}
          <Text style={{ fontSize: 11.5, color: t.colors.neutral700 }}>{formatCheckedLine(mosque.checked, mosque.checkedBy, mosque.verified)}</Text>
        </View>
        <Text style={{ fontSize: 13.5, color: t.colors.text, marginBottom: 18 }}>
          {mosque.address}{'\n'}
          <Text style={{ color: t.colors.neutral700 }}>{formatDistance(withDist.distanceMeters)} from you · {formatWalk(withDist.walkMinutes)}</Text>
        </Text>

        <View style={{ flexDirection: 'row', gap: 9, marginBottom: 27 }}>
          <Button theme={theme} variant="primary" label="Directions" onPress={() => setDirectionsOpen(true)} style={{ flex: 1 }} />
          <Button theme={theme} variant="secondary" label="I prayed here" onPress={() => requireAuth(() => Alert.alert('Visit logged'))} style={{ flex: 1 }} />
        </View>

        <Text style={kickerStyle(t.colors.accent)}>Jamaat timings</Text>
        <View style={{ marginBottom: 9 }}>
          <View style={[styles.tableRow, { borderBottomColor: t.colors.divider }]}>
            <Text style={[styles.th, { color: t.colors.neutral700 }]}>Prayer</Text>
            <Text style={[styles.th, { color: t.colors.neutral700, textAlign: 'right', flex: 1 }]}>Adhan</Text>
            <Text style={[styles.th, { color: t.colors.neutral700, textAlign: 'right', flex: 1 }]}>Jamaat</Text>
          </View>
          {PRAYER_ORDER.map((p) => (
            <View key={p} style={[styles.tableRow, { borderBottomColor: t.colors.divider }]}>
              <Text style={{ fontFamily: 'Inter_500Medium', color: p === 'maghrib' ? t.colors.accent700 : t.colors.text, width: 80 }}>{PRAYER_LABEL[p]}</Text>
              <Text style={{ textAlign: 'right', flex: 1, color: t.colors.neutral700 }}>{mosque.jamaat[p].adhan}</Text>
              <Text style={{ textAlign: 'right', flex: 1, color: p === 'maghrib' ? t.colors.accent700 : t.colors.text }}>{mosque.jamaat[p].jamaat}</Text>
            </View>
          ))}
        </View>
        <Text style={{ fontSize: 11, color: t.colors.neutral700, marginBottom: 27 }}>{mosque.timesNote}</Text>

        <Text style={kickerStyle(t.colors.accent)}>The record</Text>
        <View style={{ marginBottom: 27 }}>
          {[
            { label: 'School', value: mosque.school },
            { label: 'Languages', value: mosque.languages.join(', ') },
            { label: 'Facilities', value: mosque.facilities.join(', ') },
            { label: 'Telephone', value: mosque.phone },
            { label: 'Website', value: mosque.website },
          ].map((f) => (
            <View key={f.label} style={[styles.fieldRow, { borderTopColor: t.colors.divider }]}>
              <Text style={{ fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: t.colors.neutral700, width: 88 }}>{f.label}</Text>
              <Text style={{ flex: 1, fontSize: 13, textAlign: 'right', color: t.colors.text }}>{f.value}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.eventCard, { borderColor: t.colors.divider }]}>
          <Text style={kickerStyle(t.colors.accent)}>What's on</Text>
          <Text style={{ fontSize: 13.5, color: t.colors.text }}>{mosque.event}</Text>
          <View style={{ height: 1, backgroundColor: t.colors.divider, marginVertical: 12 }} />
          <Text style={kickerStyle(t.colors.accent)}>From the community</Text>
          <Text style={{ fontSize: 13, fontStyle: 'italic', color: t.colors.text }}>"{mosque.notes}"</Text>
          <Text style={{ fontSize: 11, color: t.colors.neutral700, marginTop: 6 }}>{mosque.notesBy}</Text>
        </View>

        <View style={{ gap: 9, marginBottom: 24 }}>
          <Button theme={theme} variant="secondary" label="Suggest an edit" onPress={() => requireAuth(() => navigation.navigate('Edit', { id: mosque.id }))} />
          <Button theme={theme} variant="ghost" label="Something wrong? Report it — no account needed" onPress={() => {}} />
        </View>
      </ScrollView>

      <Modal visible={directionsOpen} transparent animationType="slide" onRequestClose={() => setDirectionsOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setDirectionsOpen(false)}>
          <View style={[styles.dialog, { backgroundColor: t.colors.surface, borderColor: t.colors.divider }]}>
            <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 18, color: t.colors.text, marginBottom: 9 }}>Open {mosque.name} in</Text>
            {['Apple Maps', 'Google Maps', 'Citymapper'].map((app) => (
              <Pressable key={app} onPress={() => setDirectionsOpen(false)} style={[styles.mapAppRow, { borderTopColor: t.colors.divider }]}>
                <Text style={{ fontSize: 14.5, color: t.colors.text }}>{app}</Text>
                <Text style={{ fontSize: 11.5, color: t.colors.neutral700 }}>{formatWalk(withDist.walkMinutes)}</Text>
              </Pressable>
            ))}
            <Button theme={theme} variant="secondary" label="Copy the address instead" onPress={() => setDirectionsOpen(false)} style={{ marginTop: 9 }} />
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const kickerStyle = (color: string) => ({ fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase' as const, color, marginBottom: 9 });

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 8, borderBottomWidth: 1 },
  plate: { height: 128, borderRadius: 2, alignItems: 'center', justifyContent: 'center', marginTop: 12 },
  tableRow: { flexDirection: 'row', paddingVertical: 9, borderBottomWidth: 1 },
  th: { fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', width: 80 },
  fieldRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, paddingVertical: 11, borderTopWidth: 1 },
  eventCard: { borderWidth: 1, borderRadius: 4, padding: 12, marginBottom: 18 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  dialog: { borderTopLeftRadius: 7, borderTopRightRadius: 7, borderWidth: 1, padding: 18, gap: 4 },
  mapAppRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 13, borderTopWidth: 1 },
});
