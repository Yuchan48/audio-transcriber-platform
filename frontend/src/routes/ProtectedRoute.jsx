import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// import UI components
import Spinner from "../components/icons/Spinner";

function ProtectedRoute({ children }) {
  const { user, loadUser } = useAuth();
  const [checking, setChecking] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkUser = async () => {
      if (!user) await loadUser();
      setChecking(false);
    };
    checkUser();
  }, []);

  if (checking)
    return (
      <div className="flex items-center justify-center h-screen">
        Loading... {""}
        <Spinner className={"w-10 h-10 ml-2"} />
      </div>
    );

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
