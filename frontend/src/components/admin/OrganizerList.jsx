// src/pages/admin/OrganizerList.jsx
import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { FaTrash, FaEdit } from "react-icons/fa";
import toast from "react-hot-toast";

const OrganizerList = () => {
  const [organizers, setOrganizers] = useState([]);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  const fetchOrganizers = async () => {
    try {
      const res = await api.get("/organizers");
      setOrganizers(res.data);
    } catch (err) {
      toast.error("Failed to fetch organizers");
    }
  };

  useEffect(() => {
    fetchOrganizers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this organizer?"))
      return;

    try {
      await api.delete(`/organizers/${id}`);
      toast.success("Organizer deleted");
      setOrganizers(organizers.filter((o) => o._id !== id));
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleUpdate = async () => {
    try {
      await api.put(`/organizers/${editing._id}`, formData);
      toast.success("Organizer updated");
      setEditing(null);
      fetchOrganizers();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const startEdit = (org) => {
    setEditing(org);
    setFormData({
      name: org.name,
      email: org.email,
      mobile: org.mobile || "",
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">All Organizers</h2>

      {editing && (
        <div className="mb-6 bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Edit Organizer</h3>
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
              onClick={() => setEditing(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

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
          {organizers.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center p-4">
                No organizers found
              </td>
            </tr>
          ) : (
            organizers.map((org) => (
              <tr key={org._id} className="border-t">
                <td className="p-3">{org.name}</td>
                <td className="p-3">{org.email}</td>
                <td className="p-3">{org.mobile}</td>
                <td className="p-3 space-x-2">
                  <button
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                    onClick={() => startEdit(org)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => handleDelete(org._id)}
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

export default OrganizerList;
