import Svg, { Path } from 'react-native-svg';

export default function VerifiedBadge({ color, size = 13 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M12 2l7.5 3.2v6.1c0 4.6-3.1 8.8-7.5 10.4-4.4-1.6-7.5-5.8-7.5-10.4V5.2z" />
      <Path d="M8.6 12.2l2.5 2.4 4.3-4.6" />
    </Svg>
  );
}
