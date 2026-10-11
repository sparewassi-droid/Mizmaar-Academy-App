import React from 'react';

interface TopBarProps {
  leftAction?: React.ReactNode;
  title?: React.ReactNode;
  rightAction?: React.ReactNode;
  className?: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  leftAction,
  title,
  rightAction,
  className = '',
}) => {
  return (
    <header
      className={`h-[56px] w-full px-4 flex items-center justify-between z-30 shrink-0 select-none ${className}`}
    >
      <div className="flex items-center gap-2 min-w-[44px]">{leftAction}</div>
      <div className="flex-1 flex items-center justify-center text-center px-2 truncate">
        {title}
      </div>
      <div className="flex items-center justify-end gap-2 min-w-[44px]">{rightAction}</div>
    </header>
  );
};
