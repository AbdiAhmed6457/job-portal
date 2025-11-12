// client/src/components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = ({ user, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobileMenuOpen(false);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-blue-600 hover:text-blue-800 transition-colors"
        >
          MS Job Portal
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/jobs"
            className="text-gray-700 hover:text-blue-600 transition-colors"
          >
            Jobs
          </Link>
          <Link
            to="/companies"
            className="text-gray-700 hover:text-blue-600 transition-colors"
          >
            Companies
          </Link>

          {!user ? (
            <>
              <Link to="/login">
                <button className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                Login
                </button>
              </Link>
              <Link to="/register">
                <button className="px-4 py-2 rounded border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors">
                  Register
                </button>
              </Link>
            </>
          ) : (
            <button
              onClick={() => {
                onLogout();
                navigate("/login");
              }}
              className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-700 hover:text-blue-600 transition-colors"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg border-t border-gray-200">
          <div className="flex flex-col px-4 py-4 gap-4">
            <Link
              to="/jobs"
              className="text-gray-700 hover:text-blue-600 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Jobs
            </Link>
            <Link
              to="/companies"
              className="text-gray-700 hover:text-blue-600 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Companies
            </Link>

            {!user ? (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            ) : (
              <button
                onClick={() => {
                  onLogout();
                  setIsMobileMenzuOpen(false);
                  navigate("/login");
                }}
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition-colors text-center"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
