import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppState } from '../state/AppState';
import { getTheme } from '../theme';
import Button from '../components/Button';

export default function OnboardingScreen({ navigation }: any) {
  const { setLocationOn, theme } = useAppState();
  const t = getTheme(theme);

  const go = async (grant: boolean) => {
    await setLocationOn(grant);
    navigation.replace('Tabs');
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: t.colors.bg }]}>
      <View style={[styles.dialog, { backgroundColor: t.colors.surface, borderColor: t.colors.divider }]}>
        <Text style={[styles.title, { color: t.colors.text }]}>Salaam.{'\n'}Let's find you a jamaat.</Text>
        <Text style={[styles.body, { color: t.colors.text }]}>
          Share your location and Mihrab will put the nearest mosque — and the next jamaat you can still make — at
          the top of the screen. Nothing is sent to a server; the whole register is public data.
        </Text>
        <View style={{ gap: 9, marginTop: 9 }}>
          <Button theme={theme} variant="primary" label="Use my location" onPress={() => go(true)} />
          <Button theme={theme} variant="secondary" label="Just this once" onPress={() => go(true)} />
          <Button theme={theme} variant="ghost" label="I'll search a city instead" onPress={() => go(false)} />
        </View>
        <View style={{ height: 1, backgroundColor: t.colors.divider, marginVertical: 9 }} />
        <Text style={{ fontSize: 11.5, color: t.colors.neutral700, lineHeight: 17 }}>
          No account needed to look anything up. Registering only adds your favourites, a quiet log of visits, and —
          if the community asks you to — the review queue.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 18 },
  dialog: { width: '100%', maxWidth: 400, borderRadius: 7, borderWidth: 1, padding: 18, gap: 13 },
  title: { fontFamily: 'CormorantGaramond_400Regular', fontSize: 34, lineHeight: 36 },
  body: { fontSize: 14, lineHeight: 20 },
});
