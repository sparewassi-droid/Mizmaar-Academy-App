import React, { useState, useEffect, useMemo } from 'react';
import {
  Swords,
  X,
  ArrowRight,
  Bot,
  MessageCircle,
  Clock,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import {
  DuelSession,
  Question,
  PresetReaction,
  DuelParticipant,
} from '../../../types';
import { MultiplayerService } from '../../../services/MultiplayerService';
import { ALL_QUESTIONS_MAP } from '../../../data/modules';
import { TopBar } from '../../common/TopBar';
import { TimerRing } from '../../common/TimerRing';
import { SpeakerButton } from '../../common/SpeakerButton';
import { Button } from '../../common/Button';
import { Chip } from '../../common/Chip';
import { soundService } from '../../../utils/audio';

import { Mcq } from '../QuestionScreen/QuestionTypes/Mcq';
import { TrueFalse } from '../QuestionScreen/QuestionTypes/TrueFalse';
import { MultiSelect } from '../QuestionScreen/QuestionTypes/MultiSelect';
import { Match } from '../QuestionScreen/QuestionTypes/Match';
import { Sort } from '../QuestionScreen/QuestionTypes/Sort';
import { Order } from '../QuestionScreen/QuestionTypes/Order';
import { Odd } from '../QuestionScreen/QuestionTypes/Odd';
import { TapTarget } from '../QuestionScreen/QuestionTypes/TapTarget';

interface DuelScreenProps {
  duelId: string;
  myUserId: string;
  multiplayerService: MultiplayerService;
  onComplete: (duel: DuelSession) => void;
  onExit: () => void;
}

const PRESET_REACTIONS: PresetReaction[] = [
  'Good luck',
  'Nice one',
  'Well played',
  'Rematch?',
];

export const DuelScreen: React.FC<DuelScreenProps> = ({
  duelId,
  myUserId,
  multiplayerService,
  onComplete,
  onExit,
}) => {
  const [duel, setDuel] = useState<DuelSession | null>(null);
  const [myQuestionIndex, setMyQuestionIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [lastCorrect, setLastCorrect] = useState(false);
  const [lastPoints, setLastPoints] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [recentOpponentReaction, setRecentOpponentReaction] = useState<string | null>(null);

  // Subscribe to duel updates
  useEffect(() => {
    const unsub = multiplayerService.subscribeDuel(duelId, (session) => {
      setDuel(session);

      // Check for opponent reaction
      const isChallenger = session.challenger.id === myUserId;
      const opponent = isChallenger ? session.opponent : session.challenger;
      if (opponent.reaction && Date.now() - opponent.reaction.timestamp < 4000) {
        setRecentOpponentReaction(opponent.reaction.text);
      }

      if (session.status === 'completed') {
        onComplete(session);
      }
    });
    return unsub;
  }, [duelId, myUserId, multiplayerService, onComplete]);

  // Determine current question
  const currentQ: Question | null = useMemo(() => {
    if (!duel || !duel.questionIds || myQuestionIndex >= duel.questionIds.length) return null;
    const qId = duel.questionIds[myQuestionIndex];
    const moduleQs = ALL_QUESTIONS_MAP[duel.moduleId] || ALL_QUESTIONS_MAP.a1_basic_tajweed;
    return moduleQs.find((q) => q.id === qId) || moduleQs[0];
  }, [duel, myQuestionIndex]);

  const handleTimeout = () => {
    if (revealed) return;
    soundService.playIncorrect();
    setLastCorrect(false);
    setLastPoints(0);
    setRevealed(true);

    multiplayerService.submitAnswer(
      duelId,
      myQuestionIndex,
      null,
      30000,
      false,
      0
    );
  };

  // Timer countdown
  useEffect(() => {
    if (revealed || !currentQ) return;
    setSecondsLeft(30);
    setQuestionStartTime(Date.now());

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [myQuestionIndex, revealed, currentQ]);

  const handleAnswerSubmit = (isCorrect: boolean, answerData: unknown) => {
    if (revealed) return;

    const elapsedMs = Math.max(500, Date.now() - questionStartTime);
    let points = 0;
    if (isCorrect) {
      soundService.playCorrect();
      // Speed bonus: up to 100 base + 50 speed
      const speedBonus = Math.max(0, Math.floor((30000 - elapsedMs) / 600));
      points = 100 + speedBonus;
    } else {
      soundService.playIncorrect();
      points = 0;
    }

    setLastCorrect(isCorrect);
    setLastPoints(points);
    setRevealed(true);

    multiplayerService.submitAnswer(
      duelId,
      myQuestionIndex,
      answerData,
      elapsedMs,
      isCorrect,
      points
    );
  };

  const handleNextQuestion = () => {
    soundService.playTap();
    setRevealed(false);
    if (!duel) return;

    if (myQuestionIndex + 1 < duel.questionIds.length) {
      setMyQuestionIndex((prev) => prev + 1);
    } else {
      // Completed all my questions! If opponent is done too, finish
      if (duel.status === 'completed') {
        onComplete(duel);
      }
    }
  };

  const handleSendReaction = (rx: PresetReaction) => {
    soundService.playTap();
    multiplayerService.sendReaction(duelId, rx);
  };

  if (!duel) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F2E8D5]">
        <div className="w-10 h-10 border-4 border-[#2A5CAA] border-t-transparent animate-spin rounded-full" />
      </div>
    );
  }

  const isChallenger = duel.challenger.id === myUserId;
  const me: DuelParticipant = isChallenger ? duel.challenger : duel.opponent;
  const opponent: DuelParticipant = isChallenger ? duel.opponent : duel.challenger;
  const totalQuestions = duel.questionIds.length;

  const myProgressPct = Math.min(100, (myQuestionIndex / totalQuestions) * 100);
  const oppProgressPct = Math.min(100, (opponent.currentQuestionIndex / totalQuestions) * 100);

  const isWaitingForOpponent = myQuestionIndex >= totalQuestions && duel.status !== 'completed';

  return (
    <div className="min-h-screen flex flex-col bg-[#F2E8D5] text-[#1B2A41]">
      {/* Top Bar with Live Race Status */}
      <TopBar
        leftAction={
          <button
            type="button"
            onClick={() => setShowExitConfirm(true)}
            aria-label="Exit Duel"
            className="w-10 h-10 rounded-xl bg-white border border-[#E4D6BA] flex items-center justify-center text-[#5B6B7B] hover:text-[#B94437] card-solid active:translate-y-[1px]"
          >
            <X size={20} />
          </button>
        }
        title={
          <div className="flex items-center gap-2">
            <Swords size={18} className="text-[#2A5CAA]" />
            <span className="font-bold text-xs uppercase tracking-wider">
              {duel.format === 'classic' ? 'Classic Duel' : 'Sprint Race'}
            </span>
          </div>
        }
        rightAction={
          !revealed && currentQ ? (
            <div className="w-10 h-10 flex items-center justify-center">
              <TimerRing
                secondsLeft={secondsLeft}
                totalSeconds={30}
                theme={duel.ageGroup}
                isWarning={secondsLeft <= 5}
              />
            </div>
          ) : (
            <div className="w-10" />
          )
        }
      />

      {/* Duel Live Race Bar */}
      <div className="bg-white border-b-2 border-[#E4D6BA] px-4 py-3 shadow-xs">
        <div className="max-w-[620px] mx-auto flex flex-col gap-2">
          {/* Player Me vs Opponent Stat Row */}
          <div className="flex items-center justify-between">
            {/* My Score */}
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#2A5CAA] text-white font-black text-xs flex items-center justify-center border border-[#1F4580]">
                {me.username.substring(0, 2).toUpperCase()}
              </span>
              <div>
                <div className="text-xs font-black text-[#1B2A41]">{me.username} (You)</div>
                <div className="text-[11px] font-bold text-[#2A5CAA]">{me.score} pts</div>
              </div>
            </div>

            {/* Q counter badge */}
            <Chip variant="neutral" className="text-[10px] font-bold">
              Q {Math.min(myQuestionIndex + 1, totalQuestions)} of {totalQuestions}
            </Chip>

            {/* Opponent Score */}
            <div className="flex items-center gap-2 text-right">
              <div>
                <div className="text-xs font-black text-[#1B2A41] flex items-center gap-1 justify-end">
                  {opponent.id.includes('bot') && <Bot size={12} className="text-[#B8892B]" />}
                  {opponent.username}
                </div>
                <div className="text-[11px] font-bold text-[#B8892B]">{opponent.score} pts</div>
              </div>
              <span className="w-7 h-7 rounded-lg bg-[#EBD9A8] text-[#7A5814] font-black text-xs flex items-center justify-center border border-[#B8892B]">
                {opponent.username.substring(0, 2).toUpperCase()}
              </span>
            </div>
          </div>

          {/* Dual Race Progress Track */}
          <div className="flex flex-col gap-1 pt-1">
            {/* My Track */}
            <div className="w-full bg-[#E4D6BA]/40 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#2A5CAA] h-full rounded-full transition-all duration-300"
                style={{ width: `${myProgressPct}%` }}
              />
            </div>
            {/* Opponent Track */}
            <div className="w-full bg-[#E4D6BA]/40 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#B8892B] h-full rounded-full transition-all duration-300"
                style={{ width: `${oppProgressPct}%` }}
              />
            </div>
          </div>

          {/* Opponent Live Speech Bubble if they reacted */}
          {recentOpponentReaction && (
            <div className="self-end bg-[#CFE6FA] text-[#1F4580] text-xs font-bold px-3 py-1 rounded-full border border-[#2A5CAA] animate-bounce">
              {opponent.username}: "{recentOpponentReaction}"
            </div>
          )}
        </div>
      </div>

      {/* Main Play Area */}
      <main className="flex-1 w-full max-w-[620px] mx-auto p-4 flex flex-col justify-between">
        {isWaitingForOpponent ? (
          <div className="my-auto p-8 rounded-3xl bg-white border-2 border-[#E4D6BA] text-center flex flex-col items-center gap-4 card-solid">
            <div className="w-16 h-16 rounded-2xl bg-[#CFE6FA] border-2 border-[#2A5CAA] flex items-center justify-center text-[#2A5CAA] animate-pulse">
              <Clock size={32} />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#1B2A41]">All Questions Finished!</h2>
              <p className="text-xs text-[#5B6B7B] mt-1">
                Waiting for {opponent.username} to complete their final recitation...
              </p>
            </div>
            <div className="text-sm font-bold text-[#2A5CAA]">Your Final Score: {me.score} pts</div>
          </div>
        ) : currentQ ? (
          <div className="flex flex-col gap-4">
            {/* Question Card Header */}
            <div className="p-4 rounded-2xl bg-white border-2 border-[#E4D6BA] card-solid flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Chip variant="lapis" className="text-[10px]">
                  {currentQ.tier.toUpperCase()}
                </Chip>
                {currentQ.arabicDisplay && (
                  <SpeakerButton text={currentQ.arabicDisplay} size="sm" />
                )}
              </div>

              <h2 className="text-base font-bold text-[#1B2A41] leading-snug">{currentQ.prompt}</h2>

              {currentQ.arabicDisplay && (
                <div
                  dir="rtl"
                  className="font-amiri text-2xl text-[#1B2A41] text-center my-2 p-3 bg-[#FAF5EA] rounded-xl border border-[#E4D6BA]"
                >
                  {currentQ.arabicDisplay}
                </div>
              )}
            </div>

            {/* Interactive Question Type Component */}
            <div className="flex flex-col gap-2">
              {currentQ.type === 'mcq' && (
                <Mcq
                  options={currentQ.options || []}
                  selectedId={null}
                  revealed={revealed}
                  onSelect={(opt) => handleAnswerSubmit(opt.isCorrect, opt)}
                  ageGroup={duel.ageGroup}
                  disabled={revealed}
                />
              )}
              {currentQ.type === 'truefalse' && (
                <TrueFalse
                  correctAnswer={!!currentQ.answer}
                  selectedAnswer={null}
                  revealed={revealed}
                  onSelect={(val) => handleAnswerSubmit(val === currentQ.answer, val)}
                  ageGroup={duel.ageGroup}
                  disabled={revealed}
                />
              )}
              {currentQ.type === 'multiselect' && (
                <MultiSelect
                  options={currentQ.options || []}
                  revealed={revealed}
                  onSubmit={(ids, correct) => handleAnswerSubmit(correct, ids)}
                  ageGroup={duel.ageGroup}
                  disabled={revealed}
                />
              )}
              {currentQ.type === 'match' && (
                <Match
                  pairs={currentQ.pairs || []}
                  revealed={revealed}
                  onSubmit={(pairs, correct) => handleAnswerSubmit(correct, pairs)}
                  ageGroup={duel.ageGroup}
                  disabled={revealed}
                />
              )}
              {currentQ.type === 'sort' && (
                <Sort
                  groups={currentQ.groups || []}
                  revealed={revealed}
                  onSubmit={(groups, correct) => handleAnswerSubmit(correct, groups)}
                  ageGroup={duel.ageGroup}
                  disabled={revealed}
                />
              )}
              {currentQ.type === 'order' && (
                <Order
                  correctOrder={currentQ.order || []}
                  revealed={revealed}
                  onSubmit={(order, correct) => handleAnswerSubmit(correct, order)}
                  ageGroup={duel.ageGroup}
                  disabled={revealed}
                />
              )}
              {currentQ.type === 'odd' && (
                <Odd
                  options={currentQ.options || []}
                  selectedId={null}
                  revealed={revealed}
                  onSelect={(opt) => handleAnswerSubmit(opt.isCorrect, opt)}
                  ageGroup={duel.ageGroup}
                  disabled={revealed}
                />
              )}
              {currentQ.type === 'tap' && (
                <TapTarget
                  tokens={currentQ.tokens || []}
                  answerTokenIds={currentQ.answerTokenIds || []}
                  arabicDisplay={currentQ.arabicDisplay}
                  revealed={revealed}
                  onSubmit={(id, correct) => handleAnswerSubmit(correct, id)}
                  ageGroup={duel.ageGroup}
                  disabled={revealed}
                />
              )}
            </div>
          </div>
        ) : null}

        {/* Feedback Bottom Sheet when answer is revealed */}
        {revealed && currentQ && (
          <div
            data-feedback-box="true"
            className={`mt-4 p-4 rounded-2xl border-2 flex flex-col gap-2 card-solid animate-in fade-in slide-in-from-bottom-2 feedback-review-card ${
              lastCorrect
                ? 'bg-[#EAF5EF] border-[#3A8D5F] text-[#1E5638] correct-feedback'
                : 'bg-[#FBEBE8] border-[#B94437] text-[#7A281E] wrong-feedback'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {lastCorrect ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                <span className="font-black text-sm feedback-title">
                  {lastCorrect ? `Correct! +${lastPoints} pts` : 'Incorrect'}
                </span>
              </div>
              <span className="text-[11px] font-bold opacity-80">{currentQ.factRef}</span>
            </div>

            <p className="text-xs leading-relaxed font-semibold feedback-explanation feedback-review-text text-[#10264F]">
              {currentQ.explanation}
            </p>

            <Button
              variant={lastCorrect ? 'primary' : 'outline'}
              size="md"
              onClick={handleNextQuestion}
              className="mt-1 w-full text-xs font-bold flex items-center justify-center gap-1.5"
            >
              Next Question
              <ArrowRight size={14} />
            </Button>
          </div>
        )}

        {/* Preset Reactions Quick Bar */}
        <div className="pt-4 flex items-center justify-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-bold text-[#5B6B7B] mr-1 flex items-center gap-1">
            <MessageCircle size={12} />
            Say:
          </span>
          {PRESET_REACTIONS.map((rx) => (
            <button
              key={rx}
              type="button"
              onClick={() => handleSendReaction(rx)}
              className="px-2.5 py-1 rounded-xl bg-white border border-[#E4D6BA] text-[11px] font-bold text-[#1B2A41] hover:border-[#2A5CAA] hover:bg-[#CFE6FA]/40 active:translate-y-[1px] transition-all card-solid"
            >
              {rx}
            </button>
          ))}
        </div>
      </main>

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 bg-[#1B2A41]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border-2 border-[#E4D6BA] flex flex-col gap-4 card-solid text-center">
            <h3 className="text-lg font-black text-[#1B2A41]">Forfeit Match?</h3>
            <p className="text-xs text-[#5B6B7B]">
              Leaving this duel now will award the victory to your opponent.
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="md"
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 text-xs"
              >
                Keep Playing
              </Button>
              <Button
                variant="danger"
                size="md"
                onClick={() => {
                  soundService.playTap();
                  multiplayerService.leaveDuel(duelId);
                  onExit();
                }}
                className="flex-1 text-xs"
              >
                Forfeit & Exit
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
