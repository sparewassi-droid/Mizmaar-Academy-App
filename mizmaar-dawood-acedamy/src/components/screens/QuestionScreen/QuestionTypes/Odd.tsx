import React from 'react';
import { Check, X } from 'lucide-react';
import { QuestionOption, AgeGroup } from '../../../../types';
import { SpeakerButton } from '../../../common/SpeakerButton';

interface OddProps {
  options: QuestionOption[];
  selectedId: string | null;
  revealed: boolean;
  onSelect: (option: QuestionOption) => void;
  ageGroup: AgeGroup;
  disabled?: boolean;
}

export const Odd: React.FC<OddProps> = ({
  options,
  selectedId,
  revealed,
  onSelect,
  ageGroup,
  disabled = false,
}) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="text-[11px] sm:text-xs font-bold text-[#1A3D73] uppercase tracking-wider mb-0.5">
        Tap the one that does NOT belong:
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
        {options.map((option) => {
          const isSelected = selectedId === option.id;
          const isCorrect = option.isCorrect;

          let bgClass = 'bg-white';
          let borderClass = 'border-2 border-[#E5C568] hover:border-[#1A3D73]';
          let textClass = 'text-[#10264F]';
          let icon: React.ReactNode = null;

          if (revealed) {
            if (isCorrect) {
              bgClass = 'bg-[#D6EFDF]';
              borderClass = 'border-2 border-[#2E9E5B]';
              textClass = 'text-[#10264F] font-black';
              icon = <Check size={18} className="text-[#2E9E5B] shrink-0" />;
            } else if (isSelected && !isCorrect) {
              bgClass = ageGroup === '7-11' ? 'bg-[#FDF5E2]' : 'bg-[#F0D5C9]';
              borderClass = ageGroup === '7-11' ? 'border-2 border-[#E5C568]' : 'border-2 border-[#B5664A]';
              icon = (
                <X
                  size={18}
                  className={ageGroup === '7-11' ? 'text-[#8C681E] shrink-0' : 'text-[#B5664A] shrink-0'}
                />
              );
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
              onClick={() => onSelect(option)}
              className={`min-h-[48px] sm:min-h-[54px] px-3 py-2 sm:py-2.5 rounded-xl ${bgClass} ${borderClass} ${textClass} flex items-center justify-between gap-2 text-left transition-all card-solid active:translate-y-[1px] no-select outline-none focus-visible:ring-2 focus-visible:ring-[#1A3D73] cursor-pointer`}
            >
              <div className="flex-1">
                {option.arabic && (
                  <div lang="ar" dir="rtl" className="font-arabic text-lg sm:text-xl font-bold mb-0.5 text-[#10264F]">
                    {option.arabic}
                  </div>
                )}
                <div className="text-xs sm:text-sm font-semibold leading-snug">{option.label}</div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {option.arabic && <SpeakerButton text={option.arabic} size="sm" />}
                {icon}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
