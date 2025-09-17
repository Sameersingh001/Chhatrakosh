import React, { useEffect, useState } from "react";
import axios from "axios";
import Avtar from "../assets/Avtar.png";
import { Search, Filter, X, Printer } from "lucide-react";
import { Link } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_APP_URL;

const TeachersPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");

  // Filters + sorting
  const [filters, setFilters] = useState({
    department: "",
    status: "",
  });
  const [sortBy, setSortBy] = useState("");

  // Popup state
  const [showFilters, setShowFilters] = useState(false);

  // List of departments
  const departments = [
    "B.Tech", "BCA", "BBA", "B.Com", "BA", "B.Sc", "LLB",
    "M.Tech", "MCA", "MBA", "M.Com", "MA", "M.Sc", "LLM"
  ];

  // Fetch teachers
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await axios.get(`/api/teachers`);
        setTeachers(res.data);
        setFiltered(res.data);
      } catch (error) {
        console.error("❌ Failed to fetch teachers:", error);
      }
    };
    fetchTeachers();
  }, []);

  // Apply search + filters + sort
  useEffect(() => {
    let result = teachers;

    // Search filter
    if (search.trim()) {
      result = result.filter(
        (t) =>
          t.name?.toLowerCase().includes(search.toLowerCase()) ||
          t.email?.toLowerCase().includes(search.toLowerCase()) ||
          t.phone?.toLowerCase().includes(search.toLowerCase()) ||
          t.department?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Department filter
    if (filters.department) {
      result = result.filter((t) =>
        t.department?.toLowerCase().includes(filters.department.toLowerCase())
      );
    }

    // Status filter
    if (filters.status) {
      result = result.filter((t) =>
        filters.status === "Active" ? t.isActive === true : t.isActive === false
      );
    }

    // Sorting
    if (sortBy === "name") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "newest") {
      result = [...result].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    }

    setFiltered(result);
  }, [search, filters, sortBy, teachers]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({ department: "", status: "" });
    setSortBy("");
    setSearch("");
  };

  // ✅ Print Function
  const handlePrint = () => {
    if (!filtered.length) {
      alert("No data to print!");
      return;
    }

    const printWindow = window.open("", "_blank");

    // Table rows
    const rows = filtered.map(
      (t, i) => `
        <tr>
          <td>${i + 1}</td>
          <td>${t.name || "-"}</td>
          <td>${t.department || "-"}</td>
          <td>${t.username || "-"}</td>
          <td>${t.phone || "-"}</td>
          <td>${t.email || "-"}</td>
          <td>${t.address || "-"}</td>
          <td>${t.isActive ? "Active" : "Inactive"}</td>
        </tr>
      `
    ).join("");

    printWindow.document.write(`
      <html>
        <head>
          <title>Teachers Data</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h2 { text-align: center; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #444; padding: 8px; text-align: left; font-size: 14px; }
            th { background: #f2f2f2; }
            tr:nth-child(even) { background: #fafafa; }
          </style>
        </head>
        <body>
          <h2>Teachers Report</h2>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Department</th>
                <th>Username</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Address</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Filter className="w-6 h-6 text-indigo-600" /> All Teachers
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

      {/* Search Bar */}
      <div className="flex items-center gap-2 mb-6 border p-2 rounded-lg shadow-sm">
        <Search className="text-gray-500" />
        <input
          type="text"
          placeholder="Search by name, email, phone, or department..."
          className="w-full outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Clear Filters */}
      {(filters.department || filters.status || sortBy || search) && (
        <a
          onClick={clearFilters}
          className="px-4 py-2 cursor-pointer text-red-500 border border-red-400 rounded-lg hover:bg-red-50"
        >
          ❌ Clear All Filters
        </a>
      )}

      {/* Teachers List (Card view on UI only) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-5">
        {filtered.length > 0 ? (
          filtered.map((t) => (
            <Link
              to={`/admin/dashboard/Allteachers/${t._id}`}
              key={t._id}
            >
              <div className="bg-white rounded-2xl shadow-md p-5 flex gap-4 hover:shadow-lg transition">
                <img
                  src={t?.image ? `${BASE_URL}${t?.image}` : Avtar}
                  alt={t?.name || "Teacher"}
                  className="w-20 h-20 rounded-full object-cover border"
                />
                <div className="flex flex-col">
                  <h2 className="text-lg font-semibold">{t?.name}</h2>
                  <p className="text-sm text-gray-600">📧 {t?.email}</p>
                  <p className="text-sm text-gray-600">
                    🎓 Department: {t?.department || "-"}
                  </p>
                  <p className="text-sm text-gray-600">📞 {t?.phone}</p>
                  <span
                    className={`mt-2 inline-block px-2 py-1 text-xs rounded-full font-medium w-fit ${
                      t.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {t.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-gray-500">
            🚫 No teachers found.
          </div>
        )}
      </div>

      {/* Filter Popup */}
      {showFilters && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-xl p-6 relative">
            <button
              onClick={() => setShowFilters(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-xl font-bold mb-4">Filter Teachers</h2>

            <div className="space-y-4">
              {/* Department Filter */}
              <select
                name="department"
                value={filters.department}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded-lg"
              >
                <option value="">All Departments</option>
                {departments.map((dep) => (
                  <option key={dep} value={dep}>{dep}</option>
                ))}
              </select>

              {/* Status Filter */}
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

              {/* Sort */}
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

            {/* Buttons */}
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

export default TeachersPage;
