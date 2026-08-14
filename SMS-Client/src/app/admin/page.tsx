"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Users, BookOpen, UserCheck, BarChart3, Settings, LogOut } from "lucide-react";

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
    <div className="min-h-screen bg-slate-50 text-gray-800">
      {/* Header / Navbar */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <div className="bg-purple-600 text-white p-2 rounded-lg font-bold">
            SMS
          </div>
          <h1 className="text-xl font-bold text-gray-900">Admin Control Panel</h1>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-xs font-semibold bg-purple-50 text-purple-700 px-3 py-1 rounded-full border border-purple-100">
            {adminEmail}
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-1 bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-8 space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Management Modules</h2>
            <p className="text-xs text-gray-500 mt-0.5">Quick access to admin capabilities and system controls.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
            <Link
              href="/admin/users"
              className="p-5 rounded-xl border border-gray-200 hover:border-purple-500 hover:shadow-md transition bg-white block group"
            >
              <div className="bg-purple-100 text-purple-700 p-2.5 rounded-lg w-fit mb-3">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900 group-hover:text-purple-600">Manage Users</h3>
              <p className="text-xs text-gray-500 mt-1">View, update roles, and manage user accounts.</p>
            </Link>

            <Link
              href="/admin/academic"
              className="p-5 rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-md transition bg-white block group"
            >
              <div className="bg-blue-100 text-blue-700 p-2.5 rounded-lg w-fit mb-3">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900 group-hover:text-blue-600">Courses & Subjects</h3>
              <p className="text-xs text-gray-500 mt-1">Create, update, and delete courses and subjects.</p>
            </Link>

            <Link
              href="/admin/assign-teacher"
              className="p-5 rounded-xl border border-gray-200 hover:border-green-500 hover:shadow-md transition bg-white block group"
            >
              <div className="bg-green-100 text-green-700 p-2.5 rounded-lg w-fit mb-3">
                <UserCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900 group-hover:text-green-600">Allocations & Enrollment</h3>
              <p className="text-xs text-gray-500 mt-1">Assign teachers to subjects & enroll students into courses.</p>
            </Link>

            <Link
              href="/admin/reports"
              className="p-5 rounded-xl border border-gray-200 hover:border-amber-500 hover:shadow-md transition bg-white block group"
            >
              <div className="bg-amber-100 text-amber-700 p-2.5 rounded-lg w-fit mb-3">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900 group-hover:text-amber-600">System Reports</h3>
              <p className="text-xs text-gray-500 mt-1">View all assignments, student submissions, and evaluation status.</p>
            </Link>

            <Link
              href="/admin/settings"
              className="p-5 rounded-xl border border-gray-200 hover:border-indigo-500 hover:shadow-md transition bg-white block group"
            >
              <div className="bg-indigo-100 text-indigo-700 p-2.5 rounded-lg w-fit mb-3">
                <Settings className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900 group-hover:text-indigo-600">Application Settings</h3>
              <p className="text-xs text-gray-500 mt-1">Configure institution settings, policies, and system defaults.</p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}