import React from 'react';

interface LandmarkProps {
  landmarkKey: string;
  isUnlocked: boolean;
  accentSolid: string;
  accentLight: string;
  className?: string;
}

export const LandmarkSvg: React.FC<LandmarkProps> = ({
  landmarkKey,
  isUnlocked,
  accentSolid,
  accentLight,
  className = '',
}) => {
  const primaryColor = isUnlocked ? accentSolid : '#E4D6BA';
  const secondaryColor = isUnlocked ? accentLight : '#FAF5EA';
  const detailColor = isUnlocked ? '#B8892B' : '#C5B69B';

  switch (landmarkKey) {
    case 'lantern_gate':
      // The Lantern Gate: An arch with hanging lantern
      return (
        <svg viewBox="0 0 160 120" className={className}>
          {/* Arch pillars */}
          <rect x="25" y="45" width="22" height="70" rx="4" fill={primaryColor} />
          <rect x="113" y="45" width="22" height="70" rx="4" fill={primaryColor} />
          {/* Arch top */}
          <path d="M 25 45 C 25 15, 135 15, 135 45 Z" fill={secondaryColor} stroke={primaryColor} strokeWidth="4" />
          {/* Hanging chain & lantern */}
          <line x1="80" y1="25" x2="80" y2="55" stroke={detailColor} strokeWidth="2.5" />
          <polygon points="80,55 92,67 80,85 68,67" fill={detailColor} />
          <circle cx="80" cy="70" r="5" fill="#FAF5EA" />
        </svg>
      );

    case 'crescent_bridge':
      // The Crescent Bridge: Arched bridge under crescent moon
      return (
        <svg viewBox="0 0 160 120" className={className}>
          {/* Water stream */}
          <rect x="10" y="95" width="140" height="20" rx="6" fill={secondaryColor} />
          {/* Bridge arch */}
          <path d="M 20 95 Q 80 50 140 95 L 140 105 Q 80 65 20 105 Z" fill={primaryColor} />
          {/* Crescent Moon */}
          <path
            d="M 115 25 A 20 20 0 1 0 135 45 A 16 16 0 1 1 115 25 Z"
            fill={detailColor}
          />
        </svg>
      );

    case 'echo_valley':
      // Echo Valley: Twin peaks with concentric echo arcs
      return (
        <svg viewBox="0 0 160 120" className={className}>
          {/* Mountain 1 */}
          <polygon points="15,115 55,40 95,115" fill={primaryColor} />
          {/* Mountain 2 */}
          <polygon points="75,115 115,30 155,115" fill={secondaryColor} stroke={primaryColor} strokeWidth="3" />
          {/* Concentric echo arcs */}
          <path d="M 95 38 A 12 12 0 0 0 115 20" fill="none" stroke={detailColor} strokeWidth="3" strokeLinecap="round" />
          <path d="M 90 48 A 24 24 0 0 0 130 15" fill="none" stroke={detailColor} strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    case 'oasis_words':
      // Oasis of Words: Round pool with rounded trees
      return (
        <svg viewBox="0 0 160 120" className={className}>
          {/* Pool */}
          <ellipse cx="80" cy="75" rx="55" ry="32" fill={secondaryColor} stroke={primaryColor} strokeWidth="4" />
          {/* Tree 1 */}
          <rect x="35" y="50" width="8" height="35" fill={detailColor} rx="2" />
          <circle cx="39" cy="40" r="18" fill={primaryColor} />
          {/* Tree 2 */}
          <rect x="115" y="45" width="8" height="40" fill={detailColor} rx="2" />
          <circle cx="119" cy="35" r="20" fill={primaryColor} />
          {/* Floating letter droplet */}
          <circle cx="80" cy="75" r="8" fill={detailColor} />
        </svg>
      );

    case 'long_road':
      // The Long Road: Road stretching with milestone markers
      return (
        <svg viewBox="0 0 160 120" className={className}>
          {/* Perspective road */}
          <polygon points="70,20 90,20 135,115 25,115" fill={secondaryColor} stroke={primaryColor} strokeWidth="3" />
          {/* Dashed center line */}
          <line x1="80" y1="25" x2="80" y2="110" stroke={primaryColor} strokeWidth="3.5" strokeDasharray="8 6" />
          {/* Milestone markers */}
          <rect x="15" y="85" width="10" height="20" rx="3" fill={detailColor} />
          <rect x="135" y="85" width="10" height="20" rx="3" fill={detailColor} />
        </svg>
      );

    case 'crescent_arch':
      // Chapter I: Crescent over an arch
      return (
        <svg viewBox="0 0 160 120" className={className}>
          <rect x="40" y="55" width="80" height="55" rx="8" fill={secondaryColor} stroke={primaryColor} strokeWidth="3" />
          <path d="M 55 110 L 55 75 Q 80 50 105 75 L 105 110 Z" fill="#FAF5EA" stroke={primaryColor} strokeWidth="3" />
          <circle cx="80" cy="32" r="14" fill={detailColor} />
        </svg>
      );

    case 'wave_line':
      // Chapter II: Wave line
      return (
        <svg viewBox="0 0 160 120" className={className}>
          <path
            d="M 20 60 Q 50 20 80 60 T 140 60"
            fill="none"
            stroke={primaryColor}
            strokeWidth="6"
            strokeLinecap="round"
          />
          <circle cx="20" cy="60" r="6" fill={detailColor} />
          <circle cx="80" cy="60" r="6" fill={detailColor} />
          <circle cx="140" cy="60" r="6" fill={detailColor} />
        </svg>
      );

    case 'pause_bars':
      // Chapter III: Pause bars
      return (
        <svg viewBox="0 0 160 120" className={className}>
          <rect x="52" y="30" width="18" height="65" rx="6" fill={primaryColor} />
          <rect x="90" y="30" width="18" height="65" rx="6" fill={primaryColor} />
          <circle cx="80" cy="18" r="6" fill={detailColor} />
        </svg>
      );

    case 'open_book':
      // Chapter IV: Open book
      return (
        <svg viewBox="0 0 160 120" className={className}>
          <path
            d="M 80 85 C 60 70, 30 72, 20 78 L 20 40 C 30 35, 60 32, 80 45 C 100 32, 130 35, 140 40 L 140 78 C 130 72, 100 70, 80 85 Z"
            fill={secondaryColor}
            stroke={primaryColor}
            strokeWidth="3.5"
          />
          <line x1="80" y1="45" x2="80" y2="85" stroke={primaryColor} strokeWidth="3" />
        </svg>
      );

    case 'concentric_arcs':
      // Chapter V: Concentric arcs
      return (
        <svg viewBox="0 0 160 120" className={className}>
          <circle cx="80" cy="60" r="45" fill="none" stroke={secondaryColor} strokeWidth="4" />
          <circle cx="80" cy="60" r="30" fill="none" stroke={primaryColor} strokeWidth="4" />
          <circle cx="80" cy="60" r="14" fill={detailColor} />
        </svg>
      );

    case 'compass_mastery':
      // Chapter VI: Compass rose
      return (
        <svg viewBox="0 0 160 120" className={className}>
          <circle cx="80" cy="60" r="42" fill={secondaryColor} stroke={primaryColor} strokeWidth="3" />
          <polygon points="80,24 87,55 80,60 73,55" fill={primaryColor} />
          <polygon points="80,96 87,65 80,60 73,65" fill={detailColor} />
          <polygon points="44,60 75,67 80,60 75,53" fill={detailColor} />
          <polygon points="116,60 85,67 80,60 85,53" fill={primaryColor} />
        </svg>
      );

    default:
      return null;
  }
};
