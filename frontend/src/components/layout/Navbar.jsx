import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// import functions
import { logout } from "../../services/authService";

export default function Navbar({ onMenuClick }) {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setUser(null);
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex justify-between items-center bg-white shadow px-4 md:px-6 py-3">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button className="md:hidden text-gray-700" onClick={onMenuClick}>
          ☰
        </button>

        <h2 className="text-lg font-semibold">Dashboard</h2>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3 md:gap-4">
        <span className="text-sm text-gray-600 hidden sm:block">
          {user?.email}
        </span>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
