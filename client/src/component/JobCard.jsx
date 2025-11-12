// src/components/JobCard.jsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, MapPin, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const JobCard = ({ job }) => {
  const navigate = useNavigate();

  return (
    <Card
      onClick={() => navigate(`/jobs/${job.id}`)}
      className="cursor-pointer hover:shadow-lg transition-all duration-200 border border-gray-200 rounded-2xl"
    >
      <CardHeader>
        <CardTitle className="text-green-700 flex items-center gap-2 text-lg">
          <Briefcase className="h-5 w-5" /> {job.title}
        </CardTitle>
        <p className="text-gray-500 flex items-center gap-2">
          <Building2 className="h-4 w-4" /> {job.Company?.name || "Unknown Company"}
        </p>
      </CardHeader>

      <CardContent className="text-gray-600 text-sm space-y-2">
        <p className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-green-600" /> {job.location || "Not specified"}
        </p>
        <p>
          <strong>GPA Min:</strong> {job.gpaMin || "N/A"}
        </p>
      </CardContent>
    </Card>
  );
};

export default JobCard;
