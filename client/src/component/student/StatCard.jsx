// client/src/pages/student/ApplyJob.jsx
import React, { useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

const ApplyJob = () => {
  const { token } = useContext(AuthContext);
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [coverLetter, setCoverLetter] = useState("");
  const [cvFile, setCvFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false); // toggle for showing fancy modal

  const handleFileChange = (e) => {
    setCvFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("jobId", jobId);
      formData.append("coverLetter", coverLetter);
      if (cvFile) formData.append("cv", cvFile);

      await axios.post("http://localhost:5000/api/application", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // Show fancy modal
      setSuccess(true);

      // Redirect after 5 seconds
      setTimeout(() => {
        navigate("/");
      }, 5000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to apply for job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 relative">
      {/* Fancy Success Modal */}
      {success && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-10 max-w-2xl w-full text-center relative shadow-2xl animate-fadeIn">
            <h1 className="text-5xl font-extrabold text-green-600 mb-4 animate-pulse">
              🎉 Congratulations! 🎉
            </h1>
            <p className="text-xl text-gray-700 mb-6">
              Your application has been submitted successfully! 🚀
            </p>
            <div className="flex justify-center mb-6">
              <img
                src="https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif"
                alt="celebration"
                className="w-40 h-40"
              />
            </div>
            <p className="text-green-500 font-semibold text-lg">
              You’re one step closer to your dream job!
            </p>
          </div>
          {/* Confetti */}
          <div className="pointer-events-none absolute inset-0">
            {[...Array(100)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-fall"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              ></div>
            ))}
          </div>
        </div>
      )}

      {/* Apply Form */}
      {!success && (
        <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-lg z-10">
          <h2 className="text-2xl font-bold text-green-700 mb-4">Apply for Job</h2>
          {error && <p className="text-red-600 mb-4">{error}</p>}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <textarea
              name="coverLetter"
              placeholder="Write your cover letter..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              required
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              rows={5}
            />
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white font-semibold py-2 rounded hover:bg-green-700 transition"
            >
              {loading ? "Submitting..." : "Apply Now"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ApplyJob;
