// client/src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ user, onLogout }) => {
  // Determine dashboard route based on user role
  const getDashboardLink = () => {
    if (!user) return "/login";
    switch (user.role) {
      case "admin":
        return "/admin/dashboard";
      case "recruiter":
        return "/recruiter/dashboard";
      case "student":
        return "/student/dashboard";
      default:
        return "/"; // fallback
    }
  };

  return (
    <nav className="bg-blue-600 text-white fixed w-full z-50 top-0 shadow">
      <div className="container mx-auto flex justify-between items-center px-4 py-3">
        <Link to="/" className="text-2xl font-bold text-white">
          MS Job Portal
        </Link>

        <div className="space-x-4">
          <Link to="/" className="hover:text-green-300">
            Home
          </Link>

          {user ? (
            <>
              <Link to='/dashboard' className="hover:text-green-300">
                Dashboard
              </Link>
              <button
                onClick={onLogout}
                className="hover:text-yellow-300 font-semibold"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-green-300">
                Login
              </Link>
              <Link to="/register" className="hover:text-yellow-300">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
