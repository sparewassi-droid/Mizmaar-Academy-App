import React from 'react';
import { Check, X } from 'lucide-react';
import { QuestionOption, AgeGroup } from '../../../../types';
import { SpeakerButton } from '../../../common/SpeakerButton';

interface McqProps {
  options: QuestionOption[];
  selectedId: string | null;
  revealed: boolean;
  onSelect: (option: QuestionOption) => void;
  ageGroup: AgeGroup;
  disabled?: boolean;
}

export const Mcq: React.FC<McqProps> = ({
  options,
  selectedId,
  revealed,
  onSelect,
  ageGroup,
  disabled = false,
}) => {
  return (
    <div className="flex flex-col gap-2 sm:gap-2.5 w-full">
      {options.map((option) => {
        const isSelected = selectedId === option.id;
        const isCorrect = option.isCorrect;

        // Reverence rule check
        const containsDivine =
          option.label.includes('Allah') ||
          option.label.includes('الله') ||
          (option.arabic && option.arabic.includes('الله'));

        let bgClass = 'bg-white';
        let borderClass = 'border-2 border-[#E5C568] hover:border-[#1A3D73]';
        let textClass = 'text-[#10264F]';
        let icon: React.ReactNode = null;
        let animationClass = '';

        if (revealed) {
          if (isCorrect) {
            bgClass = 'bg-[#D6EFDF]';
            borderClass = 'border-2 border-[#2E9E5B]';
            textClass = 'text-[#10264F] font-black';
            icon = <Check size={18} strokeWidth={2.5} className="text-[#2E9E5B] shrink-0" />;
            if (!containsDivine) {
              animationClass = 'animate-pulse';
            }
          } else if (isSelected && !isCorrect) {
            // Gentle incorrect: amber in A, clay in B
            if (ageGroup === '7-11') {
              bgClass = 'bg-[#FDF5E2]';
              borderClass = 'border-2 border-[#E5C568]';
            } else {
              bgClass = 'bg-[#F0D5C9]';
              borderClass = 'border-2 border-[#B5664A]';
            }
            icon = (
              <X
                size={18}
                strokeWidth={2.5}
                className={ageGroup === '7-11' ? 'text-[#8C681E] shrink-0' : 'text-[#B5664A] shrink-0'}
              />
            );
            if (!containsDivine) {
              animationClass = 'animate-shake';
            }
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
            className={`w-full min-h-[48px] sm:min-h-[54px] px-3 py-2 sm:py-2.5 rounded-xl ${bgClass} ${borderClass} ${textClass} ${animationClass} flex items-center justify-between gap-2.5 text-left transition-all duration-150 no-select outline-none focus-visible:ring-2 focus-visible:ring-[#1A3D73] card-solid active:translate-y-[1px] cursor-pointer`}
          >
            <div className="flex-1 flex flex-col justify-center">
              {option.arabic && (
                <div
                  lang="ar"
                  dir="rtl"
                  className="font-arabic text-xl sm:text-2xl text-[#10264F] mb-0.5 font-bold leading-normal"
                >
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

      <style>{`
        @keyframes subtleShake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: subtleShake 0.25s ease-in-out;
        }
      `}</style>
    </div>
  );
};
