import { View } from 'react-native';

export default function TabBarDot({ color, shape }: { color: string; shape: 'circle' | 'square' | 'rounded' }) {
  const borderRadius = shape === 'circle' ? 8 : shape === 'rounded' ? 5 : 2;
  return <View style={{ width: 16, height: 16, borderRadius, borderWidth: 1.4, borderColor: color }} />;
}
