import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { X, Zap, Clock, Volume2, ArrowRight } from 'lucide-react';
import { Question, AgeGroup, Tier, QuestionOption } from '../../../types';
import { TopBar } from '../../common/TopBar';
import { TimerRing } from '../../common/TimerRing';
import { SpeakerButton } from '../../common/SpeakerButton';
import { Chip } from '../../common/Chip';
import { Button } from '../../common/Button';
import { useTimer } from '../../../hooks/useTimer';
import { calculatePoints } from '../../../utils/scoring';
import { soundService } from '../../../utils/audio';
import { EXPLORER_THEME } from '../../../theme/explorer';
import { SCHOLAR_THEME } from '../../../theme/scholar';

import { Mcq } from './QuestionTypes/Mcq';
import { TrueFalse } from './QuestionTypes/TrueFalse';
import { MultiSelect } from './QuestionTypes/MultiSelect';
import { Match } from './QuestionTypes/Match';
import { Sort } from './QuestionTypes/Sort';
import { Order } from './QuestionTypes/Order';
import { Odd } from './QuestionTypes/Odd';
import { TapTarget } from './QuestionTypes/TapTarget';

interface QuestionShellProps {
  questions: Question[];
  ageGroup: AgeGroup;
  tier: Tier;
  timerMode: 'normal' | 'extra' | 'none';
  onComplete: (summary: {
    correct: number;
    total: number;
    points: number;
    avgTimeSeconds: number;
    answers: { question: Question; isCorrect: boolean; points: number }[];
  }) => void;
  onExit: () => void;
}

