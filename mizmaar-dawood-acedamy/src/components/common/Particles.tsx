import React, { useMemo } from 'react';

interface ParticlesProps {
  count?: number;
  triggerKey?: string | number;
  trigger?: boolean;
}

const COLORS = ['#2A5CAA', '#CFE6FA', '#B8892B', '#F2E8D5', '#2E9E5B'];

export const Particles: React.FC<ParticlesProps> = ({ count = 35, triggerKey, trigger = true }) => {
  if (trigger === false) return null;
  const particles = useMemo(() => {
    const safeCount = Math.min(40, count);
    return Array.from({ length: safeCount }, (_, i) => {
      const type = i % 3; // 0: diamond, 1: circle, 2: eight-pointed star
      const color = COLORS[i % COLORS.length];
      const startX = 40 + (Math.random() - 0.5) * 40; // centered burst %
      const startY = 40 + (Math.random() - 0.5) * 20;
      const targetX = (Math.random() - 0.5) * 260; // offset in px
      const targetY = -80 - Math.random() * 220; // shoot upward
      const size = 8 + Math.floor(Math.random() * 8);
      const delay = Math.random() * 0.15;
      const duration = 0.8 + Math.random() * 0.5;
      return { id: i, type, color, startX, startY, targetX, targetY, size, delay, duration };
    });
  }, [count, triggerKey]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden z-50 select-none motion-reduce:hidden"
    >
      {particles.map((p) => {
        return (
          <div
            key={p.id}
            className="absolute animate-burst"
            style={
              {
                left: `${p.startX}%`,
                top: `${p.startY}%`,
                '--tx': `${p.targetX}px`,
                '--ty': `${p.targetY}px`,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
                animationFillMode: 'forwards',
              } as React.CSSProperties
            }
          >
            {p.type === 0 ? (
              // Diamond
              <div
                style={{
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  backgroundColor: p.color,
                  transform: 'rotate(45deg)',
                }}
              />
            ) : p.type === 1 ? (
              // Circle
              <div
                style={{
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  backgroundColor: p.color,
                  borderRadius: '50%',
                }}
              />
            ) : (
              // 8-pointed star
              <svg width={p.size} height={p.size} viewBox="0 0 24 24">
                <polygon
                  points="12,0 15,9 24,12 15,15 12,24 9,15 0,12 9,9"
                  fill={p.color}
                />
              </svg>
            )}
          </div>
        );
      })}

      <style>{`
        @keyframes particleBurst {
          0% {
            transform: translate(0, 0) scale(0.6);
            opacity: 1;
          }
          70% {
            opacity: 1;
          }
          100% {
            transform: translate(var(--tx), var(--ty)) scale(1.1);
            opacity: 0;
          }
        }
        .animate-burst {
          animation-name: particleBurst;
          animation-timing-function: cubic-bezier(0.2, 0.8, 0.4, 1);
        }
      `}</style>
    </div>
  );
};
