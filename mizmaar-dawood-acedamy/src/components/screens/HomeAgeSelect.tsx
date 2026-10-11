import React, { useRef, useState } from 'react';
import { Volume2, VolumeX, Shield, X } from 'lucide-react';
import { AgeGroup } from '../../types';
import { Card } from '../common/Card';
import { soundService } from '../../utils/audio';

interface HomeAgeSelectProps {
  currentAgeGroup: AgeGroup;
  onSelectAgeGroup: (ageGroup: AgeGroup) => void;
  onOpenGrownUps: () => void;
  onExit: () => void;
}

export const HomeAgeSelect: React.FC<HomeAgeSelectProps> = ({
  currentAgeGroup,
  onSelectAgeGroup,
  onOpenGrownUps,
  onExit,
}) => {
  const [isMuted, setIsMuted] = useState(soundService.isMuted());
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [pressProgress, setPressProgress] = useState(false);

  const toggleSound = () => {
    const next = soundService.toggleMute();
    setIsMuted(next);
  };

  const handleGrownUpsTouchStart = () => {
    setPressProgress(true);
    longPressTimerRef.current = setTimeout(() => {
      setPressProgress(false);
      onOpenGrownUps();
    }, 1800); // ~2 second long-press
  };

  const handleGrownUpsTouchEnd = () => {
    setPressProgress(false);
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[#F2E8D5] text-[#1B2A41] select-none overflow-hidden">
      {/* Subtle geometric line pattern in background (1px lines) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `radial-gradient(#2A5CAA 1px, transparent 1px), radial-gradient(#B8892B 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
          backgroundPosition: '0 0, 16px 16px',
        }}
      />

      {/* Corner controls: Mute, Grown-ups corner (long-press), Close */}
      <header className="relative z-10 w-full p-4 flex items-center justify-between">
        {/* Mute button */}
        <button
          type="button"
          onClick={toggleSound}
          aria-label={isMuted ? 'Unmute sounds' : 'Mute sounds'}
          title={isMuted ? 'Unmute' : 'Mute'}
          className="w-11 h-11 rounded-2xl bg-white border-2 border-[#E5C568] flex items-center justify-center text-[#1A3D73] hover:text-[#8C681E] shadow-xs active:translate-y-[1px] transition-colors"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>

        <div className="flex items-center gap-3">
          {/* Grown-ups corner button (long-press) */}
          <button
            type="button"
            onMouseDown={handleGrownUpsTouchStart}
            onMouseUp={handleGrownUpsTouchEnd}
            onMouseLeave={handleGrownUpsTouchEnd}
            onTouchStart={handleGrownUpsTouchStart}
            onTouchEnd={handleGrownUpsTouchEnd}
            onClick={() => {
              soundService.playTap();
              onOpenGrownUps();
            }}
            title="Grown-ups Corner (Press and hold for 2s)"
            aria-label="Grown-ups corner (Hold for 2 seconds)"
            className={`px-3 py-2 rounded-2xl bg-white border-2 border-[#E5C568] text-xs font-bold text-[#1A3D73] hover:text-[#8C681E] flex items-center gap-1.5 shadow-xs active:translate-y-[1px] transition-all ${
              pressProgress ? 'ring-2 ring-[#D4AF37] bg-[#FDF5E2]' : ''
            }`}
          >
            <Shield size={16} />
            <span className="hidden xs:inline">
              {pressProgress ? 'Holding...' : 'Grown-ups'}
            </span>
          </button>

          {/* Close button */}
          <button
            type="button"
            onClick={onExit}
            aria-label="Exit Tajweed Quest"
            title="Exit"
            className="w-11 h-11 rounded-2xl bg-white border-2 border-[#E5C568] flex items-center justify-center text-[#1A3D73] hover:text-[#8C681E] shadow-xs active:translate-y-[1px] transition-colors"
          >
            <X size={20} strokeWidth={2} />
          </button>
        </div>
      </header>

      {/* Main Hero & Two Age Cards */}
      <main className="relative z-10 flex-1 w-full max-w-[560px] mx-auto px-4 py-8 flex flex-col items-center justify-center my-auto">
        <div className="text-center mb-8">
          <div className="inline-block px-3.5 py-1 rounded-full bg-[#FDF5E2] border-2 border-[#E5C568] text-xs font-black tracking-widest uppercase text-[#8C681E] mb-2 shadow-xs">
            Mizmaar Dawood Academy
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-[#10264F] tracking-tight">
            Tajweed Quest
          </h1>
          <p className="text-base text-[#3D5A80] mt-2 font-medium">
            Master the art and elegance of noble Qur&apos;anic recitation.
          </p>
        </div>

        {/* Exactly two large age cards */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Ages 7 to 11 Card (Lantern Trail) */}
          <Card
            theme="7-11"
            interactive
            onClick={() => {
              soundService.playTap();
              onSelectAgeGroup('7-11');
            }}
            className={`p-6 flex flex-col items-center text-center gap-4 transition-all ${
              currentAgeGroup === '7-11' ? 'border-[#1A3D73] ring-2 ring-[#E5B842] shadow-md' : 'border-[#E5C568]'
            }`}
          >
            {/* Lantern and stars emblem in sky, lapis and brass */}
            <div className="w-24 h-24 rounded-3xl bg-[#EAF2FD] border-2 border-[#1A3D73] flex items-center justify-center shadow-xs">
              <svg width="56" height="56" viewBox="0 0 64 64">
                {/* Arch frame */}
                <path
                  d="M 12 56 L 12 28 C 12 12, 52 12, 52 28 L 52 56 Z"
                  fill="#FAF5EA"
                  stroke="#1A3D73"
                  strokeWidth="3"
                />
                {/* Lantern */}
                <polygon points="32,24 38,32 32,44 26,32" fill="#D4AF37" />
                <circle cx="32,34" r="3" fill="#FFFFFF" />
                {/* Stars */}
                <circle cx="20" cy="22" r="2" fill="#D4AF37" />
                <circle cx="44" cy="22" r="2" fill="#D4AF37" />
              </svg>
            </div>

            <div>
              <span className="text-xs font-black uppercase tracking-wider text-[#1A3D73]">
                Explorer
              </span>
              <h2 className="text-2xl font-black text-[#10264F] mt-0.5">Ages 7 to 11</h2>
              <p className="text-xs text-[#3D5A80] mt-1.5 leading-relaxed">
                The Lantern Trail: friendly guidance across 5 regions with gentle steps and bright stars.
              </p>
            </div>
          </Card>

          {/* Ages 11 to 14 Card (Scholar's Atlas) */}
          <Card
            theme="11-14"
            interactive
            onClick={() => {
              soundService.playTap();
              onSelectAgeGroup('11-14');
            }}
            className={`p-6 flex flex-col items-center text-center gap-4 transition-all ${
              currentAgeGroup === '11-14' ? 'border-[#D4AF37] ring-2 ring-[#1A3D73] shadow-md' : 'border-[#E5C568]'
            }`}
          >
            {/* Compass and atlas lines emblem in sand, ink and brass */}
            <div className="w-24 h-24 rounded-3xl bg-[#FDF5E2] border-2 border-[#D4AF37] flex items-center justify-center shadow-xs">
              <svg width="56" height="56" viewBox="0 0 64 64">
                {/* Outer ring */}
                <circle cx="32" cy="32" r="24" fill="none" stroke="#E5C568" strokeWidth="2.5" />
                <circle cx="32" cy="32" r="18" fill="none" stroke="#1A3D73" strokeWidth="1.5" />
                {/* Compass needle */}
                <polygon points="32,12 37,32 32,30 27,32" fill="#D4AF37" />
                <polygon points="32,52 37,32 32,34 27,32" fill="#1A3D73" />
                <circle cx="32" cy="32" r="3" fill="#D4AF37" />
              </svg>
            </div>

            <div>
              <span className="text-xs font-black uppercase tracking-wider text-[#8C681E]">
                Scholar
              </span>
              <h2 className="text-2xl font-black text-[#10264F] mt-0.5">Ages 11 to 14</h2>
              <p className="text-xs text-[#3D5A80] mt-1.5 leading-relaxed">
                The Scholar&apos;s Atlas: refined chapters with advanced rules for fluent reciters.
              </p>
            </div>
          </Card>
        </div>

        {/* Note under cards */}
        <p className="text-xs font-medium text-[#5B6B7B] text-center mt-6">
          Age 11? Pick either one. You can switch any time.
        </p>
      </main>
    </div>
  );
};
