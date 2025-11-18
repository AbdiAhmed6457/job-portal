import React, { useEffect, useState } from "react";
// Import all adminApi functions
import * as adminApi from "../../api/adminApi"; 

// Components
import AdminLayout from "../../layouts/adminLayout";
import StatBadge from "../../component/admin/StatusBadge";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";

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
      setJobs(res.data?.jobs || []); // ensure correct data access
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
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Pending Job Approvals</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatBadge title="Pending Jobs" value={jobs.length} icon={Briefcase} color="blue" />
      </div>

      {/* Loading or No Jobs */}
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
                    <p><strong>Expires:</strong> {new Date(job.expiresAt).toLocaleDateString()}</p>
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

      {/* Job Modal */}
      <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
        <DialogContent className="max-w-2xl rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">{selectedJob?.title}</DialogTitle>
            <p className="text-sm text-gray-500 mt-1">{selectedJob?.Company?.name}</p>
          </DialogHeader>

          <div className="space-y-3">
            <p className="text-gray-700 leading-relaxed">{selectedJob?.description}</p>

            <div>
              <strong>Requirements</strong>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedJob?.requirements?.map((req, i) => (
                  <Badge key={i} variant="outline">{req}</Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm mt-4">
              <p><strong>Location:</strong> {selectedJob?.location}</p>
              <p><strong>Salary:</strong> {selectedJob?.salary || "—"}</p>
              <p><strong>GPA Min:</strong> {selectedJob?.gpaMin}</p>
              <p><strong>Expires:</strong> {selectedJob && new Date(selectedJob.expiresAt).toLocaleDateString()}</p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="default"
                disabled={actionLoading}
                onClick={() => handleUpdateStatus(selectedJob.id, "approved")}
              >
                {actionLoading ? "Processing..." : "Approve"}
              </Button>

              <Button
                variant="destructive"
                disabled={actionLoading}
                onClick={() => handleUpdateStatus(selectedJob.id, "rejected")}
              >
                {actionLoading ? "Processing..." : "Reject"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminJobs;
