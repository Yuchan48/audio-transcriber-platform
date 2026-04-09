import { useState, useEffect } from "react";

// import functions
import { fetchCurrentUser } from "../services/userService";

// import UI components
import UserDashboard from "./UserDashboard";
import AdminUsers from "./AdminUsers";
import AdminAudio from "./AdminAudio";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

const Dashboard = () => {
  const [error, setError] = useState("");

  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [view, setView] = useState("dashboard");

  // fetch current user
  const fetchUser = async () => {
    try {
      setUserLoading(true);
      setError("");
      const userData = await fetchCurrentUser();
      setUser(userData);
    } catch (error) {
      setError("Error fetching user: " + error.message);
    } finally {
      setUserLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (userLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar user={user} setView={setView} />

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <Navbar user={user} />

        <div className="p-6 overflow-auto">
          {view === "dashboard" && <UserDashboard />}
          {view === "users" && user.role === "admin" && <AdminUsers />}
          {view === "all-audio" && user.role === "admin" && <AdminAudio />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
