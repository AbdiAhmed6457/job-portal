// src/components/recruiter/JobCard.jsx
import React from "react";

const JobCard = ({ job }) => {
  const statusColor = {
    approved: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    expired: "bg-red-100 text-red-800",
  };

  return (
    <div className="border border-gray-200 rounded-lg shadow hover:shadow-lg transition p-5 bg-white flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-semibold text-gray-800">{job.title}</h3>
        <p className="text-gray-600">{job.Company.name}</p>
        <p className="text-gray-500">Location: {job.location}</p>
        <p className="text-gray-500">Min GPA: {job.gpaMin || "N/A"}</p>
        <p className={`mt-2 px-2 py-1 inline-block text-sm font-medium rounded ${statusColor[job.status] || "bg-gray-100 text-gray-800"}`}>
          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
        </p>
      </div>
      <div className="mt-3 flex gap-2">
        <a
          href={`/recruiter/jobs/edit/${job.id}`}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition"
        >
          Edit
        </a>
        <button
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition"
          // onClick={deleteJob} implement later
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default JobCard;
