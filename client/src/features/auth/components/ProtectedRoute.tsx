import { useEffect, useRef } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { notify } from "../../../utils/notify";
import { LoadingSpinner } from "../../../components/ui";

const ProtectedRoute = () => {
  
  const { isLoggedIn, loading, justLoggedOut, setJustLoggedOut } = useAuth();
  const location = useLocation();
  const hasNotified = useRef(false);

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      if (!hasNotified.current) {
        if (justLoggedOut) {
          setJustLoggedOut(false);
        } else {
          notify.error("You must be logged in to access this page.");
        }
        hasNotified.current = true;
      }
    }
    if (isLoggedIn) {
      hasNotified.current = false;
    }
  }, [isLoggedIn, loading, justLoggedOut, setJustLoggedOut]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;