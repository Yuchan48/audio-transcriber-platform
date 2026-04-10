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

  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    <div className="flex h-screen w-full  bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed md:static z-50
          h-full w-64 bg-gray-900 text-white p-4
          transform transition-transform duration-200
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <Sidebar
          user={user}
          setView={(v) => {
            setView(v);
            setSidebarOpen(false);
          }}
        />
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <Navbar user={user} onMenuClick={() => setSidebarOpen(true)} />

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
