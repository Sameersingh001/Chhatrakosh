import React, { useEffect, useState } from "react";
import axios from "axios";
import Avtar from "../assets/Avtar.png";
import { Search, Filter, X, Printer } from "lucide-react";
import { Link } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_APP_URL;

const StudentsPage = ({ role }) => {
    const [students, setStudents] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState({
        className: "",
        semester: "",
        status: "",
    });
    const [sortBy, setSortBy] = useState("");
    const [showFilters, setShowFilters] = useState(false);

    // Fetch students
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const res = await axios.get(`/api/${role}/students`, {
                    withCredentials: true,
                });
                setStudents(res.data);
                setFiltered(res.data);
            } catch (error) {
                console.error(
                    "❌ Failed to fetch students:",
                    error.response?.data || error.message
                );
            }
        };
        if (role) fetchStudents();
    }, [role]);

    // Apply filters + search
    useEffect(() => {
        let result = students;

        if (search.trim()) {
            result = result.filter(
                (s) =>
                    s.name.toLowerCase().includes(search.toLowerCase()) ||
                    s.rollNo.toLowerCase().includes(search.toLowerCase()) ||
                    s.phone?.toLowerCase().includes(search.toLowerCase())
            );
        }
        if (filters.className) {
            result = result.filter((s) => s.className === filters.className);
        }
        if (filters.semester) {
            result = result.filter((s) => s.semester === filters.semester);
        }
        if (filters.status) {
            result = result.filter((s) => s.status === filters.status);
        }
        if (sortBy === "name") {
            result = [...result].sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === "newest") {
            result = [...result].sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
        }

        setFiltered(result);
    }, [search, filters, sortBy, students]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const clearFilters = () => {
        setFilters({ className: "", semester: "", status: "" });
        setSortBy("");
        setSearch("");
    };

    // Print function
    const handlePrint = () => {
        const printContent = `
      <html>
        <head>
          <title>Students Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2 { text-align: center; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; font-size: 14px; }
            th { background: #f4f4f4; }
          </style>
        </head>
        <body>
          <h2>Students Report</h2>
          <table>
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Parent Name</th>
                <th>Parent Phone</th>
                <th>Class</th>
                <th>Address</th>
                <th>Gender</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${filtered
                .map(
                    (s) => `
                <tr>
                  <td>${s.rollNo || "-"}</td>
                  <td>${s.name || "-"}</td>
                  <td>${s.email || "-"}</td>
                  <td>${s.phone || "-"}</td>
                  <td>${s.parentName || "-"}</td>
                  <td>${s.parentPhone || "-"}</td>
                  <td>${s.className || "-"} (${s.semester || "-"})</td>                  
                  <td>${s.address || "-"}</td>
                  <td>${s.gender || "-"}</td>
                  <td>${s.status || "-"}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `;

        const printWindow = window.open("", "_blank");
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.print();
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Filter className="w-6 h-6 text-indigo-600" /> All Students
                </h1>
                <div className="flex gap-2">
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
                    >
                        <Printer className="w-4 h-4" /> Print
                    </button>
                    <button
                        onClick={() => setShowFilters(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700"
                    >
                        <Filter className="w-4 h-4" /> Filters
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="flex items-center gap-2 mb-6 border p-2 rounded-lg shadow-sm">
                <Search className="text-gray-500" />
                <input
                    type="text"
                    placeholder="Search by name, roll no, or phone..."
                    className="w-full outline-none"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Clear filters */}
            <div>
                {(filters.className || filters.semester || filters.status || sortBy || search) && (
                    <a
                        onClick={clearFilters}
                        className="px-4 py-2 cursor-pointer text-red-500 border border-red-400 rounded-lg hover:bg-red-50"
                    >
                        ❌ Clear All Filters
                    </a>
                )}
            </div>

            {/* Student Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-5">
                {filtered.length > 0 ? (
                    filtered.map((s) => (
                        <Link to={`/${role}/dashboard/AllStudents/${s._id}`} key={s._id}>
                            <div className="bg-white rounded-2xl shadow-md p-5 flex gap-4 hover:shadow-lg transition">
                                <img
                                    src={s?.photo ? `${BASE_URL}${s.photo}` : Avtar}
                                    alt={s?.name || "Student"}
                                    className="w-20 h-20 rounded-full object-cover border"
                                />
                                <div className="flex flex-col">
                                    <h2 className="text-lg font-semibold">{s?.name}</h2>
                                    <p className="text-sm text-gray-600">🎓 Roll No: {s?.rollNo}</p>
                                    <p className="text-sm text-gray-600">📚 Class: {s?.className}</p>
                                    <p className="text-sm text-gray-600">📅 Semester: {s?.semester}</p>
                                    <span
                                        className={`mt-2 inline-block px-2 py-1 text-xs rounded-full font-medium w-fit ${s.status === "active"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                            }`}
                                    >
                                        {s.status || "Unknown"}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="col-span-full text-center py-10 text-gray-500">
                        🚫 No students found.
                    </div>
                )}
            </div>

            {/* Filter Modal */}
            {showFilters && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white w-full max-w-lg rounded-xl shadow-xl p-6 relative">
                        <button
                            onClick={() => setShowFilters(false)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <h2 className="text-xl font-bold mb-4">Filter Students</h2>

                        <div className="space-y-4">
                            <select
                                name="className"
                                value={filters.className}
                                onChange={handleFilterChange}
                                className="w-full p-2 border rounded-lg"
                            >
                                <option value="">All Classes</option>
                                <option value="BCA">BCA</option>
                                <option value="BBA">BBA</option>
                                <option value="B.Com">B.Com</option>
                                <option value="BA">BA</option>
                                <option value="B.Sc">B.Sc</option>
                                <option value="B.Tech">B.Tech</option>
                                <option value="MCA">MCA</option>
                                <option value="MBA">MBA</option>
                            </select>

                            <select
                                name="semester"
                                value={filters.semester}
                                onChange={handleFilterChange}
                                className="w-full p-2 border rounded-lg"
                            >
                                <option value="">All Semesters</option>
                                <option value="1st">1st</option>
                                <option value="2nd">2nd</option>
                                <option value="3rd">3rd</option>
                                <option value="4th">4th</option>
                                <option value="5th">5th</option>
                                <option value="6th">6th</option>
                            </select>

                            <select
                                name="status"
                                value={filters.status}
                                onChange={handleFilterChange}
                                className="w-full p-2 border rounded-lg"
                            >
                                <option value="">All Status</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>

                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full p-2 border rounded-lg"
                            >
                                <option value="">Sort By</option>
                                <option value="name">Name (A-Z)</option>
                                <option value="newest">Newest</option>
                            </select>
                        </div>

                        <div className="flex justify-between mt-6">
                            <button
                                onClick={clearFilters}
                                className="px-4 py-2 text-red-500 border border-red-400 rounded-lg hover:bg-red-50"
                            >
                                Clear
                            </button>
                            <button
                                onClick={() => setShowFilters(false)}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentsPage;
