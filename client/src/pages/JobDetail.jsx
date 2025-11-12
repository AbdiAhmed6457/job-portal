// client/src/pages/JobDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaBuilding,
  FaGraduationCap,
  FaClipboardList,
  FaCalendarAlt,
  FaDollarSign,
  FaBriefcase,
  FaTag,
} from "react-icons/fa";

const JobDetail = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/job/${id}`);
        const data = await res.json();
        setJob(data.job);
      } catch (err) {
        console.error("Error fetching job:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  if (loading) return <div className="text-center py-20 text-blue-600">Loading job details...</div>;
  if (!job) return <div className="text-center py-20 text-gray-600">Job not found.</div>;

  const requirementsList = Array.isArray(job.requirements)
    ? job.requirements
    : typeof job.requirements === "string"
    ? job.requirements.split("\n")
    : [];

  const salaryDisplay = job.salary
    ? typeof job.salary === "number"
      ? `$${job.salary.toLocaleString()}`
      : job.salary
    : "Negotiable";

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="bg-white shadow-xl border border-gray-200 rounded-2xl p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center gap-6 mb-6">
          {job.Company?.logoUrl ? (
            <img
              src={job.Company.logoUrl}
              alt={job.Company.name}
              className="w-24 h-24 rounded-full object-cover border border-gray-200"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
              No Logo
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-blue-700 mb-2 uppercase border-b-2 border-blue-500 pb-1">
              {job.title}
            </h1>
            <p className="flex items-center text-gray-600 mb-1">
              <FaBuilding className="mr-2 text-green-600" />
              {job.Company?.name || "Unknown Company"}
            </p>
            <p className="flex items-center text-gray-600 mb-1">
              <FaMapMarkerAlt className="mr-2 text-blue-600" />
              {job.location || "Not specified"}
            </p>
            {job.gpaMin && (
              <p className="flex items-center text-gray-600 mb-1">
                <FaGraduationCap className="mr-2 text-yellow-500" />
                Minimum GPA: {job.gpaMin}
              </p>
            )}
            {job.jobType && (
              <p className="flex items-center text-gray-600 mb-1">
                <FaBriefcase className="mr-2 text-purple-500" />
                {job.jobType}
              </p>
            )}
            {job.category && (
              <p className="flex items-center text-gray-600 mb-1">
                <FaTag className="mr-2 text-indigo-500" />
                {job.category}
              </p>
            )}
            <p className="flex items-center text-gray-600 mb-1">
              <FaDollarSign className="mr-2 text-green-500" />
              {salaryDisplay}
            </p>
            <p className="flex items-center text-gray-500 text-sm mt-1">
              <FaCalendarAlt className="mr-2" />
              Posted {new Date(job.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Job Description */}
        <div className="my-6">
          <h2 className="text-xl font-semibold text-blue-700 mb-2 border-b border-blue-500 pb-1">
            Job Description
          </h2>
          <p className="text-gray-700 leading-relaxed">{job.description || "No description provided."}</p>
        </div>

        {/* Requirements */}
        {requirementsList.length > 0 && (
          <div className="my-6">
            <h2 className="text-xl font-semibold text-blue-700 mb-2 border-b border-blue-500 pb-1">
              Requirements
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {requirementsList.map((req, idx) => (
                <li key={idx} className="flex items-center">
                  <FaClipboardList className="mr-2 text-gray-400 mt-0.5" />
                  {req}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Apply Button */}
        <div className="text-center mt-8">
          <a
            href="/login"
            className="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-3 rounded-lg shadow transition-colors"
          >
            Apply Now
          </a>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
