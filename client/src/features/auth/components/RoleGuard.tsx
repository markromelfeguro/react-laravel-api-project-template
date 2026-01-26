import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { notify } from '../../../utils/notify';

interface RoleGuardProps {
  allowedRoles: string[];
  children?: React.ReactNode;
}

export const RoleGuard = ({ allowedRoles, children }: RoleGuardProps) => {
  const { hasPermission, loading, isLoggedIn } = useAuth();

  // 1. Wait for the session check (/me) to finish
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // 2. If not logged in, boot to login
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // 3. If logged in but lacks role
  if (!hasPermission(allowedRoles)) {
    notify.error("You don't have permission to view this page.");
    return <Navigate to="/app/dashboard" replace />;
  }
  
  // 4. Authorized
  return children ? <>{children}</> : <Outlet />;
};