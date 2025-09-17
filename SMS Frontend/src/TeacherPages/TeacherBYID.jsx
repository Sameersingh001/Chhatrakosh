import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Avtar from "../assets/Avtar.png";
import { X, Plus, Trash } from "lucide-react";

const BASE_URL = import.meta.env.VITE_APP_URL;

const TeacherDetailPage = () => {
  const { id } = useParams();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState({
    designation: "",
    department: "",
    subjects: [],
  });

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const res = await axios.get(`/api/admin/teacher/${id}`, {
          withCredentials: true,
        });
        const t = res.data.Teacher; // Backend returns { Teacher: {...} }
        setTeacher(t);
        setEditData({
          designation: t.designation || "",
          department: t.department || "",
          subjects: t.subjects || [],
        });
      } catch (err) {
        console.error("❌ Failed to fetch teacher:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeacher();
  }, [id]);

  // Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle subject input change
  const handleSubjectChange = (index, field, value) => {
    const newSubjects = [...editData.subjects];
    newSubjects[index][field] = value;
    setEditData((prev) => ({ ...prev, subjects: newSubjects }));
  };

  // Add new subject
  const addSubject = () => {
    setEditData((prev) => ({
      ...prev,
      subjects: [
        ...prev.subjects,
        { subjectName: "", course: "", semester: "" },
      ],
    }));
  };

  // Remove subject
  const removeSubject = (index) => {
    setEditData((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((_, i) => i !== index),
    }));
  };

  // Update teacher info
  const handleUpdate = async () => {
    try {
      await axios.post(`/api/admin/teachers/${id}/AdminUpdateTeacher`, {
        designation: editData.designation,
        department: editData.department,
        subjects: editData.subjects,
      });
      setTeacher((prev) => ({ ...prev, ...editData }));
      setShowEdit(false);
    } catch (err) {
      console.error("❌ Failed to update teacher:", err);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Do you want to delete this user?");
    window.location.href = "/admin/dashboard/AllTeachers";
    if (!confirmDelete) return;

    try {
      await axios.post(
        `/api/delete/teacher/${id}`,
        {}, // empty body
        { withCredentials: true } // ✅ correct place
      );
      alert("✅ Teacher deleted successfully!");
    } 
    catch (error) {
      console.error("Delete error:", error);
      alert("❌ Failed to delete user.");
    }
  };



  // Toggle account status
  const handleToggleStatus = async () => {
    try {
      const res = await axios.post(
        `/api/admin/teacher/${id}/toggle-status`,
        {},
        { withCredentials: true }
      );
      setTeacher((prev) => ({ ...prev, isActive: res.data.isActive }));
      alert(res.data.message);
      window.location.reload()
    } catch (err) {
      console.error("❌ Failed to toggle status:", err);
      alert("Failed to update account status");
    }
  };

  if (loading) return <div className="p-6 text-gray-500">Loading...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="p-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-800">
            Teacher Profile
          </h1>
          <div className="flex gap-3">
            <button
              onClick={() => setShowEdit(true)}
              className="flex items-center gap-2 px-5 py-2 bg-yellow-500 text-white font-semibold rounded-xl shadow hover:bg-yellow-600 transition"
            >
              ✏️ Edit Profile
            </button>
            <button
              onClick={handleToggleStatus}
              className={`flex items-center gap-2 px-5 py-2 font-semibold rounded-xl shadow transition ${teacher?.isActive
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-green-500 hover:bg-green-600 text-white"
                }`}
            >
              {teacher?.isActive ? "Deactivate" : "Activate"}
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 cursor-pointer rounded-xl bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </button>

          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white shadow-xl rounded-2xl p-8 flex flex-col md:flex-row gap-8">
          {/* Avatar */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <img
              src={teacher?.image ? `${BASE_URL}${teacher?.image}` : Avtar}
              alt={teacher?.name}
              className="w-40 h-40 rounded-full border-4 border-yellow-400 object-cover shadow-md"
            />
            <span className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full">
              {teacher?.designation || "Faculty"}
            </span>
          </div>

          {/* Info Section */}
          <div className="flex-1 flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {teacher?.name}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3 text-gray-700">
              <p>
                📧 <span className="font-semibold">Email:</span> {teacher?.email}
              </p>
              <p>
                📞 <span className="font-semibold">Phone:</span> {teacher?.phone}
              </p>
              <p>
                🎓{" "}
                <span className="font-semibold">Qualification:</span>{" "}
                {teacher?.qualification}
              </p>
              <p>
                🏫 <span className="font-semibold">Department:</span>{" "}
                {teacher?.department}
              </p>
              <p>
                📝 <span className="font-semibold">Designation:</span>{" "}
                {teacher?.designation}
              </p>
              <p>
                📅 <span className="font-semibold">Joined:</span>{" "}
                {teacher?.dateOfJoining
                  ? new Date(teacher.dateOfJoining).toLocaleDateString()
                  : "N/A"}
              </p>
              <p>
                🔐 <span className="font-semibold">Account Status:</span>{" "}
                <span
                  className={`ml-2 font-bold ${teacher?.isActive ? "text-green-600" : "text-red-600"
                    }`}
                >
                  {teacher?.isActive ? "Active" : "Deactivated"}
                </span>
              </p>
            </div>

            {/* Subjects */}
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                📚 Subjects
              </h3>
              {teacher?.subjects?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {teacher.subjects.map((sub, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm shadow-sm"
                    >
                      {sub?.subjectName} - {sub?.course} (Sem {sub?.semester})
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No subjects assigned</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEdit && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-3xl rounded-xl shadow-xl p-6 relative overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setShowEdit(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

            <div className="space-y-4">
              {/* Designation */}
              <div>
                <label className="block mb-1 font-medium text-gray-700">Designation</label>
                <select
                  name="designation"
                  value={editData?.designation}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="">-- Select Designation --</option>
                  <option value="Assistant Professor">Assistant Professor</option>
                  <option value="Associate Professor">Associate Professor</option>
                  <option value="Professor">Professor</option>
                  <option value="Lecturer">Lecturer</option>
                  <option value="Visiting Faculty">Visiting Faculty</option>
                </select>
              </div>

              {/* Department */}
              <div>
                <label className="block mb-1 font-medium text-gray-700">Department</label>
                <select
                  name="department"
                  value={editData?.department}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Civil">Civil</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="English">English</option>
                  <option value="Management">Management</option>
                  <option value="BCA">BCA</option>
                  <option value="BBA">BBA</option>
                  <option value="B.Com">B.Com</option>
                  <option value="BA">BA</option>
                  <option value="B.Sc">B.Sc</option>
                  <option value="MCA">MCA</option>
                  <option value="MBA">MBA</option>
                  <option value="M.Com">M.Com</option>
                  <option value="MA">MA</option>
                  <option value="M.Sc">M.Sc</option>
                  <option value="LLB / Law">LLB / Law</option>
                  <option value="Education">Education</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Subjects */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">Subjects</h3>
                  <button
                    onClick={addSubject}
                    className="flex items-center gap-1 px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </div>
                {editData.subjects?.map((sub, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder="Subject"
                      value={sub?.subjectName}
                      onChange={(e) =>
                        handleSubjectChange(i, "subjectName", e.target.value)
                      }
                      className="flex-1 p-2 border rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Course"
                      value={sub?.course}
                      onChange={(e) =>
                        handleSubjectChange(i, "course", e.target.value)
                      }
                      className="flex-1 p-2 border rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Semester"
                      value={sub?.semester}
                      onChange={(e) =>
                        handleSubjectChange(i, "semester", e.target.value)
                      }
                      className="flex-1 p-2 border rounded-lg"
                    />
                    <button
                      onClick={() => removeSubject(i)}
                      className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowEdit(false)}
                className="px-4 py-2 border cursor-pointer border-red-400 text-red-500 rounded hover:bg-red-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 cursor-pointer bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Save
              </button>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default TeacherDetailPage;
