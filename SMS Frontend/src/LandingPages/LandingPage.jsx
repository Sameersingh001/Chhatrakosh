import React from "react";
import SMSpng from "../assets/SMS_png.webp"
import { useState } from "react";

export default function LandingPage() {

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10,15}$/.test(formData.phone)) {
      newErrors.phone = "Enter a valid phone number (10–15 digits)";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.length < 15) {
      newErrors.message = "Message must be at least 15 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // ✅ valid if no errors
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return; // ❌ stop if invalid

    const phoneNumber = "916396949336"; // ✅ your WhatsApp number
    const text = `Hello, I am ${formData.name}.
Phone: ${formData.phone}
Message: ${formData.message}`;

    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");

    // Optional: clear form after submit
    setFormData({ name: "", phone: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-gray-900 text-white flex flex-col">
      {/* Navbar */}
      <header className="w-full px-6 py-4 flex justify-between items-center bg-opacity-20 backdrop-blur-md sticky top-0 z-50">
        <h1 className="text-2xl font-bold">🎓 ChhatraKosh</h1>
        <nav className="space-x-6 hidden md:flex">
          <a href="#features" className="hover:text-yellow-300">Features</a>
          <a href="#about" className="hover:text-yellow-300">About</a>
          <a href="#contact" className="hover:text-yellow-300">Contact</a>
        </nav>
        <div className="space-x-3 hidden md:flex">
          {/* Login/Register Buttons */}
          <a href="/student/login" className="px-4 py-2 bg-green-500 rounded-lg hover:bg-green-600 transition">
            Student Login
          </a>
          <a href="/teacher/login" className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition">
            Teacher Login
          </a>
          <a href="/admin/login" className="px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600 transition">
            Admin Login
          </a>
          <a href="/admin/register" className="px-4 py-2 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 transition">
            Admin Register
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-8 md:px-20 py-16 flex-grow">
        <div className="md:w-1/2 text-center md:text-left">
          <h2 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Simplify Student <br /> Management 📚
          </h2>
          <p className="mt-6 text-lg text-gray-300">
            A modern Student Management System (SMS) for handling admissions,
            attendance, homework, complaints, and communication between students,
            teachers, and admins.
          </p>
          <div className="mt-8 space-x-4 flex flex-wrap gap-3 justify-center md:justify-start">
            {/* CTA Buttons */}
            <a href="/student/login" className="px-5 py-3 bg-green-500 text-black font-semibold rounded-xl hover:bg-green-400 transition">
              Student Login
            </a>
            <a href="/teacher/login" className="px-5 py-3 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-400 transition">
              Teacher Login
            </a>
            <a href="/admin/login" className="px-5 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-400 transition">
              Admin Login
            </a>
            <a href="/admin/register" className="px-5 py-3 bg-yellow-500 text-black font-semibold rounded-xl hover:bg-yellow-400 transition">
              Admin Register
            </a>
          </div>
        </div>
        <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
          <img
            src={SMSpng} // 👉 replace with your illustration
            alt="SMS Dashboard"
            className="rounded-2xl shadow-2xl w-3/4 hover:scale-105 transition"
          />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-8 md:px-20 py-16 bg-gray-100 text-black">
        <h3 className="text-3xl font-bold text-center mb-10">✨ Key Features</h3>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Student Dashboard */}
          <div className="p-6 bg-white rounded-2xl shadow hover:shadow-xl transition">
            <h4 className="text-xl font-semibold mb-2">👨‍🎓 Student Dashboard</h4>
            <p className="text-gray-600">
              View homework, attendance, grades, and submit complaints.
            </p>
          </div>

          {/* Teacher Tools */}
          <div className="p-6 bg-white rounded-2xl shadow hover:shadow-xl transition">
            <h4 className="text-xl font-semibold mb-2">👩‍🏫 Teacher Tools</h4>
            <p className="text-gray-600">
              Assign homework, mark attendance, and review complaints.
            </p>
          </div>

          {/* Admin Panel */}
          <div className="p-6 bg-white rounded-2xl shadow hover:shadow-xl transition">
            <h4 className="text-xl font-semibold mb-2">🛠️ Admin Panel</h4>
            <p className="text-gray-600">
              Manage students, teachers, leaves, notices, and analytics.
            </p>
          </div>

          {/* Attendance Management */}
          <div className="p-6 bg-white rounded-2xl shadow hover:shadow-xl transition">
            <h4 className="text-xl font-semibold mb-2">📅 Attendance Management</h4>
            <p className="text-gray-600">
              Track student and teacher attendance with real-time reports.
            </p>
          </div>

          {/* Notice Board */}
          <div className="p-6 bg-white rounded-2xl shadow hover:shadow-xl transition">
            <h4 className="text-xl font-semibold mb-2">📢 Digital Notice Board</h4>
            <p className="text-gray-600">
              Share updates, circulars, and announcements instantly with everyone.
            </p>
          </div>

          {/* Leave Management */}
          <div className="p-6 bg-white rounded-2xl shadow hover:shadow-xl transition">
            <h4 className="text-xl font-semibold mb-2">📝 Leave Management</h4>
            <p className="text-gray-600">
              Apply, approve, and track leave requests with transparency.
            </p>
          </div>

          {/* Results & Reports */}
          <div className="p-6 bg-white rounded-2xl shadow hover:shadow-xl transition">
            <h4 className="text-xl font-semibold mb-2">📊 Results & Reports</h4>
            <p className="text-gray-600">
              Generate performance reports, exam results, and subject-wise analytics.
            </p>
          </div>

          {/* Secure Login */}
          <div className="p-6 bg-white rounded-2xl shadow hover:shadow-xl transition">
            <h4 className="text-xl font-semibold mb-2">🔐 Secure Login</h4>
            <p className="text-gray-600">
              Role-based login for students, teachers, and admins with full security.
            </p>
          </div>
        </div>
      </section>


      {/* About Section */}
      <section id="about" className="px-8 md:px-20 py-16 text-center">
        <h3 className="text-3xl font-bold mb-6">📖 About ChhatraKosh</h3>
        <p className="text-lg text-gray-300 max-w-3xl mx-auto">
          SMS is designed to streamline the academic process by providing
          students, teachers, and admins with dedicated dashboards. From
          attendance tracking to homework assignments and complaints management,
          our platform makes school operations easier and faster.
        </p>
      </section>

      {/* Contact Section */}
      <section id="contact" className="px-8 md:px-20 py-16 bg-indigo-950">
        <h3 className="text-3xl font-bold text-center mb-6">📩 Contact Us</h3>
        <p className="text-center text-gray-300 mb-8">
          Have questions? Reach out to us!
        </p>
        <form className="max-w-lg mx-auto space-y-4" onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border ${errors.name ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-yellow-400`}
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <input
              type="tel"
              name="phone"
              placeholder="Your Number"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border ${errors.phone ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-yellow-400`}
            />
            {errors.phone && (
              <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          <div>
            <textarea
              name="message"
              placeholder="Your Message"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border ${errors.message ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-yellow-400`}
            />
            {errors.message && (
              <p className="text-red-400 text-sm mt-1">{errors.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!formData.name || !formData.phone || !formData.message}
            className="w-full py-3 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send Message ✉️
          </button>
        </form>
      </section>
      {/* Footer */}
      <footer className="py-6 bg-indigo-950 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} SMS | Built by ❤️ Sameer Singh
      </footer>
    </div>
  );
}
