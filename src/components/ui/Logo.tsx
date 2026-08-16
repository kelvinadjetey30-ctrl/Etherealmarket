/** Professional ETHEREALMARKET mark — geometric E + market node */
export function Logo({ size = 32, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <rect width="32" height="32" rx="8" fill="#1d4ed8" />
      <path
        d="M8 9h16v2.4H11.2V14h11.2v2.4H11.2V20H24V22.4H8V9z"
        fill="white"
      />
      <circle cx="24" cy="9" r="2.2" fill="#93c5fd" />
    </svg>
  );
}
