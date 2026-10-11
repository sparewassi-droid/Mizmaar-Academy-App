import React, { useState } from 'react';
import { PhraseToken, AgeGroup } from '../../../../types';
import { Button } from '../../../common/Button';
import { Check, X } from 'lucide-react';
import { SpeakerButton } from '../../../common/SpeakerButton';

interface TapTargetProps {
  tokens: PhraseToken[];
  answerTokenIds: string[];
  arabicDisplay?: string;
  revealed: boolean;
  onSubmit: (selectedId: string, isCorrect: boolean) => void;
  ageGroup: AgeGroup;
  disabled?: boolean;
}

export const TapTarget: React.FC<TapTargetProps> = ({
  tokens,
  answerTokenIds,
  arabicDisplay,
  revealed,
  onSubmit,
  ageGroup,
  disabled = false,
}) => {
  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null);

  const handleSelectToken = (id: string) => {
    if (revealed || disabled) return;
    setSelectedTokenId(id);
  };

  const handleConfirm = () => {
    if (!selectedTokenId) return;
    const isCorrect = answerTokenIds.includes(selectedTokenId);
    onSubmit(selectedTokenId, isCorrect);
  };

  return (
    <div className="flex flex-col gap-2 w-full items-center">
      <div className="text-[11px] sm:text-xs font-bold text-[#1A3D73] uppercase tracking-wider self-start">
        Tap the highlighted part of the phrase that applies the rule:
      </div>

      {/* Main phrase presentation card */}
      <div className="w-full bg-white border-2 border-[#E5C568] rounded-xl p-3 sm:p-4 flex flex-col items-center justify-center gap-2.5 card-solid shadow-xs">
        {arabicDisplay && (
          <div className="flex items-center gap-2.5">
            <span
              lang="ar"
              dir="rtl"
              className="font-arabic text-2xl sm:text-3xl font-bold text-[#10264F]"
            >
              {arabicDisplay}
            </span>
            <SpeakerButton text={arabicDisplay} size="sm" />
          </div>
        )}

        {/* Tappable segment tokens */}
        <div
          dir="rtl"
          className="flex flex-wrap items-center justify-center gap-2 p-2 bg-[#FAF5EA] border-2 border-[#E5C568] rounded-xl"
        >
          {tokens.map((token) => {
            const isSelected = selectedTokenId === token.id;
            const isTarget = answerTokenIds.includes(token.id);

            let bgClass = 'bg-white';
            let borderClass = 'border-2 border-[#E5C568] hover:border-[#1A3D73]';
            let textClass = 'text-[#10264F]';

            if (revealed) {
              if (isTarget) {
                bgClass = 'bg-[#D6EFDF]';
                borderClass = 'border-2 border-[#2E9E5B]';
                textClass = 'text-[#10264F] font-bold';
              } else if (isSelected && !isTarget) {
                bgClass = ageGroup === '7-11' ? 'bg-[#FDF5E2]' : 'bg-[#F0D5C9]';
                borderClass = ageGroup === '7-11' ? 'border-2 border-[#E5C568]' : 'border-2 border-[#B5664A]';
              }
            } else if (isSelected) {
              bgClass = 'bg-[#EAF2FD]';
              borderClass = 'border-2 border-[#1A3D73] ring-1 ring-[#D4AF37]';
              textClass = 'text-[#10264F]';
            }

            return (
              <button
                key={token.id}
                type="button"
                disabled={revealed || disabled}
                onClick={() => handleSelectToken(token.id)}
                className={`min-h-[42px] min-w-[42px] px-3 py-1 rounded-lg font-arabic text-xl sm:text-2xl font-bold ${bgClass} ${borderClass} ${textClass} transition-all card-solid active:translate-y-[1px] no-select outline-none focus-visible:ring-2 focus-visible:ring-[#1A3D73] flex items-center justify-center gap-1 cursor-pointer`}
              >
                <span>{token.text}</span>
                {revealed &&
                  (isTarget ? (
                    <Check size={15} className="text-[#2E9E5B]" />
                  ) : isSelected ? (
                    <X size={15} className={ageGroup === '7-11' ? 'text-[#E5C568]' : 'text-[#B5664A]'} />
                  ) : null)}
              </button>
            );
          })}
        </div>
      </div>

      {!revealed && (
        <Button
          variant="primary"
          onClick={handleConfirm}
          disabled={!selectedTokenId || disabled}
          className="w-full mt-1.5 sm:mt-2"
        >
          {selectedTokenId ? 'Confirm Selection' : 'Tap a part to select'}
        </Button>
      )}
    </div>
  );
};
