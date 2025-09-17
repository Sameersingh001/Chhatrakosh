import React, { useState } from "react";
import axios from "axios";
import AdminPng from "../assets/AdminPng.png";

const AdminRegister = () => {
  const [adminRegisterform, setAdminRegisterForm] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    secretKey: "",
    image: null,
  });

  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    if (e.target.type === "file") {
      setAdminRegisterForm({
        ...adminRegisterform,
        image: e.target.files[0],
      });
    } else {
      setAdminRegisterForm({
        ...adminRegisterform,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (adminRegisterform.password !== adminRegisterform.confirmPassword) {
      setMessage("❌ Passwords do not match");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", adminRegisterform.name);
      formData.append("email", adminRegisterform.email);
      formData.append("username", adminRegisterform.username);
      formData.append("password", adminRegisterform.password);
      formData.append("secretKey", adminRegisterform.secretKey);

      if (adminRegisterform.image) {
        formData.append("image", adminRegisterform.image);
      }

      const response = await axios.post("/api/admin/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage(response.data.message);
      setTimeout(() => (window.location.href = "/admin/login"), 1500);
    } catch (error) {
      setMessage(error.response?.data?.message || "❌ Error registering admin");
    }
  };

  return (
    <div className="flex sm:flex-row flex-col items-center justify-around min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-gray-900 px-4">
      {/* Left Image */}
      <div>
        <img
          src={AdminPng}
          alt="Admin"
          className="sm:w-148 sm:h-128 h-64 w-64 mb-6"
        />
      </div>

      {/* Form */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">
          🔑 Admin Register
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="✒️ Name"
            value={adminRegisterform.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="email"
            name="email"
            placeholder="✉️ Email"
            value={adminRegisterform.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            name="username"
            placeholder="👤 Username"
            pattern="^[a-zA-Z0-9@!#$%^&*()_+\-=\[\]{};':\\|,.<>/?]{3,30}$"
            title="Username must be 3–30 characters long and can include letters, numbers, and special characters like @, #, $, _, ., etc."
            value={adminRegisterform.username}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            name="secretKey"
            placeholder="🔒 Secret Key"
            value={adminRegisterform.secretKey}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* Password */}
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="🔑 Password"
            value={adminRegisterform.password}
            onChange={handleChange}
            required
            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
            title="Password must be at least 8 characters long and include 1 uppercase, 1 lowercase, 1 number, and 1 special character."
            className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* Confirm Password */}
          <input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="✅ Confirm Password"
            value={adminRegisterform.confirmPassword}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* Show password toggle */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="showPassword"
              className="mr-2"
              onChange={() => setShowPassword(!showPassword)}
            />
            <label htmlFor="showPassword" className="text-gray-700">
              Show Password
            </label>
          </div>

          {/* File Input */}
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg cursor-pointer bg-gray-50"
          />

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition"
          >
            Register 🚀
          </button>
        </form>

        {message && (
          <p
            className={`mt-4 text-center font-semibold ${
              message.includes("❌") ? "text-red-600" : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}

        <p className="mt-6 text-center text-gray-600 text-sm">
          Already have an account?{" "}
          <a
            href="/admin/login"
            className="text-indigo-600 hover:underline font-semibold"
          >
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default AdminRegister;
