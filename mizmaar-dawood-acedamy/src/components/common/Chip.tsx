import React from 'react';

export interface ChipProps {
  variant?: 'info' | 'reward' | 'neutral' | 'accent' | 'lapis';
  accentBg?: string;
  accentText?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  title?: string;
  onClick?: () => void;
}

export const Chip: React.FC<ChipProps> = ({
  variant = 'info',
  accentBg,
  accentText,
  icon,
  children,
  className = '',
  title,
  onClick,
}) => {
  let styleClasses = 'bg-[#EAF2FD] text-[#1A3D73] border-2 border-[#A2C4EE] font-bold';

  if (variant === 'reward') {
    styleClasses = 'bg-[#FDF5E2] text-[#8C681E] border-2 border-[#E5C568] font-black shadow-2xs';
  } else if (variant === 'neutral') {
    styleClasses = 'bg-[#FAF5EA] text-[#8C681E] border border-[#DEBE6B] font-bold';
  } else if (variant === 'lapis') {
    styleClasses = 'bg-gradient-to-r from-[#1A3D73] to-[#2556A3] text-white border-2 border-[#E5B842] font-black shadow-2xs';
  } else if (variant === 'accent' && accentBg) {
    styleClasses = 'border border-black/10';
  }

  const customStyle: React.CSSProperties =
    variant === 'accent' && accentBg
      ? { backgroundColor: accentBg, color: accentText || '#1B2A41' }
      : {};

  const clickableClass = onClick ? 'cursor-pointer hover:opacity-90 active:scale-95' : '';

  return (
    <div
      onClick={onClick}
      title={title}
      style={customStyle}
      className={`inline-flex items-center gap-1.5 h-[32px] px-3 rounded-full text-xs font-semibold whitespace-nowrap no-select ${styleClasses} ${clickableClass} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </div>
  );
};
