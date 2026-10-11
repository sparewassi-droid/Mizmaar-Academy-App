import React from 'react';
import { ModuleDefinition, ModuleProgress, Tier } from '../../../types';
import { getNodeState } from '../../../utils/unlockRules';
import { Star, Lock, Check } from 'lucide-react';

interface MapListViewProps {
  moduleDefs: ModuleDefinition[];
  modulesProgress: Record<string, ModuleProgress>;
  allRegionsUnlocked: boolean;
  onSelectNode: (module: ModuleDefinition, tier: Tier) => void;
}

export const MapListView: React.FC<MapListViewProps> = ({
  moduleDefs,
  modulesProgress,
  allRegionsUnlocked,
  onSelectNode,
}) => {
  const tiers: { key: Tier; label: string; num: number }[] = [
    { key: 'easy', label: 'Tier 1 - Easy', num: 1 },
    { key: 'moderate', label: 'Tier 2 - Moderate', num: 2 },
    { key: 'difficult', label: 'Tier 3 - Difficult', num: 3 },
  ];

  return (
    <div className="w-full max-w-[560px] mx-auto p-4 flex flex-col gap-6">
      <div className="text-sm text-[#5B6B7B] font-medium">
        Accessible List View of all Quest Regions and Stages:
      </div>

      {moduleDefs.map((mod, modIdx) => {
        const prog = modulesProgress[mod.id];
        const isRegionOpen =
          allRegionsUnlocked ||
          modIdx === 0 ||
          !!modulesProgress[moduleDefs[modIdx - 1]?.id]?.stages.moderate.passed;

        return (
          <div
            key={mod.id}
            className={`bg-white border-2 rounded-2xl p-5 card-solid ${
              isRegionOpen ? 'border-[#E4D6BA]' : 'border-[#E4D6BA]/60 opacity-70'
            }`}
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E4D6BA]">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#5B6B7B]">
                  {mod.regionName}
                </span>
                <h3 className="text-lg font-bold text-[#1B2A41]">{mod.title}</h3>
              </div>
              {prog?.sealEarned && (
                <span className="text-xs font-bold text-[#B8892B] bg-[#EBD9A8] px-2.5 py-1 rounded-full border border-[#B8892B]">
                  Region Mastered
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2.5">
              {tiers.map((t) => {
                const nodeState = getNodeState(prog, t.key, isRegionOpen, allRegionsUnlocked);
                const stageData = prog?.stages[t.key];
                const stars = stageData?.stars || 0;
                const isLocked = nodeState === 'locked';

                const label = `${mod.regionName}, ${mod.title}, ${t.label}, status: ${nodeState}, stars earned: ${stars} of 3`;

                return (
                  <button
                    key={t.key}
                    type="button"
                    disabled={isLocked}
                    onClick={() => onSelectNode(mod, t.key)}
                    aria-label={label}
                    className={`w-full p-3.5 rounded-xl border-2 flex items-center justify-between text-left transition-all ${
                      isLocked
                        ? 'bg-[#FAF5EA] border-[#E4D6BA] text-[#5B6B7B] cursor-not-allowed opacity-60'
                        : 'bg-white border-[#2A5CAA] hover:bg-[#CFE6FA]/30 cursor-pointer card-solid active:translate-y-[1px]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          isLocked
                            ? 'bg-[#E4D6BA] text-[#5B6B7B]'
                            : nodeState === 'passed' || nodeState === 'mastered'
                            ? 'bg-[#2A5CAA] text-white'
                            : 'bg-[#CFE6FA] text-[#2A5CAA]'
                        }`}
                      >
                        {isLocked ? (
                          <Lock size={14} />
                        ) : nodeState === 'passed' || nodeState === 'mastered' ? (
                          <Check size={16} strokeWidth={2.5} />
                        ) : (
                          t.num
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#1B2A41]">{t.label}</div>
                        <div className="text-xs text-[#5B6B7B]">
                          Best Score: {stageData?.bestScore || 0} pts
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {[1, 2, 3].map((starIdx) => (
                        <Star
                          key={starIdx}
                          size={16}
                          className={
                            starIdx <= stars
                              ? 'text-[#B8892B] fill-[#B8892B]'
                              : 'text-[#E4D6BA]'
                          }
                        />
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
