import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";

// import functions
import { deleteUserAccount } from "../../services/userService";

export default function Sidebar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const btnClass =
    "block w-full text-left py-2 px-3 rounded hover:bg-gray-800 transition";

  const onDeleteAccount = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone.",
      )
    ) {
      try {
        await deleteUserAccount();
        toast.success("Account deleted. Redirecting to login page.");
        navigate("/login");
      } catch (error) {
        alert("Error deleting account: " + error.message);
      }
    }
  };

  return (
    <div className="flex flex-col h-full justify-between">
      {/* Top */}
      <div>
        <h1 className="text-xl font-bold mb-6">Audio Transcriber</h1>

        <button className={btnClass} onClick={() => navigate("/dashboard")}>
          My Files
        </button>

        {user?.role === "admin" && (
          <>
            <button
              className={btnClass}
              onClick={() => navigate("/dashboard/users")}
            >
              Users
            </button>

            <button
              className={btnClass}
              onClick={() => navigate("/dashboard/all-audio")}
            >
              All Audio
            </button>
          </>
        )}
      </div>

      {/* Bottom */}
      {user?.role === "user" &&
        user?.email !== import.meta.env.VITE_DEMO_EMAIL && (
          <div className="mt-6 border-t border-gray-700 pt-4">
            <button
              onClick={onDeleteAccount}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded transition"
            >
              Delete Account
            </button>
          </div>
        )}
    </div>
  );
}
