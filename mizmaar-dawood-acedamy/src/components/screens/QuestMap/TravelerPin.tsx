import React from 'react';
import { AgeGroup } from '../../../types';

interface TravelerPinProps {
  ageGroup: AgeGroup;
  className?: string;
}

export const TravelerPin: React.FC<TravelerPinProps> = ({ ageGroup, className = '' }) => {
  return (
    <div
      aria-label="Your current position"
      className={`relative flex items-center justify-center animate-bounce-gentle select-none pointer-events-none ${className}`}
    >
      {ageGroup === '7-11' ? (
        // Theme A: Lapis teardrop pin with brass center
        <div className="relative flex flex-col items-center">
          <svg width="28" height="36" viewBox="0 0 28 36">
            {/* Teardrop pin body */}
            <path
              d="M 14 0 C 6.27 0 0 6.27 0 14 C 0 24.5 14 36 14 36 C 14 36 28 24.5 28 14 C 28 6.27 21.73 0 14 0 Z"
              fill="#2A5CAA"
              stroke="#1F4580"
              strokeWidth="2"
            />
            {/* Brass center */}
            <circle cx="14" cy="14" r="6" fill="#B8892B" />
          </svg>
          {/* Dust / shadow landing ring */}
          <div className="w-4 h-1.5 bg-[#1B2A41]/20 rounded-full mt-[-2px]" />
        </div>
      ) : (
        // Theme B: Slim brass compass needle in lapis ring
        <div className="relative flex flex-col items-center">
          <svg width="32" height="32" viewBox="0 0 32 32">
            {/* Lapis outer ring */}
            <circle cx="16" cy="16" r="14" fill="#FAF5EA" stroke="#2A5CAA" strokeWidth="3" />
            {/* Brass needle top */}
            <polygon points="16,4 20,16 16,14 12,16" fill="#B8892B" />
            {/* Needle bottom */}
            <polygon points="16,28 20,16 16,18 12,16" fill="#1B2A41" />
            {/* Center pivot */}
            <circle cx="16" cy="16" r="3" fill="#B8892B" />
          </svg>
          <div className="w-5 h-1.5 bg-[#1B2A41]/20 rounded-full mt-[-1px]" />
        </div>
      )}

      <style>{`
        @keyframes gentleHop {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-bounce-gentle {
          animation: gentleHop 1.6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
