// src/pages/admin/AdminCompanies.jsx   (or any page you want to test)
import React from "react";
import AdminLayout from "../../layouts/adminLayout";

const AdminCompanies = () => {
  return (
    <AdminLayout>
      <div className="p-10 text-center">
        <h1 className="text-6xl font-bold text-green-600">HELLO WORLD</h1>
        <p className="text-2xl text-gray-700 mt-6">
          If you can see this → Your route is working perfectly! 🎉
        </p>
        <p className="text-lg text-gray-500 mt-4">
          The problem was in the previous component code.
        </p>
      </div>
    </AdminLayout>
  );
};

export default AdminCompanies;