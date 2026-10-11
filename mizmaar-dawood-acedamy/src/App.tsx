import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  AgeGroup,
  Tier,
  FriendUser,
  DuelSession,
  DuelFormat,
  Question,
} from './types';
import { useProgress } from './hooks/useProgress';
import { LocalDemoService } from './services/LocalDemoService';
import { MODULE_DEFINITIONS, ALL_QUESTIONS_MAP, THEME_A_MODULES, THEME_B_MODULES } from './data/modules';
import { soundService } from './utils/audio';

// Navigation & Common
import { BottomNav, MainTab } from './components/common/BottomNav';

// Screens
import { DashboardHome } from './components/screens/DashboardHome';
import { QuestMap } from './components/screens/QuestMap/QuestMap';
import { StageSheet } from './components/screens/StageSheet';
import { GetReady } from './components/screens/GetReady';
import { QuestionShell } from './components/screens/QuestionScreen/QuestionShell';
import { StageResult } from './components/screens/StageResult';
import { FriendList } from './components/screens/Duels/FriendList';
import { ChallengeSetup } from './components/screens/Duels/ChallengeSetup';
import { DuelLobby } from './components/screens/Duels/DuelLobby';
import { DuelScreen } from './components/screens/Duels/DuelScreen';
import { DuelResult } from './components/screens/Duels/DuelResult';
import { GrownUpsModal } from './components/screens/GrownUps/GrownUpsModal';
import { DailyVerseModal } from './components/screens/DailyVerseModal';

type AppMode =
  | 'tab-view'
  | 'stage-get-ready'
  | 'stage-play'
  | 'stage-result'
  | 'duel-setup'
  | 'duel-lobby'
  | 'duel-play'
  | 'duel-result';

