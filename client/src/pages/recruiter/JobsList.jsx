// src/pages/recruiter/JobsList.jsx
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useSearchParams, useNavigate } from "react-router-dom";

const JobsList = () => {
  const { token } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all"); // default all jobs
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get status filter from query string
  useEffect(() => {
    const statusFromQuery = searchParams.get("status") || "all";
    setStatusFilter(statusFromQuery);
  }, [searchParams]);

  // Fetch jobs whenever token or filter changes
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/job/myJobs", {
          headers: { Authorization: `Bearer ${token}` },
        });

        let jobsData = res.data.jobs || [];
        if (statusFilter !== "all") {
          jobsData = jobsData.filter(job => job.status === statusFilter);
        }

        setJobs(jobsData);
      } catch (err) {
        console.error("Fetch jobs error:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [token, statusFilter]);

  if (loading)
    return <p className="text-center mt-10 text-gray-500">Loading jobs...</p>;

  const statusColors = {
    approved: "bg-green-500",
    pending: "bg-yellow-500",
    expired: "bg-red-500",
    rejected: "bg-gray-400",
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">My Jobs</h1>

      {/* --- Filter Buttons --- */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["all", "approved", "pending", "expired"].map(status => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-lg transition font-medium ${
              statusFilter === status
                ? "bg-blue-600 text-white shadow"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* --- Jobs Table --- */}
      {jobs.length === 0 ? (
        <p className="text-gray-500">No jobs found for "{statusFilter}"</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left">Title</th>
                <th className="border px-4 py-2 text-left">Category</th>
                <th className="border px-4 py-2 text-left">Type</th>
                <th className="border px-4 py-2 text-left">Status</th>
                <th className="border px-4 py-2 text-left">Applications</th>
                <th className="border px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map(job => (
                <tr key={job.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{job.title}</td>
                  <td className="border px-4 py-2">{job.category}</td>
                  <td className="border px-4 py-2">{job.jobType}</td>
                  <td className="border px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-white ${
                        statusColors[job.status] || "bg-gray-400"
                      }`}
                    >
                      {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                    </span>
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => navigate(`/recruiter/applications?job=${job.id}`)}
                    >
                      View Applications
                    </button>
                  </td>
                  <td className="border px-4 py-2 flex gap-2">
                    <button
                      onClick={() => navigate(`/recruiter/edit-job/${job.id}`)}
                      className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 transition"
                    >
                      Edit
                    </button>
                    <button
                      // Delete functionality can be implemented later
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default JobsList;
