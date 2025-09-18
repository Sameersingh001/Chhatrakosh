import React, { useEffect, useState } from "react";
import axios from "axios";
import { X, PlusCircle, Edit2, Trash2, Search } from "lucide-react";


const TeacherNoticePage = () => {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredNotices, setFilteredNotices] = useState([]);

    const [form, setForm] = useState({
        title: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
        link: "",
        role: "teacher", // ✅ Default teacher role
    });

    // Fetch all teacher notices
    const fetchNotices = async () => {
        setLoading(true);
        try {
            const res = await axios.get("/api/teacher/notices", { withCredentials: true });
            const reversedNotices = res?.data.reverse();
            setNotices(reversedNotices);
            setFilteredNotices(reversedNotices);
        } catch (err) {
            console.error("❌ Error fetching notices:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotices();
    }, []);

    // Search filter
    useEffect(() => {
        const filtered = notices.filter(
            (n) =>
                n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                n.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredNotices(filtered);
    }, [searchTerm, notices]);

    // Handle form input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // Submit form (create / update)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title || !form.description) {
            alert("Title and Description are required!");
            return;
        }

        try {
            if (editingId) {
                // Update
                await axios.post(`/api/teacher/notice/update/${editingId}`, form, {
                    withCredentials: true,
                });
                alert("✅ Notice updated!");
            } else {
                // Create
                await axios.post("/api/teacher/notices", form, { withCredentials: true });
                alert("✅ Notice added!");
            }

            setForm({
                title: "",
                description: "",
                date: new Date().toISOString().split("T")[0],
                link: "",
                role: "teacher",
            });
            setEditingId(null);
            setShowForm(false);
            fetchNotices();
        } catch (err) {
            console.error("❌ Error submitting notice:", err);
            alert("Failed to submit notice.");
        }
    };

    // Edit notice
    const handleEdit = (notice) => {
        setForm({
            title: notice.title,
            description: notice.description,
            date: new Date(notice.date).toISOString().split("T")[0],
            link: notice.link || "",
            role: "teacher",
        });
        setEditingId(notice._id);
        setShowForm(true);
    };

    // Delete notice
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this notice?")) return;
        try {
            await axios.post(`/api/teacher/notice/delete/${id}`, {}, { withCredentials: true });
            alert("✅ Notice deleted!");
            fetchNotices();
        } catch (err) {
            console.error("❌ Error deleting notice:", err);
            alert("Failed to delete notice.");
        }
    };

    return (
        <div className="p-6 bg-gradient-to-br from-blue-50 to-green-50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                <h1 className="text-3xl font-bold flex items-center gap-2 text-blue-800">
                    <PlusCircle className="w-8 h-8 text-blue-600" /> Teacher Notice Board
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
                            role: "teacher",
                        });
                    }}
                    className="mt-4 sm:mt-0 px-6 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transform hover:scale-105 transition"
                >
                    {showForm ? "Close Form" : "Add Notice"}
                </button>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search notices..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-3 pl-10 border border-gray-300 rounded-full shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                </div>
            </div>

            {/* Notice Form */}
            {showForm && (
                <div className="bg-white p-6 rounded-2xl shadow-xl mb-6 border border-blue-200">
                    <h2 className="text-2xl font-semibold mb-4 text-blue-700">
                        {editingId ? "Update Notice" : "Create Notice"}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="Notice Title"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Notice Description"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            rows={5}
                            required
                        />
                        <input
                            type="date"
                            name="date"
                            value={form.date}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <input
                            type="url"
                            name="link"
                            value={form.link}
                            onChange={handleChange}
                            placeholder="Optional: Add a link"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="submit"
                            className={`px-6 py-3 rounded-full text-white shadow-lg hover:scale-105 transition ${editingId
                                    ? "bg-yellow-500 hover:bg-yellow-600"
                                    : "bg-green-500 hover:bg-green-600"
                                }`}
                        >
                            {editingId ? "Update Notice" : "Submit Notice"}
                        </button>
                    </form>
                </div>
            )}

            {/* Notices Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                    <p className="text-gray-500 text-center py-10 col-span-full">
                        Loading notices...
                    </p>
                ) : filteredNotices.length === 0 ? (
                    <p className="text-gray-500 text-center py-10 col-span-full">
                        No notices found.
                    </p>
                ) : (
                    filteredNotices.map((n) => (
                        <div
                            key={n._id}
                            className="bg-white p-5 rounded-2xl shadow-lg hover:shadow-xl transition border border-blue-100 relative hover:scale-105"
                        >
                            {/* Actions */}
                            {n.role === "teacher" && (
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
                            )}

                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-xl font-semibold text-blue-800">
                                    {n.title}
                                </h3>
                                <span className="text-sm text-gray-500">
                                    {new Date(n.date).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-gray-700 mb-3 text-lg">{n.description}</p>
                            {n.link && (
                                <a
                                    href={n.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline text-sm font-medium"
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

export default TeacherNoticePage;
