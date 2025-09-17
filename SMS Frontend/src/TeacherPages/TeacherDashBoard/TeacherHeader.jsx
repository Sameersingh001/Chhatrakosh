import React from "react";
import axios from "axios";
import { LogOut, User } from "lucide-react";
import { Link } from "react-router-dom";
import Avtar from "../../assets/Avtar.png"


export default function TeacherHeader({ teacherData }) {
  const BASE_URL = import.meta.env.VITE_APP_URL

  const handleLogout = async (e) => {
    e.preventDefault();

    // ✅ Ask for confirmation before logging out
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (!confirmLogout) return;

    try {
      await axios.post("/api/teacher/logout", {}, { withCredentials: true }); // empty body + config
      localStorage.removeItem("SMS_teacherId");
      alert("✅ You have been logged out.");
      window.location.href = "/teacher/login";
    } catch (error) {
      alert(error.response?.data?.message || "❌ Error during logout. Please try again.");
    }
  };

  return (
    <header className="flex items-center justify-between bg-white shadow-md px-6 py-3">
      {/* Left side: Logo or Title */}
      <h1 className="text-xl font-bold text-gray-700">Teacher Dashboard</h1>

      {/* Right side: Admin Data */}
      <div className="flex items-center gap-4">

        {/* Admin Info */}
        <Link to="/teacher/dashboard/profile">
          <div className="flex items-center gap-2">
            <img
              src={teacherData?.image ? `${BASE_URL}${teacherData.image}` : Avtar}
              alt="Teacher Avatar"
              className="w-10 h-10 rounded-full"
            />          
            <div className="text-sm">
              <p className="font-semibold">{teacherData?.name || "Admin"}</p>
              <p className="text-gray-500">{teacherData?.role || "Super Admin"}</p>
            </div>
          </div>
        </Link>

        <Link to="/teacher/dashboard/new-student">
          <button className="px-6 py-2 bg-green-400 font-bold text-white rounded-xl"> ➕ New Student </button>
        </Link>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 cursor-pointer"
        >
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>
    </header>
  );
}
