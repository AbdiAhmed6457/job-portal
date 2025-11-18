// src/pages/admin/AdminCompanies.jsx
import React, { useState, useEffect } from "react";
import { getCompanies, updateCompanyStatus } from "../../api/adminApi";
import { Building2, CheckCircle, XCircle, AlertCircle, Loader2, Search, RefreshCw } from "lucide-react";

const AdminCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getCompanies();
      // Your backend returns { count, companies } → extract correctly
      setCompanies(res.data.companies || []);
    } catch (err) {
      setError("Failed to load companies. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleStatusUpdate = async (companyId, newStatus) => {
    if (!companyId) return;
    
    setUpdatingId(companyId);
    try {
      await updateCompanyStatus(companyId, newStatus);
      setCompanies(prev => prev.map(c => 
        c.id === companyId ? { ...c, status: newStatus } : c
      ));
    } catch (err) {
      alert("Failed to update status. Check console.");
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredCompanies = companies.filter(company =>
    company.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return { color: "bg-green-100 text-green-800 border-green-300", icon: CheckCircle };
      case "rejected":
        return { color: "bg-red-100 text-red-800 border-red-300", icon: XCircle };
      case "pending":
      default:
        return { color: "bg-yellow-100 text-yellow-800 border-yellow-300", icon: AlertCircle };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-12 h-12 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header + Refresh */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
            <Building2 className="w-10 h-10 text-green-600" />
            Manage Companies ({companies.length})
          </h1>
          <p className="text-gray-600 mt-2">Approve, reject, or revoke company access</p>
        </div>
        <button
          onClick={fetchCompanies}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Search */}
      <div className="mb-6 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search by name or email..."
          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
          {error}
        </div>
      )}

      {/* Companies Grid */}
      {filteredCompanies.length === 0 ? (
        <div className="text-center py-20">
          <Building2 className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <p className="text-xl text-gray-500">
            {searchTerm ? "No matching companies" : "No companies found"}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCompanies.map((company) => {
            const { color, icon: StatusIcon } = getStatusConfig(company.status);
            const isPending = company.status?.toLowerCase() === "pending";
            const isApproved = company.status?.toLowerCase() === "approved";

            return (
              <div
                key={company.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden"
              >
                <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-green-200 rounded-xl flex items-center justify-center text-2xl font-bold text-green-700">
                      {company.name?.[0] || "C"}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{company.name || "Unnamed"}</h3>
                      <p className="text-sm text-gray-600">{company.email}</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Status</span>
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold border flex items-center gap-2 ${color}`}>
                      <StatusIcon className="w-5 h-5" />
                      {company.status || "pending"}
                    </span>
                  </div>

                  {company.website && (
                    <div className="text-sm">
                      <span className="text-gray-500">Website:</span>{" "}
                      <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">
                        {company.website.replace(/^https?:\/\//, "")}
                      </a>
                    </div>
                  )}

                  <div className="text-xs text-gray-400">
                    Registered: {new Date(company.createdAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-6 bg-gray-50 border-t flex gap-3">
                  {isPending && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(company.id, "approved")}
                        disabled={updatingId === company.id}
                        className="flex-1 bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:opacity-70"
                      >
                        {updatingId === company.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(company.id, "rejected")}
                        disabled={updatingId === company.id}
                        className="flex-1 bg-red-600 text-white py-3 rounded-xl font-medium hover:bg-red-700 transition flex items-center justify-center gap-2 disabled:opacity-70"
                      >
                        <XCircle className="w-5 h-5" />
                        Reject
                      </button>
                    </>
                  )}

                  {isApproved && (
                    <button
                      onClick={() => handleStatusUpdate(company.id, "rejected")}
                      disabled={updatingId === company.id}
                      className="w-full bg-orange-600 text-white py-3 rounded-xl font-medium hover:bg-orange-700 transition flex items-center justify-center gap-2"
                    >
                      {updatingId === company.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <XCircle className="w-5 h-5" />}
                      Revoke Access
                    </button>
                  )}

                  {company.status?.toLowerCase() === "rejected" && (
                    <button
                      onClick={() => handleStatusUpdate(company.id, "approved")}
                      disabled={updatingId === company.id}
                      className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2"
                    >
                      {updatingId === company.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                      Re-approve
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminCompanies;