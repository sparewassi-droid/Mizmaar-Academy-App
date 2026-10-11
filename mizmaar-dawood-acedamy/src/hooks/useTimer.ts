import { useState, useEffect, useRef, useCallback } from 'react';
import { soundService } from '../utils/audio';

interface UseTimerProps {
  initialSeconds: number;
  timerMode: 'normal' | 'extra' | 'none';
  onTimeout: () => void;
  isPaused: boolean;
}

export function useTimer({
  initialSeconds,
  timerMode,
  onTimeout,
  isPaused,
}: UseTimerProps) {
  // Multiply by 2 if timerMode is 'extra'
  const effectiveBase = timerMode === 'extra' ? initialSeconds * 2 : initialSeconds;

  const [totalSeconds, setTotalSeconds] = useState(effectiveBase);
  const [secondsLeft, setSecondsLeft] = useState(effectiveBase);
  const [powerUpUsed, setPowerUpUsed] = useState(false);
  const onTimeoutRef = useRef(onTimeout);
  onTimeoutRef.current = onTimeout;

  const resetTimer = useCallback(
    (newBaseSeconds?: number) => {
      const base = newBaseSeconds !== undefined ? newBaseSeconds : initialSeconds;
      const effective = timerMode === 'extra' ? base * 2 : base;
      setTotalSeconds(effective);
      setSecondsLeft(effective);
      setPowerUpUsed(false);
    },
    [initialSeconds, timerMode]
  );

  const addExtraTime = useCallback((extra: number = 10) => {
    if (powerUpUsed) return false;
    setTotalSeconds((prev) => prev + extra);
    setSecondsLeft((prev) => prev + extra);
    setPowerUpUsed(true);
    soundService.playTap();
    return true;
  }, [powerUpUsed]);

  useEffect(() => {
    if (timerMode === 'none' || isPaused) return;

    if (secondsLeft <= 0) {
      onTimeoutRef.current();
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeoutRef.current();
          return 0;
        }
        // Soft tick sound in last 5 seconds
        if (prev <= 6) {
          soundService.playTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft, timerMode, isPaused]);

  const fraction = totalSeconds > 0 ? Math.max(0, Math.min(1, secondsLeft / totalSeconds)) : 1;
  const isWarning = secondsLeft <= 5 && timerMode !== 'none';

  return {
    secondsLeft,
    totalSeconds,
    fraction,
    isWarning,
    resetTimer,
    addExtraTime,
    canUsePowerUp: !powerUpUsed && timerMode !== 'none',
  };
}
