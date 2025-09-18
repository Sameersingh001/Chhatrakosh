import React from "react";
import axios from "axios";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  ClipboardList,
  CalendarDays,
  BookOpen,
  Settings,
  LogOut,
  Building,
  BellRing,
  MessageSquareWarning, // ✅ new icon for complaints
} from "lucide-react";

import { Link } from "react-router-dom";

const SidebarLink = ({ icon: Icon, label, active = false }) => (
  <div
    className={`flex items-center gap-3 w-full cursor-pointer text-left px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
      active
        ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md"
        : "text-white hover:bg-gray-100 hover:text-indigo-600"
    }`}
  >
    {Icon && <Icon className="h-5 w-5" />}
    <span>{label}</span>
  </div>
);

export default function SMSNav() {
  const handleSubmit = async (e) => {
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
    <aside className="bg-transparent shadow-2xl border-r-4 border-gray-400 p-6 flex flex-col gap-4 h-full w-64">
      {/* Logo / Brand */}
      <div className="flex items-center gap-3 mb-8">
        <div className="size-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 grid place-content-center text-white shadow-md">
          <GraduationCap className="size-5" />
        </div>
        <div>
          <p className="font-semibold leading-none text-white">
            ChhatraKosh Panel
          </p>
          <p className="text-xs text-gray-100">Student Management</p>
        </div>
      </div>

      {/* Nav Links */}
      <div className="flex flex-col gap-2 text-white">
        <Link to="/admin/dashboard">
          <SidebarLink icon={LayoutDashboard} label="Dashboard" active />
        </Link>

        {/* Students & Teachers */}
        <Link to="/admin/dashboard/AllStudents">
          <SidebarLink icon={Users} label="Students" />
        </Link>
        <Link to="/admin/dashboard/AllTeachers">
          <SidebarLink icon={GraduationCap} label="Teachers" />
        </Link>

        {/* Attendance */}
        <Link to="/admin/dashboard/student-attendance">
          <SidebarLink icon={CalendarDays} label="S Attendance" />
        </Link>
        <Link to="/admin/dashboard/teacher-attendance">
          <SidebarLink icon={CalendarDays} label="T Attendance" />
        </Link>

        {/* Single Leave Management */}
        <Link to="/admin/dashboard/leave">
          <SidebarLink icon={ClipboardList} label="Leave" />
        </Link>

        {/* Departments */}
        <Link to="/admin/dashboard/departments">
          <SidebarLink icon={Building} label="Departments" />
        </Link>

        {/* Digital Notice */}
        <Link to="/admin/dashboard/digital-notice">
          <SidebarLink icon={BellRing} label="Digital Notice" />
        </Link>

        {/* ✅ Student Complaints */}
        <Link to="/admin/dashboard/complaints">
          <SidebarLink icon={MessageSquareWarning} label="Complaints" />
        </Link>

        {/* Settings */}
        <Link to="/admin/settings">
          <SidebarLink icon={Settings} label="Settings" />
        </Link>
      </div>

      {/* Footer / Logout */}
      <div className="mt-auto">
        <form onSubmit={handleSubmit}>
          <button
            type="submit"
            className="flex items-center gap-3 w-full text-left px-4 py-2 rounded-xl font-medium transition-all duration-200 text-white hover:bg-gray-100 hover:text-indigo-600 cursor-pointer"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
