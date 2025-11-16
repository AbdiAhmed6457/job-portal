// src/components/recruiter/CompanyCard.jsx
import React from "react";

const CompanyCard = ({ company }) => {
  const statusColor = {
    approved: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    rejected: "bg-red-100 text-red-800",
  };

  return (
    <div className="flex items-center bg-white shadow-md rounded-lg p-4 gap-4">
      <img
        src={company.logoUrl || "/default-company.png"}
        alt={company.name}
        className="w-16 h-16 rounded-full object-cover"
      />
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{company.name}</h3>
        <p className={`mt-1 px-2 py-1 inline-block text-sm font-medium rounded ${statusColor[company.status] || "bg-gray-100 text-gray-800"}`}>
          {company.status.charAt(0).toUpperCase() + company.status.slice(1)}
        </p>
      </div>
    </div>
  );
};

export default CompanyCard;
