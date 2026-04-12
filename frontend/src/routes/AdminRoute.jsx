import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// import UI components
import Spinner from "../components/icons/Spinner";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        Loading... {""}
        <Spinner className={"w-10 h-10 ml-2"} />
      </div>
    );

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

export default AdminRoute;
