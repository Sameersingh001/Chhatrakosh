import React, { useEffect, useState } from "react";
import axios from "axios";
import CountUp from "react-countup";
import { Link } from "react-router-dom";
import {
  Users,
  BookOpen,
  Calendar,
  ClipboardList,
} from "lucide-react";

const StatCard = ({ icon: Icon, title, value, color }) => (
  <div className="bg-white shadow rounded-2xl p-6 flex items-center gap-4 hover:shadow-lg transition">
    <div className={`p-4 rounded-xl ${color}`}>
      {Icon && <Icon className="w-6 h-6 text-white" />}
    </div>
    <div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-2xl font-bold">
        <CountUp start={0} end={value} duration={2} />
      </p>
    </div>
  </div>
);

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [message, setMessage] = useState("");
  const [stats, setStats] = useState({
    studentsAssigned: 0,
    homeworkGiven: 0,
    homeworkSubmitted: 0,
    attendanceTaken: 0,
  });

  const [reports, setReports] = useState({
    recentHomework: [],
    recentAttendance: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1️⃣ Students
        const studentsRes = await axios.get("/api/teacher/students", {withCredentials: true});
        setStats((prev) => ({
          ...prev,
          studentsAssigned: studentsRes.data?.length || 0,
        }));

        // 2️⃣ Homework
        const homeworkRes = await axios.get("/api/teacher/homework");
        setStats((prev) => ({
          ...prev,
          homeworkGiven: homeworkRes.data?.given || 0,
          homeworkSubmitted: homeworkRes.data?.submitted || 0,
        }));
        setReports((prev) => ({
          ...prev,
          recentHomework: homeworkRes.data?.list?.slice(0, 5) || [],
        }));

        // 3️⃣ Attendance
        const attendanceRes = await axios.get("/api/teacher/attendance");
        setStats((prev) => ({
          ...prev,
          attendanceTaken: attendanceRes.data?.length || 0,
        }));
        setReports((prev) => ({
          ...prev,
          recentAttendance: attendanceRes.data?.slice(0, 5) || [],
        }));

        setMessage("✅ Teacher Dashboard data loaded successfully");
      } catch (error) {
        console.error("❌ API fetch error:", error.response?.data || error.message);
        setMessage("⚠️ Some teacher data might be missing");
      }
    };

    fetchData();
  }, []);

  return (
    <main className="flex-1 p-6 bg-gray-50">
      {message && <p className="mb-4 text-sm text-gray-600">{message}</p>}
      <h1 className="text-2xl font-bold mb-6">Teacher Dashboard 📚</h1>

      {/* 🔹 Menu Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeTab === "dashboard"
              ? "bg-indigo-500 text-white"
              : "bg-white shadow hover:bg-gray-100"
          }`}
        >
          📊 Dashboard
        </button>
        <button
          onClick={() => setActiveTab("homework")}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeTab === "homework"
              ? "bg-indigo-500 text-white"
              : "bg-white shadow hover:bg-gray-100"
          }`}
        >
          📝 Homework
        </button>
        <button
          onClick={() => setActiveTab("attendance")}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeTab === "attendance"
              ? "bg-indigo-500 text-white"
              : "bg-white shadow hover:bg-gray-100"
          }`}
        >
          📅 Attendance
        </button>

      </div>

      {/* 🔹 Content */}
      {activeTab === "dashboard" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
         <Link to="/teacher/dashboard/all-students"><StatCard icon={Users} title="Students" value={stats.studentsAssigned} color="bg-blue-500" /></Link> 
          <StatCard icon={BookOpen} title="Homework Given" value={stats.homeworkGiven} color="bg-purple-500" />
          <StatCard icon={ClipboardList} title="Homework Submitted" value={stats.homeworkSubmitted} color="bg-green-500" />
          <StatCard icon={Calendar} title="Attendance Taken" value={stats.attendanceTaken} color="bg-yellow-500" />
        </div>
      )}

      {activeTab === "homework" && (
        <section>
          <h2 className="text-xl font-bold mb-4">📝 Recent Homework</h2>
          <div className="bg-white shadow rounded-xl p-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="p-2">Title</th>
                  <th className="p-2">Deadline</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {reports.recentHomework.length > 0 ? (
                  reports.recentHomework.map((hw, idx) => (
                    <tr key={idx} className="border-b last:border-0">
                      <td className="p-2">{hw.title}</td>
                      <td className="p-2">{hw.deadline}</td>
                      <td className="p-2">{hw.status}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="p-2 text-center text-gray-500">
                      No homework records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === "attendance" && (
        <section>
          <h2 className="text-xl font-bold mb-4">📅 Recent Attendance</h2>
          <div className="bg-white shadow rounded-xl p-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="p-2">Date</th>
                  <th className="p-2">Present</th>
                  <th className="p-2">Absent</th>
                </tr>
              </thead>
              <tbody>
                {reports.recentAttendance.length > 0 ? (
                  reports.recentAttendance.map((att, idx) => (
                    <tr key={idx} className="border-b last:border-0">
                      <td className="p-2">{att.date}</td>
                      <td className="p-2">{att.present}</td>
                      <td className="p-2">{att.absent}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="p-2 text-center text-gray-500">
                      No attendance records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  );
}
