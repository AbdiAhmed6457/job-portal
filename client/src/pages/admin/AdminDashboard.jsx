// client/src/pages/admin/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import * as adminApi from "../../api/adminApi";
import StatBadge from "../../component/admin/StatBadge"; // Your beautiful component
import { Loader2, Building2, Briefcase, FileText, Users, TrendingUp, CheckCircle, Clock } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { motion } from "framer-motion";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalCompanies: 0,
    approvedCompanies: 0,
    pendingCompanies: 0,
    totalJobs: 0,
    approvedJobs: 0,
    pendingJobs: 0,
    totalApplications: 0,
    jobStats: [],
  });

  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Companies
      const companiesRes = await adminApi.getCompanies();
      const companies = companiesRes.data?.companies || companiesRes.data || [];
      const totalCompanies = companies.length;
      const approvedCompanies = companies.filter(c => c.status === "approved").length;
      const pendingCompanies = companies.filter(c => c.status === "pending").length;

      // Jobs (from pending endpoint - adjust if you have full jobs later)
      const jobsRes = await adminApi.getPendingJobs();
      const pendingJobs = jobsRes.jobs?.length || jobsRes.data?.count || 0;

      // Applications
      const appsRes = await adminApi.getApplications();
      const totalApplications = appsRes.data?.count || 0;

      // Job stats per company
      const jobStatsRes = await adminApi.getJobStats();
      const rawStats = (jobStatsRes.data || []).map(s => ({
        name: s.Company?.name || "Unknown",
        jobs: s.jobCount || 0,
      }));

      const totalJobs = rawStats.reduce((sum, s) => sum + s.jobs, 0);
      const approvedJobs = totalJobs - pendingJobs;

      setStats({
        totalCompanies,
        approvedCompanies,
        pendingCompanies,
        totalJobs,
        approvedJobs,
        pendingJobs,
        totalApplications,
        jobStats: rawStats.slice(0, 10), // Top 10
      });
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const chartColors = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444", "#06b6d4", "#ec4899", "#14b8a6", "#f97316", "#a855f7"];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-xl text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 text-lg mt-3">Real-time insights and platform overview</p>
        </div>

        {/* StatBadges Grid - Using YOUR component */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7 mb-12">
          <StatBadge title="Total Companies" value={stats.totalCompanies} color="blue" />
          <StatBadge title="Approved Companies" value={stats.approvedCompanies} color="green" />
          <StatBadge title="Pending Companies" value={stats.pendingCompanies} color="orange" />

          <StatBadge title="Total Jobs" value={stats.totalJobs} color="purple" />
          <StatBadge title="Published Jobs" value={stats.approvedJobs} color="teal" />
          <StatBadge title="Pending Jobs" value={stats.pendingJobs} color="red" />

          <StatBadge title="Total Applications" value={stats.totalApplications} color="pink" />
        </div>

        {/* Epic Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-8 text-white">
            <h2 className="text-3xl font-bold flex items-center gap-4">
              <Briefcase className="w-10 h-10" />
              Top Companies by Job Postings
            </h2>
            <p className="mt-2 opacity-90">Most active recruiters on the platform</p>
          </div>

          <div className="p-8">
            {stats.jobStats.length === 0 ? (
              <div className="h-96 flex items-center justify-center">
                <p className="text-gray-500 text-xl">No job postings yet</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={450}>
                <BarChart data={stats.jobStats} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                  <CartesianGrid strokeDasharray="5 5" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={100}
                    tick={{ fill: "#374151", fontSize: 14, fontWeight: 600 }}
                  />
                  <YAxis 
                    tick={{ fill: "#374151", fontSize: 14 }}
                    label={{ value: 'Number of Jobs', angle: -90, position: 'insideLeft', style: { fill: '#374151', fontWeight: 600 } }}
                  />
                  <Tooltip 
                    contentStyle={{ background: "#fff", border: "none", borderRadius: "12px", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}
                    labelStyle={{ color: "#1f2937", fontWeight: "bold" }}
                  />
                  <Bar dataKey="jobs" radius={[16, 16, 0, 0]} animationDuration={1800}>
                    {stats.jobStats.map((entry, i) => (
                      <Cell key={i} fill={chartColors[i % chartColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        {/* Footer */}
        <div className="mt-10 text-center text-gray-500">
          <p className="text-sm">Last updated: {new Date().toLocaleString()}</p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;