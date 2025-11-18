// component/admin/StatBadge.jsx
import React from "react";
import { Card } from "@/components/ui/card";

const StatBadge = ({ title, value, color = "blue" }) => {
  const colors = {
    green: "from-green-400 to-green-600",
    blue: "from-blue-400 to-blue-600",
    purple: "from-purple-400 to-purple-600",
    red: "from-red-400 to-red-600",
    orange: "from-orange-400 to-orange-600",
    teal: "from-teal-400 to-teal-600",
    pink: "from-pink-400 to-pink-600",
  };

  return (
    <Card
      className={`
      bg-gradient-to-br ${colors[color]} 
      text-white p-6 rounded-xl shadow-lg 
      transform transition-all duration-300 
      hover:scale-105 hover:shadow-2xl cursor-pointer
    `}
    >
      <h2 className="text-lg font-semibold opacity-90">{title}</h2>
      <p className="text-4xl font-extrabold mt-3">{value}</p>
    </Card>
  );
};

export default StatBadge;
