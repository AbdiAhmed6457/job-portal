// src/pages/recruiter/Dashboard.jsx
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

import JobCard from "../../component/recruiter/JobCard";
import CompanyCard from "../../component/recruiter/CompanyCard";
import StatsCard from "../../component/recruiter/StatsCard";

const Dashboard = () => {
  const { user, token } = useContext(AuthContext);
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch company info
        const companyRes = await axios.get("/api/company/mine", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCompany(companyRes.data.company || null);

        // Fetch recruiter jobs
        const jobsRes = await axios.get("/api/job/myJobs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobs(jobsRes.data.jobs || []);

        // Fetch recruiter applications (latest 5)
        const appsRes = await axios.get("/api/application/myApplications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplications(appsRes.data.applications || []);
      } catch (err) {
        console.error("Dashboard fetch error:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  if (loading)
    return (
      <div className="text-center mt-20 text-gray-500">Loading...</div>
    );

  // Stats cards data
  const stats = [
    { title: "Total Jobs", value: jobs.length, color: "blue", link: "/recruiter/jobs" },
    { title: "Approved Jobs", value: jobs.filter(j => j.status === "approved").length, color: "green", link: "/recruiter/jobs?status=approved" },
    { title: "Pending Jobs", value: jobs.filter(j => j.status === "pending").length, color: "yellow", link: "/recruiter/jobs?status=pending" },
    { title: "Expired Jobs", value: jobs.filter(j => j.status === "expired").length, color: "red", link: "/recruiter/jobs?status=expired" },
    { title: "Total Applications", value: applications.length, color: "purple", link: "/recruiter/applications" },
    { title: "New Applications", value: applications.filter(a => a.status === "new").length, color: "pink", link: "/recruiter/applications?status=new" },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* --- Top Greeting & Company --- */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome back, {company?.name || "Recruiter"}!
        </h1>
        {company ? (
          <CompanyCard company={company} />
        ) : (
          <a
            href="/recruiter/create-company"
            className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg transition"
          >
            Create Your Company
          </a>
        )}
      </div>

      {/* --- Stats Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        {/* Jobs stats */}
        <StatsCard
          title="Total Jobs"
          value={jobs.length}
          color="blue"
          link="/recruiter/jobs"
        />
        <StatsCard
          title="Approved Jobs"
          value={jobs.filter(j => j.status === "approved").length}
          color="green"
          link="/recruiter/jobs?status=approved"
        />
        <StatsCard
          title="Pending Jobs"
          value={jobs.filter(j => j.status === "pending").length}
          color="yellow"
          link="/recruiter/jobs?status=pending"
        />
        <StatsCard
          title="Expired Jobs"
          value={jobs.filter(j => j.status === "expired").length}
          color="red"
          link="/recruiter/jobs?status=expired"
        />
        {/* Applications stats */}
        <StatsCard
          title="Total Applications"
          value={applications.length}
          color="purple"
          link="/recruiter/applications"
        />
        <StatsCard
          title="New Applications"
          value={applications.filter(a => a.status === "new").length}
          color="pink"
          link="/recruiter/applications?status=new"
        />
      </div>

      {/* --- Quick Actions --- */}
      <div className="flex flex-wrap gap-4">
        <a
          href="/recruiter/post-job"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg transition"
        >
          Post New Job
        </a>
        <a
          href="/recruiter/jobs"
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-3 rounded-lg transition"
        >
          View All Jobs
        </a>
        {company && (
          <a
            href="/recruiter/company"
            className="bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-lg transition"
          >
            Edit Company
          </a>
        )}
        <a
          href="/recruiter/applications"
          className="bg-purple-500 hover:bg-purple-600 text-white px-5 py-3 rounded-lg transition"
        >
          View Applications
        </a>
      </div>

      {/* --- Recent Jobs Preview --- */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Jobs</h2>
        {jobs.length === 0 ? (
          <p className="text-gray-500">No jobs posted yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.slice(0, 6).map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
        {jobs.length > 6 && (
          <a
            href="/recruiter/jobs"
            className="mt-4 inline-block text-blue-600 hover:underline"
          >
            View All Jobs
          </a>
        )}
      </div>

      {/* --- Recent Applications Preview --- */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Applications</h2>
        {applications.length === 0 ? (
          <p className="text-gray-500">No applications yet.</p>
        ) : (
          <div className="space-y-2">
            {applications.slice(0, 5).map(app => (
              <div key={app.id} className="border p-3 rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-semibold">{app.candidateName}</p>
                  <p className="text-sm text-gray-500">{app.jobTitle}</p>
                </div>
                <span className={`px-2 py-1 rounded text-white ${
                  app.status === "new" ? "bg-green-500" :
                  app.status === "reviewed" ? "bg-blue-500" :
                  "bg-gray-400"
                }`}>
                  {app.status}
                </span>
              </div>
            ))}
            {applications.length > 5 && (
              <a
                href="/recruiter/applications"
                className="mt-2 inline-block text-blue-600 hover:underline"
              >
                View All Applications
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
