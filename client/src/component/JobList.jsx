import React, { useEffect, useState } from "react";
import JobCard from "./JobCard";

const JobList = ({ limit = 12 }) => { // Default now 12
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/job?status=approved&limit=${limit}&page=1`);
        const data = await res.json();

        // Ensure Company info is always defined
        const jobsWithCompany = data.jobs.map((job) => ({
          ...job,
          Company: job.Company || { name: "Unknown Company", logoUrl: null },
        }));

        setJobs(jobsWithCompany);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      }
    };
    fetchJobs();
  }, [limit]);

  if (!jobs.length) return <p className="text-gray-600">No jobs available yet.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
};

export default JobList;
