import React from "react";
import axios from "axios";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  ClipboardList,
  CalendarDays,
  BookOpen,
  Bell,
  FilePlus2,
  Settings,
  LogOut,
  AlertCircle, // 👈 new icon for complaints
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

export default function TeacherMenu() {
  const handleSubmit = async (e) => {
    e.preventDefault();

    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (!confirmLogout) return;

    try {
      await axios.post("/api/teacher/logout", {}, { withCredentials: true });
      localStorage.removeItem("SMS_teacherId");
      alert("✅ You have been logged out.");
      window.location.href = "/teacher/login";
    } catch (error) {
      alert(error.response?.data?.message || "❌ Error during logout. Please try again.");
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
          <p className="font-semibold leading-none text-white">Teacher Panel</p>
          <p className="text-xs text-gray-100">Manage Classes & Students</p>
        </div>
      </div>

      {/* Nav Links */}
      <div className="flex flex-col gap-2 text-white">
        <Link to="/teacher/dashboard">
          <SidebarLink icon={LayoutDashboard} label="Dashboard" active />
        </Link>
        <Link to="/teacher/dashboard/all-students">
          <SidebarLink icon={Users} label="My Students" />
        </Link>
        <Link to="/teacher/attendance">
          <SidebarLink icon={CalendarDays} label="Attendance" />
        </Link>
        <Link to="/teacher/dashboard/student-leaves">
          <SidebarLink icon={ClipboardList} label="Student Leaves" />
        </Link>
        <Link to="/teacher/homework">
          <SidebarLink icon={BookOpen} label="Homework" />
        </Link>
        <Link to="/teacher/classes">
          <SidebarLink icon={GraduationCap} label="Classes" />
        </Link>
        <Link to="/teacher/notice">
          <SidebarLink icon={Bell} label="Notice" />
        </Link>
        <Link to="/teacher/teacher-notice">
          <SidebarLink icon={FilePlus2} label="Teacher Notice" />
        </Link>
        <Link to="/teacher/complaints">
          <SidebarLink icon={AlertCircle} label="Complaints" />
        </Link>
        <Link to="/teacher/settings">
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
