// client/src/components/ui/ApplicationCard.jsx
import React from "react";
import { FaBuilding, FaCalendarAlt } from "react-icons/fa";

const ApplicationCard = ({ application, onViewJob }) => {
  const { Job, status, createdAt } = application;

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    accepted: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-xl transition-shadow duration-300">
      <div>
        <h3 className="text-xl font-semibold text-blue-700">{Job?.title}</h3>
        <p className="flex items-center gap-2 text-gray-600">
          <FaBuilding /> {Job?.Company?.name || "Unknown Company"}
        </p>
        <p className="flex items-center gap-2 text-gray-500 text-sm mt-1">
          <FaCalendarAlt /> Applied {new Date(createdAt).toLocaleDateString()}
        </p>
      </div>
      <div className="flex flex-col md:flex-row items-start md:items-center gap-2 mt-2 md:mt-0">
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[status]}`}>
          {status.toUpperCase()}
        </span>
        <button
          onClick={() => onViewJob(Job.id)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
        >
          View Job
        </button>
      </div>
    </div>
  );
};

export default ApplicationCard;
