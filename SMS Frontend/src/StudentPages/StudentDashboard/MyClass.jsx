import React, { useEffect, useState } from "react";
import axios from "axios";
import { Search, User } from "lucide-react";

const ClassmatesPage = ({ student }) => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!student?._id || !student?.className) return; // exit early if undefined

    const fetchStudents = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/students/class/${student.className}/${student._id}`, {
          withCredentials: true,
        });
        setStudents(res.data.students || []);
      } catch (err) {
        console.error("Error fetching students:", err);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [student]);

  // Filter students by name or email
  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 bg-gradient-to-br from-purple-100 via-indigo-100 to-blue-100 min-h-screen animate-fadeIn">
      <h2 className="text-4xl font-extrabold mb-8 text-indigo-900 flex items-center gap-3 drop-shadow-lg">
        <User className="w-10 h-10 text-indigo-700 animate-pulse" /> My Classmates
      </h2>

      {/* Search Input */}
      <div className="relative mb-10 max-w-lg mx-auto">
        <input
          type="text"
          placeholder="Search students by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-4 pl-12 border-2 border-indigo-300 rounded-full shadow-md focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-500 transition-all duration-300 bg-white/80 backdrop-blur-sm"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-indigo-500" />
      </div>

      {/* Students List */}
      {loading ? (
        <p className="text-gray-600 text-center py-12 text-lg font-medium animate-pulse">Loading classmates...</p>
      ) : filteredStudents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
          {filteredStudents.map((student) => (
            <div
              key={student._id}
              className="bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-indigo-200 hover:scale-105 hover:rotate-1 hover:border-indigo-400 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="flex items-center gap-5 mb-4 relative z-10">
                <User className="w-12 h-12 text-indigo-600 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-indigo-800">{student.name}</h3>
                  <p className="text-sm text-gray-600">{student.email}</p>
                </div>
              </div>
              <p className="text-gray-700 text-sm mb-1 relative z-10">Roll No: {student.rollNo}</p>
              <p className="text-gray-700 text-sm mb-1 relative z-10">Class: {student.className}</p>
              <p className="text-gray-700 text-sm relative z-10">Phone: {student.phone}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center mt-12 text-lg italic font-medium">No classmates found. Try adjusting your search!</p>
      )}
    </div>
  );
};

export default ClassmatesPage;
