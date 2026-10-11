import React, { useState } from 'react';
import { Volume2 } from 'lucide-react';
import { soundService } from '../../utils/audio';

interface SpeakerButtonProps {
  text: string;
  lang?: 'ar-SA' | 'en-US';
  questionId?: string;
  className?: string;
  size?: 'sm' | 'md';
}

export const SpeakerButton: React.FC<SpeakerButtonProps> = ({
  text,
  lang = 'ar-SA',
  questionId,
  className = '',
  size = 'md',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(true);
    soundService.playTap();
    await soundService.speakText(text, lang, questionId);
    setTimeout(() => setIsPlaying(false), 800);
  };

  const dimClass = size === 'sm' ? 'w-8 h-8' : 'w-10 h-10';
  const iconSize = size === 'sm' ? 16 : 20;

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`Listen to pronunciation of ${text}`}
      title="Listen"
      className={`inline-flex items-center justify-center rounded-full bg-[#FDF5E2] text-[#1A3D73] border-2 border-[#E5C568] hover:bg-[#F9ECCF] hover:border-[#1A3D73] active:scale-95 transition-all no-select shadow-xs ${dimClass} ${
        isPlaying ? 'ring-2 ring-[#1A3D73] scale-105' : ''
      } ${className}`}
    >
      <Volume2 size={iconSize} strokeWidth={2.2} className="text-[#1A3D73]" />
    </button>
  );
};
