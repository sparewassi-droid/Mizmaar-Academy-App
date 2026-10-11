import React, { useState } from 'react';
import {
  Shield,
  X,
  Unlock,
  CheckCircle2,
  Clock,
  Sparkles,
  Volume2,
  VolumeX,
  BookOpen,
  RotateCcw,
  BarChart2,
  Sliders,
  AlertTriangle,
} from 'lucide-react';
import { ProgressState, AgeGroup, GrownUpsSettings } from '../../../types';
import { THEME_A_MODULES, THEME_B_MODULES } from '../../../data/modules';
import { Button } from '../../common/Button';
import { Chip } from '../../common/Chip';
import { Card } from '../../common/Card';
import { soundService } from '../../../utils/audio';

interface GrownUpsModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: ProgressState;
  onUpdateSettings: (settings: Partial<GrownUpsSettings>) => void;
  onResetProgress: () => void;
}

export const GrownUpsModal: React.FC<GrownUpsModalProps> = ({
  isOpen,
  onClose,
  progress,
  onUpdateSettings,
  onResetProgress,
}) => {
  // Tabs: 'settings' | 'analytics' | 'curriculum'
  const [activeTab, setActiveTab] = useState<'settings' | 'analytics' | 'curriculum'>('settings');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [soundMuted, setSoundMuted] = useState(false);

  if (!isOpen) return null;

  const handleToggleOnline = () => {
    soundService.playTap();
    onUpdateSettings({ onlinePlayEnabled: !progress.grownUps.onlinePlayEnabled });
  };

  const handleSetTimerMode = (mode: 'normal' | 'extra' | 'none') => {
    soundService.playTap();
    onUpdateSettings({ timerMode: mode });
  };

  const handleToggleUnlockAll = () => {
    soundService.playTap();
    onUpdateSettings({ allRegionsUnlocked: !progress.grownUps.allRegionsUnlocked });
  };

  const allModules = [...THEME_A_MODULES, ...THEME_B_MODULES];

  return (
    <div className="fixed inset-0 z-50 bg-[#1B2A41]/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#FAF5EA] rounded-3xl w-full max-w-[640px] border-2 border-[#E4D6BA] card-solid my-auto flex flex-col max-h-[90vh] overflow-hidden text-[#1B2A41]">
        {/* Header */}
        <div className="p-4 bg-white border-b-2 border-[#E4D6BA] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#CFE6FA] border border-[#2A5CAA] flex items-center justify-center text-[#2A5CAA]">
              <Shield size={20} />
            </div>
            <div>
              <h2 className="text-base font-black text-[#1B2A41]">Grown-ups Corner</h2>
              <p className="text-[11px] text-[#5B6B7B]">
                Parent & Educator controls for Mizmaar Dawood Academy Tajweed Quest
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              soundService.playTap();
              onClose();
            }}
            className="w-9 h-9 rounded-xl bg-white border border-[#E4D6BA] flex items-center justify-center text-[#5B6B7B] hover:text-[#1B2A41] card-solid"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="flex flex-col gap-5">
              {/* Tab Selector */}
              <div className="flex p-1 bg-white rounded-2xl border-2 border-[#E4D6BA]">
                <button
                  type="button"
                  onClick={() => {
                    soundService.playTap();
                    setActiveTab('settings');
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === 'settings'
                      ? 'bg-[#2A5CAA] text-white card-solid'
                      : 'text-[#5B6B7B] hover:text-[#1B2A41]'
                  }`}
                >
                  <Sliders size={14} />
                  Settings
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundService.playTap();
                    setActiveTab('analytics');
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === 'analytics'
                      ? 'bg-[#2A5CAA] text-white card-solid'
                      : 'text-[#5B6B7B] hover:text-[#1B2A41]'
                  }`}
                >
                  <BarChart2 size={14} />
                  Analytics
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundService.playTap();
                    setActiveTab('curriculum');
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === 'curriculum'
                      ? 'bg-[#2A5CAA] text-white card-solid'
                      : 'text-[#5B6B7B] hover:text-[#1B2A41]'
                  }`}
                >
                  <BookOpen size={14} />
                  Standards
                </button>
              </div>

              {/* TAB 1: SETTINGS */}
              {activeTab === 'settings' && (
                <div className="flex flex-col gap-4">
                  {/* Online Play Safety Toggle */}
                  <div className="p-4 rounded-2xl bg-white border-2 border-[#E4D6BA] card-solid flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield size={18} className="text-[#2A5CAA]" />
                        <h4 className="text-sm font-bold text-[#1B2A41]">Online Study Partner Duels</h4>
                      </div>
                      <button
                        type="button"
                        onClick={handleToggleOnline}
                        className={`w-12 h-7 rounded-full p-1 transition-colors ${
                          progress.grownUps.onlinePlayEnabled ? 'bg-[#3A8D5F]' : 'bg-[#E4D6BA]'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white transition-transform ${
                            progress.grownUps.onlinePlayEnabled ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                    <p className="text-xs text-[#5B6B7B] leading-relaxed">
                      When enabled, students can add classmates by username to duel live over the network.
                      All text communication is strictly constrained to safe pre-approved encouragement phrases.
                      Offline Practice Bots are always accessible even when disabled.
                    </p>
                  </div>

                  {/* Timer Mode Setting */}
                  <div className="p-4 rounded-2xl bg-white border-2 border-[#E4D6BA] card-solid flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <Clock size={18} className="text-[#2A5CAA]" />
                      <h4 className="text-sm font-bold text-[#1B2A41]">Stage Timer Pacing</h4>
                    </div>
                    <p className="text-xs text-[#5B6B7B]">
                      Adapt countdown timers for special learning requirements or anxiety-free practice:
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'normal' as const, label: 'Standard', desc: 'Default game pace' },
                        { id: 'extra' as const, label: 'Relaxed', desc: 'Double duration' },
                        { id: 'none' as const, label: 'Untimed', desc: 'No timer pressure' },
                      ].map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => handleSetTimerMode(t.id)}
                          className={`p-2.5 rounded-xl text-center border-2 transition-all ${
                            progress.grownUps.timerMode === t.id
                              ? 'border-[#2A5CAA] bg-[#CFE6FA]/40 font-bold'
                              : 'border-[#E4D6BA] bg-white text-[#5B6B7B]'
                          }`}
                        >
                          <div className="text-xs font-bold text-[#1B2A41]">{t.label}</div>
                          <div className="text-[10px] text-[#5B6B7B]">{t.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Unlock All Regions Override */}
                  <div className="p-4 rounded-2xl bg-white border-2 border-[#E4D6BA] card-solid flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Unlock size={18} className="text-[#B8892B]" />
                        <h4 className="text-sm font-bold text-[#1B2A41]">Unlock All Map Regions</h4>
                      </div>
                      <p className="text-xs text-[#5B6B7B] mt-0.5">
                        Permit open access to inspect or practice all 11 modules without completing previous stages.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleToggleUnlockAll}
                      className={`w-12 h-7 rounded-full p-1 shrink-0 transition-colors ${
                        progress.grownUps.allRegionsUnlocked ? 'bg-[#B8892B]' : 'bg-[#E4D6BA]'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white transition-transform ${
                          progress.grownUps.allRegionsUnlocked ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Audio Controls */}
                  <div className="p-4 rounded-2xl bg-white border-2 border-[#E4D6BA] card-solid flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Volume2 size={18} className="text-[#2A5CAA]" />
                      <div>
                        <h4 className="text-sm font-bold text-[#1B2A41]">Audio Sound Effects</h4>
                        <p className="text-xs text-[#5B6B7B]">Auditory feedback and cues</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const next = !soundMuted;
                        setSoundMuted(next);
                        soundService.setMuted(next);
                      }}
                      className="text-xs flex items-center gap-1.5"
                    >
                      {soundMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                      {soundMuted ? 'Muted' : 'Enabled'}
                    </Button>
                  </div>

                  {/* Reset Student Data */}
                  <div className="p-4 rounded-2xl bg-[#FBEBE8] border-2 border-[#B94437] flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[#7A281E]">
                        <AlertTriangle size={18} />
                        <h4 className="text-sm font-bold">Reset Student Progress</h4>
                      </div>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => setShowResetConfirm(true)}
                        className="text-xs font-bold"
                      >
                        Reset Data
                      </Button>
                    </div>
                    <p className="text-xs text-[#7A281E]/80">
                      Clears stars, badges, and progress back to beginning for a fresh student attempt.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 2: ANALYTICS */}
              {activeTab === 'analytics' && (
                <div className="flex flex-col gap-4">
                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-3 rounded-2xl bg-white border-2 border-[#E4D6BA] text-center">
                      <span className="text-[10px] font-bold text-[#5B6B7B] uppercase">Total XP</span>
                      <div className="text-xl font-black text-[#B8892B]">{progress.xp}</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-white border-2 border-[#E4D6BA] text-center">
                      <span className="text-[10px] font-bold text-[#5B6B7B] uppercase">Stars</span>
                      <div className="text-xl font-black text-[#2A5CAA]">{progress.totalStars}</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-white border-2 border-[#E4D6BA] text-center">
                      <span className="text-[10px] font-bold text-[#5B6B7B] uppercase">Level</span>
                      <div className="text-xl font-black text-[#1B2A41]">{progress.level}</div>
                    </div>
                  </div>

                  {/* Module Status List */}
                  <div className="p-4 rounded-2xl bg-white border-2 border-[#E4D6BA] card-solid flex flex-col gap-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#5B6B7B]">
                      Curriculum Stage Completion
                    </h4>

                    <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
                      {allModules.map((mod) => {
                        const p = progress.modules[mod.id];
                        const passedStages = p
                          ? (p.stages.easy.passed ? 1 : 0) +
                            (p.stages.moderate.passed ? 1 : 0) +
                            (p.stages.difficult.passed ? 1 : 0)
                          : 0;

                        return (
                          <div
                            key={mod.id}
                            className="p-2.5 rounded-xl bg-[#FAF5EA] border border-[#E4D6BA] flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[#2A5CAA] w-6 uppercase">
                                {mod.code}
                              </span>
                              <span className="font-bold text-[#1B2A41]">{mod.title}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-[#5B6B7B] font-mono font-bold">
                                {passedStages}/3 cleared
                              </span>
                              {passedStages === 3 ? (
                                <CheckCircle2 size={16} className="text-[#3A8D5F]" />
                              ) : (
                                <div className="w-4 h-4 rounded-full border border-[#E4D6BA]" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: CURRICULUM STANDARDS */}
              {activeTab === 'curriculum' && (
                <div className="flex flex-col gap-3">
                  <p className="text-xs text-[#5B6B7B]">
                    Mizmaar Dawood Academy Tajweed Standards Reference: verified rules covered in each quest region.
                  </p>

                  <div className="flex flex-col gap-2 max-h-80 overflow-y-auto pr-1">
                    {allModules.map((m) => (
                      <div
                        key={m.id}
                        className="p-3 rounded-2xl bg-white border-2 border-[#E4D6BA] card-solid flex flex-col gap-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-[#2A5CAA]">
                            {m.code.toUpperCase()} &bull; {m.title}
                          </span>
                          <span className="text-[10px] text-[#5B6B7B] font-mono">
                            40 Qs &bull; {m.ageGroup}
                          </span>
                        </div>
                        <p className="text-xs text-[#5B6B7B]">{m.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
        </div>
      </div>

      {/* Reset Confirmation Overlay */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-60 bg-[#1B2A41]/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border-2 border-[#B94437] flex flex-col gap-4 text-center card-solid">
            <h3 className="text-lg font-black text-[#1B2A41]">Reset All Student Records?</h3>
            <p className="text-xs text-[#5B6B7B]">
              This will wipe all earned stars, XP, cleared stages, and friends. This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="md"
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 text-xs"
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="md"
                onClick={() => {
                  soundService.playTap();
                  onResetProgress();
                  setShowResetConfirm(false);
                  onClose();
                }}
                className="flex-1 text-xs"
              >
                Confirm Reset
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
