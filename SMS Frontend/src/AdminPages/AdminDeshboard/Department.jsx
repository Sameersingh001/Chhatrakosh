import React, { useState } from "react";
import axios from "axios";
import { Users, BookOpen, GraduationCap } from "lucide-react";

export default function TeacherByDepartment() {
    const [department, setDepartment] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [teachers, setTeachers] = useState([]);
    const [students, setStudents] = useState([]);
    const [error, setError] = useState(null);
    const [suggestions, setSuggestions] = useState([]);

    // Valid departments/classes (UG + PG)
    const validDepartments = [
        "B.Tech", "BCA", "BBA", "B.Com", "BA", "B.Sc", "LLB",
        "M.Tech", "MCA", "MBA", "M.Com", "MA", "M.Sc"
    ];

    const handleInputChange = (e) => {
        const value = e.target.value;
        setDepartment(value);

        // Generate suggestions
        if (value.trim() === "") {
            setSuggestions([]);
        } else {
            const filtered = validDepartments.filter((d) =>
                d.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filtered);
        }
    };

    const handleSuggestionClick = (value) => {
        setDepartment(value);
        setSuggestions([]);
    };

    const handleSearch = async (e) => {
        e?.preventDefault();
        if (!department.trim()) {
            setMessage("Please enter a department or class name.");
            return;
        }

        setLoading(true);
        setMessage("");
        setError(null);
        setTeachers([]);
        setStudents([]);
        setSuggestions([]);

        if (!validDepartments.includes(department.trim())) {
            setLoading(false);
            setError(
                `Invalid department/class. Try one of these: ${validDepartments.join(", ")}`
            );
            return;
        }

        try {
            const res = await axios.post(
                "/api/admin/teacher-by-department",
                { department: department.trim() },
                { withCredentials: true }
            );

            const data = res.data || {};
            setTeachers(data.teachers || []);
            setStudents(data.students || []);
            setMessage(
                `Found ${data.teachers?.length ?? 0} teacher(s) and ${data.students?.length ?? 0} student(s) for "${data.department ?? department}".`
            );
        } catch (err) {
            console.error("Error fetching by department:", err);
            setError(
                err?.response?.data?.error ||
                err?.response?.data?.message ||
                "Server error. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const presets = validDepartments;

    return (
        <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-6 flex items-center gap-3">
                <GraduationCap className="text-indigo-600" size={28} />
                Teachers & Students by Department
            </h1>

            <form
                onSubmit={handleSearch}
                className="flex flex-col sm:flex-row gap-3 items-start sm:items-center mb-6 relative"
            >
                <input
                    value={department}
                    onChange={handleInputChange}
                    placeholder="Enter department / class name (e.g. BCA)"
                    className="w-full sm:w-96 px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                {suggestions.length > 0 && (
                    <ul className="absolute top-12 sm:top-12 left-0 w-full sm:w-96 bg-white border border-gray-200 rounded-xl shadow-lg z-20 max-h-56 overflow-auto">
                        {suggestions.map((s, idx) => {
                            // Highlight matching text
                            const matchIndex = s.toLowerCase().indexOf(department.toLowerCase());
                            const beforeMatch = s.slice(0, matchIndex);
                            const matchText = s.slice(matchIndex, matchIndex + department.length);
                            const afterMatch = s.slice(matchIndex + department.length);

                            return (
                                <li
                                    key={idx}
                                    className="px-4 py-2 hover:bg-indigo-50 cursor-pointer transition flex items-center gap-2"
                                    onClick={() => handleSuggestionClick(s)}
                                >
                                    <span className="text-gray-700">{beforeMatch}</span>
                                    <span className="font-semibold text-indigo-600">{matchText}</span>
                                    <span className="text-gray-700">{afterMatch}</span>
                                </li>
                            );
                        })}
                    </ul>
                )}


                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 disabled:opacity-60"
                >
                    {loading ? "Searching..." : "Search"}
                </button>

                <button
                    type="button"
                    onClick={() => {
                        setDepartment("");
                        setTeachers([]);
                        setStudents([]);
                        setMessage("");
                        setError(null);
                        setSuggestions([]);
                    }}
                    className="px-6 py-2 border rounded-xl text-gray-700 bg-white hover:shadow"
                >
                    Reset
                </button>
            </form>

            {/* Preset department buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
                {presets.map((p) => (
                    <button
                        key={p}
                        onClick={() => {
                            setDepartment(p);
                            setTimeout(() => handleSearch(), 10);
                        }}
                        className="px-4 py-2 rounded-full text-sm font-medium border bg-white hover:bg-indigo-50 hover:border-indigo-300 transition"
                    >
                        {p}
                    </button>
                ))}
            </div>

            {/* Status */}
            {message && (
                <div className="mb-4 p-3 bg-green-50 text-green-800 rounded-lg border border-green-200 shadow-sm">
                    {message}
                </div>
            )}
            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-800 rounded-lg border border-red-200 shadow-sm">
                    {error}
                </div>
            )}

            {/* Results */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Teachers */}
                <div className="col-span-1 lg:col-span-2 bg-white shadow-md rounded-2xl p-6 border">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-indigo-100 p-2 rounded-xl">
                                <Users size={22} className="text-indigo-600" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-800">
                                Teachers ({teachers.length})
                            </h2>
                        </div>
                    </div>

                    {loading && !teachers.length ? (
                        <p className="text-sm text-gray-500">Loading teachers...</p>
                    ) : teachers.length === 0 ? (
                        <p className="text-sm text-gray-500">No teachers found.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {teachers.map((t) => (
                                <div
                                    key={t._id || t.id || `${t.name}-${Math.random()}`}
                                    className="p-5 border rounded-xl shadow-sm hover:shadow-md transition bg-gray-50"
                                >
                                    <h3 className="font-bold text-gray-800 text-lg">
                                        {t.name || t.fullName || "Unnamed"}
                                    </h3>
                                    <p className="text-sm text-gray-500">{t.email || ""}</p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        <strong>Department:</strong> {t.department || "-"}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <strong>Phone:</strong> {t.phone || t.mobile || "—"}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Students */}
                <div className="bg-white shadow-md rounded-2xl p-6 border">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-green-100 p-2 rounded-xl">
                            <BookOpen size={22} className="text-green-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800">
                            Students ({students.length})
                        </h2>
                    </div>

                    {loading && !students.length ? (
                        <p className="text-sm text-gray-500">Loading students...</p>
                    ) : students.length === 0 ? (
                        <p className="text-sm text-gray-500">
                            No students found for this class/department.
                        </p>
                    ) : (
                        <div className="space-y-3 max-h-[60vh] overflow-auto pr-2">
                            {students.map((s) => (
                                <div
                                    key={s._id || s.id || `${s.name}`}
                                    className="p-4 border rounded-xl bg-gray-50 shadow-sm hover:shadow-md transition"
                                >
                                    <p className="font-semibold text-gray-800">
                                        {s.name || s.fullName || "Unnamed Student"}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <strong>Roll No:</strong> {s.rollNo || "—"}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <strong>Class:</strong> {s.className || "-"}
                                    </p>
                                    <p className="text-sm text-gray-600">{s.email || ""}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
