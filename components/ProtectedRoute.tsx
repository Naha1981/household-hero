// components/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { UserProfile } from '../types'; 
// LoadingSpinner might not be needed here anymore if not waiting for auth

interface ProtectedRouteProps {
  userProfile: UserProfile | null;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ userProfile }) => {
  const location = useLocation();

  // If there's no profile at all, or if profile exists but not onboarded, redirect to onboarding.
  // Exception: allow access to settings even if not fully onboarded, in case they need to clear data or something.
  // However, with no auth, settings might be less critical if onboarding is the first step.
  if (!userProfile || !userProfile.onboarded_app) {
    // If trying to access onboarding itself, allow it.
    if (location.pathname === '/app-onboarding') {
      return <Outlet />;
    }
    return <Navigate to="/app-onboarding" state={{ from: location }} replace />;
  }

  return <Outlet />; // Renders the child route elements
};

export default ProtectedRoute;