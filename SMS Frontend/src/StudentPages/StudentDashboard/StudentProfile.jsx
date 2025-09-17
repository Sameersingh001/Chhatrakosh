import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Mail,
  Phone,
  Home,
  UserSquare,
  Calendar,
  MapPin,
  User,
  Users,
  Edit,
} from "lucide-react";
import Avtar from "../../assets/Avtar.png";

const BASE_URL = import.meta.env.VITE_APP_URL;

// ---------------- Edit Student Form ----------------
const EditStudentForm = ({ student, onClose, onSave }) => {
  const [formData, setFormData] = useState({ ...student });
  const [preview, setPreview] = useState(
    student?.photo ? `${BASE_URL}${student?.photo}` : Avtar
  );
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  // handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // handle image change
  const handleFileChange = (e) => {
    const uploaded = e.target.files[0];
    if (uploaded) {
      setFile(uploaded);
      setPreview(URL.createObjectURL(uploaded));
    }
  };

  // handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const form = new FormData();
      Object.keys(formData).forEach((key) => {
        form.append(key, formData[key]);
      });
      if (file) {
        form.append("photo", file);
      }
      const res = await axios.post(`/api/student/${student._id}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data) {
        onSave(res.data);
        onClose();
        window.location.reload()
      }
    } catch (err) {
      console.error(err);
      setError("Failed to update student. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-2xl">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center">
          Edit Student Profile
        </h2>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Profile Image */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-28 h-28 rounded-full border-4 border-blue-200 shadow-md overflow-hidden">
              <img
                src={preview}
                alt="Profile Preview"
                className="w-full h-full object-cover"
              />
            </div>
            <label className="cursor-pointer text-sm text-blue-600 font-medium hover:underline">
              Change Photo
              <input
                type="file"
                accept="photo/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Name */}
          <div className="flex flex-col">
            <label className="text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              className="border rounded-lg px-3 py-2"
              placeholder="Full Name"
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col">
            <label className="text-sm font-medium">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
              className="border rounded-lg px-3 py-2"
              placeholder="Phone"
            />
          </div>

          {/* Address */}
          <div className="flex flex-col">
            <label className="text-sm font-medium">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address || ""}
              onChange={handleChange}
              className="border rounded-lg px-3 py-2"
              placeholder="Address"
            />
          </div>

          {/* Parent Name */}
          <div className="flex flex-col">
            <label className="text-sm font-medium">Parent Name</label>
            <input
              type="text"
              name="parentName"
              value={formData.parentName || ""}
              onChange={handleChange}
              className="border rounded-lg px-3 py-2"
              placeholder="Parent Name"
            />
          </div>

          {/* Parent Phone */}
          <div className="flex flex-col">
            <label className="text-sm font-medium">Parent Phone</label>
            <input
              type="text"
              name="parentPhone"
              value={formData.parentPhone || ""}
              onChange={handleChange}
              className="border rounded-lg px-3 py-2"
              placeholder="Parent Phone"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled = {loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 disabled:opacity-50"
            >
           {loading ? "Saving..." : "Save"}

            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ---------------- Student Profile ----------------

const StudentProfile = ({ student }) => {
  const [studentData, setStudentData] = useState(student);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (student) setStudentData(student);
  }, [student]);

  if (!studentData) {
    return <p className="text-center text-gray-500">Loading student data...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 relative">
      {/* Profile Card */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden relative border border-gray-200">
        {/* Banner */}
        <div className="relative bg-gradient-to-r from-indigo-600 to-purple-500 h-40">
          <div className="absolute -bottom-16 left-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden">
                <img
                  src={studentData?.photo ? `${BASE_URL}${studentData.photo}` : Avtar}
                  alt={studentData?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Status Indicator */}
              <span className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
            </div>
          </div>
        </div>

        {/* Edit Button */}
        <button
          onClick={() => setIsEditing(true)}
          className="absolute top-4 right-4 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg shadow hover:bg-indigo-700 transition"
        >
          <Edit className="inline-block w-4 h-4 mr-1" />
          Edit
        </button>

        {/* Profile Info */}
        <div className="p-8 mt-16">
          <h1 className="text-3xl font-bold text-gray-900">{studentData.name}</h1>
          <p className="text-indigo-600 font-medium">{studentData.role}</p>
          <p className="text-gray-600 mt-1">
            {studentData.className} • Semester {studentData.semester}
          </p>

          {/* Info Sections */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Academic Info */}
            <div className="bg-gray-50 p-5 rounded-xl shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">📘 Academic Info</h2>
              <div className="space-y-3 text-gray-700">
                <p className="flex items-center gap-2">
                  <Users className="text-indigo-500" /> Roll No: {studentData.rollNo}
                </p>
                <p className="flex items-center gap-2">
                  <Calendar className="text-indigo-500" /> 
                  DOB: {studentData?.dob ? new Date(studentData.dob).toLocaleDateString() : "N/A"}
                </p>
                <p className="flex items-center gap-2">
                  <User className="text-indigo-500" /> Gender: {studentData.gender || "N/A"}
                </p>
              </div>
            </div>

            {/* Personal Info */}
            <div className="bg-gray-50 p-5 rounded-xl shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">👨‍👩‍👦 Personal Info</h2>
              <div className="space-y-3 text-gray-700">
                <p className="flex items-center gap-2">
                  <Mail className="text-indigo-500" /> {studentData.email}
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="text-indigo-500" /> {studentData.phone || "N/A"}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="text-indigo-500" /> {studentData.address || "N/A"}
                </p>
                <p className="flex items-center gap-2">
                  <UserSquare className="text-indigo-500" /> Parent: {studentData.parentName || "N/A"}
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="text-indigo-500" /> Parent Phone: {studentData.parentPhone || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <EditStudentForm
          student={studentData}
          onClose={() => setIsEditing(false)}
          onSave={(updated) => setStudentData(updated)}
        />
      )}
    </div>
  );
};


export default StudentProfile;
