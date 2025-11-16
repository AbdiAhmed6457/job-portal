// src/pages/recruiter/CreateCompany.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button.jsx";
import { Input } from "../../components/ui/Input.jsx";

const CreateCompany = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    logoUrl: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/company",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/recruiter/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-green-500 via-green-600 to-green-700 overflow-hidden px-4">
      
      {/* Floating circles for subtle animation */}
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full opacity-10 animate-float"
          style={{
            width: `${200 + i * 40}px`,
            height: `${200 + i * 40}px`,
            top: `${10 + i * 15}%`,
            left: `${5 + i * 20}%`,
            background: "white",
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${12 + i * 4}s`,
          }}
        />
      ))}

      {/* Form Card */}
      <div className="relative z-10 w-full max-w-lg p-8 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20">
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-2">
          Register Your Company
        </h2>
        <p className="text-gray-700 text-center mb-6">
          Create your company profile to start posting jobs professionally.
        </p>

        {error && (
          <div className="p-3 mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Company Name</label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Acme Corporation"
              className="w-full h-12 border-2 border-gray-300 rounded-lg px-3 focus:border-green-500 focus:ring-2 focus:ring-green-500/30 transition"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Logo URL</label>
            <Input
              type="text"
              name="logoUrl"
              value={formData.logoUrl}
              onChange={handleChange}
              placeholder="https://example.com/logo.png"
              className="w-full h-12 border-2 border-gray-300 rounded-lg px-3 focus:border-green-500 focus:ring-2 focus:ring-green-500/30 transition"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              required
              placeholder="Describe your company..."
              className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/30 transition"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 font-semibold bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg transition-transform duration-200 hover:scale-[1.03]"
          >
            {loading ? "Submitting..." : "Create Company"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateCompany;
