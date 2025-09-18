import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import CountUp from "react-countup";
import {
  Users,
  BookOpen,
  ClipboardList,
  FileMinus,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

// ✅ StatCard Component
const StatCard = ({ icon: Icon, title, value, color }) => (
  <div className="bg-white shadow rounded-2xl p-6 flex items-center gap-4 hover:shadow-lg transition">
    <div
      className={`p-4 rounded-full ${color} text-white shadow-md flex items-center justify-center`}
    >
      {Icon && <Icon size={32} />}
    </div>
    <div>
      <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
      <p className="text-3xl font-bold text-gray-900">
        <CountUp end={value} duration={2} separator="," />
      </p>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    teachers: 0,
    students: 0,
    attendance: 0,
    leave: 0,
  });
  const [leaveData, setLeaveData] = useState([]);
  const [message, setMessage] = useState("");

  const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EF4444", "#3B82F6"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const teachersRes = await axios.get("/api/teachers");
        const studentsRes = await axios.get(`/api/admin/students`, {
          withCredentials: true,
        });
        const leavesRes = await axios.get(`/api/admin/leaves`, {
          withCredentials: true,
        });

        setStats({
          teachers: teachersRes.data.length,
          students: studentsRes.data.length,
          attendance: 0, // TODO: Replace with real API
          leave: leavesRes.data.length,
        });

        // ✅ Group leaves by startDate
        const leaveCounts = {};
        leavesRes.data.forEach((leave) => {
          const date = leave.startDate;
          leaveCounts[date] = (leaveCounts[date] || 0) + 1;
        });

        // Convert to recharts format + sort dates
        const dailyLeaveData = Object.keys(leaveCounts)
          .map((date) => ({
            date,
            leave: leaveCounts[date],
          }))
          .sort((a, b) => new Date(a.date) - new Date(b.date));

        setLeaveData(dailyLeaveData);

        setMessage("✅ Dashboard data fetched successfully");
      } catch (error) {
        console.error("❌ Error fetching dashboard data:", error);
        setMessage("⚠️ Only teacher data available");
      }
    };

    fetchData();
  }, []);

  // ✅ Pie data for distribution (homework removed)
  const pieData = [
    { name: "Teachers", value: stats.teachers },
    { name: "Students", value: stats.students },
    { name: "Attendance", value: stats.attendance },
    { name: "Leaves", value: stats.leave },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">📊 Dashboard</h1>

      {/* Message */}
      {message && (
        <p className="mb-4 text-sm text-gray-600 bg-blue-50 p-2 rounded-lg shadow-sm">
          {message}
        </p>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Link to= "/admin/dashboard/AllTeachers">
        <StatCard
          icon={Users}
          title="Total Teachers"
          value={stats.teachers}
          color="bg-indigo-500"
          />
        </Link>
        <Link to="/admin/dashboard/AllStudents">
        <StatCard
          icon={BookOpen}
          title="Total Students"
          value={stats.students}
          color="bg-green-500"
          />
        </Link>
        <Link>
        <StatCard
          icon={ClipboardList}
          title="Attendance"
          value={stats.attendance}
          color="bg-yellow-500"
          />
        </Link>
        <Link to="/admin/dashboard/leave">
        <StatCard
          icon={FileMinus}
          title="Leaves"
          value={stats.leave}
          color="bg-red-500"
          />
        </Link>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <div className="bg-white shadow rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">Overall DATA 📂</h2>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={120}
                fill="#8884d8"  
                label
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-white shadow rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">Daily Leave Trends 📅</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={leaveData}
              margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="leave" fill="#6366F1" barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
