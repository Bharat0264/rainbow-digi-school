export function LineBook({ size = 32, color = "currentColor", strokeWidth = 1.5, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
      <path d="M6 6h10" />
      <path d="M6 10h10" />
      <path d="M6 14h6" />
    </svg>
  );
}

export function LineSprout({ size = 32, color = "currentColor", strokeWidth = 1.5, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M7 20h10" />
      <path d="M12 20v-8" />
      <path d="M12 12a5 5 0 0 1 5-5h2v2a5 5 0 0 1-5 5h-2" />
      <path d="M12 15a4 4 0 0 0-4-4H6v2a4 4 0 0 0 4 4h2" />
    </svg>
  );
}

export function LineAbacus({ size = 32, color = "currentColor", strokeWidth = 1.5, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 8h18" />
      <path d="M3 13h18" />
      <path d="M3 18h18" />
      <circle cx="7" cy="8" r="1.5" />
      <circle cx="11" cy="8" r="1.5" />
      <circle cx="16" cy="13" r="1.5" />
      <circle cx="9" cy="18" r="1.5" />
      <circle cx="14" cy="18" r="1.5" />
    </svg>
  );
}

export function LineComputer({ size = 32, color = "currentColor", strokeWidth = 1.5, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8" />
      <path d="M12 17v4" />
      <path d="M6 7h12" />
    </svg>
  );
}

export function LinePencil({ size = 32, color = "currentColor", strokeWidth = 1.5, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="m18 2 4 4-12 12H6v-4L18 2Z" />
      <path d="m14 6 4 4" />
      <path d="M6 18l-3 3" />
    </svg>
  );
}

export function LineSchool({ size = 32, color = "currentColor", strokeWidth = 1.5, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 2 2 7l10 5 10-5-10-5Z" />
      <path d="M6 10v6a6 6 0 0 0 12 0v-6" />
      <path d="M22 10v6" />
    </svg>
  );
}

export function LinePaperPlane({ size = 32, color = "currentColor", strokeWidth = 1.5, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="m22 2-7 20-4-9-9-4 20-7Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}
