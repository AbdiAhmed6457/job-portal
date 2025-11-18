import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import { Building2, Briefcase, FileText, LayoutDashboard } from "lucide-react";

const AdminLayout = () => {
  const menu = [
    { path: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/admin/companies", label: "Companies", icon: Building2 },
    { path: "/admin/jobs", label: "Jobs", icon: Briefcase },
    { path: "/admin/applications", label: "Applications", icon: FileText },
  ];

  const navItemClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
      isActive 
        ? "bg-green-600 text-white shadow-md" 
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 fixed inset-y-0 left-0">
        <h1 className="text-2xl font-bold mb-10 text-green-600">Admin Dashboard</h1>
        <nav className="space-y-4">
          {menu.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={navItemClass}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 ml-64">
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;