import React, { useState } from 'react';
import { ChevronLeft, Swords, Zap, Award, Compass, Sparkles, Bot, Shield } from 'lucide-react';
import { FriendUser, AgeGroup, DuelFormat, ProgressState } from '../../../types';
import { TopBar } from '../../common/TopBar';
import { Card } from '../../common/Card';
import { Button } from '../../common/Button';
import { Chip } from '../../common/Chip';
import { THEME_A_MODULES, THEME_B_MODULES } from '../../../data/modules';
import { soundService } from '../../../utils/audio';

interface ChallengeSetupProps {
  opponent: FriendUser;
  ageGroup: AgeGroup;
  progress: ProgressState;
  onBack: () => void;
  onCreateDuel: (params: {
    friendId: string;
    moduleId: string;
    ageGroup: AgeGroup;
    format: DuelFormat;
    seed: string;
  }) => void;
}

export const ChallengeSetup: React.FC<ChallengeSetupProps> = ({
  opponent,
  ageGroup,
  progress,
  onBack,
  onCreateDuel,
}) => {
  const modules = ageGroup === '7-11' ? THEME_A_MODULES : THEME_B_MODULES;
  const [selectedModuleId, setSelectedModuleId] = useState<string>(modules[0].id);
  const [selectedFormat, setSelectedFormat] = useState<DuelFormat>('classic');
  const [isCreating, setIsCreating] = useState(false);

  const handleStart = () => {
    soundService.playTap();
    setIsCreating(true);
    const randomSeed = `seed_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    onCreateDuel({
      friendId: opponent.id,
      moduleId: selectedModuleId,
      ageGroup,
      format: selectedFormat,
      seed: randomSeed,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F2E8D5] text-[#1B2A41]">
      <TopBar
        leftAction={
          <button
            type="button"
            onClick={() => {
              soundService.playTap();
              onBack();
            }}
            aria-label="Back"
            className="w-10 h-10 rounded-xl bg-white border border-[#E4D6BA] flex items-center justify-center text-[#1B2A41] card-solid active:translate-y-[1px]"
          >
            <ChevronLeft size={20} />
          </button>
        }
        title={
          <div className="flex items-center gap-2">
            <Swords size={18} className="text-[#2A5CAA]" />
            <span className="font-bold text-sm">Challenge Setup</span>
          </div>
        }
      />

      <main className="flex-1 w-full max-w-[620px] mx-auto p-4 flex flex-col gap-5">
        {/* Opponent Card Preview */}
        <div className="p-4 rounded-2xl bg-white border-2 border-[#E4D6BA] flex items-center justify-between card-solid">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#CFE6FA] border-2 border-[#2A5CAA] flex items-center justify-center text-[#2A5CAA]">
              {opponent.isBot ? <Bot size={24} /> : <span className="font-black text-base">{opponent.username.substring(0, 2).toUpperCase()}</span>}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold text-[#5B6B7B]">Challenging:</span>
                <span className="font-black text-sm text-[#1B2A41]">{opponent.username}</span>
              </div>
              <p className="text-xs text-[#5B6B7B] font-medium">{opponent.levelTitle}</p>
            </div>
          </div>
          <Chip variant="lapis">{opponent.isBot ? 'Bot Ready' : 'Online'}</Chip>
        </div>

        {/* Duel Format Selection */}
        <section className="flex flex-col gap-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#5B6B7B]">
            1. Select Match Format
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Classic Duel */}
            <button
              type="button"
              onClick={() => {
                soundService.playTap();
                setSelectedFormat('classic');
              }}
              className={`p-4 rounded-2xl text-left border-2 transition-all flex flex-col gap-2 ${
                selectedFormat === 'classic'
                  ? 'bg-white border-[#2A5CAA] card-solid ring-2 ring-[#2A5CAA]/20'
                  : 'bg-white/70 border-[#E4D6BA] hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-[#CFE6FA] border border-[#2A5CAA] flex items-center justify-center text-[#2A5CAA]">
                  <Award size={18} />
                </div>
                {selectedFormat === 'classic' && (
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#2A5CAA] bg-[#CFE6FA] px-2 py-0.5 rounded-full">
                    Selected
                  </span>
                )}
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#1B2A41]">Classic Duel</h3>
                <p className="text-xs text-[#5B6B7B] mt-0.5">
                  10 Questions (3 Easy, 4 Moderate, 3 Difficult). Highest accuracy & time bonus wins.
                </p>
              </div>
            </button>

            {/* Sprint Race */}
            <button
              type="button"
              onClick={() => {
                soundService.playTap();
                setSelectedFormat('sprint');
              }}
              className={`p-4 rounded-2xl text-left border-2 transition-all flex flex-col gap-2 ${
                selectedFormat === 'sprint'
                  ? 'bg-white border-[#B8892B] card-solid ring-2 ring-[#B8892B]/20'
                  : 'bg-white/70 border-[#E4D6BA] hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-[#EBD9A8] border border-[#B8892B] flex items-center justify-center text-[#7A5814]">
                  <Zap size={18} />
                </div>
                {selectedFormat === 'sprint' && (
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#7A5814] bg-[#EBD9A8] px-2 py-0.5 rounded-full">
                    Selected
                  </span>
                )}
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#1B2A41]">Sprint Race</h3>
                <p className="text-xs text-[#5B6B7B] mt-0.5">
                  15 Rapid Questions. Race against the clock and your opponent's live speed bar!
                </p>
              </div>
            </button>
          </div>
        </section>

        {/* Module Topic Selection */}
        <section className="flex flex-col gap-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#5B6B7B]">
            2. Choose Knowledge Arena ({ageGroup === '7-11' ? 'Explorer Trail' : 'Scholar Atlas'})
          </h2>
          <div className="flex flex-col gap-2">
            {modules.map((mod) => {
              const isSelected = selectedModuleId === mod.id;
              const isUnlocked = progress.grownUps.allRegionsUnlocked || progress.modules[mod.id]?.unlocked;

              return (
                <button
                  key={mod.id}
                  type="button"
                  onClick={() => {
                    soundService.playTap();
                    setSelectedModuleId(mod.id);
                  }}
                  className={`p-3 rounded-2xl text-left border-2 transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-white border-[#2A5CAA] card-solid'
                      : 'bg-white/70 border-[#E4D6BA] hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs shrink-0 border"
                      style={{
                        backgroundColor: isSelected ? '#CFE6FA' : '#FAF5EA',
                        borderColor: isSelected ? '#2A5CAA' : '#E4D6BA',
                        color: isSelected ? '#2A5CAA' : '#1B2A41',
                      }}
                    >
                      {mod.code.toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-[#1B2A41]">{mod.title}</h4>
                        {mod.arabicSubtitle && (
                          <span className="font-amiri text-xs text-[#5B6B7B]">
                            {mod.arabicSubtitle}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#5B6B7B] line-clamp-1">{mod.regionName}</p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    {isUnlocked ? (
                      <Chip variant="neutral" className="text-[10px]">
                        Unlocked
                      </Chip>
                    ) : (
                      <span className="text-[10px] font-bold text-[#5B6B7B] bg-[#E4D6BA]/50 px-2 py-0.5 rounded-full">
                        Trail
                      </span>
                    )}
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? 'border-[#2A5CAA] bg-[#2A5CAA]' : 'border-[#E4D6BA]'
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Launch Button */}
        <div className="mt-auto pt-2">
          <Button
            variant="primary"
            size="lg"
            disabled={isCreating}
            onClick={handleStart}
            className="w-full flex items-center justify-center gap-2 text-base font-bold"
          >
            <Swords size={20} />
            Enter Duel Match
          </Button>
        </div>
      </main>
    </div>
  );
};
