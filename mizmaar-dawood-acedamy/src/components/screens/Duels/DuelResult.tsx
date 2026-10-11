import React, { useEffect } from 'react';
import {
  Trophy,
  Swords,
  RotateCcw,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  Bot,
  Award,
} from 'lucide-react';
import { DuelSession } from '../../../types';
import { TopBar } from '../../common/TopBar';
import { Card } from '../../common/Card';
import { Button } from '../../common/Button';
import { Chip } from '../../common/Chip';
import { Particles } from '../../common/Particles';
import { soundService } from '../../../utils/audio';

interface DuelResultProps {
  duel: DuelSession;
  myUserId: string;
  onRematch: () => void;
  onBackToLobby: () => void;
}

export const DuelResult: React.FC<DuelResultProps> = ({
  duel,
  myUserId,
  onRematch,
  onBackToLobby,
}) => {
  const isChallenger = duel.challenger.id === myUserId;
  const me = isChallenger ? duel.challenger : duel.opponent;
  const opponent = isChallenger ? duel.opponent : duel.challenger;

  const isTie = me.score === opponent.score;
  const isWinner = me.score > opponent.score;

  useEffect(() => {
    if (isWinner) {
      soundService.playVictory();
    } else {
      soundService.playStagePass();
    }
  }, [isWinner]);

  const totalQuestions = duel.questionIds.length;
  const myAvgSeconds =
    totalQuestions > 0 ? (me.totalAnswerTimeMs / totalQuestions / 1000).toFixed(1) : '0';
  const oppAvgSeconds =
    totalQuestions > 0 ? (opponent.totalAnswerTimeMs / totalQuestions / 1000).toFixed(1) : '0';

  return (
    <div className="min-h-screen flex flex-col bg-[#F2E8D5] text-[#1B2A41] relative overflow-hidden">
      {/* Victory Particles */}
      <Particles trigger={isWinner} count={40} />

      <TopBar
        title={
          <div className="flex items-center gap-2">
            <Swords size={18} className="text-[#2A5CAA]" />
            <span className="font-bold text-sm">Duel Results</span>
          </div>
        }
      />

      <main className="flex-1 w-full max-w-[580px] mx-auto p-4 flex flex-col justify-center gap-5 my-auto">
        {/* Banner Hero */}
        <div className="text-center flex flex-col items-center gap-2">
          <div
            className={`w-20 h-20 rounded-3xl border-2 flex items-center justify-center card-solid ${
              isWinner
                ? 'bg-[#EBD9A8] border-[#B8892B] text-[#7A5814]'
                : isTie
                ? 'bg-[#CFE6FA] border-[#2A5CAA] text-[#2A5CAA]'
                : 'bg-white border-[#E4D6BA] text-[#5B6B7B]'
            }`}
          >
            {isWinner ? <Trophy size={42} /> : <Award size={42} />}
          </div>

          <h1 className="text-2xl font-black text-[#1B2A41]">
            {isWinner ? 'MashaAllah! Victory!' : isTie ? 'Well Matched! A Tie!' : 'Good Effort! Well Played!'}
          </h1>
          <p className="text-xs text-[#5B6B7B] max-w-sm">
            {isWinner
              ? `You outperformed ${opponent.username} in speed and accuracy on the trail!`
              : isTie
              ? 'Both reciters achieved the exact same score. A true scholarly match!'
              : `A noble round with ${opponent.username}. Practice brings mastery!`}
          </p>
        </div>

        {/* Head to Head Comparison Scorecard */}
        <div className="grid grid-cols-2 gap-3">
          {/* Me */}
          <Card
            theme={duel.ageGroup}
            className={`p-4 flex flex-col items-center text-center gap-2 border-2 ${
              isWinner ? 'border-[#3A8D5F] bg-[#FAF5EA]' : 'border-[#E4D6BA] bg-white'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-[#2A5CAA] text-white font-black text-sm flex items-center justify-center border border-[#1F4580]">
              {me.username.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#5B6B7B] uppercase">You</span>
              <h3 className="font-black text-sm text-[#1B2A41]">{me.username}</h3>
            </div>
            <div className="text-2xl font-black text-[#2A5CAA]">{me.score}</div>
            <span className="text-[10px] text-[#5B6B7B] font-bold">TOTAL POINTS</span>
          </Card>

          {/* Opponent */}
          <Card
            theme={duel.ageGroup}
            className={`p-4 flex flex-col items-center text-center gap-2 border-2 ${
              !isWinner && !isTie ? 'border-[#3A8D5F] bg-[#FAF5EA]' : 'border-[#E4D6BA] bg-white'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-[#EBD9A8] text-[#7A5814] font-black text-sm flex items-center justify-center border border-[#B8892B]">
              {opponent.id.includes('bot') ? (
                <Bot size={22} />
              ) : (
                opponent.username.substring(0, 2).toUpperCase()
              )}
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#5B6B7B] uppercase">Partner</span>
              <h3 className="font-black text-sm text-[#1B2A41]">{opponent.username}</h3>
            </div>
            <div className="text-2xl font-black text-[#B8892B]">{opponent.score}</div>
            <span className="text-[10px] text-[#5B6B7B] font-bold">TOTAL POINTS</span>
          </Card>
        </div>

        {/* Detailed Stats Breakdown */}
        <div className="p-4 rounded-2xl bg-white border-2 border-[#E4D6BA] card-solid flex flex-col gap-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#5B6B7B] border-b border-[#E4D6BA] pb-2">
            Round Breakdown
          </h3>

          {/* Accuracy */}
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#1B2A41] flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-[#3A8D5F]" />
              Correct Answers
            </span>
            <div className="flex items-center gap-4 font-mono font-bold">
              <span className="text-[#2A5CAA]">{me.correctCount} / {totalQuestions}</span>
              <span className="text-[#5B6B7B]">vs</span>
              <span className="text-[#B8892B]">{opponent.correctCount} / {totalQuestions}</span>
            </div>
          </div>

          {/* Avg Response Speed */}
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#1B2A41] flex items-center gap-1.5">
              <Clock size={14} className="text-[#2A5CAA]" />
              Average Answer Speed
            </span>
            <div className="flex items-center gap-4 font-mono font-bold">
              <span className="text-[#2A5CAA]">{myAvgSeconds}s</span>
              <span className="text-[#5B6B7B]">vs</span>
              <span className="text-[#B8892B]">{oppAvgSeconds}s</span>
            </div>
          </div>

          {/* XP Gained */}
          <div className="flex items-center justify-between text-xs bg-[#FAF5EA] p-2.5 rounded-xl border border-[#E4D6BA]">
            <span className="font-bold text-[#1B2A41] flex items-center gap-1.5">
              <Sparkles size={14} className="text-[#B8892B]" />
              Quest XP Rewarded
            </span>
            <span className="font-black text-[#B8892B]">
              +{isWinner ? '35' : '15'} XP
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col gap-2 pt-2">
          <Button
            variant="primary"
            size="lg"
            onClick={() => {
              soundService.playTap();
              onRematch();
            }}
            className="w-full flex items-center justify-center gap-2 text-base font-bold"
          >
            <RotateCcw size={18} />
            Rematch Same Topic
          </Button>

          <Button
            variant="outline"
            size="md"
            onClick={() => {
              soundService.playTap();
              onBackToLobby();
            }}
            className="w-full text-xs font-bold"
          >
            Return to Study Partners
          </Button>
        </div>
      </main>
    </div>
  );
};
