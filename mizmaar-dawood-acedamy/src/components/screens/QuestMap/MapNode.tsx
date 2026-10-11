import React from 'react';
import { Lock, Star, Check } from 'lucide-react';
import { Tier } from '../../../types';
import { NodeState } from '../../../utils/unlockRules';

interface MapNodeProps {
  tier: Tier;
  tierNumber: number;
  state: NodeState;
  stars: number;
  accentSolid: string;
  accentLight: string;
  onClick: () => void;
  isCurrent?: boolean;
  accessibleLabel: string;
}

export const MapNode: React.FC<MapNodeProps> = ({
  tier,
  tierNumber,
  state,
  stars,
  accentSolid,
  accentLight,
  onClick,
  isCurrent = false,
  accessibleLabel,
}) => {
  const isLocked = state === 'locked';
  const isMastered = state === 'mastered';
  const isPassed = state === 'passed' || isMastered;
  const isAvailable = state === 'available';

  // Node background & borders
  let bgFill = '#E4D6BA';
  let borderStroke = '#C5B69B';
  let textColor = '#5B6B7B';

  if (isPassed) {
    bgFill = accentSolid;
    borderStroke = isMastered ? '#B8892B' : accentSolid;
    textColor = '#FFFFFF';
  } else if (isAvailable) {
    bgFill = accentLight;
    borderStroke = accentSolid;
    textColor = '#1B2A41';
  }

  // Dimension: 64px
  const size = 64;

  return (
    <div className="flex flex-col items-center select-none group relative">
      <button
        type="button"
        disabled={isLocked}
        onClick={onClick}
        aria-label={accessibleLabel}
        className={`relative flex items-center justify-center transition-all duration-200 outline-none focus-visible:ring-4 focus-visible:ring-[#2A5CAA] ${
          isLocked ? 'cursor-not-allowed opacity-80' : 'cursor-pointer hover:scale-105 active:scale-95'
        }`}
        style={{ width: size, height: size }}
      >
        {/* Pulse ring for available node */}
        {isAvailable && (
          <div
            aria-hidden="true"
            className="absolute -inset-2 rounded-full border-2 border-[#2A5CAA] animate-ping opacity-30 pointer-events-none"
          />
        )}

        {/* Mastered brass ring */}
        {isMastered && (
          <div
            aria-hidden="true"
            className="absolute -inset-1.5 rounded-full border-2 border-[#B8892B] pointer-events-none"
          />
        )}

        {/* Node Shape SVG */}
        <svg width={size} height={size} viewBox="0 0 64 64" className="absolute inset-0">
          {tier === 'easy' ? (
            // Circle
            <circle
              cx="32"
              cy="32"
              r="28"
              fill={bgFill}
              stroke={borderStroke}
              strokeWidth={isMastered ? 4 : 3}
            />
          ) : tier === 'moderate' ? (
            // Diamond (rounded square rotated 45deg)
            <rect
              x="16"
              y="16"
              width="32"
              height="32"
              rx="6"
              transform="rotate(45 32 32)"
              fill={bgFill}
              stroke={borderStroke}
              strokeWidth={isMastered ? 4 : 3}
            />
          ) : (
            // 8-pointed star
            <polygon
              points="32,4 40,24 60,32 40,40 32,60 24,40 4,32 24,24"
              fill={bgFill}
              stroke={borderStroke}
              strokeWidth={isMastered ? 4 : 3}
            />
          )}
        </svg>

        {/* Content inside node */}
        <div className="relative z-10 flex items-center justify-center font-bold">
          {isLocked ? (
            <Lock size={18} strokeWidth={2.5} className="text-[#5B6B7B]" />
          ) : isPassed ? (
            <Check size={24} strokeWidth={3} className="text-white" />
          ) : (
            <span className="text-xl font-black font-mono tabular-nums" style={{ color: textColor }}>
              {tierNumber}
            </span>
          )}
        </div>
      </button>

      {/* 3 Stars slots underneath */}
      <div className="flex items-center gap-1 mt-2">
        {[1, 2, 3].map((starIdx) => {
          const isEarned = starIdx <= stars;
          return (
            <Star
              key={starIdx}
              size={14}
              strokeWidth={2}
              className={
                isEarned
                  ? 'text-[#B8892B] fill-[#B8892B]'
                  : 'text-[#E4D6BA] fill-transparent'
              }
            />
          );
        })}
      </div>
    </div>
  );
};
