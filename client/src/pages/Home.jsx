// client/src/pages/Home.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import JobCard from "../component/JobCard";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/job");
        setJobs(res.data.jobs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto text-center px-4">
          <h1 className="text-5xl font-bold mb-4">Find Your Dream Job</h1>
          <p className="text-xl mb-6">Connecting talented students with top recruiters.</p>
          <div className="space-x-4">
            <Link
              to="/jobs"
              className="px-6 py-3 bg-green-500 rounded font-semibold hover:bg-green-600 transition"
            >
              Browse Jobs
            </Link>
            {user?.role === "recruiter" && (
              <Link
                to="/job/create"
                className="px-6 py-3 bg-yellow-400 rounded font-semibold text-blue-700 hover:bg-yellow-300 transition"
              >
                Post a Job
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">Latest Jobs</h2>
        {loading ? (
          <p className="text-center text-gray-500">Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <p className="text-center text-gray-500">No jobs available yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
