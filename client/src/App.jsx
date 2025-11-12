// client/src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./component/Navbar";
import Home from "./pages/Home";

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

// AppContent pulls user and logout from AuthContext
const AppContent = () => {
  const { user, logout } = React.useContext(AuthContext);

  return (
    <>
      <Navbar user={user} onLogout={logout} />
      <div className="pt-20">
        <Routes>
          {/* 🟢 Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* 🔒 Example protected route (add more as needed) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div className="p-6 text-center text-lg">Welcome to your Dashboard</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </>
  );
};

// Protects routes that require authentication
const ProtectedRoute = ({ children }) => {
  const { user } = React.useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

export default App;
