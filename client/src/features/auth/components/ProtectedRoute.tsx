import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { notify } from "../../../utils/notify";

const ProtectedRoute = () => {
  const { isLoggedIn, justLoggedOut, setJustLoggedOut } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!isLoggedIn) {
      if (justLoggedOut) {
        notify.success("Logout successful.");
        setJustLoggedOut(false);
      } else {
        notify.error("You must be logged in to access this page.");
      }
    }
  }, [isLoggedIn, justLoggedOut, setJustLoggedOut]);

  if (!isLoggedIn) {
    // Redirect to login, but save the current location so we can 
    // send them back after they log in.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;