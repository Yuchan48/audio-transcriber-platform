import { useState, useEffect } from "react";

import { toast } from "react-hot-toast";

// import functions
import { fetchAllUsers } from "../../services/userService";
import { deleteUserAccount } from "../../services/userService";

// import UI components
import DeleteButton from "../../components/buttons/DeleteButton";

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

  if (loading) {
    return <p>Loading users...</p>;
  }
  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

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

      {error && <p className="text-red-500">{error}</p>}

      {users.length === 0 ? (
        <p className="text-gray-500 text-center">No users found.</p>
      ) : (
        <div className="bg-white border rounded divide-y">
          {users.map((u) => (
            <div
              key={u.id}
              className="flex justify-between items-center p-3 hover:bg-gray-50 transition"
            >
              <div>
                <p>{u.email}</p>
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
