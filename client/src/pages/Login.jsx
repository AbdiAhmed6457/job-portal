import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card.jsx";
import { Input } from "../components/ui/Input.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Loader2 } from "lucide-react";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login(email, password);
      const role = data.user?.role;
      if (role === "recruiter") navigate("/dashboard/recruiter");
      else if (role === "admin") navigate("/dashboard/admin");
      else navigate("/");
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-72 h-72 bg-white rounded-full opacity-10 animate-float"
            style={{
              top: `${20 + i * 15}%`,
              left: `${10 + i * 12}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${15 + i * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md backdrop-blur-xl bg-white/90 shadow-2xl border-0 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10" />
          
          <CardHeader className="relative pb-8 text-center">
            <div className="mx-auto w-20 h-20 mb-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Welcome Back!
            </CardTitle>
            <p className="mt-2 text-gray-600">Sign in to continue your journey</p>
          </CardHeader>

          <CardContent className="relative space-y-5 px-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 text-lg border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-300"
                />
              </div>

              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 text-lg border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm animate-pulse">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg transform transition-all duration-200 hover:scale-[1.02] active:scale-100"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </CardContent>

          <div className="relative px-8 pb-8 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <a
                href="/register"
                className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline transition-all"
              >
                Register now
              </a>
            </p>
          </div>
        </Card>
      </div>

      {/* Optional: Add subtle wave at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
    </div>
  );
};

export default Login;