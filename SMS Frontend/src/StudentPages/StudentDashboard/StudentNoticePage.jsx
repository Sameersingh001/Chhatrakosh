import React, { useEffect, useState } from "react";
import axios from "axios";

const StudentNoticePage = () => {
  const [notices, setNotices] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await axios.get("/api/student/notices", { withCredentials: true });
        setNotices(res.data.notices || []);
      } catch (error) {
        console.error("Error fetching notices:", error);
      }
    };
    fetchNotices();
  }, []);

  // Filter by title or description
  const filteredNotices = notices.filter(
    (notice) =>
      notice.title.toLowerCase().includes(search.toLowerCase()) ||
      notice.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-xl shadow-lg max-w-5xl mx-auto my-10">
      <h2 className="text-4xl font-bold mb-6 text-indigo-800 tracking-wide flex items-center gap-3">
        📢 Digital Notice Board
      </h2>

      {/* Search Input */}
      <input
        type="text"
        placeholder="🔍 Search notices by title or description..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-5 py-3 mb-8 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200 shadow-sm placeholder:text-gray-400"
      />

      {/* Notices List */}
      {filteredNotices.length > 0 ? (
        <div className="space-y-6">
          {filteredNotices.map((notice) => (
            <div
              key={notice._id}
              className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 hover:shadow-xl transition-shadow duration-300 hover:-translate-y-1 transform"
            >
              <h3 className="text-2xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                📝 {notice.title}
              </h3>
              <p className="text-gray-700 mb-3 text-lg">{notice.description}</p>
              {notice.link && (
                <a
                  href={notice.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 font-medium underline transition-colors duration-200 flex items-center gap-1"
                >
                  🔗 View More
                </a>
              )}
              <div className="mt-4 flex flex-wrap gap-4 items-center text-sm">
                <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full font-medium flex items-center gap-1">
                  📅 {new Date(notice.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium flex items-center gap-1">
                  🧑‍💼 Role: {notice.role.charAt(0).toUpperCase() + notice.role.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center mt-8 italic text-lg">😔 No notices found matching your search.</p>
      )}
    </div>
  );
};

export default StudentNoticePage;
