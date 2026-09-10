import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppState } from '../state/AppState';
import { getTheme } from '../theme';
import Button from '../components/Button';

const FACILITIES = ["Women's section", 'Wudhu', 'Parking', 'Step-free', 'Library'];

export default function AddMosqueScreen({ navigation }: any) {
  const { theme } = useAppState();
  const t = getTheme(theme);
  const [needs, setNeeds] = useState<string[]>([]);
  const toggle = (f: string) => setNeeds((p) => (p.includes(f) ? p.filter((x) => x !== f) : [...p, f]));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.colors.bg }} edges={['top']}>
      <View style={[styles.header, { borderBottomColor: t.colors.divider }]}>
        <Text style={{ fontSize: 9.5, letterSpacing: 1.2, textTransform: 'uppercase', color: t.colors.accent, marginBottom: 4 }}>
          Step 1 of 3 · the essentials
        </Text>
        <Text style={{ fontFamily: 'CormorantGaramond_600SemiBold', fontSize: 22, color: t.colors.text }}>Add a mosque</Text>
      </View>
      <ScrollView style={{ padding: 18 }}>
        <View style={{ flexDirection: 'row', gap: 4, marginBottom: 18 }}>
          <View style={{ flex: 1, height: 3, backgroundColor: t.colors.accent }} />
          <View style={{ flex: 1, height: 3, backgroundColor: t.colors.divider }} />
          <View style={{ flex: 1, height: 3, backgroundColor: t.colors.divider }} />
        </View>
        <Text style={labelStyle(t.colors.neutral700)}>Name, as the community says it</Text>
        <TextInput style={[styles.input, { borderColor: t.colors.divider, color: t.colors.text }]} placeholder="Idara-e-Jaaferiya" placeholderTextColor={t.colors.neutral600} />

        <Text style={labelStyle(t.colors.neutral700)}>Address</Text>
        <TextInput style={[styles.input, { borderColor: t.colors.divider, color: t.colors.text, minHeight: 70 }]} placeholder="Street, area, postcode" placeholderTextColor={t.colors.neutral600} multiline />

        <Text style={labelStyle(t.colors.neutral700)}>Languages of the khutba</Text>
        <TextInput style={[styles.input, { borderColor: t.colors.divider, color: t.colors.text }]} placeholder="Urdu, English" placeholderTextColor={t.colors.neutral600} />

        <Text style={{ fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase', color: t.colors.accent, marginBottom: 8 }}>Facilities</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 18 }}>
          {FACILITIES.map((f) => (
            <Pressable key={f} onPress={() => toggle(f)} style={{ borderWidth: 1, borderColor: needs.includes(f) ? t.colors.accent : t.colors.divider, borderRadius: 4, paddingHorizontal: 12, paddingVertical: 7 }}>
              <Text style={{ fontSize: 12, color: needs.includes(f) ? t.colors.accent : t.colors.text }}>{f}</Text>
            </Pressable>
          ))}
        </View>

        <View style={{ borderWidth: 1, borderColor: t.colors.divider, borderRadius: 4, padding: 12, marginBottom: 18 }}>
          <Text style={{ fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase', color: t.colors.accent, marginBottom: 7 }}>Drop the pin</Text>
          <View style={{ height: 100, backgroundColor: t.colors.neutral100, borderWidth: 1, borderColor: t.colors.divider, borderRadius: 2, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: t.colors.accent, fontSize: 24 }}>📍</Text>
          </View>
          <Text style={{ fontSize: 11, color: t.colors.neutral700, marginTop: 7 }}>
            Drag to place it on the door, not the car park — people follow this pin in the dark.
          </Text>
        </View>

        <Button theme={theme} variant="primary" label="Next: timings" onPress={() => navigation.navigate('Tabs')} />
        <Text style={{ fontSize: 11.5, color: t.colors.neutral700, marginTop: 12, marginBottom: 24 }}>
          New entries land in the review queue as a fresh markdown file. Two moderators confirm a new mosque before
          it appears on the map.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const labelStyle = (color: string) => ({ fontSize: 12, marginBottom: 5, color });

const styles = StyleSheet.create({
  header: { paddingHorizontal: 18, paddingVertical: 12, borderBottomWidth: 1 },
  input: { minHeight: 46, borderWidth: 1, borderRadius: 4, padding: 10, fontSize: 15, marginBottom: 18 },
});
