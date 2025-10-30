import { ReactNode, useEffect, useRef, useCallback, MouseEvent } from 'react';

export interface BaseModalProps {
  children: ReactNode;
  onClose: () => void;
  className?: string;
  overlayClassName?: string;
  contentClassName?: string;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  preventBackgroundScroll?: boolean;
}

/**
 * BaseModal - A base modal component that handles common modal behaviors
 *
 * Features:
 * - Prevents background scroll when modal is open
 * - Handles touch events properly on mobile devices
 * - Allows content scrolling within the modal
 * - Click outside to close
 * - ESC key to close
 * - Proper event isolation from background
 */
export default function BaseModal({
  children,
  onClose,
  className = '',
  overlayClassName = '',
  contentClassName = '',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  preventBackgroundScroll = true,
}: BaseModalProps) {
  const modalContentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Handle ESC key press
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === 'Escape') {
        onClose();
      }
    },
    [closeOnEscape, onClose],
  );

  // Handle overlay click
  const handleOverlayClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (closeOnOverlayClick && e.target === e.currentTarget) {
        onClose();
      }
    },
    [closeOnOverlayClick, onClose],
  );

  useEffect(() => {
    // Prevent background scroll
    if (preventBackgroundScroll) {
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;

      // Calculate scrollbar width to prevent layout shift
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

      document.body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
      };
    }
  }, [preventBackgroundScroll]);

  useEffect(() => {
    // Add ESC key listener
    if (closeOnEscape) {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [closeOnEscape, handleKeyDown]);

  useEffect(() => {
    if (!preventBackgroundScroll) return;

    const overlayElement = overlayRef.current;
    if (!overlayElement) return;

    const stopScrollPropagation = (event: Event) => {
      if (!overlayElement.contains(event.target as Node)) {
        return;
      }

      if (event.target === overlayElement) {
        event.preventDefault();
      }

      event.stopPropagation();
    };

    overlayElement.addEventListener('wheel', stopScrollPropagation, { passive: false });
    overlayElement.addEventListener('touchmove', stopScrollPropagation, { passive: false });

    return () => {
      overlayElement.removeEventListener('wheel', stopScrollPropagation);
      overlayElement.removeEventListener('touchmove', stopScrollPropagation);
    };
  }, [preventBackgroundScroll]);

  return (
    <div
      ref={overlayRef}
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden ${overlayClassName}`}
      style={{ margin: '0', padding: '0' }}
      onClick={handleOverlayClick}
    >
      <div
        ref={modalContentRef}
        className={`relative ${contentClassName} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
