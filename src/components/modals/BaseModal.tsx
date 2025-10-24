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
    const modalElement = modalContentRef.current;
    if (!modalElement) return;

    // Prevent wheel events from reaching the background
    const preventWheelPropagation = (e: WheelEvent) => {
      const isScrollable = modalElement.scrollHeight > modalElement.clientHeight;

      if (!isScrollable) {
        // If content is not scrollable, prevent all wheel events
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      // If scrollable, check if we're at the boundaries
      const atTop = modalElement.scrollTop <= 0;
      const atBottom =
        modalElement.scrollTop + modalElement.clientHeight >= modalElement.scrollHeight - 1;

      // Prevent scrolling past boundaries
      if ((atTop && e.deltaY < 0) || (atBottom && e.deltaY > 0)) {
        e.preventDefault();
      }

      e.stopPropagation();
    };

    // Prevent touch events from reaching the background
    const preventTouchPropagation = (e: TouchEvent) => {
      // Only stop propagation, allow the modal itself to scroll
      e.stopPropagation();
    };

    // Add event listeners with passive: false to allow preventDefault
    modalElement.addEventListener('wheel', preventWheelPropagation, { passive: false });
    modalElement.addEventListener('touchmove', preventTouchPropagation, { passive: false });
    modalElement.addEventListener('touchstart', preventTouchPropagation, { passive: false });

    return () => {
      modalElement.removeEventListener('wheel', preventWheelPropagation);
      modalElement.removeEventListener('touchmove', preventTouchPropagation);
      modalElement.removeEventListener('touchstart', preventTouchPropagation);
    };
  }, []);

  return (
    <div
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
