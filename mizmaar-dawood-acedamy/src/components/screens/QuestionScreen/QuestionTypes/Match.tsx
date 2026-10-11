import React, { useState, useMemo } from 'react';
import { MatchPair, AgeGroup } from '../../../../types';
import { Button } from '../../../common/Button';
import { Check, X } from 'lucide-react';
import { seededShuffle } from '../../../../utils/seededShuffle';

interface MatchProps {
  pairs: MatchPair[];
  revealed: boolean;
  onSubmit: (userPairs: { left: string; right: string }[], isCorrect: boolean) => void;
  ageGroup: AgeGroup;
  disabled?: boolean;
}

export const Match: React.FC<MatchProps> = ({
  pairs,
  revealed,
  onSubmit,
  ageGroup,
  disabled = false,
}) => {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Record<string, string>>({});

  // Shuffle right column deterministically so it is not listed in trivial 1:1 order
  const shuffledRight = useMemo(() => {
    return seededShuffle(
      pairs.map((p) => p.right),
      pairs.map((p) => p.left).join('')
    );
  }, [pairs]);

  const handleSelectLeft = (left: string) => {
    if (revealed || disabled) return;
    setSelectedLeft(left);
  };

  const handleSelectRight = (right: string) => {
    if (revealed || disabled || !selectedLeft) return;

    // Check if right is already matched to another left
    const newMatched = { ...matchedPairs };
    Object.keys(newMatched).forEach((k) => {
      if (newMatched[k] === right) delete newMatched[k];
    });

    newMatched[selectedLeft] = right;
    setMatchedPairs(newMatched);
    setSelectedLeft(null);
  };

  const handleResetPair = (left: string) => {
    if (revealed || disabled) return;
    const copy = { ...matchedPairs };
    delete copy[left];
    setMatchedPairs(copy);
  };

  const allMatched = Object.keys(matchedPairs).length === pairs.length;

  const handleConfirm = () => {
    const isCorrect = pairs.every((p) => matchedPairs[p.left] === p.right);
    const userPairArray = Object.entries(matchedPairs).map(([left, right]) => ({
      left,
      right,
    }));
    onSubmit(userPairArray, isCorrect);
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="text-[11px] sm:text-xs font-bold text-[#1A3D73] uppercase tracking-wider">
        Tap an item on the left, then tap its match on the right:
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-2.5 w-full">
        {/* Left Column */}
        <div className="flex flex-col gap-1.5 sm:gap-2">
          {pairs.map((pair) => {
            const isSelected = selectedLeft === pair.left;
            const pairedRight = matchedPairs[pair.left];
            const isPairCorrect = pairedRight === pair.right;

            let borderClass = 'border-2 border-[#E5C568] hover:border-[#1A3D73]';
            let bgClass = 'bg-white';

            if (revealed) {
              if (isPairCorrect) {
                bgClass = 'bg-[#D6EFDF]';
                borderClass = 'border-2 border-[#2E9E5B]';
              } else {
                bgClass = ageGroup === '7-11' ? 'bg-[#FDF5E2]' : 'bg-[#F0D5C9]';
                borderClass = ageGroup === '7-11' ? 'border-2 border-[#E5C568]' : 'border-2 border-[#B5664A]';
              }
            } else if (isSelected) {
              bgClass = 'bg-[#EAF2FD]';
              borderClass = 'border-2 border-[#1A3D73] ring-1 ring-[#D4AF37]';
            } else if (pairedRight) {
              bgClass = 'bg-[#FDF5E2]';
              borderClass = 'border-2 border-[#D4AF37]';
            }

            return (
              <button
                key={pair.left}
                type="button"
                disabled={revealed || disabled}
                onClick={() => handleSelectLeft(pair.left)}
                className={`min-h-[44px] sm:min-h-[48px] px-2.5 py-1.5 sm:py-2 rounded-xl ${bgClass} ${borderClass} flex flex-col justify-center text-left transition-all card-solid active:translate-y-[1px] no-select outline-none focus-visible:ring-2 focus-visible:ring-[#1A3D73] cursor-pointer`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs sm:text-sm font-bold text-[#10264F]">{pair.left}</span>
                  {pairedRight && !revealed && (
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        handleResetPair(pair.left);
                      }}
                      className="text-[9px] sm:text-[10px] font-bold text-[#8C681E] bg-[#EBD9A8] px-1.5 py-0.5 rounded cursor-pointer shrink-0"
                    >
                      Linked
                    </span>
                  )}
                  {revealed &&
                    (isPairCorrect ? (
                      <Check size={15} className="text-[#2E9E5B] shrink-0" />
                    ) : (
                      <X size={15} className={ageGroup === '7-11' ? 'text-[#E5C568] shrink-0' : 'text-[#B5664A] shrink-0'} />
                    ))}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-1.5 sm:gap-2">
          {shuffledRight.map((rightText) => {
            const isMatched = Object.values(matchedPairs).includes(rightText);

            let borderClass = 'border-2 border-[#E5C568] hover:border-[#1A3D73]';
            let bgClass = 'bg-white';

            if (isMatched) {
              bgClass = 'bg-[#FDF5E2]';
              borderClass = 'border-2 border-[#D4AF37]';
            }

            return (
              <button
                key={rightText}
                type="button"
                disabled={revealed || disabled}
                onClick={() => handleSelectRight(rightText)}
                className={`min-h-[44px] sm:min-h-[48px] px-2.5 py-1.5 sm:py-2 rounded-xl ${bgClass} ${borderClass} flex items-center justify-between text-left transition-all card-solid active:translate-y-[1px] no-select outline-none focus-visible:ring-2 focus-visible:ring-[#1A3D73] cursor-pointer`}
              >
                <span className="text-xs sm:text-sm font-semibold text-[#10264F]">{rightText}</span>
              </button>
            );
          })}
        </div>
      </div>

      {!revealed && (
        <Button
          variant="primary"
          onClick={handleConfirm}
          disabled={!allMatched || disabled}
          className="mt-1.5 sm:mt-2"
        >
          {allMatched ? 'Confirm Matches' : `Match all ${pairs.length} pairs`}
        </Button>
      )}
    </div>
  );
};
