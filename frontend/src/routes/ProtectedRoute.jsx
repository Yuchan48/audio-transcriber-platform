import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// import UI components
import Spinner from "../components/icons/Spinner";

function ProtectedRoute({ children }) {
  const { user, loadUser, skipAuthCheck } = useAuth();
  const [sessionExpired, setSessionExpired] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      if (!user && !skipAuthCheck) {
        const success = await loadUser();
        if (!success) setSessionExpired(true);
      }
      setChecking(false);
    };
    checkUser();
  }, [loadUser, user, skipAuthCheck]);

  if (checking)
    return (
      <div className="flex items-center justify-center h-screen">
        Loading... {""}
        <Spinner className={"w-10 h-10 ml-2"} />
      </div>
    );

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={
          sessionExpired
            ? { message: "Session expired. Please log in again." }
            : {}
        }
      />
    );
  }

  return children;
}

export default ProtectedRoute;
