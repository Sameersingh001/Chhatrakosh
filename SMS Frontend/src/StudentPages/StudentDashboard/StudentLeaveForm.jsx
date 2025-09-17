import React, { useState, useEffect } from "react";
import axios from "axios";

export default function StudentLeavePage({ student }) {
    const [form, setForm] = useState({
        studentId: "",
        reason: "",
        startDate: "",
        endDate: "",
    });

    const [message, setMessage] = useState("");
    const [leaves, setLeaves] = useState([]);


      useEffect(() => {
      if (message) {
        const timer = setTimeout(() => {
          setMessage("");
        }, 3000); // 3 seconds
  
        return () => clearTimeout(timer); // cleanup
      }
    }, [message]);



    // Predefined reasons for auto-fill
    const predefinedReasons = [
        "Medical leave",
        "Personal work",
        "Family function",
        "Travel for study",
        "Sick leave",
        "Hospital appointment",
    ];

    useEffect(() => {
        if (student?._id) {
            setForm((prev) => ({ ...prev, studentId: student._id }));
            fetchMyLeaves(student._id);
        }
    }, [student]);

    const fetchMyLeaves = async (studentId) => {
        if (!studentId) return;
        try {
            const res = await axios.get(`/api/student/${studentId}/my-leaves`, {
                withCredentials: true,
            });
            setLeaves(res.data.leaves || []);
        } catch (err) {
            console.error("❌ Failed to fetch leaves:", err);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("/api/student/request-leaves", form, {
                withCredentials: true,
            });
            setMessage(res.data.message || "Leave request submitted successfully!");
            setForm({
                studentId: student?._id || "",
                reason: "",
                startDate: "",
                endDate: "",
            });
            fetchMyLeaves(student._id);
        } catch (err) {
            console.error("❌ Failed to submit leave:", err);
            setMessage("Error submitting leave request");
        }
    };

    const handleAutoReason = (reason) => {
        setForm((prev) => ({ ...prev, reason }));
    };

    if (!student?._id) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50">
                <p className="text-lg text-gray-600">Loading student info...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-6 space-y-10">
            {/* Instructions */}
            <div className="max-w-4xl mx-auto bg-indigo-100 shadow-lg rounded-3xl p-8 border border-indigo-200">
                <h2 className="text-2xl font-bold text-indigo-700 mb-6 text-center">
                    Instructions for Applying Leave
                </h2>
                <ul className="list-decimal pl-6 space-y-4 text-gray-800">
                    <li>
                        Fill in the <span className="font-bold text-indigo-800">reason</span> clearly and honestly.
                    </li>
                    <li>
                        Choose <span className="font-bold text-indigo-800">accurate start and end dates</span> using the calendar picker.
                    </li>
                    <li>
                        Submit your request at least <span className="font-bold text-indigo-800">3 days before</span> the leave date.
                    </li>
                    <li>
                        The leave request will first be <span className="font-bold text-green-700">Recommended by the Teacher</span> and then <span className="font-bold text-green-700">Approved by the Admin</span>. Keep an eye on the <span className="font-bold text-indigo-800">tracking table</span> below for updates.
                    </li>
                    <li>
                        If your request remains <span className="font-bold text-yellow-600">Pending</span> for too long, contact the <span className="font-bold text-indigo-800">Admin</span>.
                    </li>
                </ul>
            </div>

            {/* Leave Form */}
            <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-3xl p-10 border border-indigo-100">
                <h1 className="text-3xl font-extrabold text-center text-indigo-700 mb-8">
                    Apply for Leave
                </h1>

                {message && (
                    <p className="mb-6 text-center text-green-600 font-medium">{message}</p>
                )}

                {/* Auto-reason buttons */}
                <div className="flex flex-wrap gap-3 mb-4">
                    {predefinedReasons.map((reason, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => handleAutoReason(reason)}
                            className="bg-indigo-200 hover:bg-indigo-300 text-indigo-800 font-medium py-2 px-4 rounded-xl transition"
                        >
                            {reason}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block font-semibold mb-2">Reason</label>
                        <textarea
                            name="reason"
                            value={form.reason}
                            onChange={handleChange}
                            required
                            rows={4}
                            className="w-full border border-gray-300 rounded-2xl p-4 focus:ring-2 focus:ring-indigo-400 focus:outline-none hover:border-indigo-300 transition"
                            placeholder="Enter your leave reason..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block font-semibold mb-2">Start Date</label>
                            <input
                                type="date"
                                name="startDate"
                                value={form.startDate}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded-2xl p-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none hover:border-indigo-300 transition"
                            />
                        </div>

                        <div>
                            <label className="block font-semibold mb-2">End Date</label>
                            <input
                                type="date"
                                name="endDate"
                                value={form.endDate}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded-2xl p-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none hover:border-indigo-300 transition"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl text-lg font-semibold shadow-lg transition transform hover:scale-105"
                    >
                        Submit Leave
                    </button>
                </form>
            </div>

            {/* Leave Tracking Table */}
            <div className="w-full bg-green-50 py-10 px-4">
                <div className="w-full bg-white shadow-2xl rounded-3xl p-8 border border-black-100">
                    <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
                        Track My Leaves
                    </h2>

                    {leaves.length === 0 ? (
                        <p className="text-center text-gray-500 text-lg">No leave requests yet.</p>
                    ) : (
                        <div className="overflow-x-auto rounded-xl">
                            <table className="w-full text-left border-collapse border border-gray-200">
                                <thead className="bg-green-50">
                                    <tr>
                                        <th className="px-5 py-3 font-semibold max-w-[200px]">Reason</th>
                                        <th className="px-5 py-3 font-semibold">Start Date</th>
                                        <th className="px-5 py-3 font-semibold">End Date</th>
                                        <th className="px-5 py-3 font-semibold">Teacher Status</th>
                                        <th className="px-5 py-3 font-semibold">Admin Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leaves.map((leave) => (
                                        <tr
                                            key={leave._id}
                                            className="border-t hover:bg-green-50 transition"
                                        >
                                            <td className="px-5 py-3 max-w-[200px] break-words">
                                                {leave.reason}
                                            </td>
                                            <td className="px-5 py-3">{leave.startDate}</td>
                                            <td className="px-5 py-3">{leave.endDate}</td>
                                            <td
                                                className={`px-5 py-3 font-medium ${leave.teacherStatus === "Recommended"
                                                    ? "text-green-600"
                                                    : leave.teacherStatus === "Not Recommended"
                                                        ? "text-red-600"
                                                        : "text-yellow-600"
                                                    }`}
                                            >
                                                {leave.teacherStatus}
                                            </td>
                                            <td
                                                className={`px-5 py-3 font-medium ${leave.adminStatus === "Approved"
                                                    ? "text-green-600"
                                                    : leave.adminStatus === "Rejected"
                                                        ? "text-red-600"
                                                        : "text-yellow-600"
                                                    }`}
                                            >
                                                {leave.adminStatus}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
