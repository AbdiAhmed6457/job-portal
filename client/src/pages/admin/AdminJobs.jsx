// client/src/pages/admin/AdminJobs.jsx
import React, { useEffect, useState } from "react";
import * as adminApi from "../../api/adminApi";
import StatusBadge from "../../component/admin/StatusBadge";
import { Loader2, Building2, MapPin, DollarSign, Clock, Search, Briefcase } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getPendingJobs(); // This returns pending + approved + rejected?
      // Your backend might return { jobs: [...] } or direct array
      const jobList = Array.isArray(res) ? res : res.jobs || res.data || [];
      
      // Parse requirements from JSON string
      const parsedJobs = jobList.map(job => ({
        ...job,
        requirements: job.requirements ? JSON.parse(job.requirements) : []
      }));

      setJobs(parsedJobs);
      setFilteredJobs(parsedJobs);
    } catch (err) {
      console.error("Failed to load jobs:", err);
      alert("Failed to load jobs from server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  // Search + Filter Logic
  useEffect(() => {
    let result = jobs;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(job =>
        job.title?.toLowerCase().includes(term) ||
        job.Company?.name?.toLowerCase().includes(term) ||
        job.description?.toLowerCase().includes(term)
      );
    }

    if (statusFilter !== "all") {
      result = result.filter(job => 
        job.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    setFilteredJobs(result);
  }, [searchTerm, statusFilter, jobs]);

  const handleUpdateStatus = async (jobId, newStatus) => {
    try {
      setUpdatingId(jobId);
      await adminApi.updateJobStatus(jobId, newStatus);
      await loadJobs(); // Refresh the list
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update job status");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  const pendingCount = jobs.filter(j => j.status === "pending").length;
  const approvedCount = jobs.filter(j => j.status === "approved").length;
  const rejectedCount = jobs.filter(j => j.status === "rejected").length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Jobs Management</h1>
        <p className="text-muted-foreground mt-2">
          Review and approve job postings from recruiters
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search by title, company, or description..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-56">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Jobs ({jobs.length})</SelectItem>
            <SelectItem value="pending">Pending ({pendingCount})</SelectItem>
            <SelectItem value="approved">Approved ({approvedCount})</SelectItem>
            <SelectItem value="rejected">Rejected ({rejectedCount})</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Jobs</p>
                <p className="text-3xl font-bold">{jobs.length}</p>
              </div>
              <Briefcase className="w-10 h-10 text-blue-500 opacity-30" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-orange-200">
          <CardContent className="pt-6">
            <p className="text-sm text-orange-600 font-medium">Pending Review</p>
            <p className="text-3xl font-bold text-orange-600">{pendingCount}</p>
          </CardContent>
        </Card>
        <Card className="border-green-200">
          <CardContent className="pt-6">
            <p className="text-sm text-green-600 font-medium">Approved</p>
            <p className="text-3xl font-bold text-green-600">{approvedCount}</p>
          </CardContent>
        </Card>
        <Card className="border-red-200">
          <CardContent className="pt-6">
            <p className="text-sm text-red-600 font-medium">Rejected</p>
            <p className="text-3xl font-bold text-red-600">{rejectedCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Jobs Grid */}
      {filteredJobs.length === 0 ? (
        <div className="text-center py-20">
          <Briefcase className="w-16 h-16 mx-auto mb-4 opacity-30 text-muted-foreground" />
          <p className="text-xl text-muted-foreground">No jobs found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredJobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start gap-3">
                    <CardTitle className="text-lg leading-tight">{job.title}</CardTitle>
                    <StatusBadge status={job.status} />
                  </div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-2">
                    <Building2 size={14} />
                    {job.Company?.name || "Unknown Company"}
                  </p>
                </CardHeader>

                <CardContent className="flex-1 space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {job.description || "No description"}
                  </p>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-muted-foreground" />
                      <span className="truncate">{job.location || "Remote"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign size={14} className="text-muted-foreground" />
                      <span>{job.salary || "Not disclosed"}</span>
                    </div>
                  </div>

                  {job.expiresAt && (
                    <p className="text-xs flex items-center gap-1 text-muted-foreground">
                      <Clock size={14} />
                      Expires: {new Date(job.expiresAt).toLocaleDateString()}
                    </p>
                  )}

                  {job.requirements && job.requirements.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {job.requirements.slice(0, 4).map((req, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {req}
                        </Badge>
                      ))}
                      {job.requirements.length > 4 && (
                        <Badge variant="secondary" className="text-xs">
                          +{job.requirements.length - 4}
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>

                <CardFooter className="border-t pt-4">
                  {job.status === "pending" ? (
                    <div className="w-full flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => handleUpdateStatus(job.id, "approved")}
                        disabled={updatingId === job.id}
                      >
                        {updatingId === job.id ? "Approving..." : "Approve"}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="flex-1"
                        onClick={() => handleUpdateStatus(job.id, "rejected")}
                        disabled={updatingId === job.id}
                      >
                        Reject
                      </Button>
                    </div>
                  ) : (
                    <p className="text-center w-full text-sm text-muted-foreground">
                      {job.status === "approved" ? "✓ Published" : "✕ Rejected"}
                    </p>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminJobs;