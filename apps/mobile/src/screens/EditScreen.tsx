import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { EditableField } from '@mihrab/core';
import { useAppState } from '../state/AppState';
import { getTheme } from '../theme';
import Button from '../components/Button';

const FIELDS: { key: EditableField; label: string }[] = [
  { key: 'times', label: 'Jamaat timings' },
  { key: 'address', label: 'Address' },
  { key: 'phone', label: 'Telephone' },
  { key: 'langs', label: 'Languages' },
  { key: 'facilities', label: 'Facilities' },
];

export default function EditScreen({ route, navigation }: any) {
  const { id } = route.params;
  const { mosques, auth, theme } = useAppState();
  const t = getTheme(theme);
  const mosque = mosques.find((m) => m.id === id);
  const [field, setField] = useState<EditableField>('times');
  const [draft, setDraft] = useState('');
  const [source, setSource] = useState('');
  const [attest, setAttest] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!mosque) return null;
  const currentValues: Record<EditableField, string> = {
    times: `${mosque.jamaat.maghrib.jamaat} Maghrib, ${mosque.jamaat.isha.jamaat} Isha`,
    address: mosque.address,
    phone: mosque.phone,
    langs: mosque.languages.join(', '),
    facilities: mosque.facilities.join(', '),
  };
  const handle = auth?.session?.user.email ? `@${auth.session.user.email.split('@')[0]}` : '@you';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.colors.bg }} edges={['top']}>
      <View style={[styles.header, { borderBottomColor: t.colors.divider }]}>
        <Pressable onPress={() => navigation.goBack()} style={{ padding: 8 }}><Text style={{ color: t.colors.text, fontSize: 20 }}>‹</Text></Pressable>
        <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 19, color: t.colors.text }}>Suggest an edit</Text>
      </View>
      <ScrollView style={{ padding: 18 }}>
        <Text style={[styles.notice, { color: t.colors.neutral700, borderLeftColor: t.colors.accent }]}>
          You're signed in as {handle}, so this goes out as a pull request on register/{mosque.slug}.md with your
          name on it. A moderator from the community confirms it — usually within a day or two.
        </Text>

        <Text style={labelStyle(t.colors.neutral700)}>Which detail needs fixing?</Text>
        {FIELDS.map((f) => (
          <Pressable key={f.key} onPress={() => setField(f.key)} style={[styles.fieldOpt, { borderTopColor: t.colors.divider }]}>
            <View>
              <Text style={{ fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: t.colors.neutral700 }}>{f.label}</Text>
              <Text style={{ fontSize: 13, color: t.colors.text }}>{currentValues[f.key]}</Text>
            </View>
            <View style={{ width: 16, height: 16, borderRadius: 8, borderWidth: 1.5, borderColor: t.colors.accent, backgroundColor: field === f.key ? t.colors.accent : 'transparent' }} />
          </Pressable>
        ))}

        <Text style={labelStyle(t.colors.neutral700)}>What should it say?</Text>
        <TextInput style={[styles.input, { borderColor: t.colors.divider, color: t.colors.text }]} value={draft} onChangeText={setDraft} />

        <Text style={labelStyle(t.colors.neutral700)}>How do you know? A source helps it get merged.</Text>
        <TextInput
          style={[styles.input, { borderColor: t.colors.divider, color: t.colors.text, minHeight: 80 }]}
          value={source}
          onChangeText={setSource}
          placeholder="e.g. announced at the centre last Friday; photo of the noticeboard"
          placeholderTextColor={t.colors.neutral600}
          multiline
        />

        <Pressable onPress={() => setAttest(!attest)} style={{ flexDirection: 'row', gap: 10, marginVertical: 18, alignItems: 'flex-start' }}>
          <View style={{ width: 18, height: 18, borderWidth: 1.5, borderColor: t.colors.accent, borderRadius: 3, backgroundColor: attest ? t.colors.accent : 'transparent', marginTop: 1 }} />
          <Text style={{ fontSize: 12, color: t.colors.neutral700, flex: 1 }}>I've seen this myself, or I can point to where it came from.</Text>
        </Pressable>

        <Button
          theme={theme}
          variant="primary"
          label={submitted ? 'Sent — waiting on a moderator' : 'Send it in'}
          disabled={!draft || !attest || submitted}
          onPress={() => setSubmitted(true)}
        />
        <Text style={{ fontSize: 11.5, color: t.colors.neutral700, textAlign: 'center', marginTop: 13, marginBottom: 24 }}>
          {submitted
            ? 'Your suggestion is at the top of the review queue. Confirm it there and the record re-dates itself.'
            : 'It will show as an open pull request on the record until a moderator confirms it.'}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const labelStyle = (color: string) => ({ fontSize: 12, marginBottom: 5, marginTop: 4, color });

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 8, borderBottomWidth: 1 },
  notice: { fontSize: 12.5, borderLeftWidth: 2, paddingLeft: 12, marginBottom: 18, lineHeight: 18 },
  fieldOpt: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderTopWidth: 1, alignItems: 'center' },
  input: { minHeight: 46, borderWidth: 1, borderRadius: 4, padding: 10, fontSize: 15, marginBottom: 18 },
});
