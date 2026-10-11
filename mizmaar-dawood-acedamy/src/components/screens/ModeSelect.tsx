import React from 'react';
import { Compass, Users, ChevronLeft, Shield } from 'lucide-react';
import { ProgressState, AgeGroup } from '../../types';
import { TopBar } from '../common/TopBar';
import { Card } from '../common/Card';
import { Chip } from '../common/Chip';
import { soundService } from '../../utils/audio';

interface ModeSelectProps {
  progress: ProgressState;
  ageGroup: AgeGroup;
  onSelectMode: (mode: 'solo' | 'versus') => void;
  onBackToHome: () => void;
  onOpenGrownUps: () => void;
}

export const ModeSelect: React.FC<ModeSelectProps> = ({
  progress,
  ageGroup,
  onSelectMode,
  onBackToHome,
  onOpenGrownUps,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F2E8D5] text-[#1B2A41]">
      <TopBar
        leftAction={
          <button
            type="button"
            onClick={onBackToHome}
            aria-label="Back to Home"
            className="w-10 h-10 rounded-xl bg-white border border-[#E4D6BA] flex items-center justify-center text-[#1B2A41] card-solid active:translate-y-[1px]"
          >
            <ChevronLeft size={20} />
          </button>
        }
        title={
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#2A5CAA] text-white text-xs font-black flex items-center justify-center border border-[#1F4580]">
              {progress.username.substring(0, 2).toUpperCase()}
            </span>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold leading-tight scholar-name-display">{progress.username}</span>
              <span className="text-[10px] text-[#5B6B7B] font-semibold scholar-level-badge">{progress.levelTitle}</span>
            </div>
          </div>
        }
        rightAction={
          <button
            type="button"
            onClick={onOpenGrownUps}
            title="Grown-ups Corner"
            aria-label="Grown-ups Corner"
            className="w-10 h-10 rounded-xl bg-white border border-[#E4D6BA] flex items-center justify-center text-[#5B6B7B] hover:text-[#1B2A41] card-solid active:translate-y-[1px]"
          >
            <Shield size={18} />
          </button>
        }
      />

      <main className="flex-1 w-full max-w-[560px] mx-auto p-4 flex flex-col justify-center gap-6 my-auto">
        <div className="text-center">
          <Chip variant="neutral" className="mb-2">
            {ageGroup === '7-11' ? 'The Lantern Trail' : "The Scholar's Atlas"}
          </Chip>
          <h1 className="text-3xl font-black text-[#1B2A41]">Choose Your Mode</h1>
          <p className="text-sm text-[#5B6B7B] mt-1 font-medium">
            Continue your solo journey along the path, or challenge a friend to a live duel.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Solo Quest Card */}
          <Card
            theme={ageGroup}
            interactive
            onClick={() => {
              soundService.playTap();
              onSelectMode('solo');
            }}
            className="flex flex-col items-center text-center p-6 gap-4 border-2 hover:border-[#2A5CAA]"
          >
            <div className="w-20 h-20 rounded-2xl bg-[#CFE6FA] border-2 border-[#2A5CAA] flex items-center justify-center card-solid">
              <Compass size={38} className="text-[#2A5CAA]" strokeWidth={2.2} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#1B2A41]">Solo Quest</h2>
              <p className="text-xs text-[#5B6B7B] mt-1 leading-relaxed">
                Climb the trail, unlock regions, earn mastery seals, and collect stars at your own pace.
              </p>
            </div>
          </Card>

          {/* Versus Friend Card */}
          <Card
            theme={ageGroup}
            interactive
            onClick={() => {
              soundService.playTap();
              onSelectMode('versus');
            }}
            className="flex flex-col items-center text-center p-6 gap-4 border-2 hover:border-[#B8892B]"
          >
            <div className="w-20 h-20 rounded-2xl bg-[#EBD9A8] border-2 border-[#B8892B] flex items-center justify-center card-solid">
              <Users size={38} className="text-[#B8892B]" strokeWidth={2.2} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#1B2A41]">Versus Friend</h2>
              <p className="text-xs text-[#5B6B7B] mt-1 leading-relaxed">
                Live timed duels in Classic or Sprint Race format with friends or Practice Bot.
              </p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};
