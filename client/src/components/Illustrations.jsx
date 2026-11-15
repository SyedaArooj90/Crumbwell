// Simple line-art illustrations in the same style as the homepage bread
// graphic. `variant` (1-3) rotates through the accent colors so items in the
// same category don't look identical. Swap these for real photos later —
// see the note at the bottom of this file.

const accents = {
  1: 'var(--rust)',
  2: 'var(--crust-light)',
  3: 'var(--crust)',
}

function Cake({ accent }) {
  return (
    <svg viewBox="0 0 160 140" xmlns="http://www.w3.org/2000/svg">
      <rect x="30" y="80" width="100" height="40" rx="4" fill="var(--butter)" stroke={accent} strokeWidth="3" />
      <rect x="40" y="55" width="80" height="30" rx="4" fill="var(--cream)" stroke={accent} strokeWidth="3" />
      <path d="M50 55 L55 35 L65 55 Z" fill={accent} />
      <path d="M75 55 L80 30 L90 55 Z" fill={accent} />
      <path d="M100 55 L105 35 L115 55 Z" fill={accent} />
      <circle cx="80" cy="26" r="3" fill={accent} />
    </svg>
  )
}

function Pastry({ accent }) {
  return (
    <svg viewBox="0 0 160 140" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M30 95 Q55 40 80 95 Q105 40 130 95"
        fill="none"
        stroke={accent}
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M30 95 Q55 55 80 95 Q105 55 130 95"
        fill="var(--butter)"
        stroke={accent}
        strokeWidth="3"
      />
      <path d="M55 95 Q80 75 105 95" fill="none" stroke={accent} strokeWidth="2" opacity="0.5" />
    </svg>
  )
}

function Bread({ accent }) {
  return (
    <svg viewBox="0 0 160 140" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="80" cy="105" rx="65" ry="22" fill="var(--crust)" opacity="0.15" />
      <path
        d="M20 90 Q80 25 140 90 Q110 115 80 115 Q50 115 20 90 Z"
        fill="var(--butter)"
        stroke={accent}
        strokeWidth="3"
      />
      <path d="M45 65 Q55 48 65 63" stroke={accent} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M90 58 Q100 41 110 56" stroke={accent} strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  )
}

function Beverage({ accent }) {
  return (
    <svg viewBox="0 0 160 140" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M45 45 H115 L105 105 Q104 115 94 115 H66 Q56 115 55 105 Z"
        fill="var(--butter)"
        stroke={accent}
        strokeWidth="3"
      />
      <path d="M115 55 Q135 55 135 72 Q135 88 115 85" fill="none" stroke={accent} strokeWidth="3" />
      <path d="M65 30 Q70 20 65 12" stroke={accent} strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.6" />
      <path d="M80 30 Q85 20 80 12" stroke={accent} strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.6" />
      <path d="M95 30 Q100 20 95 12" stroke={accent} strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.6" />
    </svg>
  )
}

const kinds = {
  cake: Cake,
  pastry: Pastry,
  bread: Bread,
  beverage: Beverage,
}

function Illustration({ type, variant = 1, className = '' }) {
  const Shape = kinds[type] || Cake
  const accent = accents[variant] || accents[1]
  return (
    <div className={`illustration ${className}`}>
      <Shape accent={accent} />
    </div>
  )
}

export default Illustration
