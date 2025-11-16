// client/src/component/student/ApplicationCard.jsx
import React from "react";

const ApplicationCard = ({ application, onViewJob }) => {
  return (
    <div className="bg-white shadow rounded p-4 flex flex-col md:flex-row justify-between items-start md:items-center">
      <div>
        <h3 className="text-lg font-semibold">{application.jobTitle}</h3>
        <p className="text-gray-600">Company: {application.companyName}</p>
        <p className="text-gray-500 text-sm">
          Status:{" "}
          <span
            className={
              application.status === "accepted"
                ? "text-green-600"
                : application.status === "pending"
                ? "text-yellow-600"
                : "text-red-600"
            }
          >
            {application.status}
          </span>
        </p>
      </div>
      <button
        onClick={onViewJob}
        className="mt-2 md:mt-0 bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition"
      >
        View Job
      </button>
    </div>
  );
};

export default ApplicationCard;
