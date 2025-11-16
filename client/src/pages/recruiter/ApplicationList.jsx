import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const ApplicationsList = () => {
  const { token } = useContext(AuthContext);

  const [apps, setApps] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch applications
  const fetchApps = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/application", {
        headers: { Authorization: `Bearer ${token}` }
      });
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

  // Update status
  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `/api/application/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchApps();
    } catch (err) {
      alert(err.response?.data?.message || "Status update failed");
    }
  };

  // Filtering logic
  const filteredApps =
    filter === "all" ? apps : apps.filter((a) => a.status === filter);

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Job Applications</h1>

        <div className="flex gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 rounded-xl border shadow-sm focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>

          <button
            onClick={fetchApps}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 transition"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Error / Loading */}
      {loading && <p className="text-gray-600">Loading...</p>}
      {error && <p className="text-red-600 text-lg mb-4">{error}</p>}

      {/* Applications Table */}
      {!loading && !error && (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border">

          <table className="min-w-full border-collapse">
            <thead className="bg-gray-50 border-b sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-left text-gray-600 font-semibold">
                  Candidate
                </th>
                <th className="px-6 py-4 text-left text-gray-600 font-semibold">
                  Job
                </th>
                <th className="px-6 py-4 text-left text-gray-600 font-semibold">
                  Cover Letter
                </th>
                <th className="px-6 py-4 text-left text-gray-600 font-semibold">
                  CV
                </th>
                <th className="px-6 py-4 text-center text-gray-600 font-semibold">
                  Status
                </th>
                <th className="px-6 py-4 text-center text-gray-600 font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredApps.map((app) => (
                <tr
                  key={app.id}
                  className="hover:bg-gray-50 border-b transition"
                >
                  {/* Candidate */}
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-800">
                      {app.User?.name || "Unknown"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {app.User?.email}
                    </div>
                  </td>

                  {/* Job */}
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-800">{app.Job?.title}</div>
                    <div className="text-sm text-gray-500">
                      {app.Job?.Company?.name}
                    </div>
                  </td>

                  {/* Cover letter */}
                  <td className="px-6 py-4 max-w-sm text-gray-700">
                    {app.coverLetter
                      ? app.coverLetter.slice(0, 140) +
                        (app.coverLetter.length > 140 ? "..." : "")
                      : "—"}
                  </td>

                  {/* CV */}
                  <td className="px-6 py-4">
                    {app.cvUrl ? (
                      <a
                        href={app.cvUrl}
                        target="_blank"
                        className="text-indigo-600 hover:underline"
                      >
                        Download CV
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-white text-sm shadow ${
                        app.status === "pending"
                          ? "bg-yellow-500"
                          : app.status === "accepted"
                          ? "bg-green-600"
                          : "bg-red-600"
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>

                  {/* Action Buttons */}
                  <td className="px-6 py-4 text-center flex justify-center gap-3">
                    <button
                      onClick={() => updateStatus(app.id, "accepted")}
                      className="px-4 py-1 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => updateStatus(app.id, "rejected")}
                      className="px-4 py-1 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
                    >
                      Reject
                    </button>
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
