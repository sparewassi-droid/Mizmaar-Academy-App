import React, { useEffect } from 'react';

interface BottomDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: React.ReactNode;
}

export const BottomDrawer: React.FC<BottomDrawerProps> = ({
  isOpen,
  onClose,
  children,
  title,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Dim backdrop in solid ink at 40% */}
      <div
        className="fixed inset-0 bg-[#1B2A41]/40 transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer content */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 w-full max-w-[560px] mx-auto bg-white rounded-t-[28px] border-t-2 border-x-2 border-[#E4D6BA] p-6 pb-8 shadow-2xl animate-drawer-up max-h-[90vh] overflow-y-auto"
      >
        {/* Drag handle */}
        <div className="w-12 h-1.5 bg-[#E4D6BA] rounded-full mx-auto mb-4" />

        {title && <div className="mb-4">{title}</div>}

        {children}
      </div>

      <style>{`
        @keyframes drawerUp {
          0% {
            transform: translateY(100%);
          }
          100% {
            transform: translateY(0);
          }
        }
        .animate-drawer-up {
          animation: drawerUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};
