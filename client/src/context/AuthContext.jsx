// client/src/context/AuthContext.js
import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  // Register + auto-login
const register = async (name, email, password, role) => {
  const res = await fetch("http://localhost:5000/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, role }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message);

  // Store token + user
  localStorage.setItem("token", data.accessToken);
  const userData = {
    email: data.user.email,
    role: data.user.role,
    name: data.user.name,
  };
  localStorage.setItem("user", JSON.stringify(userData));

  setToken(data.accessToken);
  setUser(userData);

  return data;
};


  const login = async (email, password) => {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login failed");

    const userData = {
      id: data.user?.id,
      email: data.user?.email,
      role: data.user?.role,
      name: data.user?.name,
    };

    localStorage.setItem("token", data.accessToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(data.accessToken);
    setUser(userData);

    return { user: userData, accessToken: data.accessToken };
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    window.location.href = "/login"; // force redirect
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
