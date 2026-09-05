export default function Logo() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-lg"
    >
      {/* Martini Glass */}
      <g>
        {/* Glass Bowl */}
        <path
          d="M10 12 L14 28 Q14 32 18 32 Q22 32 22 28 L26 12 Z"
          fill="none"
          stroke="#D4AF37"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Glass Stem */}
        <line
          x1="18"
          y1="32"
          x2="18"
          y2="40"
          stroke="#D4AF37"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Glass Base */}
        <ellipse
          cx="18"
          cy="41"
          rx="5"
          ry="2"
          fill="none"
          stroke="#D4AF37"
          strokeWidth="1.5"
        />

        {/* Liquid inside glass */}
        <path
          d="M13 18 L15 28 Q15 30 18 30 Q21 30 21 28 L23 18 Z"
          fill="#E6B800"
          opacity="0.6"
        />

        {/* Olive on stick */}
        <circle cx="18" cy="10" r="2" fill="#90EE90" />
        <line
          x1="18"
          y1="12"
          x2="18"
          y2="18"
          stroke="#D4AF37"
          strokeWidth="0.8"
        />

        {/* Decorative sparkles */}
        <circle cx="30" cy="8" r="1.5" fill="#FFD700" />
        <circle cx="35" cy="12" r="1" fill="#FFD700" />
        <circle cx="32" cy="18" r="1.2" fill="#FFD700" />
      </g>
    </svg>
  );
}
