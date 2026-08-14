"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminDashboard() {
  const router = useRouter();
  const [adminEmail, setAdminEmail] = useState("");

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!token || !userStr) {
      router.push("/login");
      return;
    }

    try {
      const user = JSON.parse(userStr);
      if (user.role !== "Admin") {
        router.push("/login");
        return;
      }
      setAdminEmail(user.email || "admin@sms.com");
    } catch {
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header / Navbar */}
      <header className="bg-white shadow-sm border-b border-gray-100 px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">SMS Admin Dashboard</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-600">{adminEmail}</span>
          <button
            onClick={handleLogout}
            className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg text-sm font-semibold transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-8 space-y-6">
        
        {/* Quick Actions / Navigation Cards */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Management Modules</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/admin/users"
              className="p-5 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition bg-white block group"
            >
              <h3 className="text-base font-semibold text-gray-800 group-hover:text-blue-600">Manage Users</h3>
              <p className="text-sm text-gray-500 mt-1">Add, view, or remove system users (Students, Teachers, Admins).</p>
            </Link>

            <Link
              href="/admin/academic"
              className="p-5 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition bg-white block group"
            >
              <h3 className="text-base font-semibold text-gray-800 group-hover:text-blue-600">Academic Setup</h3>
              <p className="text-sm text-gray-500 mt-1">Create courses, subjects, and assign teachers/students.</p>
            </Link>

            <Link
              href="/admin/reports"
              className="p-5 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition bg-white block group"
            >
              <h3 className="text-base font-semibold text-gray-800 group-hover:text-blue-600">System Reports</h3>
              <p className="text-sm text-gray-500 mt-1">View all assignments and student submissions overview.</p>
            </Link>
          </div>
        </div>

      </main>
    </div>
  );
}