// client/src/component/JobCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaGraduationCap, FaDollarSign } from "react-icons/fa";
import dayjs from "dayjs";

const JobCard = ({ job }) => {
  const truncate = (text, length = 100) => {
    if (!text) return "";
    return text.length > length ? text.substring(0, length) + "..." : text;
  };

  // Safely handle salary display
  const salaryDisplay = job.salary
    ? typeof job.salary === "number"
      ? `$${job.salary.toLocaleString()}`
      : job.salary // descriptive string like "Company scale"
    : "Negotiable";

  return (
    <div className="bg-white border border-gray-200 shadow-md hover:shadow-xl rounded-2xl p-6 transition transform hover:-translate-y-1 duration-300">
      
      {/* Company Logo + Name */}
      <div className="flex items-center mb-3">
        {job.Company?.logoUrl ? (
          <img
            src={job.Company.logoUrl}
            alt={job.Company.name}
            className="w-12 h-12 rounded-full object-cover border border-gray-200 mr-3"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-3 text-xs">
            No Logo
          </div>
        )}
        <p className="flex items-center text-gray-600 font-medium uppercase">
          {job.Company?.name || "UNKNOWN COMPANY"}
        </p>
      </div>

      {/* Job Title */}
      <h3 className="text-xl font-bold text-blue-700 mb-3 uppercase border-b-2 border-blue-500 pb-1">
        {job.title}
      </h3>

      {/* Location */}
      <p className="flex items-center text-gray-600 mb-2">
        <FaMapMarkerAlt className="mr-2 text-blue-600" />
        {job.location || "Remote"}
      </p>

      {/* GPA Requirement */}
      {job.gpaMin && (
        <p className="flex items-center text-gray-600 mb-2">
          <FaGraduationCap className="mr-2 text-yellow-500" />
          Minimum GPA: {job.gpaMin}
        </p>
      )}

      {/* Salary */}
      <p className="flex items-center text-gray-600 mb-2">
        <FaDollarSign className="mr-2 text-green-500" />
        {salaryDisplay}
      </p>

      {/* Description */}
      {job.description && (
        <p className="text-gray-700 text-sm mb-2">
          {truncate(job.description, 120)}
        </p>
      )}

      {/* Posted Date */}
      <p className="text-gray-400 text-xs mb-3">
        Posted {dayjs(job.createdAt).format("MMM D, YYYY")}
      </p>

      {/* View Details Button */}
      <Link
        to={`/job/${job.id}`}
        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow transition-colors w-full text-center"
      >
        View Details
      </Link>
    </div>
  );
};

export default JobCard;
