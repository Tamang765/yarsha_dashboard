import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

interface GuestGuardProps {
  children: React.ReactNode;
}

const GuestGuard = ({ children }: GuestGuardProps) => {
  const { isAuthenticated, user } = useContext(AuthContext);

  if (isAuthenticated) {
    if (user.role === "admin") {
      return <Navigate to="/admin" />;
    } else if (user.role === "staff") {
      return <Navigate to="/staff" />;
    } else if (user.role === "player") {
      return <Navigate to="/player" />;
    }
  }

  return <>{children}</>;
};

export default GuestGuard;
