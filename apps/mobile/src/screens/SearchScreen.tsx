import { useMemo, useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { withDistance, sortByDistance, type School } from '@mihrab/core';
import { useAppState } from '../state/AppState';
import { getTheme } from '../theme';
import MosqueRow from '../components/MosqueRow';
import Button from '../components/Button';

const SCHOOLS: (School | 'All')[] = ['All', 'Ithna Ashari', 'Ismaili', 'Bohra'];
const FACILITIES = ["Women's section", 'Wudhu', 'Parking', 'Step-free', 'Library'];

export default function SearchScreen({ navigation }: any) {
  const { mosques, position, select, theme } = useAppState();
  const t = getTheme(theme);
  const [query, setQuery] = useState('');
  const [school, setSchool] = useState<(typeof SCHOOLS)[number]>('All');
  const [needs, setNeeds] = useState<string[]>([]);

  const results = useMemo(() => {
    const filtered = mosques.filter((m) =>
      (school === 'All' || m.school === school) &&
      needs.every((n) => m.facilities.includes(n)) &&
      (query.trim() === '' || m.name.toLowerCase().includes(query.toLowerCase()) || m.area.toLowerCase().includes(query.toLowerCase()))
    );
    return sortByDistance(withDistance(filtered, position));
  }, [mosques, school, needs, query, position]);

  const toggleNeed = (f: string) => setNeeds((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.colors.bg }} edges={['top']}>
      <View style={[styles.header, { borderBottomColor: t.colors.divider }]}>
        <View style={[styles.searchBox, { borderColor: t.colors.accent }]}>
          <TextInput
            style={{ flex: 1, fontSize: 15, color: t.colors.text }}
            placeholder="A city, an area, or a mosque"
            placeholderTextColor={t.colors.neutral600}
            value={query}
            onChangeText={setQuery}
          />
        </View>
        <Text style={labelStyle(t.colors.accent)}>School</Text>
        <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: t.colors.divider, borderRadius: 4, overflow: 'hidden', marginBottom: 12 }}>
          {SCHOOLS.map((s, i) => (
            <Pressable
              key={s}
              onPress={() => setSchool(s)}
              style={{ flex: 1, paddingVertical: 9, alignItems: 'center', borderLeftWidth: i > 0 ? 1 : 0, borderLeftColor: t.colors.divider, backgroundColor: school === s ? t.colors.accent100 : 'transparent' }}
            >
              <Text style={{ fontSize: 12, color: school === s ? t.colors.accent : t.colors.text }}>{s}</Text>
            </Pressable>
          ))}
        </View>
        <Text style={labelStyle(t.colors.accent)}>Must have</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
          {FACILITIES.map((f) => (
            <Pressable
              key={f}
              onPress={() => toggleNeed(f)}
              style={{ borderWidth: 1, borderColor: needs.includes(f) ? t.colors.accent : t.colors.divider, borderRadius: 4, paddingHorizontal: 12, paddingVertical: 7 }}
            >
              <Text style={{ fontSize: 12, color: needs.includes(f) ? t.colors.accent : t.colors.text }}>{f}</Text>
            </Pressable>
          ))}
        </View>
      </View>
      <ScrollView style={{ paddingHorizontal: 18 }}>
        <Text style={{ fontWeight: '600', paddingVertical: 13, color: t.colors.text }}>
          {results.length === 1 ? 'One in the register' : `${results.length} in the register`}
        </Text>
        {results.map((m) => (
          <MosqueRow key={m.id} m={m} theme={theme} onPress={() => { select(m.id); navigation.navigate('Detail', { id: m.id }); }} />
        ))}
        <View style={{ borderTopWidth: 1, borderTopColor: t.colors.divider, paddingTop: 18, marginTop: 12, alignItems: 'center', paddingBottom: 24 }}>
          <Text style={{ fontSize: 12.5, color: t.colors.neutral700, marginBottom: 9 }}>Somewhere missing from the register?</Text>
          <Button theme={theme} variant="primary" label="Add a mosque" onPress={() => navigation.navigate('AddMosque')} style={{ paddingHorizontal: 24 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const labelStyle = (color: string) => ({ fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase' as const, color, marginBottom: 7 });

const styles = StyleSheet.create({
  header: { paddingHorizontal: 18, paddingTop: 12, paddingBottom: 12, borderBottomWidth: 1 },
  searchBox: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 4, paddingHorizontal: 10, height: 44, marginBottom: 12 },
});
