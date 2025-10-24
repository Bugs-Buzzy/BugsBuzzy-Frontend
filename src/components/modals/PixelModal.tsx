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
      <PixelFrame className="bg-gray-900 relative max-h-[90vh] flex flex-col overflow-hidden">
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-3 left-3 md:top-4 md:left-4 w-8 h-8 md:w-9 md:h-9 flex items-center justify-center z-10 transition-all duration-150 hover:brightness-110 active:translate-y-0.5 group pixel-close-btn"
            aria-label="Close modal"
            style={{
              background: '#dc2626',
              border: '3px solid #991b1b',
              boxShadow: '0 4px 0 #7f1d1d, 0 0 0 1px #fca5a5 inset',
              imageRendering: 'pixelated',
            }}
          >
            <span className="text-white font-bold text-xl md:text-2xl leading-none select-none pixel-text">
              ✕
            </span>
          </button>
        )}

        <div className="pt-8 md:pt-4 px-2 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-primary-cerulean scrollbar-track-gray-800">
          {children}
        </div>
      </PixelFrame>
    </BaseModal>
  );
}
