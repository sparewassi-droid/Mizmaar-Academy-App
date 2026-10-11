import React, { useState } from 'react';
import {
  X,
  Star,
  Play,
  Lock,
  Award,
  Clock,
  Sparkles,
  HelpCircle,
  Scroll,
} from 'lucide-react';
import { Tier, ModuleDefinition, ModuleProgress } from '../../../types';
import { LandmarkSvg } from './LandmarksSvg';
import { getNodeState } from '../../../utils/unlockRules';

interface QuestScrollModalProps {
  moduleDef: ModuleDefinition;
  questIndex: number;
  moduleProgress?: ModuleProgress;
  allRegionsUnlocked: boolean;
  onClose: () => void;
  onSelectStage: (moduleId: string, tier: Tier) => void;
}

export const QuestScrollModal: React.FC<QuestScrollModalProps> = ({
  moduleDef,
  questIndex,
  moduleProgress,
  allRegionsUnlocked,
  onClose,
  onSelectStage,
}) => {
  const [selectedTier, setSelectedTier] = useState<Tier>('easy');

  const tiers: Tier[] = ['easy', 'moderate', 'difficult'];

  const tierDetails = {
    easy: {
      name: 'Trial I: Foundational Discovery',
      badge: 'Easy • 10 Qs',
      desc: 'Learn the primary rules and identify letters with accuracy.',
      time: '60s',
      reward: '1 Star & +50 XP',
    },
    moderate: {
      name: 'Trial II: Core Passage',
      badge: 'Core • 20 Qs',
      desc: 'Master the practical tajweed drills to unlock the next quest on your map!',
      time: '90s',
      reward: '🔓 Unlocks Next Quest Chest',
    },
    difficult: {
      name: 'Trial III: Master’s Vault',
      badge: 'Mastery • 10 Qs',
      desc: 'Beat the speed exam to win the official Royal Region Seal.',
      time: '45s',
      reward: '🏆 Awards Royal Region Seal',
    },
  };

  const currentTierState = getNodeState(
    moduleProgress || undefined,
    selectedTier,
    true,
    allRegionsUnlocked
  );

  const isCurrentTierLocked = currentTierState === 'locked';
  const currentTierProgress = moduleProgress?.stages[selectedTier];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs select-none animate-fade-in"
      onClick={onClose}
    >
      {/* Ancient Parchment Scroll Wrapper (Royal Blue & Golden Finish) */}
      <div
        className="relative w-full max-w-md bg-[#FFFDF7] rounded-3xl border-4 border-[#D4AF37] shadow-2xl p-4 sm:p-6 overflow-hidden flex flex-col justify-between"
        style={{
          boxShadow: '0 25px 50px -12px rgba(16, 38, 79, 0.45), inset 0 0 40px rgba(212, 175, 55, 0.18)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative corner brackets in brilliant gold */}
        <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-[#D4AF37] rounded-tl-lg pointer-events-none" />
        <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-[#D4AF37] rounded-tr-lg pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-[#D4AF37] rounded-bl-lg pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-[#D4AF37] rounded-br-lg pointer-events-none" />

        {/* Top Header: Wax Seal & Title */}
        <div className="flex items-start justify-between pb-3 border-b-2 border-[#E5C568]">
          <div className="flex items-center gap-3">
            {/* Landmark / Wax Seal Crest */}
            <div className="w-13 h-13 rounded-2xl bg-[#FDF6E2] border-2 border-[#D4AF37] flex items-center justify-center shrink-0 shadow-inner">
              <LandmarkSvg
                landmarkKey={moduleDef.landmarkKey}
                isUnlocked={true}
                accentSolid={moduleDef.accentSolid}
                accentLight={moduleDef.accentLight}
                className="w-10 h-10"
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#FFF0A6] bg-[#1A3D73] px-2 py-0.5 rounded-full border border-[#E5B842] shadow-2xs">
                  Quest #{questIndex + 1}
                </span>
                {moduleDef.arabicSubtitle && (
                  <span className="font-amiri text-xs text-[#8C681E] font-bold bg-[#FDF5E2] px-1.5 py-0.2 rounded border border-[#DEBE6B]">
                    {moduleDef.arabicSubtitle}
                  </span>
                )}
              </div>
              <h2 className="text-base sm:text-lg font-black text-[#10264F] leading-tight mt-1">
                {moduleDef.title}
              </h2>
              <p className="text-xs text-[#8C681E] font-bold line-clamp-1">
                Region: {moduleDef.regionName}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Quest Scroll"
            className="w-8 h-8 rounded-full bg-[#FDF5E2] hover:bg-[#F6E6BF] text-[#8C681E] hover:text-[#10264F] border border-[#DEBE6B] flex items-center justify-center transition-colors shadow-xs cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Quest Story / Lore Briefing */}
        <div className="my-3 p-2.5 rounded-xl bg-[#FDF8EE] border border-[#E5C568] text-xs text-[#524430] flex items-center gap-2">
          <Scroll size={20} className="shrink-0 text-[#D4AF37]" />
          <p className="line-clamp-2 italic leading-relaxed">
            &ldquo;{moduleDef.description}&rdquo;
          </p>
        </div>

        {/* 3 Trial Tier Selectors */}
        <div className="my-2">
          <div className="flex items-center justify-between text-xs font-bold text-[#8C681E] mb-1.5 px-0.5">
            <span>Select Your Trial:</span>
            <span className="text-[#1A3D73] font-black">
              Best: {currentTierProgress?.bestScore || 0} pts
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {tiers.map((t, idx) => {
              const state = getNodeState(
                moduleProgress || undefined,
                t,
                true,
                allRegionsUnlocked
              );
              const tProg = moduleProgress?.stages[t];
              const isPassed = !!tProg?.passed;
              const isLocked = state === 'locked';
              const isSelected = selectedTier === t;

              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSelectedTier(t)}
                  className={`p-2 rounded-2xl border-2 flex flex-col items-center justify-between transition-all active:translate-y-[1px] cursor-pointer ${
                    isSelected
                      ? 'bg-white border-[#1A3D73] ring-3 ring-[#E5B842]/60 shadow-md'
                      : isLocked
                      ? 'bg-[#EFE5D0]/60 border-[#D9C7A7] opacity-60'
                      : 'bg-[#FDF9F2] border-[#E5C568] hover:border-[#1A3D73]'
                  }`}
                >
                  <span className={`text-[10px] font-black uppercase ${isSelected ? 'text-[#1A3D73]' : 'text-[#8C681E]'}`}>
                    Tier {idx + 1}
                  </span>

                  {/* Stars / Lock */}
                  <div className="my-1 flex items-center gap-0.5">
                    {isLocked ? (
                      <Lock size={14} className="text-[#8C98A4]" />
                    ) : (
                      [1, 2, 3].map((s) => (
                        <Star
                          key={s}
                          size={11}
                          className={
                            s <= (tProg?.stars || 0)
                              ? 'text-[#D4AF37] fill-[#D4AF37]'
                              : 'text-[#DECEB1]'
                          }
                        />
                      ))
                    )}
                  </div>

                  <span className={`text-[11px] font-black ${isPassed ? 'text-[#1A3D73]' : isSelected ? 'text-[#10264F]' : 'text-[#5B6B7B]'}`}>
                    {t === 'easy' ? 'Easy' : t === 'moderate' ? 'Core' : 'Master'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Tier Briefing Card */}
        <div className="p-3 my-2 rounded-2xl bg-white border-2 border-[#E5C568] shadow-xs flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-[#10264F]">
              {tierDetails[selectedTier].name}
            </h4>
            <span className="text-[10px] font-bold text-[#8C681E] bg-[#FDF5E2] px-2 py-0.5 rounded-full border border-[#DEBE6B] flex items-center gap-1">
              <Clock size={11} className="text-[#D4AF37]" /> {tierDetails[selectedTier].time}
            </span>
          </div>

          <p className="text-xs text-[#3D5A80] leading-relaxed">
            {tierDetails[selectedTier].desc}
          </p>

          <div className="flex items-center gap-1 text-[11px] font-black text-[#8C681E] bg-[#FDF5E2] p-1.5 rounded-xl border border-[#E5C568]">
            <Sparkles size={13} className="shrink-0 text-[#D4AF37]" />
            <span>Reward: {tierDetails[selectedTier].reward}</span>
          </div>
        </div>

        {/* Embark CTA Button */}
        <div className="mt-2 pt-2 border-t border-[#E5C568]">
          {isCurrentTierLocked ? (
            <div className="w-full py-2.5 px-4 rounded-xl bg-[#EFE5D0] border border-[#D9C7A7] text-center text-xs font-bold text-[#8C681E] flex items-center justify-center gap-2">
              <Lock size={14} />
              <span>
                {selectedTier === 'moderate'
                  ? 'Complete Easy Trial first to unlock'
                  : 'Complete Core Trial first to unlock'}
              </span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onSelectStage(moduleDef.id, selectedTier)}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#1A3D73] via-[#244F9C] to-[#1A3D73] hover:from-[#143265] hover:to-[#1C4382] border-2 border-[#E5B842] hover:border-[#FFF0A6] text-white text-sm font-black flex items-center justify-center gap-2 shadow-lg active:translate-y-[1px] transition-all cursor-pointer"
            >
              <Play size={16} fill="currentColor" className="text-[#F5C542]" />
              <span>Embark on Quest Now!</span>
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};
