import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const { currentUser } = useAuth();

  return currentUser
    ? <>{children}</>
    : <Navigate to="/signin" replace state={{ from: location }} />;
};

export default ProtectedRoute;




