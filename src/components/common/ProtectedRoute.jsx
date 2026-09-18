import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2, ShieldAlert } from 'lucide-react';
import Button from './Button';
import { useAuth } from '../../context/AuthContext';

/**
 * Route guard for the frontend UX (redirect, loading state, friendly
 * "access denied" message). This is a convenience layer only — the actual
 * enforcement lives on the backend (authenticateUser / authorizeRoles), so
 * a customer manually hitting an admin API endpoint is still rejected with
 * a real 403 regardless of what this component does.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {string[]} [props.roles] - If provided, only these roles may view the route.
 */
export default function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-charcoal-500">
        <Loader2 className="w-6 h-6 animate-spin text-leaf-600" />
        <span className="text-sm">Checking your session&hellip;</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname + location.search }} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16">
        <div className="w-16 h-16 rounded-3xl bg-red-50 border border-red-200 flex items-center justify-center text-red-500 mb-6">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="font-display font-extrabold text-3xl text-botanical-950">
          Access Denied
        </h1>
        <p className="text-charcoal-600 mt-3 text-base max-w-sm">
          Your account doesn't have permission to view this page.
        </p>
        <Button to="/" variant="ginger" size="md" className="mt-8">
          Return to Herbix Home
        </Button>
      </div>
    );
  }

  return children;
}
