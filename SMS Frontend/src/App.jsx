import { Routes, Route, Navigate } from "react-router-dom";
import React, { useContext } from "react";
import AdminRegister from "./AdminPages/AdminRegister";
import LandingPage from "./LandingPages/LandingPage";
import AdminLogin from "./AdminPages/AdminLogin";
import AdminDeshbord from "./AdminPages/AdminDeshboard/AdminDeshbord";
import TeacherLogin from "./TeacherPages/TeacherLogin";
import Dashboard from "./TeacherPages/TeacherDashBoard/Dashboard";
import StudentLogin from "./StudentPages/StudentLogin";
import StudentDeshboard from "./StudentPages/StudentDashboard/StudentDeshboard";
import AuthProvider, { AuthContext } from "./AuthContext";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Admin Routes */}
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/admin/login" element={<LoginWrapper><AdminLogin /></LoginWrapper>} />
        <Route
          path="/admin/dashboard/*"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDeshbord />
            </ProtectedRoute>
          }
        />

        {/* Teacher Routes */}
        <Route path="/teacher/login" element={<LoginWrapper><TeacherLogin /></LoginWrapper>} />
        <Route
          path="/teacher/dashboard/*"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Student Routes */}
        <Route path="/student/login" element={<LoginWrapper><StudentLogin /></LoginWrapper>} />
        <Route
          path="/student/dashboard/*"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentDeshboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

/**
 * 🔹 LoginWrapper:
 * If user already logged in → redirect to their dashboard.
 */
function LoginWrapper({ children }) {
  const { user } = useContext(AuthContext);

  if (user) {
    if (user.role === "admin") return <Navigate to="/admin/dashboard" />;
    if (user.role === "teacher") return <Navigate to="/teacher/dashboard" />;
    if (user.role === "student") return <Navigate to="/student/dashboard" />;
  }

  return children;
}

export default App;
