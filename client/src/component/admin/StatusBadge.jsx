// client/src/components/admin/StatusBadge.jsx
import React from "react";
import PropTypes from "prop-types";

const StatusBadge = ({ status }) => {
  // If it's not a valid string, default to "pending"
  const safeStatus =
    typeof status === "string" && status.trim() !== ""
      ? status
      : "pending";

  const lower = safeStatus.toLowerCase();

  let bgColor = "bg-gray-100";
  let textColor = "text-gray-800";

  switch (lower) {
    case "approved":
    case "accepted":
      bgColor = "bg-green-100";
      textColor = "text-green-800";
      break;

    case "pending":
      bgColor = "bg-yellow-100";
      textColor = "text-yellow-800";
      break;

    case "rejected":
      bgColor = "bg-red-100";
      textColor = "text-red-800";
      break;

    case "shortlisted":
      bgColor = "bg-blue-100";
      textColor = "text-blue-800";
      break;
  }

  return (
    <span
      className={`${bgColor} ${textColor} px-3 py-1 rounded-full font-semibold text-sm uppercase tracking-wide shadow-sm`}
    >
      {safeStatus}
    </span>
  );
};

StatusBadge.propTypes = {
  status: PropTypes.any, // allow any type safely
};

export default StatusBadge;
