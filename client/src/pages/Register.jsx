// client/src/pages/Register.jsx
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Card } from "../components/ui/Card.jsx";
import { Input } from "../components/ui/Input.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Loader2 } from "lucide-react";

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(formData.name, formData.email, formData.password, formData.role);
      if (formData.role === "recruiter") navigate("/recruiter/create-company");
      else navigate("/");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-500 overflow-hidden">
      {/* Floating circles */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute w-60 h-60 rounded-full opacity-10 animate-float"
          style={{
            top: `${15 + i * 12}%`,
            left: `${10 + i * 12}%`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${12 + i * 4}s`,
            background: "white",
          }}
        />
      ))}

      {/* Form Card */}
      <Card className="relative z-10 w-full max-w-md p-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl border-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 pointer-events-none rounded-2xl" />

        {/* Header */}
        <div className="relative text-center mb-6">
          <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Create Account
          </h2>
          <p className="mt-2 text-gray-700">Sign up and start your journey</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="h-12 text-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 rounded-lg transition"
          />
          <Input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            required
            className="h-12 text-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 rounded-lg transition"
          />
          <Input
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
            className="h-12 text-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 rounded-lg transition"
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="h-12 w-full border-2 border-gray-200 rounded-lg px-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition"
          >
            <option value="student">Student</option>
            <option value="recruiter">Recruiter</option>
          </select>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm animate-pulse">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg transition-transform duration-200 hover:scale-[1.03]"
          >
            {loading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin inline-block" />
            ) : (
              "Register"
            )}
          </Button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-gray-600 text-sm">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-all"
          >
            Login
          </a>
        </p>
      </Card>
    </div>
  );
};

export default Register;
