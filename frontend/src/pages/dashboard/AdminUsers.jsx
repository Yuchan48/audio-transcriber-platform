import { useState, useEffect } from "react";

import { toast } from "react-hot-toast";

// import functions
import { fetchAllUsers } from "../../services/userService";
import { deleteUserAccount } from "../../services/userService";

// import UI components
import DeleteButton from "../../components/buttons/DeleteButton";
import Spinner from "../../components/icons/Spinner";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchAllUsers();
      setUsers(data);
    } catch (error) {
      setError("Error fetching users: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const onDeleteUser = async (user) => {
    if (
      !window.confirm(
        `Are you sure you want to delete the user "${user.email}"?`,
      )
    )
      return;
    try {
      await deleteUserAccount(user.id);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      toast.success(`User "${user.email}" deleted successfully`);
    } catch (error) {
      setError("Error deleting user: " + error.message);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">All Users</h2>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded text-sm">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[80vh] py-10 text-gray-500">
          <Spinner className="h-6 w-6 mb-2" />
          <p className="text-sm">Loading users...</p>
        </div>
      ) : users.length === 0 ? (
        /* When no users are found */
        <div className="flex flex-col items-center justify-center text-center py-10 text-gray-500 text-lg min-h-[80vh]">
          No users found.
        </div>
      ) : (
        /* User table */
        <div className="bg-white border rounded divide-y">
          {users.map((u) => (
            <div
              key={u.id}
              className="flex justify-between items-center p-3 hover:bg-gray-50 transition"
            >
              <div className="min-w-0">
                <p className="truncate">{u.email}</p>
                <p className="text-xs text-gray-500">{u.role}</p>
              </div>

              {u.role !== "admin" && (
                <DeleteButton onClick={() => onDeleteUser(u)} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
