import React, { useEffect, useState } from "react";
import * as adminApi from "../../api/adminApi";
import AdminLayout from "../../layouts/adminLayout";
import StatusBadge from "../../components/admin/StatusBadge";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Briefcase, Building2 } from "lucide-react";
import { motion } from "framer-motion";

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getPendingJobs();
      setJobs(res.jobs || []);
    } catch (err) {
      console.error("❌ Failed to load jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      setActionLoading(true);
      await adminApi.updateJobStatus(id, status);
      loadJobs();
      setSelectedJob(null);
    } catch (err) {
      console.error("❌ Status update failed:", err);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Pending Job Approvals</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Card className="p-4">
          <p className="text-gray-500 text-sm">Pending Jobs</p>
          <p className="text-2xl font-bold">{jobs.length}</p>
        </Card>
      </div>

      {/* Jobs List */}
      {loading ? (
        <div className="w-full flex justify-center mt-20">
          <Loader2 className="animate-spin h-12 w-12 text-primary" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center text-gray-500 text-lg mt-20">
          No pending job postings.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {jobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="shadow-sm hover:shadow-xl transition duration-300 border rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">{job.title}</CardTitle>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Building2 size={14} />
                    {job.Company?.name || "Unknown Company"}
                  </p>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-gray-600 line-clamp-3">{job.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {job.requirements?.map((req, i) => (
                      <Badge key={i} variant="outline">{req}</Badge>
                    ))}
                  </div>
                  <div className="mt-4 text-sm text-gray-700 space-y-1">
                    <p><strong>Location:</strong> {job.location || "—"}</p>
                    <p><strong>Salary:</strong> {job.salary || "—"}</p>
                    <p><strong>GPA Requirement:</strong> {job.gpaMin || "—"}</p>
                    <p>
                      <strong>Expires:</strong> {new Date(job.expiresAt).toLocaleDateString()}
                    </p>
                    <StatusBadge status={job.status || "pending"} />
                  </div>
                </CardContent>

                <CardFooter className="flex justify-between items-center pt-4">
                  <Button variant="secondary" onClick={() => setSelectedJob(job)}>View</Button>
                  <div className="flex gap-2">
                    <Button variant="default" onClick={() => handleUpdateStatus(job.id, "approved")}>Approve</Button>
                    <Button variant="destructive" onClick={() => handleUpdateStatus(job.id, "rejected")}>Reject</Button>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminJobs;
