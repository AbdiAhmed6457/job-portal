// client/src/api/adminApi.js
import api from "./axios";

// ======== Companies ========
export const getCompanies = () => api.get("/admin/companies");

export const updateCompanyStatus = (id, status) =>
  api.put(`/admin/companies/${id}/status`, { status });

// ======== Jobs ========

export const getJobs = () => api.get("/admin/jobs/all");
export const getJobById = (id) => api.get(`/admin/jobs/${id}`);

export const getPendingJobs = () => api.get("/admin/jobs/pending");

export const updateJobStatus = (id, status) =>
  api.put(`/admin/jobs/${id}/status`, { status });

export const getJobStats = () => api.get("/admin/jobs/status");

// ======== Applications ========
export const getApplications = () => api.get("/admin/applications");


export const updateApplicationStatus = (id, status) =>
  api.put(`/admin/applications/${id}/status`, { status });
