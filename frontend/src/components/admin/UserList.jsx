import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { FaTrash, FaEdit } from "react-icons/fa";
import toast from "react-hot-toast";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await api.get("/users");
      setUsers(response.data);
    } catch (err) {
      toast.error("Failed to fetch users");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await api.delete(`/users/${id}`);
      toast.success("User deleted");
      setUsers(users.filter((user) => user._id !== id));
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  // Update user
  const handleUpdate = async () => {
    try {
      await api.put(`/users/${editingUser._id}`, formData);
      toast.success("User updated");
      setEditingUser(null);
      fetchUsers(); // Refresh
    } catch (err) {
      toast.error("Update failed");
    }
  };

  // Start editing a user
  const startEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      mobile: user.mobile || "",
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">All Users</h2>

      {/* Edit Form */}
      {editingUser && (
        <div className="mb-6  bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Edit User</h3>
          <div className="space-x-2 flex">
            <input
              className="border p-2 w-full"
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <input
              className="border p-2 w-full"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <input
              className="border p-2 w-full"
              type="text"
              placeholder="Mobile"
              value={formData.mobile}
              onChange={(e) =>
                setFormData({ ...formData, mobile: e.target.value })
              }
            />
          </div>
          <div className="mt-3">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
              onClick={handleUpdate}
            >
              Save
            </button>
            <button
              className="bg-gray-400 text-white px-4 py-2 rounded"
              onClick={() => setEditingUser(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* User Table */}
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Mobile No</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center p-4">
                No users found
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user._id} className="border-t">
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.mobile}</td>
                <td className="p-3 space-x-2">
                  <button
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                    onClick={() => startEdit(user)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => handleDelete(user._id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
