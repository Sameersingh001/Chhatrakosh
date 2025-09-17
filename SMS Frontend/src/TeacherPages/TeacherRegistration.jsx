import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import TeacherPng from "../assets/Teacher.png";

export default function TeacherRegisterForm() {
  const navigate = useNavigate();

  // 🔹 Auth Redirect
  useEffect(() => {
    const adminId = localStorage.getItem("SMS_adminId");
    if (!adminId) navigate("/admin/login");
  }, [navigate]);

  const [message, setMessage] = useState("");
  const [bulkMessage, setBulkMessage] = useState("");
  const [bulkData, setBulkData] = useState([]);

  // 🔹 Reset messages
  useEffect(() => {
    if (message || bulkMessage) {
      const timer = setTimeout(() => {
        setMessage("");
        setBulkMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, bulkMessage]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    designation: "",
    department: "",
    qualification: "",
    phone: "",
    address: "",
    collegeName: "Agra College",
    dateOfJoining: "",
    subjects: [{ subjectName: "", course: "", semester: "" }],
  });

  // 🔹 Handlers
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubjectChange = (index, e) => {
    const newSubjects = [...formData.subjects];
    newSubjects[index][e.target.name] = e.target.value;
    setFormData({ ...formData, subjects: newSubjects });
  };

  const addSubject = () =>
    setFormData({
      ...formData,
      subjects: [
        ...formData.subjects,
        { subjectName: "", course: "", semester: "" },
      ],
    });

  // 🔹 Single Teacher Registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/teachers/register", formData);
      setMessage(res.data?.message || "✅ Teacher registered successfully");
      setFormData({
        name: "",
        email: "",
        username: "",
        designation: "",
        department: "",
        qualification: "",
        phone: "",
        address: "",
        collegeName: "Agra College",
        dateOfJoining: "",
        subjects: [{ subjectName: "", course: "", semester: "" }],
      });
    } catch (error) {
      setMessage(error?.response?.data?.message || "❌ Registration failed.");
    }
  };

  // 🔹 Bulk Upload
  const handleBulkFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      setBulkData(jsonData);
      setBulkMessage("");
    } catch {
      setBulkMessage("❌ Failed to read file. Please check format.");
    }
  };

  const handleBulkUpload = async () => {
    if (bulkData.length === 0) {
      setBulkMessage("⚠️ No data to upload. Please select a valid file.");
      return;
    }
    try {
      const res = await axios.post("/api/teachers/bulk-register", {
        teachers: bulkData,
      });
      setBulkMessage(res.data?.message || "✅ Bulk upload successful");
      setBulkData([]);
    } catch (error) {
      setBulkMessage(error?.response?.data?.message || "❌ Failed Bulk Upload");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-6">
      <div className="flex flex-row md:flex-row bg-white shadow-2xl rounded-2xl w-full max-w-6xl overflow-hidden">

        {/* Left Illustration */}
        <div className="md:w-1/3 hidden md:flex flex-col items-center p-8 bg-gradient-to-br from-indigo-600 to-blue-700 text-white space-y-8 shadow-lg">


          {/* Instructions */}
          <div className="w-full max-w-md bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-md space-y-4">
            <h3 className="text-lg font-semibold text-center mb-2">Bulk Upload Instructions</h3>
            <ul className="text-sm list-disc list-inside space-y-3">
              <li>
                <b>Required CSV/Excel Columns:</b>
                <span className="block ml-6 text-white/90">
                  name, email, username, designation, department, qualification, phone,
                  address, collegeName, dateOfJoining, subjects
                </span>
              </li>
              <li>
                <b>Username format:</b> Must contain at least 1 letter, 1 number, 1 special character (e.g., @#$%^&*), and be 3–30 characters long.
                <br />
                <code className="block bg-white/20 px-3 py-1 rounded-md mt-1 text-white/90 font-mono text-xs overflow-x-auto">
                  Example: User1@, abc123#, Test@9
                </code>
              </li>
              <li>
                <b>subjects</b> column must be in valid JSON array format.
              </li>
              <li>
                Example format:
                <code className="block bg-white/20 px-3 py-2 rounded-md mt-1 text-white/90 font-mono text-xs overflow-x-auto">
                  {'[{"subjectName":"DS", "course":"BCA", "semester":"5"}]'}
                </code>
              </li>
              <li>
                Multiple subjects can be added inside the same JSON array.
              </li>
              <li>
                <b>course</b> and <b>semester</b> must not be empty, otherwise upload will fail.
              </li>
            </ul>
          </div>


          {/* Illustration */}
          <img
            src={TeacherPng}
            alt="Teacher Illustration"
            className="w-3/4 max-w-[220px] transform hover:scale-110 transition-transform duration-500 ease-in-out"
          />

        </div>







        {/* Right Form */}
        <div className="md:w-2/3 w-full p-8 space-y-8">
          {/* Bulk Upload */}
          <div className="border-2 border-indigo-200 p-6 rounded-xl bg-indigo-50 shadow-md">
            <h2 className="text-xl font-bold mb-4 text-indigo-800">Bulk Teacher Upload</h2>
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleBulkFile}
              className="w-full p-3 border-2 border-indigo-300 rounded-lg mb-4 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
            {bulkData.length > 0 && (
              <div className="overflow-x-auto max-h-48 border-2 border-indigo-300 rounded-lg mb-4 bg-white shadow-inner">
                <table className="table-auto text-sm w-full border-collapse">
                  <thead className="bg-indigo-100 sticky top-0">
                    <tr>
                      {Object.keys(bulkData[0]).map((key, idx) => (
                        <th key={idx} className="px-4 py-2 border-b text-indigo-700 font-semibold">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {bulkData.map((row, i) => (
                      <tr key={i} className="even:bg-indigo-50 hover:bg-indigo-100 transition">
                        {Object.values(row).map((val, j) => (
                          <td key={j} className="px-4 py-2 border-b">
                            {val}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <button
              onClick={handleBulkUpload}
              className="w-full p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-md font-semibold"
            >
              Upload Bulk File
            </button>
                      <a
            href="/Teacher_BulkRegister.csv"  
            download ="Teacher_BulkRegister.csv"
            className="block text-indigo-700 text-sm font-medium mt-2 hover:text-indigo-900"
          >
            📄 Download Sample CSV File
          </a>
            {bulkMessage && (
              <p className="mt-3 text-center text-indigo-800 text-sm font-medium">
                {bulkMessage}
              </p>
            )}

          </div>

          {/* Single Teacher Form */}
          <h2 className="text-xl font-bold text-indigo-800">Teacher Registration</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="p-3 border-2 border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition bg-white"
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="p-3 border-2 border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition bg-white"
            />
            <input
              name="username"
              placeholder="Username"
              value={formData.username}
              pattern="^[a-zA-Z0-9@!#$%^&*()_+\-=\[\]{};':\\|,.<>/?]{3,30}$"
              title="Username must be 3–30 characters long and can include letters, numbers, and special characters like @, #, $, _, ., etc."
              onChange={handleChange}
              required
              className="p-3 border-2 border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition bg-white"
            />

            <select
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              required
              className="p-3 border-2 border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition bg-white appearance-none"
            >
              <option value="">Designation</option>
              <option>Assistant Professor</option>
              <option>Associate Professor</option>
              <option>Professor</option>
              <option>Lecturer</option>
              <option>Visiting Faculty</option>
            </select>

            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              className="p-3 border-2 border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition bg-white appearance-none"
            >
              <option value="">-------- Select Course --------</option>
              <optgroup label="Undergraduate (UG)">
                <option value="B.Tech">B.Tech (Bachelor of Technology)</option>
                <option value="BCA">BCA (Bachelor of Computer Applications)</option>
                <option value="BBA">BBA (Bachelor of Business Administration)</option>
                <option value="B.Com">B.Com (Bachelor of Commerce)</option>
                <option value="BA">BA (Bachelor of Arts)</option>
                <option value="B.Sc">B.Sc (Bachelor of Science)</option>
                <option value="LLB">LLB (Bachelor of Law)</option>
              </optgroup>
              <optgroup label="Postgraduate (PG)">
                <option value="M.Tech">M.Tech (Master of Technology)</option>
                <option value="MCA">MCA (Master of Computer Applications)</option>
                <option value="MBA">MBA (Master of Business Administration)</option>
                <option value="M.Com">M.Com (Master of Commerce)</option>
                <option value="MA">MA (Master of Arts)</option>
                <option value="M.Sc">M.Sc (Master of Science)</option>
                <option value="LLM">LLM (Master of Law)</option>
              </optgroup>
            </select>

            <input
              name="qualification"
              placeholder="Qualification"
              value={formData.qualification}
              onChange={handleChange}
              required
              className="p-3 border-2 border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition bg-white"
            />
            <input
              name="phone"
              placeholder="Phone (10 digits)"
              pattern="\d{10}"
              value={formData.phone}
              onChange={handleChange}
              required
              className="p-3 border-2 border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition bg-white"
            />
            <input
              name="collegeName"
              placeholder="College Name"
              value={formData.collegeName}
              onChange={handleChange}
              required
              className="p-3 border-2 border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition bg-white"
            />
            <input
              name="dateOfJoining"
              type="date"
              value={formData.dateOfJoining}
              onChange={handleChange}
              required
              className="p-3 border-2 border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition bg-white"
            />

            <textarea
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              className="p-3 border-2 border-indigo-300 rounded-lg col-span-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition bg-white h-24 resize-none"
            />

            {/* Subjects */}
            <div className="col-span-2 space-y-4">
              {formData.subjects.map((subj, idx) => (
                <div key={idx} className="grid grid-cols-3 gap-4">
                  <input
                    name="subjectName"
                    placeholder="Subject Name"
                    value={subj.subjectName}
                    onChange={(e) => handleSubjectChange(idx, e)}
                    required
                    className="p-3 border-2 border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition bg-white"
                  />
                  <input
                    name="course"
                    placeholder="Course"
                    value={subj.course}
                    onChange={(e) => handleSubjectChange(idx, e)}
                    required
                    className="p-3 border-2 border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition bg-white"
                  />
                  <input
                    name="semester"
                    placeholder="Semester"
                    value={subj.semester}
                    onChange={(e) => handleSubjectChange(idx, e)}
                    required
                    className="p-3 border-2 border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition bg-white"
                  />
                </div>
              ))}
              {formData.subjects.length < 5 && (
                <button
                  type="button"
                  onClick={addSubject}
                  className="text-indigo-600 text-sm font-medium hover:text-indigo-800 transition"
                >
                  + Add Another Subject
                </button>
              )}
            </div>

            <button
              type="submit"
              className="col-span-2 p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-md font-semibold"
            >
              Register Teacher
            </button>

            {message && <div className="col-span-2 text-sm text-green-600 font-medium text-center">{message}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}
