import React, { useState, useEffect } from "react";
import axios from "axios";
import { LogOut, Edit3, Save, X } from "lucide-react";
import Avtar from "../../assets/Avtar.png";

const AdminProfile = ({ admin }) => {
  const BASE_URL = import.meta.env.VITE_APP_URL;

  const [admindata, setAdminData] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    image: null,
    previewImage: Avtar,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!admin) return;
    setAdminData(admin);
    setFormData({
      username: admin.username || "",
      image: null,
      previewImage: admin.image ? `${BASE_URL}${admin.image}` : Avtar,
    });
    setLoading(false);
  }, [admin, BASE_URL]);

  // Logout
  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to log out?")) return;
    try {
      await axios.post("/api/admin/logout", {}, { withCredentials: true });
      localStorage.removeItem("SMS_adminId");
      window.location.href = "/admin/login";
    } catch (err) {
      alert(err.response?.data?.message || "Error logging out");
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    if (e.target.type === "file") {
      setFormData({
        ...formData,
        image: e.target.files[0],
        previewImage: URL.createObjectURL(e.target.files[0]),
      });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  // Save changes to backend
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!admindata) return;

    try {
      const updateData = new FormData();
      updateData.append("username", formData.username);
      if (formData.image) updateData.append("image", formData.image);

      const res = await axios.post(
        `/api/admin/update/${admindata._id}`,updateData,{ headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }
  
      );

      window.location.reload()

      alert(res.data.message || "Profile updated successfully");

      // Update frontend state with updated admin from backend
      setAdminData(res.data.admin);
      setFormData({
        username: res.data.admin.username,
        image: null,
        previewImage: res.data.admin.image
          ? `${BASE_URL}${res.data.admin.image}`
          : Avtar,
      });
      setIsEditing(false);
    } catch (err) {
      alert(err.response?.data?.message || "Error updating profile");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!admindata) return <p className="text-center mt-10 text-red-500">Admin data not found.</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 flex flex-col items-center text-white">
          <img
            src={formData.previewImage}
            alt="Admin Avatar"
            className="w-28 h-28 rounded-full border-4 border-white shadow-xl object-cover"
          />
          <h2 className="mt-4 text-2xl font-bold">{admindata.name}</h2>
          <p className="text-md mt-1">{admindata.role}</p>
        </div>

        {/* Profile Info */}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-xl shadow-sm">
            <span className="text-indigo-600 font-semibold">💡 ID:</span>
            <span className="text-gray-700">{admindata._id}</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-xl shadow-sm">
            <span className="text-indigo-600 font-semibold">📧 Email:</span>
            <span className="text-gray-700">{admindata.email}</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-xl shadow-sm">
            <span className="text-indigo-600 font-semibold">👤 Username:</span>
            <span className="text-gray-700">{admindata.username}</span>
          </div>

          <button
            onClick={() => setIsEditing(true)}
            className="w-full mt-3 flex items-center justify-center gap-2 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-lg shadow-md transition"
          >
            <Edit3 size={18} /> Edit Profile
          </button>
        </div>

        {/* Logout */}
        <div className="p-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl shadow-lg transition transform hover:-translate-y-1 hover:scale-105"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-96 relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setIsEditing(false)}
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Profile Image
                </label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg cursor-pointer bg-gray-50"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md"
                >
                  <Save size={18} /> Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg shadow-md"
                >
                  <X size={18} /> Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;
