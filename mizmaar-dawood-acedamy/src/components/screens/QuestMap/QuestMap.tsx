import React, { useState, useMemo } from 'react';
import {
  Compass,
  Award,
  Lock,
  ArrowRight,
  X,
} from 'lucide-react';
import {
  AgeGroup,
  Tier,
  ProgressState,
  ModuleDefinition,
} from '../../../types';
import { MODULE_DEFINITIONS } from '../../../data/modules';
import { TreasureChestSvg, TreasureState } from './TreasureChestSvg';
import { QuestScrollModal } from './QuestScrollModal';
import { checkAllSealsEarned, isRegionUnlocked } from '../../../utils/unlockRules';
import { soundService } from '../../../utils/audio';

interface QuestMapProps {
  progress: ProgressState;
  ageGroup: AgeGroup;
  onSelectStage: (moduleId: string, tier: Tier) => void;
  onBackToMode: () => void;
  onChangeAgeGroup?: (age: AgeGroup) => void;
}

interface PositionCoord {
  left: string;
  top: string;
  svgX: number;
  svgY: number;
}

// Generate well-spaced map coordinates avoiding any overlap between adjacent quests
function getQuestCoordinates(count: number): PositionCoord[] {
  if (count <= 4) {
    return [
      { left: '18%', top: '78%', svgX: 180, svgY: 510 }, // 1. Oasis (Bottom-Left)
      { left: '80%', top: '74%', svgX: 800, svgY: 480 }, // 2. Canyon (Bottom-Right)
      { left: '78%', top: '34%', svgX: 780, svgY: 220 }, // 3. Grove (Mid-Right)
      { left: '22%', top: '24%', svgX: 220, svgY: 160 }, // 4. Harbor (Upper-Left)
    ];
  }
  if (count === 5) {
    return [
      { left: '16%', top: '80%', svgX: 160, svgY: 520 }, // 1. Oasis (Bottom-Left)
      { left: '80%', top: '75%', svgX: 800, svgY: 490 }, // 2. Canyon (Bottom-Right)
      { left: '30%', top: '52%', svgX: 300, svgY: 340 }, // 3. Steps & Dunes (Mid-Left)
      { left: '82%', top: '34%', svgX: 820, svgY: 220 }, // 4. Olive Grove & Tower (Mid-Right)
      { left: '20%', top: '22%', svgX: 200, svgY: 145 }, // 5. Coastal Harbor (Upper-Left)
    ];
  }
  // 6 or more (Scholar 11–14)
  return [
    { left: '16%', top: '82%', svgX: 160, svgY: 535 }, // 1. Oasis (Bottom-Left)
    { left: '82%', top: '78%', svgX: 820, svgY: 510 }, // 2. Canyon (Bottom-Right)
    { left: '28%', top: '60%', svgX: 280, svgY: 390 }, // 3. Caravanserai (Lower-Mid Left)
    { left: '80%', top: '44%', svgX: 800, svgY: 285 }, // 4. Mountain Fortress (Upper-Mid Right)
    { left: '32%', top: '28%', svgX: 320, svgY: 180 }, // 5. Palm Grove (Upper-Mid Left)
    { left: '82%', top: '18%', svgX: 820, svgY: 120 }, // 6. Coastal Citadel (Upper-Right)
  ];
}

