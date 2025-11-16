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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/application", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Filter only student's applications
        const studentApps = res.data.applications.filter(
          (app) => app.studentUserId === user.id
        );
        setApplications(studentApps);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [token, user.id]);

  const stats = {
    total: applications.length,
    accepted: applications.filter((a) => a.status === "accepted").length,
    pending: applications.filter((a) => a.status === "pending").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  const handleViewJob = (jobId) => {
    navigate(`/job/${jobId}`);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-blue-700 mb-6">
        Welcome, {user.name}!
      </h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Applied" value={stats.total} color="bg-blue-500" icon={<FaClipboardList />} />
        <StatCard title="Accepted" value={stats.accepted} color="bg-green-500" icon={<FaCheckCircle />} />
        <StatCard title="Pending" value={stats.pending} color="bg-yellow-500" icon={<FaClipboardList />} />
        <StatCard title="Rejected" value={stats.rejected} color="bg-red-500" icon={<FaTimesCircle />} />
      </div>

      {/* Applications Section */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-center text-blue-600">Loading applications...</p>
        ) : applications.length === 0 ? (
          <p className="text-center text-gray-600">You have not applied to any jobs yet.</p>
        ) : (
          applications.map((app) => (
            <ApplicationCard key={app.id} application={app} onViewJob={handleViewJob} />
          ))
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
