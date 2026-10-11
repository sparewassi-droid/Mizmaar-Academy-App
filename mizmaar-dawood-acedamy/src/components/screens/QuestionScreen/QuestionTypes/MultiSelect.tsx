import React, { useState } from 'react';
import { Check, Square, CheckSquare } from 'lucide-react';
import { QuestionOption, AgeGroup } from '../../../../types';
import { Button } from '../../../common/Button';

interface MultiSelectProps {
  options: QuestionOption[];
  revealed: boolean;
  onSubmit: (selectedIds: string[], isCorrect: boolean) => void;
  ageGroup: AgeGroup;
  disabled?: boolean;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  revealed,
  onSubmit,
  ageGroup,
  disabled = false,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleToggle = (id: string) => {
    if (revealed || disabled) return;
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleConfirm = () => {
    const correctIds = options.filter((o) => o.isCorrect).map((o) => o.id);
    const isCorrect =
      selectedIds.length === correctIds.length &&
      selectedIds.every((id) => correctIds.includes(id));
    onSubmit(selectedIds, isCorrect);
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="text-[11px] sm:text-xs font-bold text-[#1A3D73] uppercase tracking-wider mb-0.5">
        Select all that apply:
      </div>

      {options.map((option) => {
        const isSelected = selectedIds.includes(option.id);
        const shouldBeSelected = option.isCorrect;

        let bgClass = 'bg-white';
        let borderClass = 'border-2 border-[#E5C568] hover:border-[#1A3D73]';
        let textClass = 'text-[#10264F]';

        if (revealed) {
          if (shouldBeSelected) {
            bgClass = 'bg-[#D6EFDF]';
            borderClass = 'border-2 border-[#2E9E5B]';
            textClass = 'text-[#10264F] font-bold';
          } else if (isSelected && !shouldBeSelected) {
            bgClass = ageGroup === '7-11' ? 'bg-[#FDF5E2]' : 'bg-[#F0D5C9]';
            borderClass = ageGroup === '7-11' ? 'border-2 border-[#E5C568]' : 'border-2 border-[#B5664A]';
          } else {
            textClass = 'text-[#5B6B7B]/60';
          }
        } else if (isSelected) {
          bgClass = 'bg-[#EAF2FD]';
          borderClass = 'border-2 border-[#1A3D73] ring-1 ring-[#D4AF37]';
        }

        return (
          <button
            key={option.id}
            type="button"
            disabled={disabled || revealed}
            onClick={() => handleToggle(option.id)}
            className={`w-full min-h-[46px] sm:min-h-[50px] px-3 py-2 sm:py-2.5 rounded-xl ${bgClass} ${borderClass} ${textClass} flex items-center justify-between gap-2.5 text-left transition-all card-solid active:translate-y-[1px] no-select outline-none focus-visible:ring-2 focus-visible:ring-[#1A3D73] cursor-pointer`}
          >
            <div className="flex items-center gap-2.5">
              {isSelected ? (
                <CheckSquare size={19} className="text-[#1A3D73] shrink-0" />
              ) : (
                <Square size={19} className="text-[#5B6B7B] shrink-0" />
              )}
              <span className="text-xs sm:text-sm font-semibold">{option.label}</span>
            </div>

            {revealed && shouldBeSelected && (
              <Check size={18} strokeWidth={2.5} className="text-[#2E9E5B] shrink-0" />
            )}
          </button>
        );
      })}

      {!revealed && (
        <Button
          variant="primary"
          onClick={handleConfirm}
          disabled={selectedIds.length === 0 || disabled}
          className="mt-1.5 sm:mt-2"
        >
          Submit Answers ({selectedIds.length})
        </Button>
      )}
    </div>
  );
};
