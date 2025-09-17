import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Avtar from "../assets/Avtar.png";

const BASE_URL = import.meta.env.VITE_APP_URL;

const StudentDetailPage = ({role}) => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await axios.get(`/api/students/${role}/${id}`, {
          withCredentials: true,
        });
        setStudent(res.data?.Student);
      } catch (err) {
        console.error("❌ Failed to fetch student:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [role, id]);

  // Toggle Active/Inactive
const handleToggleStatus = async () => {
  try {
    const res = await axios.post(
      `/api/admin/student/${id}/toggle-status`,
      {},
      { withCredentials: true }
    );

    // Update state directly with returned status
    setStudent((prev) => ({ ...prev, status: res.data?.status }));

    alert(res.data.message); // or use toast()
  } catch (err) {
    console.error("❌ Failed to toggle status:", err);
    alert("Failed to update account status");
  }
};


  // Delete Student
  const handleDelete = async () => {
    const confirmDelete = window.confirm("Do you want to delete this student?");
    if (!confirmDelete) return;
    window.location.href = "/admin/dashboard/AllStudents";

    try {
      await axios.post(`/api/delete/student/${id}`, {}, { withCredentials: true });
      alert("✅ Student deleted successfully!");
    } catch (error) {
      alert("❌ Failed to delete student.", error);
    }
  };

  if (loading) return <div className="p-6 text-gray-500">Loading...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-indigo-700">
          🎓 Student Profile
        </h1>
        <div className="flex gap-3">
          <button
            onClick={handleToggleStatus}
            className={`px-5 py-2 rounded-xl font-semibold shadow transition 
              ${student.status === "active"
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-green-500 hover:bg-green-600 text-white"
              }`}
          >
            {student.status === "active" ? "Deactivate" : "Activate"}
          </button>
          <button
            onClick={handleDelete}
            className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold shadow"
          >
            🗑 Delete
          </button>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white shadow-xl rounded-2xl p-8 flex flex-col md:flex-row gap-10 border-t-4 border-indigo-500">
        {/* Avatar + Status */}
        <div className="flex flex-col items-center gap-4">
          <img
            src={student?.photo ? `${BASE_URL}${student?.photo}` : Avtar}
            alt={student?.name}
            className="w-40 h-40 rounded-full border-4 border-indigo-500 object-cover shadow-lg"
          />
          <span
            className={`px-4 py-1 text-sm font-semibold rounded-full shadow 
              ${student?.status === "active"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
              }`}
          >
            {student?.status}
          </span>
        </div>

        {/* Info Section */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4 text-gray-700">
          <h2 className="col-span-2 text-2xl font-bold text-gray-900 mb-4">
            {student?.name}
          </h2>
          <p>📧 <span className="font-semibold">Email:</span> {student?.email}</p>
          <p>📞 <span className="font-semibold">Phone:</span> {student?.phone}</p>
          <p>📚 <span className="font-semibold">Semester:</span> {student?.semester}</p>
          <p>🆔 <span className="font-semibold">Roll No:</span> {student?.rollNo}</p>
          <p>🏫 <span className="font-semibold">Class:</span> {student?.className}</p>
          <p>📅 <span className="font-semibold">DOB:</span> 
            {student?.dob ? new Date(student.dob).toLocaleDateString() : "N/A"}
          </p>
          <p>🚻 <span className="font-semibold">Gender:</span> {student?.gender}</p>
          <p>📍 <span className="font-semibold">Address:</span> {student?.address}</p>
          <p>👨‍👩‍👦 <span className="font-semibold">Parent:</span> {student?.parentName}</p>
          <p>📞 <span className="font-semibold">Parent Phone:</span> {student?.parentPhone}</p>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailPage;
