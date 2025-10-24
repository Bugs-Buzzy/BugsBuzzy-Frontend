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
    const overlayElement = overlayRef.current;
    const modalContentElement = modalContentRef.current;
    if (!overlayElement) return;

    // Prevent wheel and touch events only on the overlay itself, not on modal content
    const preventEvent = (e: Event) => {
      // Allow events that originate from modal content or its children
      if (modalContentElement && e.target && modalContentElement.contains(e.target as Node)) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
    };

    // Add event listeners on the overlay to prevent background scrolling
    overlayElement.addEventListener('wheel', preventEvent, { passive: false });
    overlayElement.addEventListener('touchmove', preventEvent, { passive: false });

    return () => {
      overlayElement.removeEventListener('wheel', preventEvent);
      overlayElement.removeEventListener('touchmove', preventEvent);
    };
  }, []);

  return (
    <div
      ref={overlayRef}
      className={`fixed inset-0 z-50 flex items-center justify-center ${overlayClassName}`}
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
