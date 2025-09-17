import React from "react";
import axios from "axios";
import {LogOut} from "lucide-react";
import { Link } from "react-router-dom";
import Avtar from "../../assets/Avtar.png"


export default function StudentHeader({ studentData }) {

  const BASE_URL = import.meta.env.VITE_APP_URL


const handleLogout = async (e) => {
  e.preventDefault();

  // ✅ Ask for confirmation before logging out
  const confirmLogout = window.confirm("Are you sure you want to log out?");
  if (!confirmLogout) return;

  try {
    await axios.post("/api/student/logout", {}, { withCredentials: true }); // empty body + config
    localStorage.removeItem("SMS_studentId");
    alert("✅ You have been logged out.");
    window.location.href = "/student/login";
  } catch (error) {
    alert(error.response?.data?.message || "❌ Error during logout. Please try again.");
  }
};

  return (
    <header className="flex items-center justify-between bg-white shadow-md px-6 py-3">
      {/* Left side: Logo or Title */}
      <h1 className="text-xl font-bold text-gray-700">Student Dashboard</h1>

      {/* Right side: Admin Data */}
      <div className="flex items-center gap-4">

        {/* Admin Info */}
        <Link to="/student/dashboard/profile">
        <div className="flex items-center gap-2 cursor-pointer">
            <img src={studentData?.photo ? `${BASE_URL}${studentData?.photo}` : Avtar} alt="Avtar" className="h-12 w-12 text-gray-600 bg-gray-200 rounded-full p-1" />
          <div className="text-sm">
            <p className="font-semibold">{studentData?.name || "Student Name"}</p>
            <p className="text-gray-500">{studentData?.role || "Student"}</p>
          </div>
        </div>
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
