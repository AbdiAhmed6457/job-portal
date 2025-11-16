// client/src/pages/recruiter/ApplicationsList.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const ApplicationsList = () => {
  const { token } = useContext(AuthContext);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");

  const fetchApps = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/application", { headers: { Authorization: `Bearer ${token}` } });
      setApps(res.data.applications || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/api/application/${id}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } });
      fetchApps();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update");
    }
  };

  const filtered = filter === "all" ? apps : apps.filter(a => a.status === filter);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Applications</h1>
        <div className="flex gap-2">
          <select value={filter} onChange={(e)=>setFilter(e.target.value)} className="border px-3 py-2 rounded">
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
          <button onClick={fetchApps} className="px-3 py-2 bg-gray-200 rounded">Refresh</button>
        </div>
      </div>

      {loading ? <p>Loading...</p> : error ? <p className="text-red-600">{error}</p> : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">Candidate</th>
                <th className="border px-4 py-2">Job</th>
                <th className="border px-4 py-2">Cover Letter</th>
                <th className="border px-4 py-2">CV</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(app => (
                <tr key={app.id} className="hover:bg-gray-50 align-top">
                  <td className="border px-4 py-2">{app.User?.name || "—"}<div className="text-xs text-gray-500">{app.User?.email}</div></td>
                  <td className="border px-4 py-2">{app.Job?.title}</td>
                  <td className="border px-4 py-2 max-w-xs">{app.coverLetter ? app.coverLetter.slice(0, 200) + (app.coverLetter.length > 200 ? "..." : "") : "—"}</td>
                  <td className="border px-4 py-2">
                    {app.cvUrl ? (
                      <a href={app.cvUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Download</a>
                    ) : "—"}
                  </td>
                  <td className="border px-4 py-2">
                    <span className={`px-2 py-1 rounded text-white ${
                      app.status === "pending" ? "bg-yellow-500" :
                      app.status === "accepted" ? "bg-green-500" :
                      "bg-red-500"
                    }`}>{app.status}</span>
                  </td>
                  <td className="border px-4 py-2 flex gap-2">
                    <button onClick={() => updateStatus(app.id, "accepted")} className="px-3 py-1 bg-green-600 text-white rounded">Accept</button>
                    <button onClick={() => updateStatus(app.id, "rejected")} className="px-3 py-1 bg-red-600 text-white rounded">Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ApplicationsList;
