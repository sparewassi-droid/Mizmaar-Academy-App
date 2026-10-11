import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  theme?: '7-11' | '11-14';
  interactive?: boolean;
  onClick?: () => void;
  accentBorder?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  theme = '7-11',
  interactive = false,
  onClick,
  accentBorder,
}) => {
  const radiusClass = theme === '7-11' ? 'rounded-[24px]' : 'rounded-[16px]';
  const borderClass = accentBorder
    ? ''
    : theme === '7-11'
    ? 'border-2 border-[#E5C568]'
    : 'border-2 border-[#1A3D73]/30';

  const style: React.CSSProperties = {
    boxShadow: '0 4px 0 #E5C568',
    ...(accentBorder ? { border: `2px solid ${accentBorder}` } : {}),
  };

  const interactiveClasses = interactive
    ? 'cursor-pointer hover:translate-y-[-2px] active:translate-y-[2px] transition-transform duration-150'
    : '';

  return (
    <div
      onClick={onClick}
      style={style}
      className={`bg-white ${radiusClass} ${borderClass} p-5 ${interactiveClasses} ${className}`}
    >
      {children}
    </div>
  );
};
