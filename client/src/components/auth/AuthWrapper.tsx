import { ReactNode, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

// This component serves as a wrapper that makes the auth available
// to other components that need it
export const AuthWrapper = ({ children }: { children: ReactNode }) => {
  const { checkAuth } = useAuth();
  
  // Check authentication status once when the wrapper mounts
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  
  return <>{children}</>;
};