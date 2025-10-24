import { ReactNode } from 'react';

import BaseModal from '@/components/modals/BaseModal';
import PixelFrame from '@/components/PixelFrame';

interface PixelModalProps {
  children: ReactNode;
  onClose: () => void;
  showCloseButton?: boolean;
}

export default function PixelModal({ children, onClose, showCloseButton = true }: PixelModalProps) {
  return (
    <BaseModal
      onClose={onClose}
      overlayClassName="pixel-modal-overlay p-4 sm:p-6"
      contentClassName="max-w-2xl w-full"
    >
      <PixelFrame className="bg-gray-900 relative max-h-[90vh] flex flex-col">
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-2 left-2 md:top-3 md:left-3 w-7 h-7 md:w-8 md:h-8 flex items-center justify-center z-10 transition-all duration-200 hover:scale-110 active:scale-95 group"
            aria-label="Close modal"
            style={{
              background: 'linear-gradient(135deg, #374151 0%, #1f2937 100%)',
              border: '2px solid #4b5563',
              boxShadow: '2px 2px 0 rgba(0,0,0,0.5), inset 1px 1px 0 rgba(255,255,255,0.1)',
            }}
          >
            <span className="text-gray-300 group-hover:text-white font-bold text-lg leading-none">
              ✕
            </span>
          </button>
        )}

        <div className="pt-8 md:pt-4 overflow-y-auto flex-1">{children}</div>
      </PixelFrame>
    </BaseModal>
  );
}
