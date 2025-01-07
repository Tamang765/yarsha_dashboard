import { ReactNode, useContext, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Login from "../Pages/Login";

// components

// ----------------------------------------------------------------------

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isInitialized, user } = useContext(AuthContext);
  const { pathname } = useLocation();

  const [requestedLocation, setRequestedLocation] = useState<string | null>(
    null
  );

  if (user?.role !== "admin") {
    return <p></p>;
  }

  if (!isInitialized) {
    return <p>Loading</p>;
  }

  if (!isAuthenticated) {
    // if (isAuthenticated && user?.role === "admin") {
    console.log(pathname, requestedLocation);
    if (pathname !== requestedLocation) {
      setRequestedLocation(pathname);
    }
    return <Login />;
  }

  if (requestedLocation && pathname !== requestedLocation) {
    setRequestedLocation(null);
    return <Navigate to={requestedLocation} />;
  }

  return <>{children}</>;
}
