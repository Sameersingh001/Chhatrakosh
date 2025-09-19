import React, { useEffect, useState } from "react";
import axios from "axios";
import { X, PlusCircle, Edit2, Trash2, Search } from "lucide-react";

const BASE_URL = import.meta.env.VITE_APP_URL;

const NoticePage = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Added for search functionality
  const [filteredNotices, setFilteredNotices] = useState([]); // For filtered results

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    link: "",
    role: "admin", // Customizable role, could be dynamic based on user
  });

  // Fetch all notices
  const fetchNotices = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/admin/notice");
      const reversedNotices = res?.data.reverse();
      setNotices(reversedNotices);
      setFilteredNotices(reversedNotices); // Initialize filtered notices
    } catch (err) {
      console.error("❌ Error fetching notices:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  // Handle search
  useEffect(() => {
    const filtered = notices.filter(
      (n) =>
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredNotices(filtered);
  }, [searchTerm, notices]);

  // Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Submit form (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) {
      alert("Title and Description are required!");
      return;
    }

    try {
      if (editingId) {
        // Update notice
        await axios.post(`/api/admin/notice/update/${editingId}`, form, {
          withCredentials: true,
        });
        alert("✅ Notice updated successfully!");
      } else {
        // Create notice
        await axios.post("/api/admin/notice", form, { withCredentials: true });
        alert("✅ Notice added successfully!");
      }

      setForm({
        title: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
        link: "",
        role: "admin",
      });
      setEditingId(null);
      setShowForm(false);
      fetchNotices();
    } catch (err) {
      console.error("❌ Error submitting notice:", err);
      alert("Failed to submit notice. Try again.");
    }
  };

  // Edit notice
  const handleEdit = (notice) => {
    setForm({
      title: notice.title,
      description: notice.description,
      date: new Date(notice.date).toISOString().split("T")[0],
      link: notice.link || "",
      role: notice.role,
    });
    setEditingId(notice._id);
    setShowForm(true);
  };

  // Delete notice
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notice?")) return;
    try {
      await axios.post(`/api/admin/notice/delete/${id}`, {}, { withCredentials: true });
      alert("✅ Notice deleted!");
      window.location.reload()
    } catch (err) {
      console.error("❌ Error deleting notice:", err);
      alert("Failed to delete notice.");
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 min-h-screen"> {/* Customized colorful background */}
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2 text-indigo-800"> {/* Larger text for optimization */}
          <PlusCircle className="w-8 h-8 text-indigo-600" /> Customized College Notice Board
        </h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setForm({
              title: "",
              description: "",
              date: new Date().toISOString().split("T")[0],
              link: "",
              role: "admin",
            });
          }}
          className="mt-4 sm:mt-0 px-6 py-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transform hover:scale-105 transition"
        >
          {showForm ? "Close Form" : "Add New Notice"}
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search notices by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 pl-10 border border-gray-300 rounded-full shadow focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* Notice Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-2xl shadow-xl mb-6 border border-indigo-200"> {/* Stylish rounded corners */}
          <h2 className="text-2xl font-semibold mb-4 text-indigo-700">
            {editingId ? "Update Notice" : "Create New Notice"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Notice Title"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
            />
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Detailed Description"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              rows={5}
              required
            />
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
            />
            <input
              type="url"
              name="link"
              value={form.link}
              onChange={handleChange}
              placeholder="Optional: Add a Link (e.g., https://example.com)"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
            <input
              name="role"
              value={form.role}
              readOnly
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-gray-50"
            >
            </input>
            <button
              type="submit"
              className={`px-6 py-3 rounded-full text-white shadow-lg hover:scale-105 transition ${editingId ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-500 hover:bg-green-600"
                }`}
            >
              {editingId ? "Update Notice" : "Submit Notice"}
            </button>
          </form>
        </div>
      )}

      {/* Notices List */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"> {/* Responsive grid layout */}
        {loading ? (
          <p className="text-gray-500 text-center py-10 col-span-full">Loading notices...</p>
        ) : filteredNotices.length === 0 ? (
          <p className="text-gray-500 text-center py-10 col-span-full">No notices found.</p>
        ) : (
          filteredNotices.map((n) => (
            <div
              key={n._id}
              className="bg-white p-5 rounded-2xl shadow-lg hover:shadow-xl transition border border-blue-100 relative hover:scale-105 max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl w-full break-words"
            >
              {/* Actions */}
              <div className="absolute bottom-5 right-3 flex gap-3">
                <button
                  onClick={() => handleEdit(n)}
                  className="p-2 rounded-full hover:bg-yellow-100 text-yellow-600 shadow"
                  title="Edit Notice"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(n._id)}
                  className="p-2 rounded-full hover:bg-red-100 text-red-600 shadow"
                  title="Delete Notice"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 gap-2">
                <h3 className="text-lg sm:text-xl font-semibold text-blue-800 leading-snug break-words">
                  {n.title}
                </h3>
                <span className="text-xs sm:text-sm text-gray-500">
                  {new Date(n.date).toLocaleDateString()}
                </span>
              </div>

              <p className="text-gray-700 mb-3 text-base sm:text-s leading-relaxed break-words whitespace-pre-line">
                {n.description}
              </p>

              {n.link && (
                <a
                  href={n.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline text-sm font-medium break-all"
                >
                  🔗 Open Link
                </a>
              )}

              <p className="text-xs text-gray-500 mt-2">Role: {n.role}</p>
            </div>

          ))
        )}
      </div>
    </div>
  );
};

export default NoticePage;