export const QuestionShell: React.FC<QuestionShellProps> = ({
  questions,
  ageGroup,
  tier,
  timerMode,
  onComplete,
  onExit,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [answersRecord, setAnswersRecord] = useState<
    { question: Question; isCorrect: boolean; points: number; answerTimeMs: number }[]
  >([]);

  const [revealed, setRevealed] = useState(false);
  const [lastCorrect, setLastCorrect] = useState(false);
  const [lastPointsEarned, setLastPointsEarned] = useState(0);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Power-up states
  const [removedOptionIds, setRemovedOptionIds] = useState<string[]>([]);
  const [removeTwoUsed, setRemoveTwoUsed] = useState(false);

  // Time tracking for average answer time
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  const currentQ = questions[currentIndex];
  const themeObj = ageGroup === '7-11' ? EXPLORER_THEME : SCHOLAR_THEME;

  // Base timer calculation
  const baseSeconds = useMemo(() => {
    let s = themeObj.baseSeconds[tier];
    // Add 15 seconds for interactive question types
    if (['match', 'sort', 'order', 'multiselect', 'tap'].includes(currentQ?.type || '')) {
      s += 15;
    }
    return s;
  }, [themeObj, tier, currentQ]);

  // Handle timeout
  const handleTimeout = useCallback(() => {
    if (revealed) return;
    soundService.playIncorrect();
    setLastCorrect(false);
    setLastPointsEarned(0);
    setStreak(0);
    setRevealed(true);

    const elapsed = Date.now() - questionStartTime;
    setAnswersRecord((prev) => [
      ...prev,
      { question: currentQ, isCorrect: false, points: 0, answerTimeMs: elapsed },
    ]);
  }, [revealed, currentQ, questionStartTime]);

  const {
    secondsLeft,
    totalSeconds,
    isWarning,
    resetTimer,
    addExtraTime,
    canUsePowerUp: canUseExtraTime,
  } = useTimer({
    initialSeconds: baseSeconds,
    timerMode,
    onTimeout: handleTimeout,
    isPaused: revealed || showExitConfirm,
  });

  // Handle answer submission
  const handleAnswerSubmit = useCallback(
    (isCorrect: boolean) => {
      if (revealed) return;

      const elapsed = Date.now() - questionStartTime;
      const { points } = calculatePoints(
        tier,
        isCorrect,
        secondsLeft,
        totalSeconds,
        isCorrect ? streak + 1 : 0
      );

      if (isCorrect) {
        soundService.playCorrect();
        setStreak((prev) => prev + 1);
        setCorrectCount((prev) => prev + 1);
        setScore((prev) => prev + points);
        setLastCorrect(true);
        setLastPointsEarned(points);
      } else {
        soundService.playIncorrect();
        setStreak(0);
        setLastCorrect(false);
        setLastPointsEarned(0);
      }

      setRevealed(true);
      setAnswersRecord((prev) => [
        ...prev,
        { question: currentQ, isCorrect, points, answerTimeMs: elapsed },
      ]);
    },
    [revealed, questionStartTime, tier, secondsLeft, totalSeconds, streak, currentQ]
  );

  // Advance to next question
  const advanceNext = useCallback(() => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setRevealed(false);
      setRemovedOptionIds([]);
      setQuestionStartTime(Date.now());
      resetTimer(baseSeconds);
    } else {
      // Completed all questions in stage
      const totalAnswers = answersRecord.length;
      const avgTime =
        totalAnswers > 0
          ? Math.round(
              answersRecord.reduce((acc, a) => acc + a.answerTimeMs, 0) / (totalAnswers * 1000)
            )
          : 0;

      onComplete({
        correct: correctCount,
        total: questions.length,
        points: score,
        avgTimeSeconds: avgTime,
        answers: answersRecord,
      });
    }
  }, [
    currentIndex,
    questions.length,
    resetTimer,
    baseSeconds,
    answersRecord,
    correctCount,
    score,
    onComplete,
  ]);

  // Auto advance after 2.5 seconds (or skippable with button tap)
  useEffect(() => {
    if (!revealed) return;
    const timer = setTimeout(() => {
      advanceNext();
    }, 2800);
    return () => clearTimeout(timer);
  }, [revealed, advanceNext]);

  // Power-up: Remove two
  const handleRemoveTwo = () => {
    if (removeTwoUsed || revealed) return;
    if (currentQ.type === 'mcq' && currentQ.options) {
      const incorrectIds = currentQ.options.filter((o) => !o.isCorrect).map((o) => o.id);
      const toRemove = incorrectIds.slice(0, 2);
      setRemovedOptionIds(toRemove);
      setRemoveTwoUsed(true);
      soundService.playTap();
    } else if (currentQ.type === 'odd' && currentQ.options) {
      const incorrectIds = currentQ.options.filter((o) => !o.isCorrect).map((o) => o.id);
      const toRemove = incorrectIds.slice(0, 2);
      setRemovedOptionIds(toRemove);
      setRemoveTwoUsed(true);
      soundService.playTap();
    }
  };

  const filteredOptions = useMemo(() => {
    if (!currentQ.options) return [];
    if (removedOptionIds.length === 0) return currentQ.options;
    return currentQ.options.filter((o) => !removedOptionIds.includes(o.id));
  }, [currentQ.options, removedOptionIds]);

  const tierBanner = themeObj.tierBanners[tier];

  return (
    <div className="h-full w-full flex flex-col bg-[#F2E8D5] text-[#1B2A41] overflow-hidden">
      {/* Top Bar */}
      <TopBar
        leftAction={
          <button
            type="button"
            onClick={() => setShowExitConfirm(true)}
            aria-label="Exit Stage"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white border border-[#E4D6BA] flex items-center justify-center text-[#1B2A41] card-solid active:translate-y-[1px]"
          >
            <X size={18} strokeWidth={2} />
          </button>
        }
        title={
          <div className="flex flex-col items-center w-full max-w-[260px]">
            {/* Segmented progress bar */}
            <div className="flex items-center gap-1 w-full h-1.5 sm:h-2 rounded-full overflow-hidden bg-[#E4D6BA]">
              {questions.map((_, idx) => {
                const isPassed = idx < currentIndex;
                const isCurrent = idx === currentIndex;
                return (
                  <div
                    key={idx}
                    className={`h-full flex-1 transition-all ${
                      isPassed ? 'bg-[#1A3D73]' : isCurrent ? 'bg-[#D4AF37]' : 'bg-[#E5C568]/40'
                    }`}
                  />
                );
              })}
            </div>
            <div className="text-[10px] sm:text-[11px] font-black text-[#1A3D73] mt-0.5 sm:mt-1">
              Question {currentIndex + 1} of {questions.length}
            </div>
          </div>
        }
        rightAction={
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-black text-[#1A3D73] font-mono tabular-nums bg-[#FDF5E2] px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-xl border-2 border-[#E5C568] shadow-2xs">
              {score}
            </span>
          </div>
        }
      />

      {/* Main Content Area - constrained to fit viewport without vertical clipping */}
      <main className="flex-1 w-full max-w-[560px] mx-auto px-3 py-1.5 sm:px-4 sm:py-2.5 flex flex-col justify-between overflow-hidden min-h-0">
        {/* Header HUD: Timer, Tier badge, Streak */}
        <div className="flex items-center justify-between mb-1 sm:mb-2 shrink-0">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Chip variant="neutral">{tierBanner}</Chip>
            {streak >= 2 && (
              <Chip variant="reward" icon={<Zap size={13} className="text-[#D4AF37]" />}>
                Streak x{streak}
              </Chip>
            )}
          </div>

          <TimerRing
            secondsLeft={secondsLeft}
            totalSeconds={totalSeconds}
            theme={ageGroup}
            isWarning={isWarning}
          />
        </div>

        {/* Question Area - expands to fit answer options without overflowing */}
        <div className="flex-1 flex flex-col justify-center min-h-0 my-0.5">
          {/* Prompt header with speaker */}
          <div className="mb-1.5 sm:mb-2 shrink-0 flex items-start justify-between gap-2">
            <h2 className="text-base sm:text-lg font-black text-[#10264F] leading-snug flex-1 question-prompt">
              {currentQ.prompt}
            </h2>
            <SpeakerButton text={currentQ.prompt} lang="en-US" size="sm" className="shrink-0 mt-0.5" />
          </div>

          {/* Large Arabic text if present */}
          {currentQ.arabicDisplay && !['tap'].includes(currentQ.type) && (
            <div className="my-1 sm:my-2 p-2 sm:p-2.5 bg-white border-2 border-[#E5C568] rounded-xl flex items-center justify-center gap-3 shadow-2xs shrink-0">
              <span
                lang="ar"
                dir="rtl"
                className="font-arabic text-2xl sm:text-3xl font-bold text-[#10264F] leading-snug text-center"
              >
                {currentQ.arabicDisplay}
              </span>
              <SpeakerButton text={currentQ.arabicDisplay} size="sm" />
            </div>
          )}

          {/* Interactive Answer Area */}
          <div className="w-full flex-1 flex flex-col justify-center min-h-0">
            {currentQ.type === 'mcq' && (
              <Mcq
                options={filteredOptions}
                selectedId={null}
                revealed={revealed}
                onSelect={(opt) => handleAnswerSubmit(opt.isCorrect)}
                ageGroup={ageGroup}
                disabled={revealed}
              />
            )}

            {currentQ.type === 'truefalse' && (
              <TrueFalse
                correctAnswer={!!currentQ.answer}
                selectedAnswer={null}
                revealed={revealed}
                onSelect={(val) => handleAnswerSubmit(val === currentQ.answer)}
                ageGroup={ageGroup}
                disabled={revealed}
              />
            )}

            {currentQ.type === 'multiselect' && (
              <MultiSelect
                options={currentQ.options || []}
                revealed={revealed}
                onSubmit={(_ids, isCorrect) => handleAnswerSubmit(isCorrect)}
                ageGroup={ageGroup}
                disabled={revealed}
              />
            )}

            {currentQ.type === 'match' && (
              <Match
                pairs={currentQ.pairs || []}
                revealed={revealed}
                onSubmit={(_pairs, isCorrect) => handleAnswerSubmit(isCorrect)}
                ageGroup={ageGroup}
                disabled={revealed}
              />
            )}

            {currentQ.type === 'sort' && (
              <Sort
                groups={currentQ.groups || []}
                revealed={revealed}
                onSubmit={(_placements, isCorrect) => handleAnswerSubmit(isCorrect)}
                ageGroup={ageGroup}
                disabled={revealed}
              />
            )}

            {currentQ.type === 'order' && (
              <Order
                correctOrder={currentQ.order || []}
                revealed={revealed}
                onSubmit={(_order, isCorrect) => handleAnswerSubmit(isCorrect)}
                ageGroup={ageGroup}
                disabled={revealed}
              />
            )}

            {currentQ.type === 'odd' && (
              <Odd
                options={filteredOptions}
                selectedId={null}
                revealed={revealed}
                onSelect={(opt) => handleAnswerSubmit(opt.isCorrect)}
                ageGroup={ageGroup}
                disabled={revealed}
              />
            )}

            {currentQ.type === 'tap' && (
              <TapTarget
                tokens={currentQ.tokens || []}
                answerTokenIds={currentQ.answerTokenIds || []}
                arabicDisplay={currentQ.arabicDisplay}
                revealed={revealed}
                onSubmit={(_id, isCorrect) => handleAnswerSubmit(isCorrect)}
                ageGroup={ageGroup}
                disabled={revealed}
              />
            )}
          </div>
        </div>

        {/* Feedback & Explanation Card (revealed upon answer or timeout) */}
        {revealed && (
          <div
            data-feedback-box="true"
            className={`my-1.5 p-2.5 sm:p-3 rounded-xl border-2 transition-all card-solid shrink-0 feedback-review-card ${
              lastCorrect
                ? 'bg-[#D6EFDF] border-[#2E9E5B] text-[#1B2A41] correct-feedback'
                : ageGroup === '7-11'
                ? 'bg-[#FDF5E2] border-[#E5C568] text-[#8C681E] wrong-feedback'
                : 'bg-[#F0D5C9] border-[#B5664A] text-[#1B2A41] wrong-feedback'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-xs sm:text-sm feedback-title">
                {lastCorrect ? themeObj.copy.correct : themeObj.copy.almost}
                {lastCorrect && lastPointsEarned > 0 && ` (+${lastPointsEarned} pts)`}
              </span>
              <button
                type="button"
                onClick={advanceNext}
                className="text-xs font-bold bg-white px-2.5 py-1 rounded-lg border-2 border-[#E5C568] hover:border-[#1A3D73] flex items-center gap-1 active:translate-y-[1px] text-[#10264F] cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight size={13} className="text-[#1A3D73]" />
              </button>
            </div>
            <p className="text-xs sm:text-sm font-semibold leading-normal feedback-explanation feedback-review-text text-[#10264F]">
              {currentQ.explanation}
            </p>
          </div>
        )}

        {/* Power-ups Bar (Solo mode only, disabled during reveal) */}
        {!revealed && (
          <div className="flex items-center justify-between gap-3 pt-2 pb-0.5 border-t border-[#E5C568]/60 shrink-0">
            <div className="text-xs font-black text-[#1A3D73]">Power-ups:</div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={!canUseExtraTime}
                onClick={() => addExtraTime(10)}
                aria-label="Extra time powerup"
                title="Add 10 seconds (once per stage)"
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border-2 border-[#E5C568] text-xs font-bold text-[#10264F] hover:border-[#1A3D73] disabled:opacity-30 shadow-xs active:translate-y-[1px] cursor-pointer"
              >
                <Clock size={15} className="text-[#1A3D73]" />
                <span>+10s</span>
              </button>

              {['mcq', 'odd'].includes(currentQ.type) && (
                <button
                  type="button"
                  disabled={removeTwoUsed}
                  onClick={handleRemoveTwo}
                  aria-label="Remove two powerup"
                  title="Remove two wrong choices (once per stage)"
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border-2 border-[#E5C568] text-xs font-bold text-[#10264F] hover:border-[#D4AF37] disabled:opacity-30 shadow-xs active:translate-y-[1px] cursor-pointer"
                >
                  <Zap size={15} className="text-[#D4AF37]" />
                  <span>50/50</span>
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Exit Confirmation Dialog */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#10264F]/50 backdrop-blur-2xs">
          <div className="w-full max-w-[420px] bg-white rounded-3xl p-6 border-3 border-[#E5C568] shadow-2xl flex flex-col gap-4">
            <h3 className="text-lg font-black text-[#10264F]">Leave Stage?</h3>
            <p className="text-sm text-[#5B6B7B]">
              If you leave now, your current progress on this attempt will not be saved. You can try
              again whenever you like.
            </p>
            <div className="flex items-center gap-3 mt-2">
              <Button
                variant="secondary"
                fullWidth
                onClick={() => setShowExitConfirm(false)}
              >
                Keep Playing
              </Button>
              <Button
                variant="primary"
                fullWidth
                onClick={() => {
                  setShowExitConfirm(false);
                  onExit();
                }}
              >
                Leave
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
