import React, { useState } from 'react';
import {
  Compass,
  Map as MapIcon,
  Swords,
  Star,
  Sparkles,
  Volume2,
  VolumeX,
  CheckCircle2,
  Lock,
  ChevronRight,
  Award,
  Zap,
  Edit2,
  Check,
  Flame,
  ArrowRight,
  Palette,
} from 'lucide-react';
import { ProgressState, AgeGroup } from '../../types';
import { THEME_A_MODULES, THEME_B_MODULES } from '../../data/modules';
import { TreasureChestSvg } from './QuestMap/TreasureChestSvg';
import { soundService } from '../../utils/audio';

interface DashboardHomeProps {
  progress: ProgressState;
  theme?: 'default' | 'dark-emerald';
  onToggleTheme?: () => void;
  onOpenMap: () => void;
  onOpenDuels: () => void;
  onOpenGrownUps: () => void;
  onChangeAgeGroup: (age: AgeGroup) => void;
  onUpdateUsername: (name: string) => void;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({
  progress,
  theme = 'default',
  onToggleTheme,
  onOpenMap,
  onOpenDuels,
  onOpenGrownUps,
  onChangeAgeGroup,
  onUpdateUsername,
}) => {
  const [isMuted, setIsMuted] = useState(soundService.isMuted());
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(progress.username);

  const toggleSound = () => {
    const next = soundService.toggleMute();
    setIsMuted(next);
  };

  const currentModules = progress.ageGroup === '7-11' ? THEME_A_MODULES : THEME_B_MODULES;
  const totalStarsPossible = currentModules.length * 9;

  // Count unlocked modules
  const unlockedCount = currentModules.filter(
    (m, idx) =>
      progress.grownUps.allRegionsUnlocked ||
      idx === 0 ||
      progress.modules[currentModules[idx - 1]?.id]?.stages.moderate.passed
  ).length;

  // Next active module to focus on
  const nextModuleIndex = currentModules.findIndex((m, idx) => {
    const isUnlocked =
      progress.grownUps.allRegionsUnlocked ||
      idx === 0 ||
      progress.modules[currentModules[idx - 1]?.id]?.stages.moderate.passed;
    const modProg = progress.modules[m.id];
    const isMastered =
      modProg?.stages.easy.passed &&
      modProg?.stages.moderate.passed &&
      modProg?.stages.difficult.passed;
    return isUnlocked && !isMastered;
  });

  const activeModuleIndex = nextModuleIndex !== -1 ? nextModuleIndex : 0;
  const nextModule = currentModules[activeModuleIndex] || currentModules[0];
  const activeProg = progress.modules[nextModule.id];
  const activeStars =
    (activeProg?.stages.easy.stars || 0) +
    (activeProg?.stages.moderate.stars || 0) +
    (activeProg?.stages.difficult.stars || 0);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      onUpdateUsername(nameInput.trim());
      setIsEditingName(false);
      soundService.playTap();
    }
  };

  return (
    <div className="h-full flex flex-col justify-between p-2.5 sm:p-4 max-w-[680px] mx-auto w-full select-none overflow-hidden text-[#10264F]">
      {/* 1. ACADEMY HEADER: Scholar Profile, Age Track Button & Quick Settings (Royal Blue & Golden Touches) */}
      <header className="shrink-0 flex items-center justify-between gap-2 pb-2 border-b-2 border-[#D4AF37]/60">
        {/* Left: Scholar Profile */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#1A3D73] via-[#2A5CAA] to-[#10264F] text-[#FFF0A6] flex items-center justify-center font-black text-sm border-2 border-[#E5B842] shadow-md ring-2 ring-[#B8892B]/30">
              {progress.username.substring(0, 2).toUpperCase()}
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#D4AF37] border-2 border-[#FAF5EA] flex items-center justify-center text-[8px] text-[#10264F] font-black shadow-xs">
              ✓
            </div>
          </div>

          <div className="flex flex-col min-w-0">
            {isEditingName ? (
              <form onSubmit={handleSaveName} className="flex items-center gap-1.5">
                <input
                  type="text"
                  autoFocus
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-32 px-2 py-0.5 text-xs font-bold rounded-lg bg-[#FAF4E6] text-[#10264F] border-2 border-[#E5B842] focus:outline-none focus:ring-2 focus:ring-[#2A5CAA] shadow-xs scholar-name-input"
                  aria-label="Student name"
                  placeholder="Enter name..."
                />
                <button
                  type="submit"
                  aria-label="Save name"
                  title="Save name"
                  className="w-6 h-6 bg-[#1A3D73] hover:bg-[#2A5CAA] text-[#FFF0A6] rounded-lg flex items-center justify-center text-xs border border-[#E5B842] shadow-xs shrink-0 active:scale-95 transition-transform"
                >
                  <Check size={13} />
                </button>
              </form>
            ) : (
              <div
                className="flex items-center gap-1.5 cursor-pointer group"
                onClick={() => {
                  soundService.playTap();
                  setIsEditingName(true);
                }}
                title="Click to change scholar name"
              >
                <h1 className="text-sm sm:text-base font-black text-[#10264F] scholar-name-display leading-tight truncate">
                  {progress.username}
                </h1>
                <Edit2 size={13} className="text-[#8C681E] scholar-name-edit-icon group-hover:text-[#1A3D73] shrink-0 transition-colors" />
              </div>
            )}
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] text-[#8C681E] scholar-level-badge font-extrabold bg-[#FDF5E2] border border-[#DEBE6B] px-1.5 py-0.5 rounded-md">
                {progress.levelTitle}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Small Age Group Option Button & Quick Utility Controls (Clean & Decongested) */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Small Age Group Button / Icon */}
          <button
            type="button"
            onClick={() => {
              soundService.playTap();
              onChangeAgeGroup(progress.ageGroup === '7-11' ? '11-14' : '7-11');
            }}
            title={`Current Age Group: ${progress.ageGroup === '7-11' ? 'Explorer (7–11 yrs)' : 'Scholar (11–14 yrs)'}. Click to switch.`}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl border-2 text-xs font-black shadow-xs transition-colors cursor-pointer select-none ${
              progress.ageGroup === '7-11'
                ? 'bg-gradient-to-r from-[#1A3D73] to-[#2556A3] border-[#E5B842] text-white hover:border-[#FFF0A6]'
                : 'bg-gradient-to-r from-[#C99726] to-[#B8892B] border-[#FFF0A6] text-white hover:border-[#FEE589]'
            }`}
          >
            <Compass size={13} className={progress.ageGroup === '7-11' ? 'text-[#93C5FD]' : 'text-white'} />
            <span className="font-black">Age: {progress.ageGroup === '7-11' ? '7–11' : '11–14'}</span>
          </button>

          {/* Color & Theme Switcher (Dark Green Background & Beige Boxes with Blue Icons vs Classic) */}
          {onToggleTheme && (
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={
                theme === 'dark-emerald'
                  ? 'Switch to Classic Royal Blue theme'
                  : 'Switch to Dark Green & Beige theme'
              }
              title={
                theme === 'dark-emerald'
                  ? 'Theme: Dark Green & Beige (Blue Icons). Click for Classic Blue'
                  : 'Theme: Classic Royal Blue. Click for Dark Green & Beige'
              }
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl border-2 flex items-center justify-center shadow-xs cursor-pointer active:scale-95 transition-all select-none ${
                theme === 'dark-emerald'
                  ? 'bg-[#FAF4E6] border-[#1D4ED8] text-[#1D4ED8] hover:bg-[#EFE3C8] shadow-[0_0_8px_rgba(29,78,216,0.25)]'
                : 'bg-white border-[#D4AF37]/80 text-[#1A3D73] hover:text-[#8C681E] hover:border-[#B8892B] active:bg-[#FDF3D8]'
              }`}
            >
              <Palette size={15} className="text-[#1D4ED8]" />
            </button>
          )}

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white border-2 border-[#D4AF37]/70 flex items-center justify-center text-[#1A3D73] hover:text-[#8C681E] hover:border-[#B8892B] shadow-xs active:bg-[#FDF3D8] transition-colors"
          >
            {isMuted ? <VolumeX size={14} className="text-[#1D4ED8]" /> : <Volume2 size={14} className="text-[#1D4ED8]" />}
          </button>
        </div>
      </header>

      {/* 2. MAIN HUB CONTENT (NON-SCROLLABLE, RICH PARCHMENT & ADVENTURE AESTHETIC) */}
      <main className="flex-1 flex flex-col justify-between py-1.5 sm:py-2.5 gap-2 overflow-hidden">
        {/* Top Salutation & Scholar Badges Strip */}
        <div className="flex items-center justify-between px-1 shrink-0">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#10264F] leading-tight flex items-center gap-1.5">
              <span>As-salāmu &apos;alaykum!</span>
              <span className="text-base sm:text-lg">✨</span>
            </h2>
            <p className="text-xs sm:text-[13px] text-[#8C681E] font-extrabold leading-tight mt-0.5">
              Welcome to Mizmaar Dawood Academy
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <div className="flex items-center gap-1 bg-[#FDF5E2] border-2 border-[#E5B842] px-2.5 py-1 rounded-xl text-xs font-black text-[#8C681E] shadow-xs">
              <Star size={13} className="text-[#D4AF37] fill-[#D4AF37]" />
              <span>{progress.totalStars} Stars</span>
            </div>
            <div className="hidden xs:flex items-center gap-1 bg-[#FDF3D8] border border-[#DEBE6B] px-2 py-1 rounded-xl text-xs font-black text-[#8C681E] shadow-xs">
              <Flame size={12} className="text-[#D4AF37] fill-[#D4AF37]" />
              <span>Streak</span>
            </div>
          </div>
        </div>

        {/* 3. CENTER HERO: THE QUEST MAP OVERWORLD PORTAL */}
        <div
          onClick={onOpenMap}
          className="relative rounded-2xl sm:rounded-3xl border-4 border-[#D4AF37] bg-gradient-to-br from-[#FFFDF7] via-[#FDF6E4] to-[#F7EACD] p-3 sm:p-4 shadow-xl cursor-pointer overflow-hidden flex flex-col justify-between gap-2.5 shrink-0 select-none hover:border-[#B8892B] transition-all"
          style={{
            boxShadow: '0 12px 28px -6px rgba(26, 61, 124, 0.22), inset 0 0 38px rgba(212, 175, 55, 0.2)',
          }}
        >
          {/* Subtle Cartographic Background Decoration */}
          <div
            aria-hidden="true"
            className="absolute -right-4 -bottom-4 w-40 h-40 opacity-15 pointer-events-none text-[#D4AF37]"
          >
            <Compass size={160} />
          </div>

          {/* Top Row: Quest Identification & Map Open Arrow */}
          <div className="flex items-start justify-between gap-2 relative z-10">
            <div className="flex items-center gap-3">
              {/* Treasure Chest of the Active Quest */}
              <div className="relative shrink-0">
                <div className="p-1 rounded-2xl bg-[#F6EACF] border-2 border-[#D4AF37] shadow-inner flex items-center justify-center">
                  <TreasureChestSvg
                    state={activeStars >= 9 ? 'mastered' : 'active'}
                    size={52}
                    isCurrent={true}
                  />
                </div>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#1A3D73] to-[#2A5CAA] text-[#FFF0A6] text-[8px] font-black px-2 py-0.2 rounded-full border border-[#E5B842] whitespace-nowrap shadow-xs">
                  Quest {activeModuleIndex + 1}
                </div>
              </div>

              {/* Module Details */}
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-black uppercase tracking-wider text-[#8C681E] bg-[#FDF5E2] px-2 py-0.5 rounded-full border border-[#DEBE6B]">
                    Current Expedition
                  </span>
                  <span className="text-[10px] text-[#8C681E] font-bold truncate">
                    • {nextModule.regionName}
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-black text-[#10264F] flex items-center gap-2 mt-0.5 leading-tight truncate">
                  <span>{nextModule.title}</span>
                  {nextModule.arabicSubtitle && (
                    <span className="font-amiri text-xs text-[#8C681E] bg-white/95 px-1.5 py-0.2 rounded border border-[#DEBE6B] shadow-2xs">
                      {nextModule.arabicSubtitle}
                    </span>
                  )}
                </h3>

                <p className="text-[11px] text-[#3D5A80] line-clamp-1 mt-0.5 font-medium">
                  {nextModule.description}
                </p>
              </div>
            </div>

            <div className="shrink-0 w-8 h-8 rounded-xl bg-white border-2 border-[#D4AF37] flex items-center justify-center text-[#1A3D73] shadow-xs">
              <ChevronRight size={18} />
            </div>
          </div>

          {/* Middle: Miniature Trail Stepper (Visualizing Unlocking Progression) */}
          <div className="relative z-10 pt-1 border-t border-[#E5C568]">
            <div className="flex items-center justify-between text-[10px] font-bold text-[#8C681E] mb-1.5">
              <span className="flex items-center gap-1 font-black text-[#1A3D73]">
                <MapIcon size={12} className="text-[#D4AF37]" />
                <span>Realm Trail Progress</span>
              </span>
              <span className="text-[#8C681E] font-black">
                {unlockedCount} of {currentModules.length} Modules Open
              </span>
            </div>

            {/* Stepper Node Points */}
            <div className="flex items-center gap-1 sm:gap-2">
              {currentModules.map((m, idx) => {
                const isOpen =
                  progress.grownUps.allRegionsUnlocked ||
                  idx === 0 ||
                  progress.modules[currentModules[idx - 1]?.id]?.stages.moderate.passed;
                const isCleared = progress.modules[m.id]?.stages.difficult.passed;
                const isCurrent = idx === activeModuleIndex;

                return (
                  <div
                    key={m.id}
                    className={`flex-1 h-2.5 rounded-full border transition-colors ${
                      isCleared
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#2E9E5B] border-[#9E781A]'
                        : isCurrent
                        ? 'bg-[#1A3D73] border-2 border-[#E5B842] ring-2 ring-[#D4AF37]/50'
                        : isOpen
                        ? 'bg-[#D4AF37] border-[#A07818]'
                        : 'bg-[#DECEB1] border-[#C7B594]'
                    }`}
                    title={`${m.title} (${isCleared ? 'Mastered' : isOpen ? 'Unlocked' : 'Locked'})`}
                  />
                );
              })}
            </div>
          </div>

          {/* Action Button: Direct Portal into the Overworld Quest Map */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              soundService.playTap();
              onOpenMap();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#1A3D73] via-[#244F9C] to-[#1A3D73] hover:from-[#143265] hover:to-[#1C4382] border-2 border-[#E5B842] hover:border-[#FFF0A6] text-white text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-lg relative z-10 cursor-pointer transition-colors"
          >
            <Compass size={17} className="text-[#F5C542] shrink-0" />
            <span className="truncate tracking-wide">Open Quest Map & Unlock Next Treasure</span>
            <ArrowRight size={15} className="shrink-0 text-[#FFF0A6]" />
          </button>
        </div>

        {/* 4. BALANCED ACTION CARDS: Today's Quest + Duels Arena */}
        <div className="grid grid-cols-2 gap-2 sm:gap-2.5 shrink-0">
          {/* Card A: Today's Challenge (Gleaming Gold Theme) */}
          <div
            onClick={() => {
              soundService.playTap();
              onOpenMap();
            }}
            className="p-2.5 sm:p-3 rounded-2xl bg-white border-2 border-[#E5B842] hover:border-[#B8892B] shadow-xs hover:shadow-md flex flex-col justify-between gap-1.5 cursor-pointer active:translate-y-[1px] transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-[#8C681E] flex items-center gap-1">
                <Sparkles size={11} className="text-[#D4AF37]" />
                Daily Sunnah Goal
              </span>
              {progress.todaysQuest.completed ? (
                <CheckCircle2 size={14} className="text-[#2E9E5B]" />
              ) : (
                <span className="text-[9px] font-black text-[#8C681E] bg-[#FDF5E2] border border-[#E5B842] px-1.5 py-0.2 rounded-md">
                  +{progress.todaysQuest.rewardXp} XP
                </span>
              )}
            </div>

            <h4 className="text-[11px] sm:text-xs font-bold text-[#10264F] line-clamp-2 leading-tight">
              {progress.todaysQuest.title}
            </h4>

            <div className="text-[9px] sm:text-[10px] font-bold text-[#8C681E] flex items-center gap-1">
              <span>{progress.todaysQuest.completed ? 'MashaAllah! Complete' : 'Tap to embark now'}</span>
              <ChevronRight size={12} className="text-[#D4AF37] group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* Card B: Live Duels / Study Partner Practice (Royal Blue Theme) */}
          <div
            onClick={() => {
              soundService.playTap();
              onOpenDuels();
            }}
            className="p-2.5 sm:p-3 rounded-2xl bg-white border-2 border-[#2A5CAA] hover:border-[#1A3D73] shadow-xs hover:shadow-md flex flex-col justify-between gap-1.5 cursor-pointer active:translate-y-[1px] transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-[#1A3D73] flex items-center gap-1">
                <Swords size={11} className="text-[#1A3D73]" />
                Duels Arena
              </span>
              <span className="text-[9px] font-bold text-[#1A3D73] bg-[#EAF2FD] border border-[#A2C4EE] px-1.5 py-0.2 rounded-md">
                Active
              </span>
            </div>

            <h4 className="text-[11px] sm:text-xs font-bold text-[#10264F] line-clamp-2 leading-tight">
              Tajweed Speed Duels
            </h4>

            <div className="text-[9px] sm:text-[10px] font-bold text-[#1A3D73] flex items-center gap-1">
              <span>Sprint 10Q & Bot Mentors</span>
              <ChevronRight size={12} className="text-[#1A3D73] group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>

        {/* 5. ACADEMY MILESTONES & SCHOLAR STATS STRIP (ROYAL BLUE & GOLD ILLUMINATED) */}
        <div className="p-2 sm:p-2.5 rounded-2xl bg-[#FDF8EE] border-2 border-[#E5B842]/70 flex items-center justify-around text-center text-xs shadow-xs shrink-0">
          <div>
            <span className="text-[9px] text-[#8C681E] font-extrabold uppercase tracking-wider">
              Total Points
            </span>
            <div className="font-black text-xs sm:text-sm text-[#1A3D73] leading-tight">
              {progress.totalPoints.toLocaleString()}
            </div>
          </div>

          <div className="w-[1px] h-6 bg-[#E5C568]" />

          <div>
            <span className="text-[9px] text-[#8C681E] font-extrabold uppercase tracking-wider">
              Quest XP
            </span>
            <div className="font-black text-xs sm:text-sm text-[#B8892B] leading-tight">
              {progress.xp} XP
            </div>
          </div>

          <div className="w-[1px] h-6 bg-[#E5C568]" />

          <div>
            <span className="text-[9px] text-[#8C681E] font-extrabold uppercase tracking-wider">
              Realms Open
            </span>
            <div className="font-black text-xs sm:text-sm text-[#1A3D73] leading-tight">
              {unlockedCount} / {currentModules.length}
            </div>
          </div>

          <div className="w-[1px] h-6 bg-[#E5C568]" />

          <div>
            <span className="text-[9px] text-[#8C681E] font-extrabold uppercase tracking-wider">
              Scholar Rank
            </span>
            <div className="font-black text-xs sm:text-sm text-[#8C681E] leading-tight">
              Lv. {progress.level}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
