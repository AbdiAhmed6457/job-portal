// client/src/pages/JobDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const JobDetail = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/job`);
        const foundJob = res.data.jobs.find((j) => j.id === parseInt(id));
        setJob(foundJob);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  if (loading) return <p className="text-center mt-8 text-gray-500">Loading job details...</p>;
  if (!job) return <p className="text-center mt-8 text-gray-500">Job not found</p>;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold text-blue-700 mb-4">{job.title}</h1>
        <p className="text-gray-600 font-semibold mb-2">{job.Company?.name}</p>
        <p className="text-gray-500 mb-2">{job.location}</p>
        <p className="text-gray-400 mb-4">
          Expires on: {new Date(job.expiresAt).toLocaleDateString()}
        </p>

        <h2 className="text-xl font-semibold text-blue-700 mb-2">Job Description</h2>
        <p className="text-gray-700 mb-4">{job.description}</p>

        {job.requirements && (
          <>
            <h2 className="text-xl font-semibold text-blue-700 mb-2">Requirements</h2>
            <p className="text-gray-700 mb-4">{job.requirements}</p>
          </>
        )}

        {job.gpaMin && (
          <p className="text-gray-700 font-semibold">Minimum GPA: {job.gpaMin}</p>
        )}

        <button className="mt-6 px-6 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600 transition">
          Apply Now
        </button>
      </div>
    </div>
  );
};

export default JobDetail;
