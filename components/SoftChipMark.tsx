export default function SoftChipMark({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      role="img"
      aria-hidden="true"
      focusable="false"
    >
      {/* legs — top and bottom, three each */}
      <line x1="14" y1="8" x2="14" y2="2" stroke="var(--wisteria-deep)" strokeWidth={3} strokeLinecap="round" />
      <line x1="22" y1="8" x2="22" y2="2" stroke="var(--wisteria-deep)" strokeWidth={3} strokeLinecap="round" />
      <line x1="30" y1="8" x2="30" y2="2" stroke="var(--wisteria-deep)" strokeWidth={3} strokeLinecap="round" />
      <line x1="14" y1="36" x2="14" y2="42" stroke="var(--wisteria-deep)" strokeWidth={3} strokeLinecap="round" />
      <line x1="22" y1="36" x2="22" y2="42" stroke="var(--wisteria-deep)" strokeWidth={3} strokeLinecap="round" />
      <line x1="30" y1="36" x2="30" y2="42" stroke="var(--wisteria-deep)" strokeWidth={3} strokeLinecap="round" />
      {/* stitched felt body */}
      <rect
        x="6" y="8" width="32" height="28" rx="9"
        fill="var(--wisteria)"
        stroke="var(--wisteria-deep)"
        strokeWidth={2}
        strokeDasharray="4 3"
      />
      {/* center snap */}
      <circle cx="22" cy="22" r="4" fill="var(--blush)" stroke="var(--blush-deep)" strokeWidth={1.5} />
    </svg>
  );
}
