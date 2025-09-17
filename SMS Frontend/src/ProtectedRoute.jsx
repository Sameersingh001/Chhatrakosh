import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user, loading } = useContext(AuthContext);

if (loading)
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="w-16 h-16 border-4 border-t-transparent border-blue-500 border-b-purple-500 border-l-pink-500 border-r-indigo-500 rounded-full animate-spin mb-4 shadow-lg"></div>
      <p className="text-gray-700 text-lg font-medium animate-pulse">Loading...</p>
    </div>
  );

  if (!user) return <Navigate to="/" replace />;

  if (!allowedRoles.includes(user.role)) {
    if (user.role === "admin") return <Navigate to="/admin/dashboard" replace />;
    if (user.role === "teacher") return <Navigate to="/teacher/dashboard" replace />;
    if (user.role === "student") return <Navigate to="/student/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
