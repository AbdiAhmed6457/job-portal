// client/src/pages/student/StudentDashboard.jsx
import React, { useEffect, useState, useContext } from "react";
import StatCard from "../../component/student/StatCard";
import ApplicationCard from "../../component/student/ApplicationCard";
import { AuthContext } from "../../context/AuthContext";
import { FaClipboardList, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const StudentDashboard = () => {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loadingApps, setLoadingApps] = useState(true);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [filter, setFilter] = useState("all"); // all / accepted / pending / rejected

  // Fetch student applications
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get("/api/application", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Filter only applications of this student
        const studentApps = res.data.applications.map((app) => ({
          ...app,
          jobTitle: app.Job?.title || "Unknown Job",
          companyName: app.Job?.Company?.name || "Unknown Company",
        }));

        setApplications(studentApps);
      } catch (err) {
        console.error("Fetch applications error:", err);
      } finally {
        setLoadingApps(false);
      }
    };
    fetchApplications();
  }, [token]);

  // Fetch all jobs for suggestions
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get("/api/job", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Only jobs student hasn't applied for
        const appliedJobIds = applications.map((a) => a.jobId);
        const suggestedJobs = res.data.jobs.filter(
          (job) => !appliedJobIds.includes(job.id)
        );
        setJobs(suggestedJobs);
      } catch (err) {
        console.error("Fetch jobs error:", err);
      } finally {
        setLoadingJobs(false);
      }
    };

    if (!loadingApps) fetchJobs();
  }, [applications, token, loadingApps]);

  // Stats
  const stats = {
    total: applications.length,
    accepted: applications.filter((a) => a.status === "accepted").length,
    pending: applications.filter((a) => a.status === "pending").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  // Filter applications
  const filteredApps =
    filter === "all"
      ? applications
      : applications.filter((a) => a.status === filter);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-blue-700 mb-6">
        Welcome, {user.name}!
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatCard
          title="Total Applied"
          value={stats.total}
          color="bg-blue-500"
          icon={<FaClipboardList />}
        />
        <StatCard
          title="Accepted"
          value={stats.accepted}
          color="bg-green-500"
          icon={<FaCheckCircle />}
        />
        <StatCard
          title="Pending"
          value={stats.pending}
          color="bg-yellow-500"
          icon={<FaClipboardList />}
        />
        <StatCard
          title="Rejected"
          value={stats.rejected}
          color="bg-red-500"
          icon={<FaTimesCircle />}
        />
      </div>

      {/* Application Filters */}
      <div className="flex gap-3 mb-6">
        {["all", "accepted", "pending", "rejected"].map((status) => (
          <button
            key={status}
            className={`px-4 py-2 rounded font-semibold ${
              filter === status
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => setFilter(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Applications */}
      <div className="space-y-4 mb-12">
        {loadingApps ? (
          <p className="text-center text-blue-600">Loading applications...</p>
        ) : filteredApps.length === 0 ? (
          <p className="text-center text-gray-600">
            No applications in this category.
          </p>
        ) : (
          filteredApps.map((app) => (
            <ApplicationCard
              key={app.id}
              application={app}
              onViewJob={() => navigate(`/job/${app.jobId}`)}
            />
          ))
        )}
      </div>

      {/* Job Suggestions */}
      <div>
        <h2 className="text-2xl font-bold text-green-700 mb-4">
          Suggested Jobs
        </h2>
        {loadingJobs ? (
          <p className="text-center text-blue-600">Loading suggestions...</p>
        ) : jobs.length === 0 ? (
          <p className="text-center text-gray-600">
            No new job suggestions at the moment.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white shadow-lg rounded p-4 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                  <p className="text-gray-600 mb-2">
                    Company: {job.Company?.name || "Unknown Company"}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {job.jobType || "Full-time"}
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/job/${job.id}`)}
                  className="mt-4 bg-green-600 text-white font-semibold py-2 rounded hover:bg-green-700 transition"
                >
                  View Job
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
