import React, { useState } from "react";
import axios from "axios";
import AdminPng from "../assets/AdminPng.png"
import { useEffect } from "react";

export default function StudentLogin() {
  const [formData, setFormData] = useState({
    rollNO: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 3000); // 3 seconds

      return () => clearTimeout(timer); // cleanup
    }
  }, [message]);



  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/student/login", formData, {
        withCredentials: true,
      });
      setMessage(response.data.message);
      localStorage.setItem("SMS_studentId", response.data.student.id);
      window.location.href = "/student/dashboard";
    } catch (error) {
      setMessage(error.response?.data?.message || "Error logging in");
    }
  };
  return (
    <div className="flex sm:flex-row flex-col items-center justify-around min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-gray-900 px-4">
      <img src={AdminPng} alt="Admin" className=" sm:w-148 sm:h-128 h-64 w-64 mb-6" />

      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">
          🔑 Student Login
        </h2>

        {message ? (
          <div
            className={`mb-4 p-3 rounded-lg text-sm ${message.includes("❌") || message.includes("Error")
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
              }`}
          >
            {message}
          </div>
        ) : null}


        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Roll No.
            </label>
            <input
              type="text"
              name="rollNo"
              placeholder="👤 Your Roll Number"
              value={formData.rollNo}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="👤 Your Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="🔑 Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                id="showPassword"
                className="mr-2"
                onChange={() => setShowPassword(!showPassword)}
              />
              <label htmlFor="showPassword" className="text-gray-700">
                Check your password
              </label>
            </div>

            <p className="text-xs text-gray-500 mt-1">
              password is generated using your first name (lowercase) + last 4 digits of your Roll Number + last 4 digits of your Phone Number + "@".            
            </p>



          </div>
          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-500 transition disabled:opacity-50"
          >
            {message ? "Login again" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
