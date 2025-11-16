// client/src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import JobDetail from "./pages/JobDetail";
import CreateCompany from "./pages/recruiter/CreateCompany";
import Dashboard from "./pages/recruiter/Dashboard";
import DashboardRedirect from "./component/DashboardRedirect";
import PostJob from "./pages/recruiter/PostJob";
import JobsList from "./pages/recruiter/JobsList";
import ApplyJob from "./pages/student/ApplyJob"; 
import ApplicationsList from "./pages/recruiter/ApplicationList"; // Recruiter/Admin applications list
import StudentDashboard from "./pages/student/Dashboard"; 

// Components
import Navbar from "./component/Navbar";
import Footer from "./component/Footer";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user } = React.useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

const AppContent = () => {
  const { user, logout } = React.useContext(AuthContext);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Sticky Navbar */}
      <Navbar user={user} onLogout={logout} />

      {/* Main Content */}
      <main className="flex-grow pt-20">
        <Routes>
          {/* Student Apply Form */}
          <Route
            path="/job/:jobId/apply"
            element={
              <ProtectedRoute>
                <ApplyJob />
              </ProtectedRoute>
            }
          />

          {/* Applications List (recruiter/admin) */}
          <Route
            path="/recruiter/applications"
            element={
              <ProtectedRoute>
                <ApplicationsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/applications"
            element={
              <ProtectedRoute>
                <ApplicationsList />
              </ProtectedRoute>
            }
          />

          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/job/:id" element={<JobDetail />} />

          {/* Recruiter Routes */}
          <Route
            path="/recruiter/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/create-company"
            element={
              <ProtectedRoute>
                <CreateCompany />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/post-job"
            element={
              <ProtectedRoute>
                <PostJob />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/jobs"
            element={
              <ProtectedRoute>
                <JobsList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          {/* Example Protected Route */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardRedirect />
              </ProtectedRoute>
            }
          />

          {/* 404 fallback */}
          <Route
            path="*"
            element={
              <div className="text-center p-10 text-red-500">
                404 | Page Not Found
              </div>
            }
          />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
