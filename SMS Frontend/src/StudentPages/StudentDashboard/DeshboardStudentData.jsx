import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import CountUp from "react-countup";
import { Users, BookOpen, FileMinus, MessageSquare, Megaphone } from "lucide-react";

// StatCard component
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

export default function StudentDashboard({ studentData }) {
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard"); // default is dashboard
  const [stats, setStats] = useState({
    myClasses: 0,
    homeworkAssigned: 0,
    leaveRequests: 0,
    complaints: 0,
    digitalNotices: 0,
  });

  const [reports, setReports] = useState({
    recentHomework: [],
    recentLeaves: [],
    recentComplaints: [],
    recentNotices: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!studentData?._id) return;

      try {
        // Leaves
        const leavesRes = await axios.get(`/api/student/${studentData._id}/my-leaves`);
        setStats((p) => ({ ...p, leaveRequests: leavesRes.data.leaves?.length || 0 }));
        setReports((p) => ({
          ...p,
          recentLeaves: leavesRes.data.leaves?.slice(0, 5) || [],
        }));

                // Digital Notices
        const noticesRes = await axios.get("/api/student/notices");
        setStats((p) => ({ ...p, digitalNotices: noticesRes.data.notices.length || 0 }));
        setReports((p) => ({
          ...p,
          recentNotices: noticesRes.data.notices.slice(0, 5) || [],
        }));

        // Homework (only assigned, not submitted anymore)
        const homeworkRes = await axios.get("/api/student/homework");
        setStats((p) => ({
          ...p,
          homeworkAssigned: homeworkRes.data?.assigned || 0,
        }));
        setReports((p) => ({
          ...p,
          recentHomework: homeworkRes.data?.list?.slice(0, 5) || [],
        }));

        // Complaints
        const complaintsRes = await axios.get("/api/student/complaints");
        setStats((p) => ({ ...p, complaints: complaintsRes.data?.length || 0 }));
        setReports((p) => ({
          ...p,
          recentComplaints: complaintsRes.data?.slice(0, 5) || [],
        }));



        setMessage("✅ Dashboard data loaded successfully");
      } catch (error) {
        console.error("❌ API fetch error:", error.response?.data || error.message);
        setMessage("⚠️ Some student data might be missing");
      }
    };

    fetchData();
  }, [studentData]);

  if (!studentData?._id) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-gray-600 text-lg">Loading student dashboard...</p>
      </div>
    );
  }

  return (
    <main className="flex-1 bg-gray-50">
      {/* Tabs fixed at top */}
      <div className="sticky top-0 z-10 bg-gray-50 p-4 shadow mb-4 flex gap-4">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeTab === "dashboard" ? "bg-indigo-500 text-white" : "bg-white shadow hover:bg-gray-100"
          }`}
        >
          📊 Dashboard
        </button>
        <button
          onClick={() => setActiveTab("leaves")}
          className={`px-4 py-2 rounded-lg cursor-pointer font-medium ${
            activeTab === "leaves" ? "bg-indigo-500 text-white" : "bg-white shadow hover:bg-gray-100"
          }`}
        >
          ✈️ Leaves
        </button>
        <button
          onClick={() => setActiveTab("complaints")}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeTab === "complaints" ? "bg-indigo-500 text-white" : "bg-white shadow hover:bg-gray-100"
          }`}
        >
          📢 Complaints
        </button>
        <button
          onClick={() => setActiveTab("notices")}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeTab === "notices" ? "bg-indigo-500 text-white" : "bg-white shadow hover:bg-gray-100"
          }`}
        >
          📜 Digital Notices
        </button>
      </div>

      <div className="p-6">
        {message && <p className="mb-4 text-sm text-gray-600">{message}</p>}

        {/* Dashboard Stats */}
        {activeTab === "dashboard" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatCard icon={Users} title="My Class Students" value={stats.myClasses} color="bg-blue-500" />
            <StatCard icon={BookOpen} title="Homework Assigned" value={stats.homeworkAssigned} color="bg-purple-500" />
            <Link to="/student/dashboard/request-leaves">
              <StatCard icon={FileMinus} title="Leave Requests" value={stats.leaveRequests} color="bg-indigo-500" />
            </Link>
            <StatCard icon={MessageSquare} title="Complaints" value={stats.complaints} color="bg-pink-500" />
            <Link to="/student/dashboard/digital-notice">
            <StatCard icon={Megaphone} title="Digital Notices" value={stats.digitalNotices} color="bg-yellow-500" />
            </Link>
          </div>
        )}

        {/* Leaves */}
        {activeTab === "leaves" && (
          <ReportTable
            title="Recent Leaves"
            data={reports.recentLeaves}
            columns={["Reason", "Start Date", "End Date", "Teacher Status", "Admin Status"]}
            rowKeys={["reason", "startDate", "endDate", "teacherStatus", "adminStatus"]}
            emptyMsg="No leaves found"
          />
        )}

        {/* Complaints */}
        {activeTab === "complaints" && (
          <ReportTable
            title="Recent Complaints"
            data={reports.recentComplaints}
            columns={["Title", "Date", "Status"]}
            rowKeys={["title", "date", "status"]}
            emptyMsg="No complaints found"
          />
        )}

        {/* Digital Notices */}
        {activeTab === "notices" && (
          <ReportTable
            title="Recent Digital Notices"
            data={reports.recentNotices}
            columns={["Title", "Date", "Posted By"]}
            rowKeys={["title", "date", "role"]}
            emptyMsg="No notices found"
            />
        )}
      </div>
    </main>
  );
}

// Generic table component
const ReportTable = ({ title, data, columns, rowKeys, emptyMsg }) => (
  <div className="mb-6">
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <div className="bg-white shadow rounded-xl p-4 overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            {columns.map((col, idx) => (
              <th key={idx} className="p-2">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, idx) => (
              <tr key={idx} className="border-b last:border-0">
                {rowKeys.map((key) => (
                  <td key={key} className="p-2 break-words">
                    {/* Check if the key is 'date' and format it */}
                    {key === "date"
                      ? new Date(row[key]).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : row[key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="p-2 text-center text-gray-500">
                {emptyMsg}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);
