import React from 'react';

interface TimerRingProps {
  secondsLeft: number;
  totalSeconds: number;
  theme: '7-11' | '11-14';
  isWarning: boolean;
  size?: number;
  strokeWidth?: number;
}

export const TimerRing: React.FC<TimerRingProps> = ({
  secondsLeft,
  totalSeconds,
  theme,
  isWarning,
  size = 52,
  strokeWidth = 4,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const fraction = totalSeconds > 0 ? Math.max(0, Math.min(1, secondsLeft / totalSeconds)) : 1;
  const strokeDashoffset = circumference * (1 - fraction);

  // Turn amber in Theme A, clay in Theme B during warning
  const strokeColor = isWarning
    ? theme === '7-11'
      ? '#E89B3C'
      : '#B5664A'
    : '#2A5CAA';

  return (
    <div
      role="timer"
      aria-label={`${secondsLeft} seconds remaining`}
      className="relative flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="rotate-[-90deg]">
        {/* Background track in sand-deep */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E4D6BA"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Animated countdown ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          className="transition-all duration-300 ease-linear"
        />
      </svg>
      <span
        className={`absolute text-xs font-bold font-mono tabular-nums ${
          isWarning
            ? theme === '7-11'
              ? 'text-[#E89B3C]'
              : 'text-[#B5664A]'
            : 'text-[#1B2A41]'
        }`}
      >
        {secondsLeft}
      </span>
    </div>
  );
};
