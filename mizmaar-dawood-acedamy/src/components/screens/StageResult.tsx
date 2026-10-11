import React, { useState, useEffect } from 'react';
import { Star, RotateCcw, Map, ArrowRight, Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Question, AgeGroup, Tier } from '../../types';
import { Button } from '../common/Button';
import { Chip } from '../common/Chip';
import { Particles } from '../common/Particles';
import { calculateStars } from '../../utils/scoring';
import { soundService } from '../../utils/audio';

interface StageResultProps {
  ageGroup: AgeGroup;
  moduleId: string;
  tier: Tier;
  correct: number;
  total: number;
  points: number;
  avgTimeSeconds: number;
  answers: { question: Question; isCorrect: boolean; points: number }[];
  onRetry: () => void;
  onNextStage?: () => void;
  onBackToMap: () => void;
}

export const StageResult: React.FC<StageResultProps> = ({
  ageGroup,
  moduleId,
  tier,
  correct,
  total,
  points,
  avgTimeSeconds,
  answers,
  onRetry,
  onNextStage,
  onBackToMap,
}) => {
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
  const stars = calculateStars(accuracy);
  const passed = stars > 0;
  const xpGained = Math.floor(points / 10);

  const [displayPoints, setDisplayPoints] = useState(0);
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    if (passed) {
      soundService.playLevelUp();
    } else {
      soundService.playIncorrect();
    }

    // Score count-up
    const duration = 1200;
    const steps = 24;
    const stepTime = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const fraction = currentStep / steps;
      setDisplayPoints(Math.round(points * fraction));
      if (currentStep >= steps) {
        clearInterval(timer);
        setDisplayPoints(points);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [points, passed]);

  return (
    <div className="min-h-screen bg-[#F2E8D5] text-[#1B2A41] p-4 flex flex-col items-center justify-between">
      {passed && <Particles count={stars === 3 ? 40 : 25} />}

      <div className="w-full max-w-[560px] mx-auto flex flex-col items-center gap-6 my-auto py-6">
        {/* Result Heading */}
        <div className="text-center">
          <Chip variant={passed ? 'reward' : 'neutral'} className="mb-2">
            {passed ? (stars === 3 ? 'Mastered!' : 'Stage Complete!') : 'Keep Practicing'}
          </Chip>
          <h1 className="text-3xl sm:text-4xl font-black text-[#10264F]">
            {passed
              ? ageGroup === '7-11'
                ? 'Great Achievement!'
                : 'Stage Accomplished'
              : 'Try Again'}
          </h1>
        </div>

        {/* 3 Stars presentation */}
        <div className="flex items-center gap-3">
          {[1, 2, 3].map((starIndex) => {
            const isEarned = starIndex <= stars;
            return (
              <div
                key={starIndex}
                className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 transition-all ${
                  isEarned
                    ? 'bg-[#FDF5E2] border-2 border-[#D4AF37] shadow-md scale-105'
                    : 'bg-white border-2 border-[#E5C568]/40 opacity-40'
                }`}
              >
                <Star
                  size={32}
                  strokeWidth={2}
                  className={isEarned ? 'text-[#D4AF37] fill-[#D4AF37]' : 'text-[#8C98A4]'}
                />
              </div>
            );
          })}
        </div>

        {/* Stats Grid */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white border-2 border-[#E5C568] rounded-2xl p-4 flex flex-col items-center shadow-xs">
            <span className="text-xs font-bold text-[#8C681E]">Score</span>
            <span className="text-2xl font-black text-[#1A3D73] font-mono tabular-nums">
              {displayPoints}
            </span>
          </div>

          <div className="bg-white border-2 border-[#E5C568] rounded-2xl p-4 flex flex-col items-center shadow-xs">
            <span className="text-xs font-bold text-[#8C681E]">Accuracy</span>
            <span className="text-2xl font-black text-[#10264F] font-mono tabular-nums">
              {accuracy}%
            </span>
          </div>

          <div className="bg-white border-2 border-[#E5C568] rounded-2xl p-4 flex flex-col items-center shadow-xs">
            <span className="text-xs font-bold text-[#8C681E]">Avg Speed</span>
            <span className="text-2xl font-black text-[#10264F] font-mono tabular-nums">
              {avgTimeSeconds}s
            </span>
          </div>

          <div className="bg-white border-2 border-[#E5C568] rounded-2xl p-4 flex flex-col items-center shadow-xs">
            <span className="text-xs font-bold text-[#8C681E]">XP Gained</span>
            <span className="text-2xl font-black text-[#B8892B] font-mono tabular-nums">
              +{xpGained}
            </span>
          </div>
        </div>

        {/* Review Answers Toggle */}
        <div className="w-full">
          <button
            type="button"
            onClick={() => setShowReview(!showReview)}
            className="w-full py-3 px-4 bg-white border-2 border-[#E5C568] hover:border-[#1A3D73] rounded-2xl flex items-center justify-between text-sm font-bold text-[#10264F] active:translate-y-[1px] transition-colors"
          >
            <span>Review Answers ({answers.length})</span>
            {showReview ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          {showReview && (
            <div className="flex flex-col gap-3 mt-3 max-h-[320px] overflow-y-auto p-1">
              {answers.map((record, index) => {
                return (
                  <div
                    key={index}
                    className={`p-4 rounded-2xl border-2 card-solid ${
                      record.isCorrect
                        ? 'bg-white border-[#2E9E5B]'
                        : ageGroup === '7-11'
                        ? 'bg-[#FBE6C8] border-[#E89B3C]'
                        : 'bg-[#F0D5C9] border-[#B5664A]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="text-xs font-bold text-[#5B6B7B]">Question {index + 1}</span>
                      {record.isCorrect ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-[#2E9E5B]">
                          <Check size={14} />
                          <span>Correct</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-[#B5664A]">
                          <X size={14} />
                          <span>Needs review</span>
                        </span>
                      )}
                    </div>

                    <div className="text-sm font-bold text-[#1B2A41] mb-2 leading-snug">
                      {record.question.prompt}
                    </div>

                    <p className="text-xs font-semibold text-[#10264F] bg-white/90 p-2.5 rounded-xl border border-black/5 leading-relaxed feedback-explanation feedback-review-text">
                      {record.question.explanation}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col sm:flex-row items-center gap-3 pt-2">
          {passed && onNextStage && (
            <Button
              variant="primary"
              fullWidth
              size="lg"
              onClick={onNextStage}
              className="order-1"
            >
              <span>Next Stage</span>
              <ArrowRight size={20} className="ml-2" />
            </Button>
          )}

          <Button
            variant={passed ? 'secondary' : 'primary'}
            fullWidth
            size={passed ? 'md' : 'lg'}
            onClick={onRetry}
            className="order-2"
          >
            <RotateCcw size={18} className="mr-2" />
            <span>Try Again</span>
          </Button>

          <Button
            variant="ghost"
            fullWidth
            size="md"
            onClick={onBackToMap}
            className="order-3"
          >
            <Map size={18} className="mr-2" />
            <span>Back to Quest Map</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
