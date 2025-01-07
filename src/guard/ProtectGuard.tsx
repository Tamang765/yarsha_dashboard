import React, { ReactNode, useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

interface ProtectedRouteProps {
  allowedRoles: string[];
  children?: ReactNode;
}

const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
  const { user, isAuthenticated, isInitialized } = useContext(AuthContext);

  if (!isInitialized) {
    return <div>Loading...</div>; 
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const hasAccess = allowedRoles.includes(user?.role);

  if (!hasAccess) {
    return <Navigate to="/unauthorized" />;
  }

  return children || <Outlet />;
};

export default ProtectedRoute;
