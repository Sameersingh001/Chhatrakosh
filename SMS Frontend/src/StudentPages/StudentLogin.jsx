import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminPng from "../assets/AdminPng.png";

export default function StudentLogin() {
  const [formData, setFormData] = useState({
    rollNo: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  // Captcha states
  const [captcha, setCaptcha] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");

  // Generate captcha on first render
  useEffect(() => {
    generateCaptcha();
  }, []);

  // Clear message after 3s
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Generate alphanumeric captcha
  const generateCaptcha = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let str = "";
    for (let i = 0; i < 6; i++) {
      str += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptcha(str);
    setCaptchaInput("");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Captcha check
    if (captchaInput !== captcha) {
      setMessage("❌ Incorrect captcha, try again.");
      generateCaptcha();
      return;
    }

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
      <img
        src={AdminPng}
        alt="Admin"
        className="sm:w-148 sm:h-128 h-64 w-64 mb-6"
      />

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
          {/* Roll No */}
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

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="📧 Your Email"
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
                Show password
              </label>
            </div>

            <p className="text-xs text-gray-500 mt-1">
              Default :  Password is generated using your first name (lowercase) + last 4 digits of your Roll Number + last 4 digits of your Phone Number + "@".
            </p>
          </div>

          {/* Alphanumeric Captcha */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Enter Captcha:
              <span className="ml-2 inline-block font-bold px-6 py-2 bg-indigo-100 text-indigo-800 rounded-lg tracking-widest select-all">
                {captcha}
              </span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                required
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={generateCaptcha}
                className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                ↻
              </button>
            </div>
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
