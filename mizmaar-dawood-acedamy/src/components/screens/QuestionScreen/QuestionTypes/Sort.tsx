import React, { useState } from 'react';
import { SortGroup, SortItem, AgeGroup } from '../../../../types';
import { Button } from '../../../common/Button';
import { Check, X } from 'lucide-react';

interface SortProps {
  groups: SortGroup[];
  revealed: boolean;
  onSubmit: (userPlacements: Record<string, string>, isCorrect: boolean) => void;
  ageGroup: AgeGroup;
  disabled?: boolean;
}

export const Sort: React.FC<SortProps> = ({
  groups,
  revealed,
  onSubmit,
  ageGroup,
  disabled = false,
}) => {
  // Collect all items
  const allItems: SortItem[] = groups.flatMap((g) => g.items);

  // Map of itemId -> groupName
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Unplaced items
  const unplacedItems = allItems.filter((item) => !placements[item.id]);

  const handleSelectItem = (id: string) => {
    if (revealed || disabled) return;
    setSelectedItemId(selectedItemId === id ? null : id);
  };

  const handlePlaceInGroup = (groupName: string) => {
    if (revealed || disabled || !selectedItemId) return;
    setPlacements((prev) => ({
      ...prev,
      [selectedItemId]: groupName,
    }));
    setSelectedItemId(null);
  };

  const handleRemoveFromGroup = (itemId: string) => {
    if (revealed || disabled) return;
    setPlacements((prev) => {
      const copy = { ...prev };
      delete copy[itemId];
      return copy;
    });
  };

  const allPlaced = Object.keys(placements).length === allItems.length;

  const handleConfirm = () => {
    // Check if each item is in its correct group
    let isCorrect = true;
    for (const group of groups) {
      for (const item of group.items) {
        if (placements[item.id] !== group.name) {
          isCorrect = false;
          break;
        }
      }
      if (!isCorrect) break;
    }
    onSubmit(placements, isCorrect);
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="text-[11px] sm:text-xs font-bold text-[#1A3D73] uppercase tracking-wider">
        Tap a tile, then tap a box to place it:
      </div>

      {/* Available items bank */}
      {unplacedItems.length > 0 && !revealed && (
        <div className="p-2 bg-[#FAF5EA] border-2 border-[#E5C568] rounded-xl flex flex-wrap gap-1.5 min-h-[40px] items-center">
          {unplacedItems.map((item) => {
            const isSelected = selectedItemId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectItem(item.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all card-solid active:translate-y-[1px] cursor-pointer ${
                  isSelected
                    ? 'bg-[#EAF2FD] border-2 border-[#1A3D73] text-[#10264F] scale-105 ring-1 ring-[#D4AF37]'
                    : 'bg-white border-2 border-[#E5C568] hover:border-[#1A3D73] text-[#10264F]'
                }`}
              >
                {item.text}
              </button>
            );
          })}
        </div>
      )}

      {/* Destination boxes */}
      <div className={`grid gap-2 w-full ${groups.length === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
        {groups.map((group) => {
          const placedInThisGroup = allItems.filter((item) => placements[item.id] === group.name);

          return (
            <div
              key={group.name}
              onClick={() => handlePlaceInGroup(group.name)}
              className={`p-2.5 sm:p-3 rounded-xl border-2 transition-all min-h-[70px] sm:min-h-[85px] flex flex-col ${
                selectedItemId
                  ? 'border-[#1A3D73] bg-[#EAF2FD]/50 cursor-pointer border-dashed'
                  : 'border-[#E5C568] bg-white'
              }`}
            >
              <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#10264F] mb-1.5 pb-0.5 border-b border-[#E5C568]/60">
                {group.name}
              </div>

              <div className="flex flex-wrap gap-1 flex-1 items-start">
                {placedInThisGroup.map((item) => {
                  const belongsHere = group.items.some((i) => i.id === item.id);

                  let itemBg = 'bg-[#FAF5EA] border border-[#E5C568] text-[#10264F]';
                  if (revealed) {
                    if (belongsHere) {
                      itemBg = 'bg-[#D6EFDF] border-[#2E9E5B] text-[#10264F] font-bold';
                    } else {
                      itemBg =
                        ageGroup === '7-11'
                          ? 'bg-[#FDF5E2] border-[#E5C568] text-[#8C681E]'
                          : 'bg-[#F0D5C9] border-[#B5664A] text-[#1B2A41]';
                    }
                  }

                  return (
                    <span
                      key={item.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFromGroup(item.id);
                      }}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold cursor-pointer ${itemBg}`}
                    >
                      <span>{item.text}</span>
                      {revealed && (
                        belongsHere ? (
                          <Check size={13} className="text-[#2E9E5B]" />
                        ) : (
                          <X size={13} className={ageGroup === '7-11' ? 'text-[#E5C568]' : 'text-[#B5664A]'} />
                        )
                      )}
                    </span>
                  );
                })}

                {placedInThisGroup.length === 0 && (
                  <span className="text-[11px] text-[#5B6B7B]/60 italic self-center mx-auto my-auto">
                    {selectedItemId ? 'Tap to place here' : 'Empty box'}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {!revealed && (
        <Button
          variant="primary"
          onClick={handleConfirm}
          disabled={!allPlaced || disabled}
          className="mt-1.5 sm:mt-2"
        >
          {allPlaced ? 'Check Sorting' : `Place all ${allItems.length} tiles`}
        </Button>
      )}
    </div>
  );
};
