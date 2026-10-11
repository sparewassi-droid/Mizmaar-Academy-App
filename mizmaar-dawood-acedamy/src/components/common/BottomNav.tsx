import React from 'react';
import { Home, Map as MapIcon, Swords, Shield, BookOpen } from 'lucide-react';
import { soundService } from '../../utils/audio';

export type MainTab = 'home' | 'map' | 'duels' | 'grownups' | 'verse';

interface BottomNavProps {
  currentTab: MainTab;
  onSelectTab: (tab: MainTab) => void;
  unlockedModuleCount?: number;
  onOpenVerse?: () => void;
  isVerseOpen?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  unlockedModuleCount = 1,
  onOpenVerse,
  isVerseOpen = false,
}) => {
  const tabs = [
    {
      id: 'home' as MainTab,
      label: 'Home',
      icon: Home,
    },
    {
      id: 'map' as MainTab,
      label: 'Quest Map',
      icon: MapIcon,
      badge: `${unlockedModuleCount} Open`,
    },
    {
      id: 'verse' as MainTab,
      label: 'Daily Verse',
      icon: BookOpen,
    },
    {
      id: 'duels' as MainTab,
      label: 'Duels',
      icon: Swords,
    },
    {
      id: 'grownups' as MainTab,
      label: 'Grown-ups',
      icon: Shield,
    },
  ];

  return (
    <nav
      aria-label="Bottom Navigation"
      className="shrink-0 w-full bg-[#FAF5EA] border-t-2 border-[#D4AF37] px-2 sm:px-3 py-1.5 sm:py-2 z-40 select-none shadow-sm"
    >
      <div className="max-w-[560px] mx-auto flex items-center justify-around gap-1 sm:gap-1.5">
        {tabs.map((tab) => {
          const isActive = tab.id === 'verse' ? isVerseOpen : !isVerseOpen && currentTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                soundService.playTap();
                if (tab.id === 'verse') {
                  if (onOpenVerse) {
                    onOpenVerse();
                  } else {
                    onSelectTab('verse');
                  }
                } else {
                  onSelectTab(tab.id);
                }
              }}
              className={`relative flex-1 py-1 sm:py-1.5 px-1 sm:px-2 rounded-2xl flex flex-col items-center justify-center gap-0.5 sm:gap-1 transition-all active:translate-y-[1px] cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-b from-[#1A3D7C] to-[#10264F] text-[#FFF0A6] border-2 border-[#E5B842] shadow-md font-bold'
                  : 'text-[#1A3D7C]/80 hover:text-[#1A3D7C] hover:bg-[#F3E7CC]/70 border-2 border-transparent'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <Icon
                  size={19}
                  strokeWidth={isActive ? 2.5 : 2}
                  className={isActive ? 'text-[#F5C542]' : 'text-[#1A3D7C]'}
                />
                {tab.badge && !isActive && (
                  <span className="absolute -top-1.5 -right-3 text-[9px] font-black bg-gradient-to-r from-[#D4AF37] to-[#B8892B] text-white px-1.5 py-0.2 rounded-full border border-[#FFF0A6] shadow-2xs">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] sm:text-[11px] leading-tight text-center truncate max-w-full ${isActive ? 'font-black text-[#FFF0A6]' : 'font-bold'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
