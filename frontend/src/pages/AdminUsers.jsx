import { useState, useEffect } from "react";

// import functions
import { fetchAllUsers } from "../services/userService";
import { deleteUserAccount } from "../services/userService";

// import UI components
import DeleteButton from "../components/buttons/DeleteButton";

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

  const onDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUserAccount(userId);
        setUsers((prev) => prev.filter((user) => user.id !== userId));
      } catch (error) {
        setError("Error deleting user: " + error.message);
      }
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

              <DeleteButton onClick={() => onDeleteUser(u.id)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
