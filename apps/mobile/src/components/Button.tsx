import { Pressable, Text, type StyleProp, type ViewStyle } from 'react-native';
import { getTheme, type ThemeName } from '../theme';

type Variant = 'primary' | 'secondary' | 'ghost';

export default function Button({
  label, onPress, theme, variant = 'secondary', style, disabled,
}: {
  label: string; onPress?: () => void; theme: ThemeName; variant?: Variant;
  style?: StyleProp<ViewStyle>; disabled?: boolean;
}) {
  const t = getTheme(theme);
  const border = variant === 'primary' ? t.colors.accent : variant === 'secondary' ? t.colors.divider : 'transparent';
  const color = variant === 'secondary' ? t.colors.text : t.colors.accent;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[{
        minHeight: 46, borderRadius: 4, borderWidth: variant === 'ghost' ? 0 : 1, borderColor: border,
        alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16, opacity: disabled ? 0.45 : 1,
      }, style]}
    >
      <Text style={{ color, fontFamily: 'CormorantGaramond_600SemiBold', fontWeight: '600', fontSize: 14 }}>{label}</Text>
    </Pressable>
  );
}
