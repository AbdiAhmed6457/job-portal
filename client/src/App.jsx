// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import JobDetail from "./pages/JobDetail";

import CreateCompany from "./pages/recruiter/CreateCompany";
import Dashboard from "./pages/recruiter/Dashboard";
import PostJob from "./pages/recruiter/PostJob";
import JobsList from "./pages/recruiter/JobsList";
import ApplicationsList from "./pages/recruiter/ApplicationList";

import ApplyJob from "./pages/student/ApplyJob";
import StudentDashboard from "./pages/student/Dashboard";

import DashboardRedirect from "./component/DashboardRedirect";

import AdminLayout from "./layouts/adminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminJobs from "./pages/admin/AdminJobs";
import AdminCompanies from "./pages/admin/AdminCompanies";
import AdminApplications from "./pages/admin/AdminApplications";

// Components
import Navbar from "./component/Navbar";
import Footer from "./component/Footer";

// Protected Route
const ProtectedRoute = ({ children }) => {
  const { user } = React.useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// MAIN APP — NO BROWSERROUTER HERE ANYMORE!
const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

const AppContent = () => {
  const { user, logout } = React.useContext(AuthContext);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar user={user} onLogout={logout} />

      <main className="flex-grow pt-20">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/job/:id" element={<JobDetail />} />

          {/* Student Routes */}
          <Route
            path="/job/:jobId/apply"
            element={<ProtectedRoute><ApplyJob /></ProtectedRoute>}
          />
          <Route
            path="/student/dashboard"
            element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>}
          />

          {/* Recruiter Routes */}
          <Route
            path="/recruiter/dashboard"
            element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
          />
          <Route
            path="/recruiter/create-company"
            element={<ProtectedRoute><CreateCompany /></ProtectedRoute>}
          />
          <Route
            path="/recruiter/post-job"
            element={<ProtectedRoute><PostJob /></ProtectedRoute>}
          />
          <Route
            path="/recruiter/jobs"
            element={<ProtectedRoute><JobsList /></ProtectedRoute>}
          />
          <Route
            path="/recruiter/applications"
            element={<ProtectedRoute><ApplicationsList /></ProtectedRoute>}
          />

          {/* Universal dashboard redirect */}
          <Route
            path="/dashboard"
            element={<ProtectedRoute><DashboardRedirect /></ProtectedRoute>}
          />

          {/* ADMIN ROUTES — with sidebar layout */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="jobs" element={<AdminJobs />} />
            <Route path="companies" element={<AdminCompanies />} />
            <Route path="applications" element={<AdminApplications />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<div className="text-center py-32 text-3xl text-red-600">404 - Page Not Found</div>} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default App;