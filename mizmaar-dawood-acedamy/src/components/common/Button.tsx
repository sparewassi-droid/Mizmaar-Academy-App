import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'accent' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  accentBg?: string;
  accentBorder?: string;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  accentBg,
  accentBorder,
  className = '',
  children,
  disabled,
  ...props
}) => {
  const heightClass =
    size === 'lg'
      ? 'h-[64px] text-lg'
      : size === 'sm'
      ? 'h-[40px] text-xs rounded-xl'
      : 'h-[52px] text-base';
  const widthClass = fullWidth ? 'w-full' : size === 'sm' ? 'px-3.5' : 'px-6';

  let variantStyle: React.CSSProperties = {};
  let variantClasses = '';

  if (variant === 'primary') {
    variantClasses = 'bg-gradient-to-r from-[#1A3D73] via-[#244F9C] to-[#1A3D73] hover:from-[#143265] hover:to-[#1C4382] text-white font-black border-2 border-[#E5B842] hover:border-[#FFF0A6] active:translate-y-[2px] shadow-md';
    variantStyle = {
      boxShadow: disabled ? 'none' : '0 4px 0 #10264F',
    };
  } else if (variant === 'accent' && accentBg) {
    variantClasses = 'text-white font-bold border-2 border-[#E5B842] active:translate-y-[2px] shadow-md';
    variantStyle = {
      backgroundColor: accentBg,
      boxShadow: disabled ? 'none' : `0 3px 0 ${accentBorder || '#10264F'}`,
    };
  } else if (variant === 'secondary') {
    variantClasses = 'bg-white text-[#1A3D73] font-black border-2 border-[#1A3D73] hover:border-[#E5B842] hover:bg-[#FDF8EE] active:translate-y-[2px] shadow-xs';
    variantStyle = {
      boxShadow: disabled ? 'none' : '0 3px 0 #E5C568',
    };
  } else if (variant === 'outline') {
    variantClasses = 'bg-white text-[#10264F] font-bold border-2 border-[#E5C568] hover:border-[#1A3D73] active:translate-y-[2px]';
    variantStyle = {
      boxShadow: disabled ? 'none' : '0 2px 0 #E5C568',
    };
  } else if (variant === 'danger') {
    variantClasses = 'bg-[#B94437] text-white font-bold border-0 active:translate-y-[2px]';
    variantStyle = {
      boxShadow: disabled ? 'none' : '0 3px 0 #7A281E',
    };
  } else if (variant === 'ghost') {
    variantClasses = 'bg-transparent text-[#1A3D73] font-bold hover:bg-[#EAF2FD]/70 hover:text-[#10264F] active:translate-y-[1px]';
  }

  const disabledClasses = disabled
    ? 'opacity-40 cursor-not-allowed transform-none shadow-none'
    : 'cursor-pointer transition-all duration-150';

  return (
    <button
      className={`inline-flex items-center justify-center rounded-2xl ${heightClass} ${widthClass} ${variantClasses} ${disabledClasses} no-select outline-none focus-visible:ring-2 focus-visible:ring-[#2A5CAA] ${className}`}
      style={variantStyle}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
