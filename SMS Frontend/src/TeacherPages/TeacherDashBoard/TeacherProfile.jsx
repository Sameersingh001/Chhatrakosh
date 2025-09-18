import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Mail,
  User,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  BookOpen,
  Lock,
  Eye,
  EyeOff,
  BookMarked,
  CheckCircle,
  XCircle,
  X,
  Upload 
} from "lucide-react";
import Avtar from "../../assets/Avtar.png";

const BASE_URL = import.meta.env.VITE_APP_URL;

// ---------------- Change Password Modal ----------------
const ChangePasswordModal = ({ teacherId, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.post(`/api/teacher/${teacherId}/changePassword`, {
        currentPassword,
        newPassword,
        confirmPassword,
      });

      if (res.data?.message) {
        setSuccess(res.data.message);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 animate-fadeIn">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Change Password
        </h2>

        <p className="text-gray-600 text-sm mb-4 text-center">
          Your new password must be at least <b>8 characters</b> long and
          include: <br />✔ Uppercase, ✔ Lowercase, ✔ Number, ✔ Special character
        </p>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-2">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Password */}
          <div className="relative">
            <input
              type={showCurrent ? "text" : "password"}
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 pr-10 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              required
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
            >
              {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* New Password */}
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 pr-10 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              required
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
            >
              {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 pr-10 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? "Saving..." : "Change Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const EditTeacherForm = ({ teacher, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: teacher?.name || "",
    username: teacher?.username || "",
    qualification: teacher?.qualification || "",
    phone: teacher?.phone || "",
    address: teacher?.address || "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(`${BASE_URL}${teacher?.image}` || Avtar);
  const [loading, setLoading] = useState(false);

  // Handle text input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image input
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file)); // preview new image
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });
      if (image) {
        data.append("image", image);
      }

      const res = await axios.post(`/api/teachers/${teacher._id}`, data, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      window.location.reload()

      onSave(res.data.teacher);
      onClose();
    } catch (err) {
      console.error("Error updating teacher:", err);
      alert("Failed to update teacher.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 relative animate-fadeIn">
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-red-600 transition"
          onClick={onClose}
        >
          <X size={22} />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">
          ✏️ Edit Teacher Profile
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 max-h-[70vh] overflow-y-auto pr-2"
        >
          {/* Image Upload with Preview */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative w-28 h-28">
              <img
                src={teacher?.image ? preview : `${BASE_URL}${teacher?.image}`}
                alt="Profile Preview"
                className="w-28 h-28 rounded-full object-cover border shadow-md"
              />
              <label className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full cursor-pointer shadow hover:bg-indigo-700 transition">
                <Upload size={16} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-xs text-gray-500">Click icon to upload new image</p>
          </div>

          {/* Personal Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              placeholder="Qualification"
              className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
              className="border rounded-lg px-3 py-2 w-full md:col-span-2 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-gray-300 text-gray-700 rounded-lg shadow hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 disabled:opacity-50 transition"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};



// ---------------- Teacher Profile ----------------
const TeacherProfile = ({ teacher }) => {
  const [teacherData, setTeacherData] = useState(teacher);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    if (teacher) setTeacherData(teacher);
  }, [teacher]);

  if (!teacherData) {
    return <p className="text-center text-gray-500">Loading teacher data...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden relative">
      {/* Header Banner */}
      <div className="relative bg-gradient-to-r from-indigo-500 to-purple-600 h-32">
        <div className="absolute -bottom-12 left-6">
          <div className="w-28 h-28 rounded-full border-4 border-white shadow-lg overflow-hidden">
            <img
              src={
                teacherData?.image ? `${BASE_URL}${teacherData.image}` : Avtar
              }
              alt={teacherData?.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="absolute top-4 right-4 flex gap-3">
        <button
          onClick={() => setIsEditing(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700"
        >
          Edit Profile
        </button>
        <button
          onClick={() => setIsChangingPassword(true)}
          className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 flex items-center gap-1"
        >
          <Lock size={16} /> Change Password
        </button>
      </div>

      <div className="p-6 mt-12">
        <h1 className="text-2xl font-bold text-gray-800">
          {teacherData.name}
        </h1>
        <p className="text-gray-600">{teacherData.designation}</p>
        <p className="text-gray-600">{teacherData.department}</p>

        {/* Main Info */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <div className="flex items-center gap-2">
            <Mail className="text-indigo-500" />
            <span>{teacherData.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="text-indigo-500" />
            <span>{teacherData.username}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={18} className="text-indigo-500" />
            <span>{teacherData.phone || "N/A"}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={18} className="text-indigo-500" />
            <span>{teacherData.address || "Not Provided"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Briefcase size={18} className="text-indigo-500" />
            <span>{teacherData.collegeName}</span>
          </div>
          <div className="flex items-center gap-2">
            <GraduationCap size={18} className="text-indigo-500" />
            <span>{teacherData.qualification}</span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-indigo-500" />
            <span>
              {teacherData.dateOfJoining
                ? new Date(teacherData.dateOfJoining).toLocaleDateString("en-IN")
                : "N/A"}
            </span>
          </div>
        </div>

        {/* Extra Info */}
        <div className="mt-8 p-5 bg-gray-50 rounded-xl shadow-inner">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Additional Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            {/* Subjects */}
            <div className="flex items-center gap-3">
              <BookMarked className="text-indigo-500" />
              <span>
                Subjects:{" "}
                {teacherData.subjects?.length > 0
                  ? teacherData.subjects
                      .map(
                        (sub) =>
                          `${sub.subjectName} (${sub.course}, Sem ${sub.semester})`
                      )
                      .join(", ")
                  : "Not Assigned"}
              </span>
            </div>

            {/* Status */}
            <div className="flex items-center gap-3">
              {teacherData?.isActive ? (
                <CheckCircle className="text-green-500" />
              ) : (
                <XCircle className="text-red-500" />
              )}
              <span>
                Status: {teacherData?.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal (your existing one, unchanged) */}
      {isEditing && (
        <EditTeacherForm
          teacher={teacherData}
          onClose={() => setIsEditing(false)}
          onSave={(updated) => setTeacherData(updated)}
        />
      )}

      {/* Change Password Modal */}
      {isChangingPassword && (
        <ChangePasswordModal
          teacherId={teacherData._id}
          onClose={() => setIsChangingPassword(false)}
        />
      )}
    </div>
  );
};

export default TeacherProfile;
