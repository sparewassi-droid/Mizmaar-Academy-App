import React, { useState } from 'react';
import { ArrowUp, ArrowDown, Check, X } from 'lucide-react';
import { AgeGroup } from '../../../../types';
import { Button } from '../../../common/Button';
import { seededShuffle } from '../../../../utils/seededShuffle';

interface OrderProps {
  correctOrder: string[];
  revealed: boolean;
  onSubmit: (userOrder: string[], isCorrect: boolean) => void;
  ageGroup: AgeGroup;
  disabled?: boolean;
}

export const Order: React.FC<OrderProps> = ({
  correctOrder,
  revealed,
  onSubmit,
  ageGroup,
  disabled = false,
}) => {
  // Start with shuffled order so player has to arrange it
  const [currentOrder, setCurrentOrder] = useState<string[]>(() => {
    const shuffled = seededShuffle(correctOrder, correctOrder.join('-'));
    // Make sure it is not accidentally already in exact order
    if (shuffled.every((item, i) => item === correctOrder[i])) {
      return [...shuffled.slice(1), shuffled[0]];
    }
    return shuffled;
  });

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (revealed || disabled) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentOrder.length) return;

    const copy = [...currentOrder];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;
    setCurrentOrder(copy);
  };

  const handleConfirm = () => {
    const isCorrect = currentOrder.every((item, i) => item === correctOrder[i]);
    onSubmit(currentOrder, isCorrect);
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="text-[11px] sm:text-xs font-bold text-[#1A3D73] uppercase tracking-wider">
        Arrange in correct sequence from top to bottom:
      </div>

      <div className="flex flex-col gap-1.5 sm:gap-2">
        {currentOrder.map((item, index) => {
          const isSlotCorrect = item === correctOrder[index];

          let bgClass = 'bg-white';
          let borderClass = 'border-2 border-[#E5C568]';

          if (revealed) {
            if (isSlotCorrect) {
              bgClass = 'bg-[#D6EFDF]';
              borderClass = 'border-2 border-[#2E9E5B]';
            } else {
              bgClass = ageGroup === '7-11' ? 'bg-[#FDF5E2]' : 'bg-[#F0D5C9]';
              borderClass = ageGroup === '7-11' ? 'border-2 border-[#E5C568]' : 'border-2 border-[#B5664A]';
            }
          }

          return (
            <div
              key={item}
              className={`min-h-[42px] sm:min-h-[46px] px-2.5 py-1.5 sm:py-2 rounded-xl ${bgClass} ${borderClass} flex items-center justify-between gap-2.5 card-solid`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-5 h-5 rounded-full bg-[#FAF5EA] border border-[#D4AF37] text-[#10264F] text-[11px] font-black flex items-center justify-center shrink-0">
                  {index + 1}
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#10264F] truncate">{item}</span>
              </div>

              {!revealed && (
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    disabled={index === 0 || disabled}
                    onClick={() => moveItem(index, 'up')}
                    aria-label={`Move ${item} up`}
                    className="w-7 h-7 rounded-lg bg-[#FAF5EA] border border-[#E5C568] hover:border-[#1A3D73] flex items-center justify-center text-[#1A3D73] disabled:opacity-20 active:translate-y-[1px] cursor-pointer"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    type="button"
                    disabled={index === currentOrder.length - 1 || disabled}
                    onClick={() => moveItem(index, 'down')}
                    aria-label={`Move ${item} down`}
                    className="w-7 h-7 rounded-lg bg-[#FAF5EA] border border-[#E5C568] hover:border-[#1A3D73] flex items-center justify-center text-[#1A3D73] disabled:opacity-20 active:translate-y-[1px] cursor-pointer"
                  >
                    <ArrowDown size={14} />
                  </button>
                </div>
              )}

              {revealed && (
                <div className="shrink-0">
                  {isSlotCorrect ? (
                    <Check size={18} className="text-[#2E9E5B]" />
                  ) : (
                    <X size={18} className={ageGroup === '7-11' ? 'text-[#E5C568]' : 'text-[#B5664A]'} />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!revealed && (
        <Button variant="primary" onClick={handleConfirm} disabled={disabled} className="mt-1.5 sm:mt-2">
          Confirm Sequence
        </Button>
      )}
    </div>
  );
};
