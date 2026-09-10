import { Pressable, Text, View } from 'react-native';
import type { MosqueWithDistance } from '@mihrab/core';
import { formatDistance, isStale } from '@mihrab/core';
import type { ThemeName } from '../theme';
import { getTheme } from '../theme';
import VerifiedBadge from './VerifiedBadge';

export default function MosqueRow({ m, theme, onPress }: { m: MosqueWithDistance; theme: ThemeName; onPress: () => void }) {
  const t = getTheme(theme);
  const stale = isStale(m.checked, m.verified);
  return (
    <Pressable onPress={onPress} style={{ paddingVertical: 13, borderTopWidth: 1, borderTopColor: t.colors.divider }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={{ fontFamily: 'Inter_500Medium', fontWeight: '600', fontSize: 16.5, color: t.colors.text }}>{m.name}</Text>
          {!stale && <VerifiedBadge color={t.colors.accent} size={12.5} />}
        </View>
        <Text style={{ fontSize: 11, color: t.colors.accent, textTransform: 'uppercase' }}>{formatDistance(m.distanceMeters)}</Text>
      </View>
      <Text style={{ fontSize: 12, color: t.colors.neutral700, marginTop: 3 }}>{m.school} · {m.area}</Text>
      <View style={{ flexDirection: 'row', gap: 6, marginTop: 7, flexWrap: 'wrap' }}>
        <View style={{ borderWidth: stale ? 1 : 0, borderColor: t.colors.accent, backgroundColor: stale ? 'transparent' : t.colors.accent100, borderRadius: 3, paddingHorizontal: 8, paddingVertical: 2 }}>
          <Text style={{ fontSize: 9.5, color: stale ? t.colors.accent : t.colors.accent800 }}>{stale ? 'Needs a check' : `Verified ${m.checked}`}</Text>
        </View>
        {m.facilities.slice(0, 2).map((f) => (
          <View key={f} style={{ backgroundColor: t.colors.neutral100, borderRadius: 3, paddingHorizontal: 8, paddingVertical: 2 }}>
            <Text style={{ fontSize: 9.5, color: t.colors.neutral800 }}>{f}</Text>
          </View>
        ))}
      </View>
    </Pressable>
  );
}
