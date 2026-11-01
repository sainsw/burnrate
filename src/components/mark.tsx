// The BurnRate mark: a clock face with the elapsed quarter burned in ember.
export function Mark({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="10" cy="10" r="8.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 10 V3.5 A6.5 6.5 0 0 1 16.5 10 Z" fill="var(--ember)" />
    </svg>
  );
}
