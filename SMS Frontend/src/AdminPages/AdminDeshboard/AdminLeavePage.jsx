import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminLeavesPage = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaves = async () => {
    try {
      const res = await axios.get("/api/admin/leaves", { withCredentials: true });
      setLeaves(res?.data || []);
    } catch (err) {
      console.error("Failed to fetch leaves:", err?.response?.data || err?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (leaveId, status) => {
    const confirmUpdate = window.confirm(
      `Are you sure you want to mark this leave as "${status}"?`
    );
    if (!confirmUpdate) return;

    try {
      const res = await axios.post(
        `/api/admin/leave/${leaveId}`,
        { status },
        { withCredentials: true }
      );
      setLeaves(prev => prev.map(l => (l?._id === leaveId ? res.data : l)));
    } catch (err) {
      console.error("Failed to update leave:", err?.response?.data || err?.message);
    }
  };

  const handlePrint = () => {
    const printContent = document.getElementById("leave-table").outerHTML;
    const printWindow = window.open("", "", "width=1200,height=800");
    printWindow.document.write(`
      <html>
        <head>
          <title>Leave Requests</title>
          <style>
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background: #f4f4f4; }
          </style>
        </head>
        <body>
          <h2 style="text-align:center;">Leave Requests Data</h2>
          ${printContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  if (loading)
    return (
      <p className="text-center text-gray-500 mt-20 text-lg animate-pulse">
        Loading leave requests...
      </p>
    );

  if (leaves?.length === 0)
    return (
      <p className="text-center text-gray-500 text-lg md:text-xl mt-20">
        No leave requests found.
      </p>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-indigo-600">
          Admin Leave Approval
        </h1>
        <button
          onClick={handlePrint}
          className="bg-indigo-500 text-white px-4 py-2 rounded shadow hover:bg-indigo-600"
        >
          Print
        </button>
      </div>

      <div className="overflow-x-auto">
        <table
          id="leave-table"
          className="min-w-full bg-white rounded-xl shadow-md overflow-hidden"
        >
          <thead className="bg-indigo-100 text-indigo-700">
            <tr>
              <th className="py-3 px-4 text-left">Student</th>
              <th className="py-3 px-4 text-left">Class</th>
              <th className="py-3 px-4 text-left">Semester</th>
              <th className="py-3 px-4 text-left">Duration</th>
              <th className="py-3 px-4 text-left">Reason</th>
              <th className="py-3 px-4 text-left">Teacher Status</th>
              <th className="py-3 px-4 text-left">Admin Status</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {leaves.map(leave => (
              <tr key={leave?._id} className="hover:bg-gray-50 transition">
                <td className="py-3 px-4">
                  {leave?.studentId?.name} ({leave?.studentId?.rollNo})
                </td>
                <td className="py-3 px-4">{leave?.studentId?.className}</td>
                <td className="py-3 px-4">{leave?.studentId?.semester || "-"}</td>
                <td className="py-3 px-4">
                  {leave?.startDate} → {leave?.endDate}
                </td>
                <td className="py-3 px-4">{leave?.reason}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
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
                    className={`px-2 py-1 rounded-full text-sm ${
                      leave?.adminStatus === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : leave?.adminStatus === "Approved"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {leave?.adminStatus || "Pending"}
                  </span>
                </td>
                <td className="py-3 px-4 flex gap-2">
                  {leave?.teacherStatus === "Recommended" &&
                    leave?.adminStatus === "Pending" && (
                      <>
                        <button
                          onClick={() =>
                            handleStatusUpdate(leave?._id, "Approved")
                          }
                          className="bg-green-500 text-white px-3 py-1 rounded shadow hover:bg-green-600"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() =>
                            handleStatusUpdate(leave?._id, "Rejected")
                          }
                          className="bg-red-500 text-white px-3 py-1 rounded shadow hover:bg-red-600"
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

export default AdminLeavesPage;
