import React from "react";
import axios from "axios";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  BookOpen,
  ClipboardList,
  Settings,
  LogOut,
  MessageSquareWarning, // for complaint
  FileText, // for leave
} from "lucide-react";

import { Link } from "react-router-dom";

const SidebarLink = ({ icon: Icon, label, active = false }) => (
  <div
    className={`flex items-center gap-3 w-full cursor-pointer text-left px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
      active
        ? "bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-md"
        : "text-white hover:bg-gray-100 hover:text-green-600"
    }`}
  >
    {Icon && <Icon className="h-5 w-5" />}
    <span>{label}</span>
  </div>
);

export default function StudentMenu() {
  const handleSubmit = async (e) => {
    e.preventDefault();

    const StudentID = localStorage.getItem("SMS_studentId")

    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (!confirmLogout) return;

    try {
      await axios.post("/api/student/logout", {}, { withCredentials: true });
      localStorage.removeItem("SMS_studentId");
      alert("✅ You have been logged out.");
      window.location.href = "/student/login";
    } catch (error) {
      alert(error.response?.data?.message || "❌ Error during logout. Please try again.");
    }
  };

  return (
    <aside className="bg-transparent shadow-2xl border-r-4 border-gray-400 p-6 flex flex-col gap-4 h-full w-64">
      {/* Logo / Brand */}
      <div className="flex items-center gap-3 mb-8">
        <div className="size-10 rounded-xl bg-gradient-to-r from-green-500 to-blue-500 grid place-content-center text-white shadow-md">
          <Users className="size-5" />
        </div>
        <div>
          <p className="font-semibold leading-none text-white">Student Panel</p>
          <p className="text-xs text-gray-100">Manage Learning & Progress</p>
        </div>
      </div>

      {/* Nav Links */}
      <div className="flex flex-col gap-2 text-white">
        <Link to="/student/dashboard">
          <SidebarLink icon={LayoutDashboard} label="Dashboard" active />
        </Link>
        <Link to="/student/classes">
          <SidebarLink icon={Users} label="My Classes" />
        </Link>
        <Link to="/student/attendance">
          <SidebarLink icon={CalendarDays} label="Attendance" />
        </Link>
        <Link to="/student/homework">
          <SidebarLink icon={BookOpen} label="Homework" />
        </Link>
        <Link to="/student/dashboard/request-leaves">
          <SidebarLink icon={FileText} label="Leave" />
        </Link>
        <Link to="/student/complaint">
          <SidebarLink icon={MessageSquareWarning} label="Complaint" />
        </Link>
        <Link to="/student/settings">
          <SidebarLink icon={Settings} label="Settings" />
        </Link>
      </div>

      {/* Footer / Logout */}
      <div className="mt-auto">
        <form onSubmit={handleSubmit}>
          <button
            type="submit"
            className="flex items-center gap-3 w-full text-left px-4 py-2 rounded-xl font-medium transition-all duration-200 text-white hover:bg-gray-100 hover:text-green-600 cursor-pointer"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