export const QuestMap: React.FC<QuestMapProps> = ({
  progress,
  ageGroup,
  onSelectStage,
  onChangeAgeGroup,
}) => {
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [lockedNotice, setLockedNotice] = useState<{
    questNumber: number;
    title: string;
    prevTitle: string;
    prevModuleId: string;
  } | null>(null);

  // Filter modules by current ageGroup
  const moduleDefs = useMemo(() => {
    return Object.values(MODULE_DEFINITIONS).filter((m) => m.ageGroup === ageGroup);
  }, [ageGroup]);

  const allSealsEarned = checkAllSealsEarned(moduleDefs, progress.modules);

  // Determine unlock state for each quest module
  const questStates = useMemo(() => {
    return moduleDefs.map((mod, idx) => {
      const isUnlocked = isRegionUnlocked(
        idx,
        moduleDefs,
        progress.modules,
        progress.grownUps.allRegionsUnlocked
      );
      const prog = progress.modules[mod.id];
      const easyPassed = !!prog?.stages.easy.passed;
      const moderatePassed = !!prog?.stages.moderate.passed;
      const difficultPassed = !!prog?.stages.difficult.passed;
      const isMastered = easyPassed && moderatePassed && difficultPassed;
      const stars = (prog?.stages.easy.stars || 0) +
        (prog?.stages.moderate.stars || 0) +
        (prog?.stages.difficult.stars || 0);

      let visualState: TreasureState = 'locked';
      if (!isUnlocked) {
        visualState = 'locked';
      } else if (isMastered) {
        visualState = 'mastered';
      } else {
        visualState = 'active';
      }

      return {
        mod,
        index: idx,
        isUnlocked,
        isMastered,
        stars,
        visualState,
        prog,
      };
    });
  }, [moduleDefs, progress.modules, progress.grownUps.allRegionsUnlocked]);

  // Coordinates array safe for this module count
  const questPositions = useMemo(() => {
    return getQuestCoordinates(moduleDefs.length);
  }, [moduleDefs.length]);

  // Safe position accessor guaranteeing pos is NEVER undefined
  const getSafePosition = (idx: number): PositionCoord => {
    if (questPositions[idx]) return questPositions[idx];
    return questPositions[idx % questPositions.length] || {
      left: '50%',
      top: '50%',
      svgX: 500,
      svgY: 300,
    };
  };

  // Find the player's current active quest position
  const activeQuestIndex = useMemo(() => {
    for (let i = 0; i < questStates.length; i++) {
      if (questStates[i].isUnlocked && !questStates[i].isMastered) {
        return i;
      }
    }
    // If all are mastered, player stands at the Summit Apex
    if (allSealsEarned) return questStates.length;
    return 0;
  }, [questStates, allSealsEarned]);

  // Currently inspected module for Quest Scroll modal
  const inspectingModule = useMemo(() => {
    if (!selectedModuleId) return null;
    return moduleDefs.find((m) => m.id === selectedModuleId) || null;
  }, [selectedModuleId, moduleDefs]);

  const inspectingIndex = useMemo(() => {
    if (!selectedModuleId) return 0;
    return moduleDefs.findIndex((m) => m.id === selectedModuleId);
  }, [selectedModuleId, moduleDefs]);

  // Node Click handler
  const handleQuestNodeClick = (idx: number) => {
    soundService.playTap();
    const qState = questStates[idx];
    if (!qState) return;

    if (!qState.isUnlocked) {
      const prevMod = moduleDefs[idx - 1];
      setLockedNotice({
        questNumber: idx + 1,
        title: qState.mod.title,
        prevTitle: prevMod ? prevMod.title : 'Previous Quest',
        prevModuleId: prevMod ? prevMod.id : moduleDefs[0].id,
      });
      setSelectedModuleId(null);
      return;
    }

    setLockedNotice(null);
    setSelectedModuleId(qState.mod.id);
  };

  // Apex Position based on module count
  const apexPos = useMemo(() => {
    if (moduleDefs.length >= 6) {
      return { left: '52%', top: '11%', svgX: 520, svgY: 75 };
    }
    return { left: '52%', top: '12%', svgX: 520, svgY: 80 };
  }, [moduleDefs.length]);

  return (
    <div className="relative h-full w-full flex flex-col bg-[#F3E7CC] text-[#1B2A41] overflow-hidden select-none font-sans">
      {/* 1. TOP HEADER: CLEAN BAR WITH ONLY EXPLORER AND SCHOLAR OPTIONS (ROYAL BLUE & GOLD THEMED) */}
      <header className="shrink-0 h-13 sm:h-14 bg-[#FAF3E3] border-b-2 border-[#D4AF37] px-3 sm:px-6 flex items-center justify-center shadow-xs z-30 select-none">
        <div className="flex bg-[#ECE0C7] p-1 rounded-2xl border-2 border-[#D4AF37] shadow-inner max-w-sm w-full justify-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              soundService.playTap();
              onChangeAgeGroup?.('7-11');
              setSelectedModuleId(null);
              setLockedNotice(null);
            }}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer ${
              ageGroup === '7-11'
                ? 'bg-gradient-to-r from-[#1A3D73] to-[#2556A3] text-white shadow-md border-2 border-[#E5B842]'
                : 'text-[#8C681E] hover:text-[#10264F] hover:bg-white/40'
            }`}
          >
            <Compass size={16} className={ageGroup === '7-11' ? 'text-[#F5C542]' : 'text-[#8C681E]'} />
            <span>Explorer</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold leading-none ${
                ageGroup === '7-11' ? 'bg-[#10264F] text-[#FFF0A6] border border-[#E5B842]/50' : 'bg-[#DFD0B0] text-[#7A6133]'
              }`}
            >
              7–11
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundService.playTap();
              onChangeAgeGroup?.('11-14');
              setSelectedModuleId(null);
              setLockedNotice(null);
            }}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer ${
              ageGroup === '11-14'
                ? 'bg-gradient-to-r from-[#C99726] to-[#B8892B] text-white shadow-md border-2 border-[#FFF0A6]'
                : 'text-[#8C681E] hover:text-[#10264F] hover:bg-white/40'
            }`}
          >
            <Award size={16} className={ageGroup === '11-14' ? 'text-[#FFF0A6]' : 'text-[#8C681E]'} />
            <span>Scholar</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold leading-none ${
                ageGroup === '11-14' ? 'bg-[#855F10] text-[#FFF0A6] border border-[#FFF0A6]/40' : 'bg-[#DFD0B0] text-[#7A6133]'
              }`}
            >
              11–14
            </span>
          </button>
        </div>
      </header>

      {/* 2. REAL TREASURE QUEST MAP (FITS 100% IN VIEWPORT, ZERO SCROLLING) */}
      <div className="flex-1 w-full h-full relative overflow-hidden flex items-center justify-center p-1 sm:p-2.5">
        {/* ANTIQUE PARCHMENT MAP FRAME WITH RADIANT GOLDEN FINISH */}
        <div
          className="relative w-full h-full max-w-5xl rounded-3xl border-4 border-[#D4AF37] bg-[#F7EED8] shadow-2xl overflow-hidden"
          style={{
            boxShadow: '0 20px 45px -10px rgba(26, 61, 124, 0.4), inset 0 0 60px rgba(212, 175, 55, 0.28)',
          }}
        >
          {/* SVG MAP BACKGROUND: TERRAIN, WATER, AND WINDING DOTTED TREASURE TRAIL */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            preserveAspectRatio="none"
            viewBox="0 0 1000 650"
          >
            <defs>
              {/* Parchment Paper Gradient */}
              <radialGradient id="parchmentTexture" cx="50%" cy="50%" r="70%">
                <stop offset="0%" stopColor="#FFF9EB" />
                <stop offset="60%" stopColor="#F5E8C7" />
                <stop offset="100%" stopColor="#E3CCA0" />
              </radialGradient>

              {/* Golden Path Glowing Filter */}
              <filter id="goldPathGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#F1C40F" floodOpacity="0.8" />
              </filter>
            </defs>

            {/* Base Parchment Field */}
            <rect width="1000" height="650" fill="url(#parchmentTexture)" />

            {/* Weathered Outer Compass Border */}
            <rect
              x="12"
              y="12"
              width="976"
              height="626"
              rx="20"
              fill="none"
              stroke="#B89454"
              strokeWidth="2.5"
              strokeDasharray="18 10"
              opacity="0.65"
            />
            <rect
              x="20"
              y="20"
              width="960"
              height="610"
              rx="16"
              fill="none"
              stroke="#CFA968"
              strokeWidth="1"
              opacity="0.4"
            />

            {/* TOPOGRAPHIC ELEVATION CONTOURS (Hand-drawn look) */}
            <path
              d="M 50 150 Q 180 90 320 160 T 600 120 T 950 160"
              fill="none"
              stroke="#D8BE8E"
              strokeWidth="1.5"
              opacity="0.35"
            />
            <path
              d="M 50 320 Q 220 280 400 350 T 780 300 T 950 340"
              fill="none"
              stroke="#D8BE8E"
              strokeWidth="1.5"
              opacity="0.35"
            />
            <path
              d="M 50 500 Q 250 440 500 520 T 950 480"
              fill="none"
              stroke="#D8BE8E"
              strokeWidth="1.5"
              opacity="0.35"
            />

            {/* GEOGRAPHIC FEATURE 1: Emerald Oasis Lagoon (Near Quest 1 - Bottom Left) */}
            <ellipse cx="160" cy="520" rx="135" ry="70" fill="#D3EBF5" opacity="0.65" />
            <ellipse cx="160" cy="520" rx="95" ry="45" fill="#BFE3F2" opacity="0.55" />
            {/* Palm trees at Oasis */}
            <g transform="translate(85, 480) scale(0.7)" opacity="0.75">
              <path d="M 20 50 Q 25 25 30 0" stroke="#7A5229" strokeWidth="4" fill="none" />
              <path d="M 30 0 Q 10 -20 -10 -15" stroke="#2E7D32" strokeWidth="3" fill="none" />
              <path d="M 30 0 Q 30 -30 35 -35" stroke="#2E7D32" strokeWidth="3" fill="none" />
              <path d="M 30 0 Q 50 -20 70 -15" stroke="#2E7D32" strokeWidth="3" fill="none" />
            </g>

            {/* GEOGRAPHIC FEATURE 2: Red Sandstone Canyons (Near Quest 2 - Bottom Right) */}
            <polygon points="720,560 760,470 800,560" fill="#E6BA80" opacity="0.5" />
            <polygon points="770,560 810,450 850,560" fill="#DEAB6D" opacity="0.5" />
            <polygon points="820,560 860,480 900,560" fill="#E6BA80" opacity="0.5" />

            {/* GEOGRAPHIC FEATURE 3: Desert Dunes & Caravanserai (Mid-Left area) */}
            <ellipse cx="300" cy="340" rx="110" ry="60" fill="#EFE0BC" opacity="0.45" />
            <path
              d="M 250 360 Q 290 330 340 350"
              fill="none"
              stroke="#D2B589"
              strokeWidth="2"
              opacity="0.45"
            />

            {/* GEOGRAPHIC FEATURE 4: Olive Groves & Citadel Hills (Near Quest 4 - Mid Right) */}
            <ellipse cx="810" cy="225" rx="125" ry="75" fill="#E2E8D0" opacity="0.5" />
            <circle cx="870" cy="200" r="15" fill="#A4B584" opacity="0.6" />
            <circle cx="890" cy="215" r="11" fill="#8E9F6E" opacity="0.6" />

            {/* GEOGRAPHIC FEATURE 5: Blue Ocean Cove with Sailing Merchant Ship (Near Harbor - Upper Left) */}
            <ellipse cx="190" cy="155" rx="135" ry="75" fill="#D5EEF5" opacity="0.55" />
            {/* Dhow / Sailing Ship on the water */}
            <g transform="translate(85, 125) scale(0.65)" opacity="0.7">
              <path d="M 0 25 Q 25 35 50 25 L 45 40 Q 25 45 5 40 Z" fill="#8B5A2B" />
              <line x1="25" y1="28" x2="25" y2="2" stroke="#5C3A1E" strokeWidth="2" />
              <polygon points="25,5 45,22 25,22" fill="#FAF5EA" stroke="#CBB48B" strokeWidth="1" />
              <polygon points="25,5 10,24 25,24" fill="#FAF5EA" stroke="#CBB48B" strokeWidth="1" />
            </g>

            {/* GEOGRAPHIC FEATURE 6: The High Mountain Summit (Top Center - Apex) */}
            <polygon points="430,135 520,40 610,135" fill="#E2C99D" opacity="0.6" />
            <polygon points="480,135 520,75 560,135" fill="#FFF9ED" opacity="0.8" />

            {/* ============================================================== */}
            {/* DYNAMIC WINDING DOTTED TREASURE TRAIL LINKING ALL QUESTS */}
            {questStates.map((_, i) => {
              if (i >= questStates.length - 1) return null;
              const p = getSafePosition(i);
              const nextP = getSafePosition(i + 1);
              const isSegmentUnlocked = !!questStates[i + 1]?.isUnlocked;

              // Curved bezier path between sequential waypoints
              const midX = (p.svgX + nextP.svgX) / 2;
              const midY = (p.svgY + nextP.svgY) / 2 + (i % 2 === 0 ? 30 : -25);
              const pathD = `M ${p.svgX} ${p.svgY} Q ${midX} ${midY} ${nextP.svgX} ${nextP.svgY}`;

              return (
                <path
                  key={`trail-seg-${i}`}
                  d={pathD}
                  fill="none"
                  stroke={isSegmentUnlocked ? '#D4AF37' : '#1A3D73'}
                  strokeWidth={isSegmentUnlocked ? '6' : '3.5'}
                  strokeDasharray={isSegmentUnlocked ? '10 8' : '8 8'}
                  strokeLinecap="round"
                  filter={isSegmentUnlocked ? 'url(#goldPathGlow)' : undefined}
                  opacity={isSegmentUnlocked ? 0.95 : 0.45}
                />
              );
            })}

            {/* FINAL TRAIL SEGMENT TO SUMMIT APEX */}
            {(() => {
              const lastPos = getSafePosition(questStates.length - 1);
              const midX = (lastPos.svgX + apexPos.svgX) / 2;
              const midY = (lastPos.svgY + apexPos.svgY) / 2;
              const pathD = `M ${lastPos.svgX} ${lastPos.svgY} Q ${midX} ${midY} ${apexPos.svgX} ${apexPos.svgY}`;

              return (
                <path
                  d={pathD}
                  fill="none"
                  stroke={allSealsEarned ? '#D4AF37' : '#1A3D73'}
                  strokeWidth={allSealsEarned ? '6' : '3.5'}
                  strokeDasharray={allSealsEarned ? '10 8' : '8 8'}
                  strokeLinecap="round"
                  filter={allSealsEarned ? 'url(#goldPathGlow)' : undefined}
                  opacity={allSealsEarned ? 0.95 : 0.45}
                />
              );
            })()}

            {/* VINTAGE COMPASS ROSE IN LOWER RIGHT CORNER (ROYAL BLUE & GOLD STAR) */}
            <g transform="translate(930, 580) scale(0.65)" opacity="0.75">
              <circle cx="0" cy="0" r="44" fill="none" stroke="#D4AF37" strokeWidth="2.5" />
              <circle cx="0" cy="0" r="36" fill="none" stroke="#F5C542" strokeWidth="1" strokeDasharray="4 4" />
              <polygon points="0,-48 6,0 0,6 -6,0" fill="#1A3D73" stroke="#F5C542" strokeWidth="0.8" />
              <polygon points="0,48 6,0 0,-6 -6,0" fill="#D4AF37" />
              <polygon points="48,0 0,6 -6,0 0,-6" fill="#D4AF37" />
              <polygon points="-48,0 0,6 6,0 0,-6" fill="#D4AF37" />
              <text x="0" y="-53" textAnchor="middle" fill="#10264F" fontSize="13" fontWeight="900">N</text>
              <text x="56" y="4" textAnchor="middle" fill="#10264F" fontSize="11" fontWeight="bold">E</text>
              <text x="0" y="62" textAnchor="middle" fill="#10264F" fontSize="11" fontWeight="bold">S</text>
              <text x="-56" y="4" textAnchor="middle" fill="#10264F" fontSize="11" fontWeight="bold">W</text>
            </g>

            {/* BIG "X" MARKS THE SPOT BEHIND THE SUMMIT APEX */}
            <g transform={`translate(${apexPos.svgX}, ${apexPos.svgY - 2})`} opacity={allSealsEarned ? 0.95 : 0.6}>
              <line x1="-20" y1="-20" x2="20" y2="20" stroke="#C0392B" strokeWidth="6" strokeLinecap="round" />
              <line x1="20" y1="-20" x2="-20" y2="20" stroke="#C0392B" strokeWidth="6" strokeLinecap="round" />
            </g>
          </svg>

          {/* INTERACTIVE QUEST WAYPOINT TREASURES ON THE MAP */}
          {questStates.map((qState, idx) => {
            const pos = getSafePosition(idx);
            const isCurrentPin = activeQuestIndex === idx;

            return (
              <div
                key={qState.mod.id}
                style={{ left: pos.left, top: pos.top }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center cursor-pointer group select-none"
                onClick={() => handleQuestNodeClick(idx)}
              >
                {/* Bouncing Player Pawn / Traveler Explorer Pin (Royal Blue & Gold) */}
                {isCurrentPin && (
                  <div className="absolute -top-11 z-30 pointer-events-none animate-bounce-gentle flex flex-col items-center">
                    <div className="px-2 py-0.5 rounded-full bg-gradient-to-r from-[#1A3D73] to-[#2A5CAA] text-[#FFF0A6] text-[9px] font-black shadow-md border-2 border-[#E5B842] flex items-center gap-1 whitespace-nowrap">
                      <span>You are here</span>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-[#1A3D73] border-2 border-[#E5B842] shadow-lg flex items-center justify-center text-[#FFF0A6] text-[10px] font-black -mt-0.5">
                      {progress.username.substring(0, 1).toUpperCase()}
                    </div>
                    <div className="w-2.5 h-1 bg-[#10264F]/30 rounded-full mt-[-2px]" />
                  </div>
                )}

                {/* REAL TREASURE CHEST sitting on stone pedestal */}
                <div
                  className={`relative p-1 rounded-2xl transition-all duration-300 flex items-center justify-center ${
                    qState.visualState === 'active'
                      ? 'scale-105 group-hover:scale-115'
                      : qState.visualState === 'mastered'
                      ? 'group-hover:scale-110'
                      : 'opacity-80 group-hover:opacity-95'
                  }`}
                >
                  {/* Pulsing Aura Ring for Active Chest */}
                  {qState.visualState === 'active' && (
                    <div className="absolute inset-0 rounded-full bg-[#F5C542]/35 animate-ping pointer-events-none" />
                  )}

                  <TreasureChestSvg
                    state={qState.visualState}
                    size={52}
                    isCurrent={isCurrentPin}
                  />
                </div>

                {/* PARCHMENT QUEST RIBBON BANNER - ROYAL BLUE & GOLDEN ACCENTS */}
                <div
                  className={`-mt-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-xl border-2 flex flex-col items-center shadow-md text-center w-[105px] xs:w-[118px] sm:w-[132px] transition-all select-none ${
                    qState.visualState === 'locked'
                      ? 'bg-[#EAE0CA]/95 border-[#C7B591] text-[#7A6B4F]'
                      : qState.visualState === 'mastered'
                      ? 'bg-[#FDF5E2] border-2 border-[#D4AF37] text-[#8C681E] shadow-amber-200/50'
                      : 'bg-white border-2 border-[#1A3D73] text-[#10264F] ring-2 ring-[#E5B842] shadow-lg'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <span className={`text-[8px] sm:text-[9px] font-black uppercase tracking-wider ${
                      qState.visualState === 'active' ? 'text-[#1A3D73]' : qState.visualState === 'mastered' ? 'text-[#8C681E]' : 'text-[#7A6B4F]'
                    }`}>
                      Quest {idx + 1}
                    </span>
                    {qState.visualState === 'locked' ? (
                      <Lock size={9} className="text-[#8C7A5C]" />
                    ) : (
                      <span className="text-[8px] sm:text-[9px] font-black text-[#D4AF37]">
                        ★ {qState.stars}/9
                      </span>
                    )}
                  </div>

                  <span className="text-[9px] sm:text-[10px] font-black truncate w-full leading-tight">
                    {qState.mod.title}
                  </span>

                  <span className={`text-[7.5px] sm:text-[8px] font-extrabold truncate w-full ${
                    qState.visualState === 'active'
                      ? 'text-[#1A3D73]'
                      : qState.visualState === 'mastered'
                      ? 'text-[#D4AF37]'
                      : 'text-[#8A724B]'
                  }`}>
                    {qState.visualState === 'locked'
                      ? '🔒 Locked'
                      : qState.visualState === 'mastered'
                      ? '🏆 Mastered'
                      : '▶ Tap to Play'}
                  </span>
                </div>
              </div>
            );
          })}

          {/* SUMMIT APEX: "X MARKS THE SPOT" / THE CROWN CITADEL CHEST */}
          <div
            style={{ left: apexPos.left, top: apexPos.top }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center cursor-pointer group select-none"
            onClick={() => {
              soundService.playTap();
              const lastMod = questStates[questStates.length - 1]?.mod;
              if (!allSealsEarned) {
                setLockedNotice({
                  questNumber: questStates.length + 1,
                  title: 'The Sultan’s Summit Vault (X Marks the Spot)',
                  prevTitle: lastMod ? lastMod.title : 'Prior Quest',
                  prevModuleId: lastMod ? lastMod.id : moduleDefs[0].id,
                });
              } else if (lastMod) {
                setSelectedModuleId(lastMod.id);
              }
            }}
          >
            {activeQuestIndex === questStates.length && (
              <div className="absolute -top-11 z-30 pointer-events-none animate-bounce-gentle flex flex-col items-center">
                <div className="px-2 py-0.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B8892B] text-white text-[9px] font-black shadow-md border-2 border-white">
                  Summit Master!
                </div>
                <div className="w-6 h-6 rounded-full bg-[#D4AF37] border-2 border-white shadow-lg flex items-center justify-center text-white text-[10px] font-black -mt-0.5">
                  👑
                </div>
              </div>
            )}

            <TreasureChestSvg
              state="apex"
              size={58}
              isCurrent={allSealsEarned}
            />

            <div
              className={`-mt-1 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-xl border-2 flex flex-col items-center shadow-md text-center w-[115px] sm:w-[135px] transition-all select-none ${
                allSealsEarned
                  ? 'bg-[#FDF5E2] border-2 border-[#D4AF37] text-[#8C681E] animate-pulse ring-2 ring-[#D4AF37]/50'
                  : 'bg-[#EAE0CA]/90 border-[#C7B591] text-[#7A6B4F]'
              }`}
            >
              <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-[#C0392B]">
                X Marks The Spot
              </span>
              <span className="text-[9px] sm:text-[10px] font-black truncate w-full leading-tight">
                {ageGroup === '7-11' ? 'Summit Star' : 'Mastery Vault'}
              </span>
              <span className="text-[7.5px] sm:text-[8px] font-bold text-[#8A6D3B] truncate w-full">
                {allSealsEarned ? '🏆 Mastered All!' : '🔒 Complete all quests'}
              </span>
            </div>
          </div>

          {/* Bottom-Center Map Legend Banner (Royal Blue & Golden Accent) */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 bg-[#FFFDF7]/95 px-3 sm:px-4 py-1 rounded-full border-2 border-[#D4AF37] shadow-md flex items-center gap-1.5 text-[9px] sm:text-[10px] font-black text-[#1A3D73] backdrop-blur-xs whitespace-nowrap pointer-events-none">
            <Compass size={12} className="text-[#D4AF37]" />
            <span>Tap open treasure chest to embark on trials & unlock next quest</span>
          </div>
        </div>
      </div>

      {/* 3. QUEST SCROLL MODAL (APPEARS WHEN PLAYER TAPS AN OPEN QUEST) */}
      {inspectingModule && (
        <QuestScrollModal
          moduleDef={inspectingModule}
          questIndex={inspectingIndex}
          moduleProgress={progress.modules[inspectingModule.id]}
          allRegionsUnlocked={progress.grownUps.allRegionsUnlocked}
          onClose={() => setSelectedModuleId(null)}
          onSelectStage={onSelectStage}
        />
      )}

      {/* 4. LOCKED TREASURE PARCHMENT NOTIFICATION (ROYAL BLUE & GOLD THEMED) */}
      {lockedNotice && (
        <div
          role="alertdialog"
          className="fixed inset-x-4 bottom-14 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:bottom-16 z-50 max-w-md w-full bg-[#FFFDF7] rounded-3xl border-3 border-[#1A3D73] p-4 shadow-2xl animate-fade-in flex items-center justify-between gap-3 select-none"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#EAF2FD] border-2 border-[#1A3D73] flex items-center justify-center text-[#1A3D73] shrink-0">
              <Lock size={22} />
            </div>
            <div>
              <h4 className="text-sm font-black text-[#10264F]">
                Treasure #{lockedNotice.questNumber} is Locked!
              </h4>
              <p className="text-xs text-[#5B6B7B] mt-0.5 leading-tight">
                Complete Core Trial of{' '}
                <span className="font-bold text-[#10264F]">{lockedNotice.prevTitle}</span> along the trail to unlock this quest.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                setSelectedModuleId(lockedNotice.prevModuleId);
                setLockedNotice(null);
              }}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#1A3D73] to-[#2556A3] border border-[#E5B842] text-white text-xs font-black flex items-center gap-1 hover:from-[#143265] hover:to-[#1C4382] transition-colors shadow-xs cursor-pointer"
            >
              <span>Play Prior</span>
              <ArrowRight size={13} className="text-[#FFF0A6]" />
            </button>
            <button
              type="button"
              onClick={() => setLockedNotice(null)}
              className="p-1 rounded-lg text-[#5B6B7B] hover:text-[#10264F] cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Animation Styles */}
      <style>{`
        @keyframes gentleHop {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-7px); }
        }
        .animate-bounce-gentle {
          animation: gentleHop 1.6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
