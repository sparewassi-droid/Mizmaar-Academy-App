import React from 'react';
import { Award } from 'lucide-react';

interface RegionSealProps {
  isEarned: boolean;
  className?: string;
}

export const RegionSeal: React.FC<RegionSealProps> = ({ isEarned, className = '' }) => {
  if (!isEarned) return null;

  return (
    <div
      aria-label="Region Mastery Seal Earned"
      title="All 3 stages completed! Mastery Seal awarded."
      className={`relative inline-flex items-center justify-center animate-stamp-down ${className}`}
    >
      <div className="w-10 h-10 rounded-full bg-[#EBD9A8] border-2 border-[#B8892B] flex items-center justify-center card-solid">
        <Award size={20} strokeWidth={2.5} className="text-[#B8892B]" />
      </div>

      <style>{`
        @keyframes stampDown {
          0% { transform: scale(1.6); opacity: 0; }
          70% { transform: scale(0.9); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-stamp-down {
          animation: stampDown 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};
