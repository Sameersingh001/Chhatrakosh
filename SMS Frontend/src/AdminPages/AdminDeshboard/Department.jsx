import React, { useState } from "react";
import axios from "axios";
import { Users, BookOpen, GraduationCap, Printer } from "lucide-react";

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

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        const printDate = new Date().toLocaleString();

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Teachers & Students Report - ${department}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    h1 { color: #333; text-align: center; }
                    h2 { color: #444; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
                    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f5f5f5; }
                    tr:nth-child(even) { background-color: #f9f9f9; }
                    .print-date { text-align: right; color: #666; font-size: 14px; margin-bottom: 20px; }
                    @media print {
                        body { margin: 0; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <h1>Teachers & Students Report - ${department}</h1>
                <div class="print-date">Generated: ${printDate}</div>
                
                <h2>Teachers (${teachers.length})</h2>
                ${teachers.length > 0 ? `
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Department</th>
                                <th>Subjects</th>
                                <th>Phone</th>
                            </tr>
                        </thead>
                        <tbody>
${teachers.map(t => `
  <tr>
    <td>${t.name || t.fullName || "Unnamed"}</td>
    <td>${t.email || "-"}</td>
    <td>${t.department || "-"}</td>
    <td>
      ${Array.isArray(t.subjects) && t.subjects.length > 0
                ? t.subjects.map(sub => sub.subjectName).join(", ")
                : "-"
            }
    </td>
    <td>${t.phone || t.mobile || "—"}</td>
  </tr>
`).join('')}

                        </tbody>
                    </table>
                ` : '<p>No teachers found</p>'}
                
                <h2>Students (${students.length})</h2>
                ${students.length > 0 ? `
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Roll No</th>
                                <th>Class</th>
                                <th>Email</th>
                                <th>phone</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${students.map(s => `
                                <tr>
                                    <td>${s.name || s.fullName || "Unnamed Student"}</td>
                                    <td>${s.rollNo || "—"}</td>
                                    <td>${s.className || "-"}, ${s.semester}</td>
                                    <td>${s.email || "-"}</td>
                                    <td>${s.phone || "-"}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                ` : '<p>No students found</p>'}
                
                <button class="no-print" onclick="window.print()" style="margin-top: 20px; padding: 10px 15px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    Print Report
                </button>
                <button class="no-print" onclick="window.close()" style="margin-top: 20px; margin-left: 10px; padding: 10px 15px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    Close Window
                </button>
            </body>
            </html>
        `);

        printWindow.document.close();
    };

    const presets = validDepartments;

    return (
        <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-extrabold text-gray-800 flex items-center gap-3">
                    <GraduationCap className="text-indigo-600" size={28} />
                    Teachers & Students by Department
                </h1>

                {(teachers.length > 0 || students.length > 0) && (
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition"
                    >
                        <Printer size={18} />
                        Print Report
                    </button>
                )}
            </div>

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
                                    <p className="text-sm text-gray-600 mt-1">
                                        <strong>Subjects:</strong>{" "}
                                        {Array.isArray(t.subjects)
                                            ? t.subjects.map((sub) =>
                                                typeof sub === "string" ? sub : sub.subjectName
                                            ).join(", ")
                                            : t.subject?.subjectName || "-"}
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
                                        <strong> Semester:</strong> {s.semester || "-"}
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