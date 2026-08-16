/** ETHEREALMARKET official logo — EM monogram with orbital arc */
export function Logo({ size = 32, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="EtherealMarket"
    >
      {/* Soft arc */}
      <path
        d="M28 88 C12 68 12 40 28 22 C36 14 48 10 60 10"
        stroke="#1d4ed8"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        opacity="0.95"
      />
      <path
        d="M60 110 C88 110 108 88 108 60 C108 40 98 24 82 16"
        stroke="#2563eb"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />
      {/* EM letters */}
      <text
        x="58"
        y="72"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="52"
        fontWeight="700"
        fill="url(#emGrad)"
        letterSpacing="-2"
      >
        EM
      </text>
      {/* Wave under E */}
      <path
        d="M32 78 C42 72 52 84 62 76"
        stroke="#1e3a8a"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.85"
      />
      {/* Small bank motif */}
      <g transform="translate(54, 100)" fill="#1e3a8a" opacity="0.9">
        <rect x="2" y="4" width="2.2" height="6" />
        <rect x="5.5" y="4" width="2.2" height="6" />
        <rect x="9" y="4" width="2.2" height="6" />
        <path d="M0 4 L6.5 0 L13 4 Z" />
        <rect x="0" y="10" width="13" height="1.2" />
      </g>
      <defs>
        <linearGradient id="emGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e3a8a" />
          <stop offset="55%" stopColor="#1d4ed8" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
    </svg>
  );
}
