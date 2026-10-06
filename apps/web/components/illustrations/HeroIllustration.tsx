export function HeroIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 520 440" className={className} role="img" aria-label="Wandklimagerät mit kühlem Luftstrom">
      <defs>
        <linearGradient id="hi-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.18" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.04" />
        </linearGradient>
        <linearGradient id="hi-unit" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#e6eefc" />
        </linearGradient>
        <linearGradient id="hi-air" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#bfe0ff" stopOpacity="0.9" />
          <stop offset="1" stopColor="#bfe0ff" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect x="20" y="20" width="480" height="400" rx="36" fill="url(#hi-wall)" stroke="#ffffff" strokeOpacity="0.25" />

      {/* indoor unit */}
      <g>
        <rect x="70" y="70" width="380" height="110" rx="26" fill="url(#hi-unit)" />
        <rect x="70" y="148" width="380" height="32" rx="14" fill="#d5e2f8" />
        <rect x="96" y="158" width="328" height="8" rx="4" fill="#9fb6e0" />
        <circle cx="410" cy="100" r="6" fill="#4fa8ff" />
        <rect x="96" y="94" width="120" height="10" rx="5" fill="#c9d8f2" />
        <text x="352" y="106" fontSize="22" fontWeight="700" fill="#2f6fed" fontFamily="inherit">
          21°
        </text>
      </g>

      {/* airflow */}
      <g fill="none" stroke="url(#hi-air)" strokeWidth="10" strokeLinecap="round">
        <path d="M120 200 C 110 260, 150 300, 120 370" />
        <path d="M200 200 C 190 270, 230 310, 205 390" />
        <path d="M280 200 C 270 270, 310 310, 285 390" />
        <path d="M360 200 C 350 260, 390 300, 360 370" />
      </g>

      {/* snowflakes */}
      <g stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.85">
        {[
          [160, 300],
          [330, 330],
          [250, 250],
          [410, 280],
        ].map(([x, y]) => (
          <g key={`${x}-${y}`} transform={`translate(${x} ${y})`}>
            <line x1="-9" y1="0" x2="9" y2="0" />
            <line x1="-4.5" y1="-7.8" x2="4.5" y2="7.8" />
            <line x1="-4.5" y1="7.8" x2="4.5" y2="-7.8" />
          </g>
        ))}
      </g>
    </svg>
  );
}
