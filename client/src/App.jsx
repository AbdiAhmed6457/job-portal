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
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/job/:id" element={<JobDetail />} />
          <Route path="/recruiter/dashboard" element={<Dashboard />} />
          <Route path="/recruiter/create-company" element={<CreateCompany />} />
          <Route path="/recruiter/post-job" element={<PostJob />} />


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
