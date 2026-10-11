import React from 'react';
import { Tier, ModuleDefinition, StageProgress } from '../../types';
import { BottomDrawer } from '../common/BottomDrawer';
import { Button } from '../common/Button';
import { Star, Clock, Zap, HelpCircle } from 'lucide-react';
import { EXPLORER_THEME } from '../../theme/explorer';
import { SCHOLAR_THEME } from '../../theme/scholar';

interface StageSheetProps {
  isOpen: boolean;
  onClose: () => void;
  moduleDef: ModuleDefinition;
  tier: Tier;
  stageProgress?: StageProgress;
  onStart: () => void;
}

export const StageSheet: React.FC<StageSheetProps> = ({
  isOpen,
  onClose,
  moduleDef,
  tier,
  stageProgress,
  onStart,
}) => {
  const themeObj = moduleDef.ageGroup === '7-11' ? EXPLORER_THEME : SCHOLAR_THEME;
  const tierName = themeObj.tierBanners[tier];
  const questionCount = tier === 'moderate' ? 20 : 10;
  const baseSeconds = themeObj.baseSeconds[tier];
  const bestScore = stageProgress?.bestScore || 0;
  const starsEarned = stageProgress?.stars || 0;

  return (
    <BottomDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="text-center">
          <span className="text-xs font-black uppercase tracking-wider text-[#1A3D73]">
            {moduleDef.regionName}
          </span>
          <h2 className="text-2xl font-black text-[#10264F] mt-0.5">{moduleDef.title}</h2>
          <div className="inline-block mt-1 px-3 py-0.5 rounded-full bg-[#FDF5E2] border-2 border-[#E5C568] text-xs font-extrabold text-[#8C681E] shadow-2xs">
            {tierName} (Tier {tier === 'easy' ? '1' : tier === 'moderate' ? '2' : '3'})
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-5">
        {/* Stars status */}
        <div className="flex items-center justify-center gap-3 py-2">
          {[1, 2, 3].map((starIdx) => {
            const isEarned = starIdx <= starsEarned;
            return (
              <div
                key={starIdx}
                className={`w-13 h-13 rounded-2xl flex items-center justify-center border-2 transition-all ${
                  isEarned
                    ? 'bg-[#FDF5E2] border-2 border-[#D4AF37] shadow-sm scale-105'
                    : 'bg-white border-2 border-[#E5C568]/40 opacity-40'
                }`}
              >
                <Star
                  size={26}
                  strokeWidth={2}
                  className={isEarned ? 'text-[#D4AF37] fill-[#D4AF37]' : 'text-[#8C98A4]'}
                />
              </div>
            );
          })}
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-3 gap-2.5 text-center">
          <div className="bg-white border-2 border-[#E5C568] rounded-2xl p-3 shadow-xs">
            <span className="text-[11px] font-bold text-[#8C681E] flex items-center justify-center gap-1">
              <HelpCircle size={12} className="text-[#D4AF37]" /> Questions
            </span>
            <span className="text-lg font-black text-[#10264F] font-mono tabular-nums mt-0.5 block">
              {questionCount}
            </span>
          </div>

          <div className="bg-white border-2 border-[#E5C568] rounded-2xl p-3 shadow-xs">
            <span className="text-[11px] font-bold text-[#8C681E] flex items-center justify-center gap-1">
              <Clock size={12} className="text-[#D4AF37]" /> Timer
            </span>
            <span className="text-lg font-black text-[#10264F] font-mono tabular-nums mt-0.5 block">
              {baseSeconds}s
            </span>
          </div>

          <div className="bg-white border-2 border-[#E5C568] rounded-2xl p-3 shadow-xs">
            <span className="text-[11px] font-bold text-[#8C681E] flex items-center justify-center gap-1">
              <Star size={12} className="text-[#D4AF37]" /> Best Score
            </span>
            <span className="text-lg font-black text-[#1A3D73] font-mono tabular-nums mt-0.5 block">
              {bestScore}
            </span>
          </div>
        </div>

        {/* Power-up reminder */}
        <div className="p-3 bg-[#FDF8EE] border-2 border-[#E5C568] rounded-xl flex items-center gap-3">
          <Zap size={20} className="text-[#D4AF37] shrink-0" />
          <p className="text-xs text-[#3D5A80] leading-relaxed">
            <strong className="text-[#10264F]">Stage Power-ups:</strong> You have 1x Extra Time (+10s)
            and 1x Remove Two choices ready to assist you.
          </p>
        </div>

        {/* Start Button */}
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={onStart}
        >
          Start Stage
        </Button>
      </div>
    </BottomDrawer>
  );
};
