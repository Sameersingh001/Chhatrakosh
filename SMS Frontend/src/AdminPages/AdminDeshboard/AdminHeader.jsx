import React from "react";
import axios from "axios";
import { LogOut, UserPlus, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";
import Avtar from "../../assets/Avtar.png";

export default function AdminHeader({ adminData }) {
  const BASE_URL = import.meta.env.VITE_APP_URL;

  const handleLogout = async (e) => {
    e.preventDefault();

    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (!confirmLogout) return;

    try {
      await axios.post("/api/admin/logout", {}, { withCredentials: true });
      localStorage.removeItem("SMS_adminId");
      alert("✅ You have been logged out.");
      window.location.href = "/admin/login";
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "❌ Error during logout. Please try again."
      );
    }
  };

  return (
    <header className="flex items-center justify-between bg-white shadow-sm px-6 py-3 border-b">
      {/* Left side: Logo or Title */}
      <h1 className="text-xl font-bold text-gray-800 tracking-wide">
        ChhatraKosh Admin 🔏
      </h1>

      {/* Right side */}
      <div className="flex items-center gap-6">
        {/* Admin Info */}
        <Link to="/admin/dashboard/profile">
          <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition">
            <img
              src={adminData?.image ? `${BASE_URL}${adminData?.image}` : Avtar}
              alt="Admin Avatar"
              className="h-12 w-12 rounded-full border object-cover"
            />
            <div className="text-sm">
              <p className="font-semibold text-gray-700">
                {adminData?.name || "Admin"}
              </p>
              <p className="text-gray-500 text-xs">
                {adminData?.role || "Super Admin"}
              </p>
            </div>
          </div>
        </Link>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Link to="/admin/dashboard/teachers/register">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-blue-600 transition">
              <UserPlus className="w-4 h-4" /> Add Teacher
            </button>
          </Link>

          <Link to="/admin/dashboard/student/new-student">
            <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-green-600 transition">
              <GraduationCap className="w-4 h-4" /> Add Student
            </button>
          </Link>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-red-600 transition"
        >
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>
    </header>
  );
}
