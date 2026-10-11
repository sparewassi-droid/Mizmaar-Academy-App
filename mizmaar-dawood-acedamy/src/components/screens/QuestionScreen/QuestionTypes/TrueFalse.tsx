import React from 'react';
import { Check, X } from 'lucide-react';
import { AgeGroup } from '../../../../types';

interface TrueFalseProps {
  correctAnswer: boolean;
  selectedAnswer: boolean | null;
  revealed: boolean;
  onSelect: (ans: boolean) => void;
  ageGroup: AgeGroup;
  disabled?: boolean;
}

export const TrueFalse: React.FC<TrueFalseProps> = ({
  correctAnswer,
  selectedAnswer,
  revealed,
  onSelect,
  ageGroup,
  disabled = false,
}) => {
  const options = [
    { value: true, label: 'True', arabic: 'صَحِيح' },
    { value: false, label: 'False', arabic: 'خَطَأ' },
  ];

  return (
    <div className="grid grid-cols-2 gap-2.5 sm:gap-3 w-full">
      {options.map((opt) => {
        const isSelected = selectedAnswer === opt.value;
        const isCorrect = correctAnswer === opt.value;

        let bgClass = 'bg-white';
        let borderClass = 'border-2 border-[#E5C568] hover:border-[#1A3D73]';
        let textClass = 'text-[#10264F]';
        let icon: React.ReactNode = null;

        if (revealed) {
          if (isCorrect) {
            bgClass = 'bg-[#D6EFDF]';
            borderClass = 'border-2 border-[#2E9E5B]';
            textClass = 'text-[#10264F] font-black';
            icon = <Check size={20} strokeWidth={2.5} className="text-[#2E9E5B]" />;
          } else if (isSelected && !isCorrect) {
            bgClass = ageGroup === '7-11' ? 'bg-[#FDF5E2]' : 'bg-[#F0D5C9]';
            borderClass = ageGroup === '7-11' ? 'border-2 border-[#E5C568]' : 'border-2 border-[#B5664A]';
            icon = (
              <X
                size={20}
                strokeWidth={2.5}
                className={ageGroup === '7-11' ? 'text-[#8C681E]' : 'text-[#B5664A]'}
              />
            );
          } else {
            textClass = 'text-[#5B6B7B]/50';
          }
        } else if (isSelected) {
          bgClass = 'bg-[#EAF2FD]';
          borderClass = 'border-2 border-[#1A3D73] ring-1 ring-[#D4AF37]';
        }

        return (
          <button
            key={String(opt.value)}
            type="button"
            disabled={disabled || revealed}
            onClick={() => onSelect(opt.value)}
            className={`min-h-[60px] sm:min-h-[72px] p-2.5 sm:p-3 rounded-xl ${bgClass} ${borderClass} ${textClass} flex flex-col items-center justify-center gap-1 transition-all duration-150 card-solid active:translate-y-[1px] no-select outline-none focus-visible:ring-2 focus-visible:ring-[#1A3D73] cursor-pointer`}
          >
            <div lang="ar" dir="rtl" className="font-arabic text-xl sm:text-2xl font-bold">
              {opt.arabic}
            </div>
            <div className="text-xs sm:text-sm font-bold flex items-center gap-1.5">
              <span>{opt.label}</span>
              {icon}
            </div>
          </button>
        );
      })}
    </div>
  );
};
