import React from "react";
import { Navigate } from "react-router-dom";

const DashboardRedirect = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (user.role === "recruiter") {
    return <Navigate to="/recruiter/dashboard" replace />;
  }

  if (user.role === "student") {
    return <Navigate to="/student/dashboard" replace />;
  }

  // fallback
  return <Navigate to="/login" replace />;
};

export default DashboardRedirect;
