// client/src/components/Navbar.jsx
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-green-500 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-gold-500 hover:text-yellow-400">
          MS Job Portal
        </Link>

        <div className="flex items-center space-x-4">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <Link to="/jobs" className="hover:underline">
            Jobs
          </Link>
          {user ? (
            <>
              {user.role === "recruiter" && (
                <Link to="/dashboard/recruiter" className="hover:underline">
                  Dashboard
                </Link>
              )}
              {user.role === "student" && (
                <Link to="/dashboard" className="hover:underline">
                  Dashboard
                </Link>
              )}
              {user.role === "admin" && (
                <Link to="/dashboard/admin" className="hover:underline">
                  Admin
                </Link>
              )}
              <button
                onClick={logout}
                className="ml-2 px-3 py-1 bg-yellow-400 text-blue-700 font-semibold rounded hover:bg-yellow-300 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">
                Login
              </Link>
              <Link
                to="/register"
                className="ml-2 px-3 py-1 bg-yellow-400 text-blue-700 font-semibold rounded hover:bg-yellow-300 transition"
              >
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
