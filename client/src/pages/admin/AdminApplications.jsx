// pages/admin/AdminApplications.jsx
import React, { useEffect, useState } from "react";
import * as adminApi from "../../api/adminApi";
import AdminLayout from "../../layouts/AdminLayout";
import StatusBadge from "../../component/admin/StatusBadge";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load all applications
  const loadApplications = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getApplications(); // expects { data: { applications: [...] } }
      setApplications(res.data.applications || []);
    } catch (err) {
      console.error("❌ Failed to load applications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">All Applications</h1>
      </div>

      {loading ? (
        <div className="flex justify-center mt-20">
          <Loader2 className="animate-spin h-12 w-12 text-primary" />
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center text-gray-500 text-lg mt-20">
          No applications found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {applications.map((app, index) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="shadow-sm hover:shadow-xl transition duration-300 border rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">{app.Job?.title || "Unknown Job"}</CardTitle>
                  <p className="text-sm text-gray-500">{app.User?.name || "Unknown User"}</p>
                </CardHeader>

                <CardContent className="space-y-2 text-sm text-gray-700">
                  <p><strong>Email:</strong> {app.User?.email || "—"}</p>
                  <p><strong>Resume:</strong> <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View</a></p>
                  <p><strong>Applied On:</strong> {new Date(app.createdAt).toLocaleDateString()}</p>
                  <StatusBadge status={app.status || "pending"} />
                </CardContent>

                <CardFooter className="flex justify-between items-center pt-4">
                  {/* Optional action buttons */}
                  <Button
                    variant="default"
                    onClick={() => alert(`Application ID: ${app.id}`)}
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminApplications;
