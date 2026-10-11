import React from 'react';

export type TreasureState = 'locked' | 'active' | 'mastered' | 'apex';

interface TreasureChestSvgProps {
  state: TreasureState;
  size?: number;
  className?: string;
  isCurrent?: boolean;
}

export const TreasureChestSvg: React.FC<TreasureChestSvgProps> = ({
  state,
  size = 72,
  className = '',
  isCurrent = false,
}) => {
  if (state === 'apex') {
    // Grand Golden Sultan's Vault / X Marks the Spot Treasure
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className={`transition-transform duration-300 ${isCurrent ? 'animate-pulse scale-105' : ''} ${className}`}
      >
        <defs>
          <radialGradient id="apexGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F1C40F" stopOpacity="0.8" />
            <stop offset="70%" stopColor="#D4A017" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#D4A017" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="goldLid" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFEAA7" />
            <stop offset="50%" stopColor="#F1C40F" />
            <stop offset="100%" stopColor="#B8860B" />
          </linearGradient>
          <linearGradient id="goldBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F1C40F" />
            <stop offset="50%" stopColor="#D4A017" />
            <stop offset="100%" stopColor="#8A6208" />
          </linearGradient>
        </defs>

        {/* Outer Aura */}
        <circle cx="50" cy="50" r="48" fill="url(#apexGlow)" />

        {/* Stone / Gold Pedestal */}
        <polygon points="18,88 82,88 74,96 26,96" fill="#8A6208" />
        <rect x="22" y="80" width="56" height="8" rx="2" fill="#D4A017" stroke="#FFEAA7" strokeWidth="1" />

        {/* Chest Base */}
        <path d="M 24 50 L 76 50 L 73 80 L 27 80 Z" fill="url(#goldBody)" stroke="#FFEAA7" strokeWidth="1.5" />

        {/* Chest Trim Vertical Straps */}
        <rect x="33" y="50" width="6" height="30" fill="#FFEAA7" />
        <rect x="61" y="50" width="6" height="30" fill="#FFEAA7" />

        {/* Open Dome Lid with glowing treasure inside */}
        <path d="M 20 48 Q 50 18 80 48 Z" fill="url(#goldLid)" stroke="#FFEAA7" strokeWidth="2" />
        <ellipse cx="50" cy="48" rx="30" ry="7" fill="#4A3000" />

        {/* Glowing Rubies & Diamonds inside */}
        <circle cx="42" cy="46" r="4" fill="#E74C3C" />
        <polygon points="50,42 54,46 50,50 46,46" fill="#00D2D3" />
        <circle cx="58" cy="45" r="3.5" fill="#2ECC71" />
        <circle cx="50" cy="38" r="3" fill="#FFEAA7" />

        {/* Royal Crown on Top */}
        <path
          d="M 38 32 L 42 22 L 50 28 L 58 22 L 62 32 Z"
          fill="#FFEAA7"
          stroke="#D4A017"
          strokeWidth="1"
        />
        <circle cx="42" cy="22" r="1.5" fill="#E74C3C" />
        <circle cx="50" cy="27" r="1.5" fill="#00D2D3" />
        <circle cx="58" cy="22" r="1.5" fill="#E74C3C" />

        {/* Big Crimson "X" Cross behind or below */}
        <line x1="12" y1="12" x2="26" y2="26" stroke="#C0392B" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="26" y1="12" x2="12" y2="26" stroke="#C0392B" strokeWidth="3.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (state === 'locked') {
    // Heavy Iron & Dark Oak Locked Chest
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className={`opacity-70 grayscale-30 transition-transform ${className}`}
      >
        <defs>
          <linearGradient id="lockedWood" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6E5844" />
            <stop offset="50%" stopColor="#4A3828" />
            <stop offset="100%" stopColor="#352618" />
          </linearGradient>
          <linearGradient id="ironBand" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#95A5A6" />
            <stop offset="100%" stopColor="#475254" />
          </linearGradient>
        </defs>

        {/* Shadow */}
        <ellipse cx="50" cy="85" rx="36" ry="7" fill="#1B2A41" opacity="0.25" />

        {/* Wooden Chest Body */}
        <path d="M 22 52 L 78 52 L 74 82 L 26 82 Z" fill="url(#lockedWood)" stroke="#2C1F15" strokeWidth="1.5" />

        {/* Wood Planks Lines */}
        <line x1="24" y1="62" x2="76" y2="62" stroke="#2C1F15" strokeWidth="1" opacity="0.6" />
        <line x1="25" y1="72" x2="75" y2="72" stroke="#2C1F15" strokeWidth="1" opacity="0.6" />

        {/* Arched Closed Lid */}
        <path d="M 20 52 Q 50 28 80 52 Z" fill="url(#lockedWood)" stroke="#2C1F15" strokeWidth="1.5" />

        {/* Iron Trim Straps */}
        <path d="M 32 37 Q 34 52 34 82" fill="none" stroke="url(#ironBand)" strokeWidth="4.5" />
        <path d="M 68 37 Q 66 52 66 82" fill="none" stroke="url(#ironBand)" strokeWidth="4.5" />
        <rect x="19" y="50" width="62" height="4" fill="url(#ironBand)" />

        {/* Iron Rivets */}
        <circle cx="34" cy="52" r="1.5" fill="#BDC3C7" />
        <circle cx="66" cy="52" r="1.5" fill="#BDC3C7" />
        <circle cx="34" cy="74" r="1.5" fill="#BDC3C7" />
        <circle cx="66" cy="74" r="1.5" fill="#BDC3C7" />

        {/* Brass Padlock with Keyhole */}
        <rect x="44" y="58" width="12" height="15" rx="2" fill="#D4A017" stroke="#7A5600" strokeWidth="1" />
        <path d="M 46 58 L 46 52 Q 50 47 54 52 L 54 58" fill="none" stroke="#7F8C8D" strokeWidth="2.5" />
        <circle cx="50" cy="64" r="1.8" fill="#2C1F15" />
        <polygon points="49.5,64 50.5,64 51,69 49,69" fill="#2C1F15" />

        {/* Iron Chains wrapped around */}
        <path
          d="M 26 44 L 74 76"
          stroke="#7F8C8D"
          strokeWidth="2.5"
          strokeDasharray="4 3"
          strokeLinecap="round"
          opacity="0.85"
        />
        <path
          d="M 74 44 L 26 76"
          stroke="#7F8C8D"
          strokeWidth="2.5"
          strokeDasharray="4 3"
          strokeLinecap="round"
          opacity="0.85"
        />
      </svg>
    );
  }

  if (state === 'mastered') {
    // Mastered: Gleaming Gold Chest with 3 Stars & Emerald Gem
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className={`transition-transform duration-200 hover:scale-108 ${className}`}
      >
        <defs>
          <radialGradient id="masterGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2ECC71" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#2ECC71" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="richWood" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#A0522D" />
            <stop offset="50%" stopColor="#8B4513" />
            <stop offset="100%" stopColor="#5C2E0B" />
          </linearGradient>
          <linearGradient id="goldStraps" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFEAA7" />
            <stop offset="50%" stopColor="#F1C40F" />
            <stop offset="100%" stopColor="#D4A017" />
          </linearGradient>
        </defs>

        {/* Emerald Aura */}
        <circle cx="50" cy="55" r="44" fill="url(#masterGlow)" />

        {/* Shadow */}
        <ellipse cx="50" cy="85" rx="38" ry="7" fill="#1B2A41" opacity="0.3" />

        {/* Chest Body */}
        <path d="M 22 52 L 78 52 L 74 82 L 26 82 Z" fill="url(#richWood)" stroke="#3D1D05" strokeWidth="1.5" />

        {/* Arched Lid */}
        <path d="M 20 52 Q 50 28 80 52 Z" fill="url(#richWood)" stroke="#3D1D05" strokeWidth="1.5" />

        {/* Golden Straps */}
        <path d="M 32 37 Q 34 52 34 82" fill="none" stroke="url(#goldStraps)" strokeWidth="4.5" />
        <path d="M 68 37 Q 66 52 66 82" fill="none" stroke="url(#goldStraps)" strokeWidth="4.5" />
        <rect x="19" y="50" width="62" height="4" fill="url(#goldStraps)" />

        {/* Center Emerald Latch */}
        <rect x="44" y="52" width="12" height="15" rx="2" fill="url(#goldStraps)" stroke="#B8860B" strokeWidth="1" />
        <polygon points="50,56 54,60 50,64 46,60" fill="#2ECC71" stroke="#27AE60" strokeWidth="0.8" />

        {/* 3 Hovering Golden Stars */}
        <g transform="translate(0, -6)">
          {/* Center Star */}
          <polygon
            points="50,22 52.5,27.5 58.5,28 54,32 55.5,38 50,34.5 44.5,38 46,32 41.5,28 47.5,27.5"
            fill="#F1C40F"
            stroke="#D4A017"
            strokeWidth="0.8"
          />
          {/* Left Star */}
          <polygon
            points="34,26 36,30.5 41,31 37.5,34 38.5,39 34,36.5 29.5,39 30.5,34 27,31 32,30.5"
            fill="#F1C40F"
            stroke="#D4A017"
            strokeWidth="0.8"
          />
          {/* Right Star */}
          <polygon
            points="66,26 68,30.5 73,31 69.5,34 70.5,39 66,36.5 61.5,39 62.5,34 59,31 64,30.5"
            fill="#F1C40F"
            stroke="#D4A017"
            strokeWidth="0.8"
          />
        </g>
      </svg>
    );
  }

  // Active / Ready to Explore: Open Chest glowing with golden light and jewels!
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`transition-transform duration-300 ${isCurrent ? 'scale-110 drop-shadow-lg' : 'hover:scale-105'} ${className}`}
    >
      <defs>
        <radialGradient id="activeGlow" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#FFF2A3" stopOpacity="0.95" />
          <stop offset="35%" stopColor="#F1C40F" stopOpacity="0.6" />
          <stop offset="70%" stopColor="#D4A017" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#D4A017" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="activeWood" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#C06C2E" />
          <stop offset="50%" stopColor="#A0522D" />
          <stop offset="100%" stopColor="#663300" />
        </linearGradient>
        <linearGradient id="goldHinges" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFEAA7" />
          <stop offset="50%" stopColor="#F1C40F" />
          <stop offset="100%" stopColor="#B8860B" />
        </linearGradient>
      </defs>

      {/* Radiant Glow rays */}
      <circle cx="50" cy="45" r="46" fill="url(#activeGlow)" />
      <g opacity="0.6">
        <line x1="50" y1="42" x2="50" y2="12" stroke="#FFF9D2" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="50" y1="42" x2="32" y2="18" stroke="#FFF9D2" strokeWidth="2" strokeLinecap="round" />
        <line x1="50" y1="42" x2="68" y2="18" stroke="#FFF9D2" strokeWidth="2" strokeLinecap="round" />
        <line x1="50" y1="42" x2="20" y2="34" stroke="#FFF9D2" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="50" y1="42" x2="80" y2="34" stroke="#FFF9D2" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* Shadow */}
      <ellipse cx="50" cy="85" rx="38" ry="7" fill="#1B2A41" opacity="0.35" />

      {/* Chest Body (Base) */}
      <path d="M 22 52 L 78 52 L 74 82 L 26 82 Z" fill="url(#activeWood)" stroke="#4A2600" strokeWidth="1.5" />

      {/* Open Lid tilted back */}
      <path
        d="M 18 48 Q 50 16 82 42 L 78 36 Q 50 12 22 42 Z"
        fill="url(#activeWood)"
        stroke="#4A2600"
        strokeWidth="1.5"
      />

      {/* Golden Hinges & Corner Plates */}
      <path d="M 32 52 L 32 82" stroke="url(#goldHinges)" strokeWidth="4" />
      <path d="M 68 52 L 68 82" stroke="url(#goldHinges)" strokeWidth="4" />
      <rect x="20" y="50" width="60" height="3" fill="url(#goldHinges)" />

      {/* Overflowing Golden Coins & Gems */}
      <ellipse cx="50" cy="51" rx="26" ry="6" fill="#3D1D05" />
      <circle cx="44" cy="49" r="4.5" fill="#F1C40F" stroke="#B8860B" strokeWidth="0.8" />
      <circle cx="56" cy="49" r="4.5" fill="#F1C40F" stroke="#B8860B" strokeWidth="0.8" />
      <circle cx="50" cy="46" r="4" fill="#FFEAA7" stroke="#D4A017" strokeWidth="0.8" />
      <polygon points="38,48 42,44 46,48 42,52" fill="#E74C3C" />
      <polygon points="58,47 62,43 66,47 62,51" fill="#00D2D3" />
      <polygon points="50,42 53,38 56,42 53,46" fill="#2ECC71" />

      {/* Center Brass Lock Plate */}
      <rect x="45" y="53" width="10" height="12" rx="1.5" fill="url(#goldHinges)" stroke="#7A5600" strokeWidth="1" />
      <circle cx="50" cy="58" r="1.5" fill="#3D1D05" />

      {/* Little sparkle star */}
      <polygon
        points="50,22 52,27 57,28 53,31 54,36 50,33 46,36 47,31 43,28 48,27"
        fill="#FFFFFF"
        opacity="0.9"
      />
    </svg>
  );
};
