import { ReactNode, useEffect } from 'react';

import PixelFrame from '@/components/PixelFrame';

interface PixelModalProps {
  children: ReactNode;
  onClose: () => void;
}

export default function PixelModal({ children, onClose }: PixelModalProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="pixel-modal-overlay p-4">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative max-w-2xl w-full max-h-[90vh] md:max-h-[80vh] overflow-y-auto">
        <PixelFrame className="bg-gray-900">
          <button
            onClick={onClose}
            className="absolute top-2 left-2 md:top-4 md:left-4 pixel-btn pixel-btn-danger w-8 h-8 md:w-10 md:h-10 p-0 flex items-center justify-center z-10 text-sm md:text-base"
          >
            ✕
          </button>

          <div className="pt-8 md:pt-4">{children}</div>
        </PixelFrame>
      </div>
    </div>
  );
}
