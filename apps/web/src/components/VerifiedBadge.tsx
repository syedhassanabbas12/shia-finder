export default function VerifiedBadge({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2">
      <path d="M12 2l7.5 3.2v6.1c0 4.6-3.1 8.8-7.5 10.4-4.4-1.6-7.5-5.8-7.5-10.4V5.2z" />
      <path d="M8.6 12.2l2.5 2.4 4.3-4.6" />
    </svg>
  );
}
