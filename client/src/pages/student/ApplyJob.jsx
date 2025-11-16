import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ApplyJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [coverLetter, setCoverLetter] = useState("");
  const [cvFile, setCvFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleFileChange = (e) => {
    setCvFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!cvFile) {
      setErrorMsg("Please upload your CV.");
      return;
    }

    const formData = new FormData();
    formData.append("coverLetter", coverLetter);
    formData.append("cv", cvFile);
    formData.append("jobId", id);

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/application", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData, // No JSON — FormData handles everything
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || "Failed to apply.");
        setLoading(false);
        return;
      }

      setSuccessMsg("Application submitted successfully!");
      setTimeout(() => navigate(`/job/${id}`), 1500);

    } catch (err) {
      console.error(err);
      setErrorMsg("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-12 p-8 bg-white shadow-lg rounded-xl border">
      <h1 className="text-3xl font-bold text-green-600 text-center mb-6">
        Apply for Job
      </h1>

      {errorMsg && (
        <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="bg-green-100 text-green-700 p-3 mb-4 rounded">
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit}>

        {/* Cover Letter */}
        <label className="block mb-2 font-semibold text-gray-700">
          Cover Letter
        </label>
        <textarea
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          className="w-full border rounded-lg p-3 h-32 focus:ring focus:ring-green-300"
          placeholder="Write your cover letter..."
        />

        {/* CV Upload */}
        <label className="block mt-4 mb-2 font-semibold text-gray-700">
          Upload CV (PDF only)
        </label>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="w-full border p-2 rounded-lg"
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold shadow"
        >
          {loading ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </div>
  );
};

export default ApplyJob;
