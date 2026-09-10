import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppState } from '../state/AppState';
import { getTheme } from '../theme';
import Button from '../components/Button';

export default function YouScreen() {
  const { auth, favorites, mosques, theme, toggleTheme, locationOn, setLocationOn, supabaseConfigured } = useAppState();
  const t = getTheme(theme);
  const [email, setEmail] = useState('');

  const ThemeRow = (
    <>
      <Text style={{ fontSize: 13.5, color: t.colors.text, marginBottom: 8 }}>Appearance</Text>
      <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: t.colors.divider, borderRadius: 4, overflow: 'hidden', marginBottom: 18 }}>
        {(['light', 'dark'] as const).map((v, i) => (
          <Pressable
            key={v}
            onPress={() => theme !== v && toggleTheme()}
            style={{ flex: 1, paddingVertical: 10, alignItems: 'center', borderLeftWidth: i > 0 ? 1 : 0, borderLeftColor: t.colors.divider, backgroundColor: theme === v ? t.colors.accent100 : 'transparent' }}
          >
            <Text style={{ color: theme === v ? t.colors.accent : t.colors.text, textTransform: 'capitalize' }}>{v}</Text>
          </Pressable>
        ))}
      </View>
      <View style={[styles.settingRow, { borderTopColor: t.colors.divider }]}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 13.5, color: t.colors.text }}>Location</Text>
          <Text style={{ fontSize: 11.5, color: t.colors.neutral700 }}>{locationOn ? 'Granted while using the app.' : 'Off — search by city instead.'}</Text>
        </View>
        <Button theme={theme} variant="secondary" label={locationOn ? 'Turn off' : 'Allow'} onPress={() => setLocationOn(!locationOn)} />
      </View>
    </>
  );

  if (!auth?.session) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: t.colors.bg }} edges={['top']}>
        <ScrollView style={{ padding: 18 }}>
          <Text style={{ fontFamily: 'CormorantGaramond_600SemiBold', fontSize: 22, color: t.colors.text, marginBottom: 9 }}>You</Text>
          <Text style={{ fontSize: 13, color: t.colors.neutral700, marginBottom: 18, lineHeight: 19 }}>
            Sign in to save favourites, keep a quiet log of your visits, and — if the community asks you to — get
            access to the review queue. Reading and reporting stay open to everyone either way.
          </Text>
          {supabaseConfigured ? (
            <View style={{ flexDirection: 'row', gap: 9, marginBottom: 18 }}>
              <TextInput
                style={[styles.input, { flex: 1, borderColor: t.colors.divider, color: t.colors.text }]}
                placeholder="you@example.com"
                placeholderTextColor={t.colors.neutral600}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              <Button theme={theme} variant="primary" label="Send link" onPress={() => auth?.signInWithEmail(email)} />
            </View>
          ) : (
            <Text style={{ fontSize: 12, color: t.colors.neutral700, marginBottom: 18 }}>
              Supabase isn't configured yet — set EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY in
              apps/mobile/.env to enable sign-in.
            </Text>
          )}
          {ThemeRow}
        </ScrollView>
      </SafeAreaView>
    );
  }

  const favMosques = mosques.filter((m) => favorites?.favoriteIds.includes(m.id));
  const handle = `@${auth.session.user.email?.split('@')[0] ?? 'you'}`;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.colors.bg }} edges={['top']}>
      <ScrollView style={{ padding: 18 }}>
        <Text style={{ fontFamily: 'CormorantGaramond_600SemiBold', fontSize: 22, color: t.colors.text }}>{handle}</Text>
        <Text style={{ fontSize: 11.5, color: t.colors.neutral700, marginBottom: 18 }}>Member of the community register</Text>

        <Text style={{ fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase', color: t.colors.accent, marginBottom: 4 }}>Favourites</Text>
        {favMosques.length === 0 && (
          <Text style={{ fontSize: 12.5, color: t.colors.neutral700, paddingVertical: 12, borderTopWidth: 1, borderTopColor: t.colors.divider }}>
            Nothing saved yet — tap the heart on any record and it lands here.
          </Text>
        )}
        {favMosques.map((m) => (
          <View key={m.id} style={[styles.favRow, { borderTopColor: t.colors.divider }]}>
            <Text style={{ fontFamily: 'CormorantGaramond_600SemiBold', fontSize: 16, color: t.colors.text }}>{m.name}</Text>
          </View>
        ))}

        <View style={{ height: 1, backgroundColor: t.colors.divider, marginVertical: 18 }} />
        {ThemeRow}
        <Button theme={theme} variant="ghost" label="Sign out" onPress={() => auth.signOut()} style={{ marginTop: 18, alignSelf: 'flex-start' }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input: { minHeight: 46, borderWidth: 1, borderRadius: 4, padding: 10, fontSize: 15 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12, borderTopWidth: 1, paddingTop: 12 },
  favRow: { paddingVertical: 12, borderTopWidth: 1 },
});