export default function App() {
  // Multiplayer service singleton
  const multiplayerService = useMemo(() => new LocalDemoService(), []);

  // Bottom Navigation Tab ('home' | 'map' | 'duels' | 'grownups')
  const [activeTab, setActiveTab] = useState<MainTab>('home');

  // Overall App Mode
  const [appMode, setAppMode] = useState<AppMode>('tab-view');

  // Stage execution state
  const [activeModuleId, setActiveModuleId] = useState<string>('a1_basic_tajweed');
  const [activeTier, setActiveTier] = useState<Tier>('easy');
  const [isStageSheetOpen, setIsStageSheetOpen] = useState(false);
  const [stageResultData, setStageResultData] = useState<{
    correct: number;
    total: number;
    points: number;
    avgTimeSeconds: number;
    answers: { question: Question; isCorrect: boolean; points: number }[];
  } | null>(null);

  // Duels state
  const [selectedFriend, setSelectedFriend] = useState<FriendUser | null>(null);
  const [activeDuelId, setActiveDuelId] = useState<string | null>(null);
  const [activeDuelSession, setActiveDuelSession] = useState<DuelSession | null>(null);

  // Modal states
  const [isGrownUpsOpen, setIsGrownUpsOpen] = useState(false);
  const [isVerseModalOpen, setIsVerseModalOpen] = useState(false);

  // App color theme state: 'dark-emerald' (Dark Green background, Beige boxes, Blue icons) vs 'default'
  const [theme, setTheme] = useState<'default' | 'dark-emerald'>(() => {
    try {
      const saved = localStorage.getItem('app_theme_mode');
      if (saved === 'default') return 'default';
      return 'dark-emerald';
    } catch {
      return 'dark-emerald';
    }
  });

  const toggleTheme = useCallback(() => {
    soundService.playTap();
    setTheme((prev) => {
      const next = prev === 'default' ? 'dark-emerald' : 'default';
      try {
        localStorage.setItem('app_theme_mode', next);
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  useEffect(() => {
    if (theme === 'dark-emerald') {
      document.documentElement.classList.add('theme-dark-emerald');
      document.body.classList.add('theme-dark-emerald');
    } else {
      document.documentElement.classList.remove('theme-dark-emerald');
      document.body.classList.remove('theme-dark-emerald');
    }
  }, [theme]);

  // Progress hook
  const {
    progress,
    setAgeGroup,
    setUsername,
    completeStage,
    resetProgress,
    updateGrownUps,
  } = useProgress('7-11');

  // Sync multiplayer service sign-in
  useEffect(() => {
    multiplayerService.signIn({
      id: progress.userId,
      username: progress.username,
    });
  }, [multiplayerService, progress.userId, progress.username]);

  // Handle age group switch
  const handleChangeAgeGroup = useCallback(
    (age: AgeGroup) => {
      setAgeGroup(age);
      if (age === '7-11') {
        setActiveModuleId('a1_basic_tajweed');
      } else {
        setActiveModuleId('b1_advanced_tajweed');
      }
    },
    [setAgeGroup]
  );

  // Stage selection from Map node
  const handleSelectStageNode = useCallback((moduleId: string, tier: Tier) => {
    soundService.playTap();
    setActiveModuleId(moduleId);
    setActiveTier(tier);
    setIsStageSheetOpen(true);
  }, []);

  // Start selected stage from StageSheet drawer
  const handleStartStage = useCallback(() => {
    soundService.playTap();
    setIsStageSheetOpen(false);
    setAppMode('stage-get-ready');
  }, []);

  // Questions for the active stage
  const currentStageQuestions = useMemo(() => {
    const all = ALL_QUESTIONS_MAP[activeModuleId] || ALL_QUESTIONS_MAP.a1_basic_tajweed;
    return all.filter((q) => q.tier === activeTier);
  }, [activeModuleId, activeTier]);

  // Stage completion handler
  const handleStageComplete = useCallback(
    (summary: {
      correct: number;
      total: number;
      points: number;
      avgTimeSeconds: number;
      answers: { question: Question; isCorrect: boolean; points: number }[];
    }) => {
      setStageResultData(summary);

      const accuracy = summary.total > 0 ? Math.round((summary.correct / summary.total) * 100) : 0;
      let stars = 0;
      if (accuracy >= 90) stars = 3;
      else if (accuracy >= 75) stars = 2;
      else if (accuracy >= 60) stars = 1;

      const xpGained = Math.floor(summary.points / 10);

      completeStage({
        ageGroup: progress.ageGroup,
        moduleId: activeModuleId,
        tier: activeTier,
        stars,
        correct: summary.correct,
        total: summary.total,
        points: summary.points,
        accuracy,
        avgTimeSeconds: summary.avgTimeSeconds,
        xpGained,
      });

      setAppMode('stage-result');
    },
    [activeModuleId, activeTier, completeStage, progress.ageGroup]
  );

  // Active module definition
  const activeModuleDef = MODULE_DEFINITIONS[activeModuleId] || MODULE_DEFINITIONS.a1_basic_tajweed;

  // Unlocked modules count for badge
  const currentModulesList = progress.ageGroup === '7-11' ? THEME_A_MODULES : THEME_B_MODULES;
  const unlockedCount = currentModulesList.filter(
    (m, idx) =>
      progress.grownUps.allRegionsUnlocked ||
      idx === 0 ||
      progress.modules[currentModulesList[idx - 1]?.id]?.stages.moderate.passed
  ).length;

  return (
    <div className="h-screen w-screen max-h-screen max-w-full overflow-hidden flex flex-col bg-[#F2E8D5] text-[#1B2A41] select-none font-sans antialiased">
      {/* ----------------- PRIMARY TAB VIEWS ----------------- */}
      {appMode === 'tab-view' && (
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Main Content Area based on Active Bottom Tab */}
          <div className="flex-1 overflow-hidden relative">
            {/* TAB 1: Display Home Page */}
            {activeTab === 'home' && (
              <DashboardHome
                progress={progress}
                theme={theme}
                onToggleTheme={toggleTheme}
                onOpenMap={() => setActiveTab('map')}
                onOpenDuels={() => setActiveTab('duels')}
                onOpenGrownUps={() => setIsGrownUpsOpen(true)}
                onChangeAgeGroup={handleChangeAgeGroup}
                onUpdateUsername={setUsername}
              />
            )}

            {/* TAB 2: Pretty Quest Map with Module Progression */}
            {activeTab === 'map' && (
              <QuestMap
                progress={progress}
                ageGroup={progress.ageGroup}
                onSelectStage={handleSelectStageNode}
                onBackToMode={() => setActiveTab('home')}
                onChangeAgeGroup={handleChangeAgeGroup}
              />
            )}

            {/* TAB 3: Duels / Study Partners */}
            {activeTab === 'duels' && (
              <FriendList
                progress={progress}
                ageGroup={progress.ageGroup}
                multiplayerService={multiplayerService}
                onBack={() => setActiveTab('home')}
                onOpenGrownUps={() => setIsGrownUpsOpen(true)}
                onStartChallenge={(friend) => {
                  setSelectedFriend(friend);
                  setAppMode('duel-setup');
                }}
              />
            )}

            {/* TAB 4: Grown-ups Tab Shortcut */}
            {activeTab === 'grownups' && (
              <DashboardHome
                progress={progress}
                onOpenMap={() => setActiveTab('map')}
                onOpenDuels={() => setActiveTab('duels')}
                onOpenGrownUps={() => setIsGrownUpsOpen(true)}
                onChangeAgeGroup={handleChangeAgeGroup}
                onUpdateUsername={setUsername}
              />
            )}
          </div>

          {/* Persistent Bottom Navigation Bar */}
          <BottomNav
            currentTab={activeTab}
            unlockedModuleCount={unlockedCount}
            isVerseOpen={isVerseModalOpen}
            onOpenVerse={() => setIsVerseModalOpen(true)}
            onSelectTab={(tab) => {
              if (tab === 'grownups') {
                setIsGrownUpsOpen(true);
              } else if (tab === 'verse') {
                setIsVerseModalOpen(true);
              } else {
                setActiveTab(tab);
              }
            }}
          />

          {/* Stage Detail Drawer (when clicked on a Map Node) */}
          <StageSheet
            isOpen={isStageSheetOpen}
            onClose={() => setIsStageSheetOpen(false)}
            moduleDef={activeModuleDef}
            tier={activeTier}
            stageProgress={progress.modules[activeModuleId]?.stages[activeTier]}
            onStart={handleStartStage}
          />
        </div>
      )}

      {/* ----------------- IMMERSIVE STAGE PLAY VIEWS ----------------- */}
      {/* Get Ready Countdown */}
      {appMode === 'stage-get-ready' && (
        <GetReady
          accentColor={activeModuleDef.accentBg}
          regionName={activeModuleDef.regionName}
          tierTitle={`${activeModuleDef.title} (${activeTier.toUpperCase()})`}
          onFinish={() => setAppMode('stage-play')}
        />
      )}

      {/* Solo Question Answering Shell */}
      {appMode === 'stage-play' && (
        <div className="h-full flex flex-col overflow-hidden">
          <QuestionShell
            questions={currentStageQuestions}
            ageGroup={progress.ageGroup}
            tier={activeTier}
            timerMode={progress.grownUps.timerMode}
            onComplete={handleStageComplete}
            onExit={() => {
              soundService.playTap();
              setAppMode('tab-view');
              setActiveTab('map');
            }}
          />
        </div>
      )}

      {/* Stage Result Celebration */}
      {appMode === 'stage-result' && stageResultData && (
        <div className="h-full flex flex-col overflow-hidden">
          <StageResult
            ageGroup={progress.ageGroup}
            moduleId={activeModuleId}
            tier={activeTier}
            correct={stageResultData.correct}
            total={stageResultData.total}
            points={stageResultData.points}
            avgTimeSeconds={stageResultData.avgTimeSeconds}
            answers={stageResultData.answers}
            onRetry={() => {
              soundService.playTap();
              setAppMode('stage-get-ready');
            }}
            onNextStage={() => {
              soundService.playTap();
              if (activeTier === 'easy') {
                setActiveTier('moderate');
                setAppMode('stage-get-ready');
              } else if (activeTier === 'moderate') {
                setActiveTier('difficult');
                setAppMode('stage-get-ready');
              } else {
                setAppMode('tab-view');
                setActiveTab('map');
              }
            }}
            onBackToMap={() => {
              soundService.playTap();
              setAppMode('tab-view');
              setActiveTab('map');
            }}
          />
        </div>
      )}

      {/* ----------------- IMMERSIVE DUELS VIEWS ----------------- */}
      {/* Challenge Setup */}
      {appMode === 'duel-setup' && selectedFriend && (
        <div className="h-full flex flex-col overflow-hidden">
          <ChallengeSetup
            opponent={selectedFriend}
            ageGroup={progress.ageGroup}
            progress={progress}
            onBack={() => setAppMode('tab-view')}
            onCreateDuel={async (params) => {
              const duelId = await multiplayerService.createDuel(params);
              setActiveDuelId(duelId);
              setAppMode('duel-lobby');
            }}
          />
        </div>
      )}

      {/* Duel Lobby */}
      {appMode === 'duel-lobby' && activeDuelId && (
        <div className="h-full flex flex-col overflow-hidden">
          <DuelLobby
            duelId={activeDuelId}
            myUserId={progress.userId}
            multiplayerService={multiplayerService}
            onStartGame={(session) => {
              setActiveDuelSession(session);
              setAppMode('duel-play');
            }}
            onLeave={() => {
              setActiveDuelId(null);
              setAppMode('tab-view');
            }}
          />
        </div>
      )}

      {/* Live Duel Screen */}
      {appMode === 'duel-play' && activeDuelId && (
        <div className="h-full flex flex-col overflow-hidden">
          <DuelScreen
            duelId={activeDuelId}
            myUserId={progress.userId}
            multiplayerService={multiplayerService}
            onComplete={(session) => {
              setActiveDuelSession(session);
              setAppMode('duel-result');
            }}
            onExit={() => {
              setActiveDuelId(null);
              setAppMode('tab-view');
            }}
          />
        </div>
      )}

      {/* Duel Result */}
      {appMode === 'duel-result' && activeDuelSession && (
        <div className="h-full flex flex-col overflow-hidden">
          <DuelResult
            duel={activeDuelSession}
            myUserId={progress.userId}
            onRematch={async () => {
              const partner =
                activeDuelSession.challenger.id === progress.userId
                  ? activeDuelSession.opponent
                  : activeDuelSession.challenger;

              const newDuelId = await multiplayerService.createDuel({
                friendId: partner.id,
                moduleId: activeDuelSession.moduleId,
                ageGroup: activeDuelSession.ageGroup,
                format: activeDuelSession.format,
                seed: `seed_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
              });
              setActiveDuelId(newDuelId);
              setAppMode('duel-lobby');
            }}
            onBackToLobby={() => {
              setActiveDuelId(null);
              setActiveDuelSession(null);
              setAppMode('tab-view');
              setActiveTab('duels');
            }}
          />
        </div>
      )}

      {/* Grown-ups Corner Modal (Global Overlay) */}
      <GrownUpsModal
        isOpen={isGrownUpsOpen}
        onClose={() => setIsGrownUpsOpen(false)}
        progress={progress}
        onUpdateSettings={updateGrownUps}
        onResetProgress={resetProgress}
      />

      {/* Daily Quran Verse Modal with revolving verses and translation */}
      <DailyVerseModal
        isOpen={isVerseModalOpen}
        onClose={() => setIsVerseModalOpen(false)}
        theme={theme}
      />
    </div>
  );
}
