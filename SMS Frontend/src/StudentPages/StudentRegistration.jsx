import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx"; // ✅ for Excel parsing
import { Upload, Info } from "lucide-react";
import { User, Mail } from "lucide-react";

export default function AddStudent() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rollNo: "",
    className: "",
    semester: "",
    phone: "",
    dob: "",
    gender: "",
    address: "",
    parentName: "",
    parentPhone: "",
  });

  const [message, setMessage] = useState("");
  const [bulkFile, setBulkFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);

  // Auto clear messages
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Single student input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // ✅ Single student submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => data.append(key, value));

      const res = await axios.post("/api/students/registration", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      setMessage(`✅ ${res.data.message}`);
      setFormData({
        name: "",
        email: "",
        rollNo: "",
        className: "",
        semester: "",
        phone: "",
        dob: "",
        gender: "",
        address: "",
        parentName: "",
        parentPhone: "",
      });
    } catch (error) {
      setMessage(`❌ Error: ${error.response?.data?.message || error.message}`);
    }
  };

  // ✅ Handle Excel File Upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setBulkFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      setPreviewData(jsonData);
    };
    reader.readAsArrayBuffer(file);
  };

  // ✅ Submit bulk upload
  const handleBulkSubmit = async () => {
    if (!bulkFile) return setMessage("❌ Please upload an Excel file!");

    try {
      const res = await axios.post("/api/students/bulk-register", { students: previewData });
      setMessage(`✅ ${res.data.message}`);
      setBulkFile(null);
      setPreviewData([]);
    } catch (error) {
      setMessage(`❌ Bulk Upload Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <main className="flex-1 p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-10">


        <section className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
  {/* Instructions Section */}
  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
    <h3 className="flex items-center text-lg font-semibold text-blue-700 mb-2">
      <Info className="w-5 h-5 mr-2" /> Instructions for Bulk Upload
    </h3>
    <ul className="list-disc list-inside text-gray-700 text-sm leading-relaxed">
      <li>Prepare an <strong>Excel/CSV</strong> file with the following columns (all required):</li>
      <ul className="ml-6 list-disc text-gray-600">
        <li><code>name</code> – Student Full Name</li>
        <li><code>email</code> – Student Email</li>
        <li><code>rollNo</code> – Unique Roll Number</li>
        <li><code>className</code> – Class Name (e.g., BCA, BBA)</li>
        <li><code>semester</code> – Semester (e.g., 5)</li>
        <li><code>phone</code> – Contact Number</li>
        <li><code>dob</code> – Date of Birth (YYYY-MM-DD)</li>
        <li><code>gender</code> – Male / Female / Other</li>
        <li><code>address</code> – Full Address</li>
        <li><code>parentName</code> – Parent/Guardian Name</li>
        <li><code>parentPhone</code> – Parent Contact Number</li>
      </ul>
      <li>Ensure there are <strong>no missing values</strong> in required fields.</li>
      <li>Save the file as <code>.xlsx</code>, <code>.xls</code>, or <code>.csv</code>.</li>
      <li>Click <strong>Upload All Students</strong> after previewing the data.</li>
    </ul>
  </div>

  {/* Upload Section */}
  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
    <Upload className="w-6 h-6 text-blue-600" /> Bulk Upload Students (Excel/CSV)
  </h2>

  <input
    type="file"
    accept=".xlsx, .xls, .csv"
    onChange={handleFileUpload}
    className="mb-4"
  />

  {previewData.length > 0 && (
    <>
      <p className="mb-2 text-gray-600">
        Preview ({previewData.length} students):
      </p>
      <div className="overflow-auto max-h-60 border rounded-lg mb-4">
        <table className="min-w-full text-sm border-collapse">
          <thead className="bg-gray-100">
            <tr>
              {Object.keys(previewData[0]).map((key, i) => (
                <th key={i} className="border px-3 py-1">{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {previewData.slice(0, 5).map((row, i) => (
              <tr key={i}>
                {Object.values(row).map((val, j) => (
                  <td key={j} className="border px-3 py-1">{val}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={handleBulkSubmit}
        className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700"
      >
        📤 Upload All Students
      </button>
    </>
  )}
  </section>







        {/* ------------------ SINGLE STUDENT FORM ------------------ */}
        <section>
          <h1 className="text-3xl font-extrabold text-gray-800 mb-6 flex items-center gap-2">
            🧑‍🎓 Add New Student
          </h1>

          {message && (
            <div
              className={`mb-4 p-4 rounded-lg text-sm font-medium shadow-md transition ${
                message.includes("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-xl rounded-2xl p-8 grid grid-cols-1 md:grid-cols-2 gap-6 border border-gray-100"
          >
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold mb-2">Full Name</label>
              <div className="flex items-center border rounded-lg px-3 py-2">
                <User className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter student name"
                  className="w-full outline-none"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold mb-2">Email</label>
              <div className="flex items-center border rounded-lg px-3 py-2">
                <Mail className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  className="w-full outline-none"
                  required
                />
              </div>
            </div>

            {/* Roll No */}
            <div>
              <label className="block text-sm font-semibold mb-2">Roll No</label>
              <input
                type="text"
                name="rollNo"
                value={formData.rollNo}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>

            {/* Class */}
            <div>
              <label className="block text-sm font-semibold mb-2">Class</label>
              <select
                name="className"
                value={formData.className}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
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
            </div>

            {/* Semester */}
            <div>
              <label className="block text-sm font-semibold mb-2">Semester</label>
              <input
                type="text"
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                placeholder="e.g. 4th"
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold mb-2">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>

            {/* DOB */}
            <div>
              <label className="block text-sm font-semibold mb-2">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-semibold mb-2">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-2">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter full address"
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>

            {/* Parent Name */}
            <div>
              <label className="block text-sm font-semibold mb-2">Parent Name</label>
              <input
                type="text"
                name="parentName"
                value={formData.parentName}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>

            {/* Parent Phone */}
            <div>
              <label className="block text-sm font-semibold mb-2">Parent Phone</label>
              <input
                type="tel"
                name="parentPhone"
                value={formData.parentPhone}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg shadow-md"
              >
                🚀 Add Student
              </button>
            </div>
          </form>
        </section>

        {/* ------------------ BULK UPLOAD SECTION ------------------ */}

</div>
    </main>
  );
}
