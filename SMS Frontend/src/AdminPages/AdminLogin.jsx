import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminPng from "../assets/AdminPng.png";

export default function AdminLogin() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Captcha states
  const [captcha, setCaptcha] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");

  useEffect(() => {
    generateCaptcha(); // Generate captcha on first load
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const generateCaptcha = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptcha(result);
    setCaptchaInput("");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password match check
    if (formData.password !== formData.confirmPassword) {
      setMessage("❌ Passwords do not match!");
      return;
    }

    // Captcha check
    if (captchaInput !== captcha) {
      setMessage("❌ Incorrect captcha, try again.");
      generateCaptcha();
      return;
    }

    try {
      const response = await axios.post("/api/admin/login", formData, {
        withCredentials: true,
      });
      setMessage(response.data.message);
      localStorage.setItem("SMS_adminId", response.data.admin.id);
      window.location.href = "/admin/dashboard";
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
          🔑 Admin Login
        </h2>

        {message && (
          <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 text-sm">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Username</label>
            <input
              type="text"
              name="username"
              placeholder="👤 Your Username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="🔑 Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Confirm Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="🔑 Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Show Password */}
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

          {/* Captcha */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Enter Captcha:{" "}
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

        <p className="mt-6 text-center text-gray-600 text-sm">
          Don’t have an account?{" "}
          <a
            href="/admin/register"
            className="text-indigo-600 hover:underline font-semibold"
          >
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}
