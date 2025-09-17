import React, { useEffect, useState } from "react";
import axios from "axios";

const TeacherLeavesPage = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaves = async () => {
    try {
      const res = await axios.get("/api/teacher/leaves", { withCredentials: true });
      setLeaves(res?.data || []);
    } catch (err) {
      console.error("Failed to fetch leaves:", err?.response?.data || err?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (leaveId, status) => {
    const confirmUpdate = window.confirm(`Are you sure you want to mark this leave as "${status}"?`);
    if (!confirmUpdate) return;

    try {
      await axios.post(`/api/teacher/leaves/${leaveId}`, { status }, { withCredentials: true });
      setLeaves(prev =>
        prev.map(l => (l?._id === leaveId ? { ...l, teacherStatus: status } : l))
      );
    } catch (err) {
      console.error("Failed to update leave:", err?.response?.data || err?.message);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  if (loading)
    return (
      <p className="text-center text-gray-500 mt-20 text-lg animate-pulse">
        Loading leaves...
      </p>
    );

  if (leaves?.length === 0)
    return (
      <p className="text-center text-gray-500 text-lg md:text-xl mt-20">
        No leave requests available.
      </p>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-indigo-600 text-center md:text-left">
        Student Leave Requests
      </h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow-md overflow-hidden">
          <thead className="bg-indigo-100 text-indigo-700">
            <tr>
              <th className="py-3 px-4 text-left text-sm md:text-base">Student</th>
              <th className="py-3 px-4 text-left text-sm md:text-base">Class</th>
              <th className="py-3 px-4 text-left text-sm md:text-base">Duration</th>
              <th className="py-3 px-4 text-left text-sm md:text-base">Reason</th>
              <th className="py-3 px-4 text-left text-sm md:text-base">Teacher Status</th>
              <th className="py-3 px-4 text-left text-sm md:text-base">Admin Status</th>
              <th className="py-3 px-4 text-left text-sm md:text-base">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {leaves.map(leave => (
              <tr key={leave?._id} className="hover:bg-gray-50 transition">
                <td className="py-3 px-4 text-gray-800">
                  {leave?.studentId?.name} <span className="text-gray-500">({leave?.studentId?.rollNo})</span>
                </td>
                <td className="py-3 px-4 text-gray-600">{leave?.studentId?.className}</td>
                <td className="py-3 px-2 text-gray-600">
                    <div className="flex flex-col">
                  <p className="text-sm">{leave?.startDate} </p> 
                  <span className="text-sm text-center">To</span>
                  <p className="text-sm">{leave?.endDate} </p>
                    </div>
                </td>
                <td className="py-3 px-4 text-gray-600 max-w-xs break-words">{leave?.reason}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 text-xs md:text-sm rounded-full font-medium ${
                      leave?.teacherStatus === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : leave?.teacherStatus === "Recommended"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {leave?.teacherStatus || "Pending"}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 text-xs md:text-sm rounded-full font-medium ${
                      leave?.adminStatus === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : leave?.adminStatus === "Recommended"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {leave?.adminStatus || "Pending"}
                  </span>
                </td>
                <td className="py-3 px-4 flex gap-2">
                  {leave?.teacherStatus === "Pending" && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(leave?._id, "Recommended")}
                        className="bg-green-500 text-white px-3 py-1 rounded shadow hover:bg-green-600 transition text-sm md:text-base"
                      >
                        Recommend
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(leave?._id, "Rejected")}
                        className="bg-red-500 text-white px-3 py-1 rounded shadow hover:bg-red-600 transition text-sm md:text-base"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherLeavesPage;
