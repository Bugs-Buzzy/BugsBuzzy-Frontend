import { ReactNode, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';

import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth();
  const { warning } = useToast();
  const hasShownToast = useRef(false);

  useEffect(() => {
    if (!loading && !isAuthenticated && !hasShownToast.current) {
      warning('برای دسترسی به این بخش باید وارد شوید');
      hasShownToast.current = true;
    }
  }, [loading, isAuthenticated, warning]);

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
