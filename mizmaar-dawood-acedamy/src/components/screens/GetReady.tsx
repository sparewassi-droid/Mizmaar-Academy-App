import React, { useEffect, useState } from 'react';
import { soundService } from '../../utils/audio';

interface GetReadyProps {
  accentColor: string;
  regionName: string;
  tierTitle: string;
  onFinish: () => void;
}

export const GetReady: React.FC<GetReadyProps> = ({
  accentColor,
  regionName,
  tierTitle,
  onFinish,
}) => {
  const [count, setCount] = useState(3);

  useEffect(() => {
    soundService.playTick();
    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          soundService.playNodeUnlock();
          setTimeout(onFinish, 400);
          return 0;
        }
        soundService.playTick();
        return prev - 1;
      });
    }, 900);

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 text-center select-none"
      style={{ backgroundColor: accentColor }}
    >
      <div className="w-full max-w-[420px] bg-white rounded-3xl p-8 border-3 border-[#D4AF37] shadow-2xl flex flex-col items-center gap-4 animate-scale-up">
        <div className="text-xs font-black uppercase tracking-widest text-[#8C681E] bg-[#FDF5E2] px-3 py-1 rounded-full border border-[#DEBE6B]">
          {regionName}
        </div>
        <h2 className="text-2xl font-black text-[#10264F]">{tierTitle}</h2>

        <div className="w-24 h-24 rounded-full bg-[#FDF5E2] border-4 border-[#1A3D73] ring-4 ring-[#E5B842] flex items-center justify-center my-4 shadow-md">
          <span className="text-5xl font-black text-[#1A3D73] font-mono tabular-nums">
            {count > 0 ? count : 'GO!'}
          </span>
        </div>

        <p className="text-xs font-extrabold text-[#8C681E]">Prepare your mind and heart.</p>
      </div>

      <style>{`
        @keyframes scaleUpIntro {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-scale-up {
          animation: scaleUpIntro 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};
