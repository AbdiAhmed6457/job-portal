// src/components/recruiter/StatsCard.jsx
import React from "react";

const StatsCard = ({ title, value, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
    yellow: "bg-yellow-100 text-yellow-800",
    red: "bg-red-100 text-red-800",
  };

  return (
    <div className={`p-4 rounded-lg shadow flex flex-col items-center justify-center ${colorClasses[color] || "bg-gray-100 text-gray-800"}`}>
      <p className="text-sm font-medium">{title}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
};

export default StatsCard;
