// client/src/components/JobCard.jsx
import React from "react";
import { Link } from "react-router-dom";

const JobCard = ({ job }) => {
  return (
    <div className="border rounded-lg p-5 shadow-md hover:shadow-lg transition bg-white">
      <h2 className="text-xl font-bold text-blue-700">{job.title}</h2>
      <p className="text-gray-600 font-semibold">{job.Company?.name}</p>
      <p className="text-gray-500">{job.location}</p>
      <p className="text-gray-400 text-sm mt-2">
        Expires: {new Date(job.expiresAt).toLocaleDateString()}
      </p>
      <p className="mt-2 text-gray-700 line-clamp-3">{job.description}</p>
      <Link
        to={`/jobs/${job.id}`}
        className="inline-block mt-3 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
      >
        View Details
      </Link>
    </div>
  );
};

export default JobCard;
