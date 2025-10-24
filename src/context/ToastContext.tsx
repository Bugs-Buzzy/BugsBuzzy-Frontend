import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

import Toast, { ToastType, ToastProps } from '@/components/Toast';

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Omit<ToastProps, 'onClose'>[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'info', duration = 4000) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  }, []);

  const success = useCallback(
    (message: string, duration?: number) => showToast(message, 'success', duration),
    [showToast],
  );

  const error = useCallback(
    (message: string, duration?: number) => showToast(message, 'error', duration),
    [showToast],
  );

  const info = useCallback(
    (message: string, duration?: number) => showToast(message, 'info', duration),
    [showToast],
  );

  const warning = useCallback(
    (message: string, duration?: number) => showToast(message, 'warning', duration),
    [showToast],
  );

  return (
    <ToastContext.Provider value={{ showToast, success, error, info, warning }}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onClose={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
