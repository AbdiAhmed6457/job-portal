// client/src/pages/JobList.jsx
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, MapPin, Building2, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/jobs?status=approved&title=${query}&location=${location}`
      );
      const data = await res.json();
      setJobs(data.jobs || []);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="container mx-auto max-w-5xl">
        <h1 className="text-4xl font-bold text-green-700 mb-8 text-center">
          Explore Job Opportunities
        </h1>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-10">
          <Input
            placeholder="Search by job title..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Input
            placeholder="Location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <Button onClick={fetchJobs} className="bg-green-700 hover:bg-green-600 text-white">
            <Search className="h-4 w-4 mr-2" /> Search
          </Button>
        </div>

        {/* Job Results */}
        {loading ? (
          <p className="text-center text-gray-500">Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <p className="text-center text-gray-500">No jobs found.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <Card
                key={job.id}
                className="shadow-sm hover:shadow-lg transition cursor-pointer"
                onClick={() => navigate(`/jobs/${job.id}`)}
              >
                <CardHeader>
                  <CardTitle className="text-green-700 flex items-center gap-2">
                    <Briefcase className="h-5 w-5" /> {job.title}
                  </CardTitle>
                  <p className="text-gray-500 flex items-center gap-2">
                    <Building2 className="h-4 w-4" /> {job.Company?.name || "Unknown"}
                  </p>
                </CardHeader>
                <CardContent className="text-gray-600 text-sm space-y-2">
                  <p className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-green-600" /> {job.location || "Not specified"}
                  </p>
                  <p>
                    <strong>Min GPA:</strong> {job.gpaMin || "N/A"}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobList;
