// src/pages/recruiter/PostJob.jsx
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Input } from "../../components/ui/Input.jsx";
import { Button } from "../../components/ui/Button.jsx";

const PostJob = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    gpaMin: "",
    location: "",
    salary: "",
    jobType: "full-time",
    category: "",
    expiresAt: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setSuccess("Job created successfully and pending approval!");
      setFormData({
        title: "",
        description: "",
        requirements: "",
        gpaMin: "",
        location: "",
        salary: "",
        jobType: "full-time",
        category: "",
        expiresAt: "",
      });

      // Redirect after short delay
      setTimeout(() => navigate("/recruiter/jobs"), 1500);
    } catch (err) {
      setError(err.message || "Failed to create job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-500 p-4">
      <div className="w-full max-w-2xl bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Post a New Job
        </h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded mb-4 animate-pulse">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded mb-4 animate-pulse">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="title"
            placeholder="Job Title"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <Input
            name="description"
            placeholder="Job Description"
            value={formData.description}
            onChange={handleChange}
            required
          />
          <Input
            name="requirements"
            placeholder="Requirements"
            value={formData.requirements}
            onChange={handleChange}
          />
          <Input
            name="gpaMin"
            placeholder="Minimum GPA (optional)"
            type="number"
            value={formData.gpaMin}
            onChange={handleChange}
          />
          <Input
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
          />
          <Input
            name="salary"
            placeholder="Salary"
            value={formData.salary}
            onChange={handleChange}
          />
          <select
            name="jobType"
            value={formData.jobType}
            onChange={handleChange}
            className="w-full h-11 border-2 border-gray-200 rounded-lg px-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
          >
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="internship">Internship</option>
          </select>
          <Input
            name="category"
            placeholder="Category (e.g., IT, Marketing)"
            value={formData.category}
            onChange={handleChange}
          />
          <Input
            name="expiresAt"
            type="date"
            placeholder="Application Deadline"
            value={formData.expiresAt}
            onChange={handleChange}
          />

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg transition-all"
          >
            {loading ? "Posting Job..." : "Post Job"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
