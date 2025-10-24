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
            className="absolute top-4 left-4 md:top-4 md:left-4 pixel-btn pixel-btn-danger w-8 h-8 md:w-10 md:h-10 p-0 flex items-center justify-center z-10 text-sm md:text-base"
            aria-label="Close modal"
          >
            ✕
          </button>
        )}

        <div className="pt-8 md:pt-4 overflow-y-auto flex-1">{children}</div>
      </PixelFrame>
    </BaseModal>
  );
}
