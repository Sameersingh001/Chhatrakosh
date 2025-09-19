import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminPng from "../assets/AdminPng.png";

export default function TeacherLogin() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  // Captcha states
  const [captcha, setCaptcha] = useState({ num1: 0, num2: 0 });
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

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10);
    const num2 = Math.floor(Math.random() * 10);
    setCaptcha({ num1, num2 });
    setCaptchaInput("");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Captcha check
    const correctAnswer = captcha.num1 + captcha.num2;
    if (parseInt(captchaInput, 10) !== correctAnswer) {
      setMessage("❌ Incorrect captcha, try again.");
      generateCaptcha();
      return;
    }

    try {
      const response = await axios.post("/api/teacher/login", formData, {
        withCredentials: true,
      });
      setMessage(response.data.message);
      localStorage.setItem("SMS_teacherId", response.data.teacher.id);
      window.location.href = "/teacher/dashboard";
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
          🔑 Teacher Login
        </h2>

        {message ? (
          <div
            className={`mb-4 p-3 rounded-lg text-sm ${
              message.includes("❌") || message.includes("Error")
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
              Username
            </label>
            <input
              type="text"
              name="username"
              placeholder="👤 Your Username"
              pattern="^[a-zA-Z0-9@!#$%^&*()_+\\-=\\[\\]{};':\\\\|,.<>/?]{3,30}$"
              title="Username must be 3–30 characters long and can include letters, numbers, and special characters."
              value={formData.username}
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
              Default Password: First part of your name (lowercase) + last 6
              digits of your phone number + @
            </p>
          </div>

          {/* Captcha */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Solve Captcha: {captcha.num1} + {captcha.num2} = ?
            </label>
            <div className="flex gap-2">
              <input
                type="number"
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
