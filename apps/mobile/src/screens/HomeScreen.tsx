import { useMemo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { withDistance, sortByDistance, formatDistance, formatWalk } from '@mihrab/core';
import { useAppState } from '../state/AppState';
import { getTheme } from '../theme';
import VerifiedBadge from '../components/VerifiedBadge';

const HARROWFIELD = { lat: 51.5556, lng: -0.038 };

export default function HomeScreen({ navigation }: any) {
  const { mosques, loading, position, locationOn, setLocationOn, toggleTheme, select, theme } = useAppState();
  const t = getTheme(theme);

  const withDist = useMemo(
    () => sortByDistance(withDistance(mosques, position ?? HARROWFIELD)),
    [mosques, position]
  );
  const hero = withDist[0];
  const alsoNear = withDist.slice(1, 4);

  const openMosque = (id: string) => {
    select(id);
    navigation.navigate('Detail', { id });
  };

  return (
    <View style={{ flex: 1, backgroundColor: t.colors.bg }}>
      <SafeAreaView edges={['top']} style={{ backgroundColor: t.colors.bg }}>
        <View style={[styles.header, { borderBottomColor: t.colors.divider }]}>
          <View>
            <Text style={[styles.brand, { color: t.colors.text }]}>Mihrab</Text>
            <Text style={{ fontSize: 9.5, letterSpacing: 1.5, textTransform: 'uppercase', color: t.colors.accent }}>
              Harrowfield · {loading ? '…' : `${withDist.length} mosques`}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            <Pressable style={[styles.iconBtn, { borderColor: t.colors.divider }]} onPress={() => navigation.navigate('Search')}>
              <Text style={{ color: t.colors.text }}>🔍</Text>
            </Pressable>
            <Pressable style={[styles.iconBtn, { borderColor: t.colors.divider }]} onPress={toggleTheme}>
              <Text style={{ color: t.colors.text }}>{theme === 'dark' ? '☾' : '☀'}</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>

      <View style={{ flex: 1 }}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={{ flex: 1 }}
          initialRegion={{
            latitude: (position ?? HARROWFIELD).lat,
            longitude: (position ?? HARROWFIELD).lng,
            latitudeDelta: 0.03,
            longitudeDelta: 0.03,
          }}
        >
          {withDist.map((m) => (
            <Marker
              key={m.id}
              coordinate={{ latitude: m.coordinates.lat, longitude: m.coordinates.lng }}
              title={m.name}
              onPress={() => openMosque(m.id)}
            />
          ))}
        </MapView>
        <Pressable
          style={[styles.locateBtn, { backgroundColor: t.colors.bg, borderColor: t.colors.divider }]}
          onPress={() => setLocationOn(!locationOn)}
        >
          <Text>⌖</Text>
        </Pressable>
      </View>

      <View style={[styles.sheet, { backgroundColor: t.colors.bg, borderTopColor: t.colors.divider }]}>
        <View style={[styles.handle, { backgroundColor: t.colors.divider }]} />
        {hero && (
          <Pressable onPress={() => openMosque(hero.id)} style={[styles.hero, { borderBottomColor: t.colors.divider }]}>
            <Text style={{ fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase', color: t.colors.accent, marginBottom: 5 }}>
              Nearest to you now
            </Text>
            <Text style={{ fontFamily: 'CormorantGaramond_400Regular', fontSize: 29, color: t.colors.text, marginBottom: 6 }}>
              {hero.name}
            </Text>
            <View style={{ flexDirection: 'row', gap: 8, alignItems: 'baseline' }}>
              <Text style={{ fontFamily: 'CormorantGaramond_600SemiBold', color: t.colors.accent700 }}>{hero.jamaat.maghrib.jamaat}</Text>
              <Text style={{ color: t.colors.neutral700 }}>·</Text>
              <Text style={{ color: t.colors.text }}>{formatWalk(hero.walkMinutes)}</Text>
              <Text style={{ color: t.colors.neutral700 }}>·</Text>
              <Text style={{ color: t.colors.text }}>{formatDistance(hero.distanceMeters)}</Text>
            </View>
          </Pressable>
        )}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 9 }}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: t.colors.text }}>Also near</Text>
          <Text style={{ fontSize: 10.5, color: t.colors.neutral700 }}>by walking time</Text>
        </View>
        {alsoNear.map((m) => (
          <Pressable
            key={m.id}
            onPress={() => openMosque(m.id)}
            style={[styles.alsoRow, { borderTopColor: t.colors.divider }]}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={{ fontFamily: 'CormorantGaramond_600SemiBold', fontSize: 15.5, color: t.colors.text }}>{m.name}</Text>
              <VerifiedBadge color={t.colors.accent} size={12} />
            </View>
            <Text style={{ fontSize: 11, color: t.colors.accent, textTransform: 'uppercase' }}>{formatDistance(m.distanceMeters)}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 12, borderBottomWidth: 1 },
  brand: { fontFamily: 'CormorantGaramond_600SemiBold', fontWeight: '600', fontSize: 22 },
  iconBtn: { width: 40, height: 40, borderRadius: 4, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  locateBtn: { position: 'absolute', right: 12, bottom: 12, width: 44, height: 44, borderRadius: 22, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  sheet: { borderTopWidth: 1, paddingHorizontal: 18, paddingTop: 9, paddingBottom: 18 },
  handle: { width: 44, height: 3, borderRadius: 2, alignSelf: 'center', marginBottom: 13 },
  hero: { borderBottomWidth: 1, paddingBottom: 13, marginBottom: 4 },
  alsoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderTopWidth: 1, minHeight: 44 },
});
