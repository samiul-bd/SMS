"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types/auth";

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // LocalStorage theke user data ber kora
    const storedUser = localStorage.getItem("user");
    
    if (!storedUser) {
      router.push("/login");
      return;
    }

    const parsedUser: User = JSON.parse(storedUser);
    
    // Jodi keu Admin na hoye ei page-e ashte chay, take ber kore deya
    if (parsedUser.role !== "Admin") {
      router.push("/login");
      return;
    }

    setUser(parsedUser);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-xl font-semibold text-gray-600">Loading Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center border-b">
        <h1 className="text-2xl font-extrabold text-blue-600">SMS Admin</h1>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-gray-800 font-semibold text-sm">{user.name}</p>
            <p className="text-gray-500 text-xs">{user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-md text-sm font-semibold transition border border-red-200"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Dashboard Content */}
      <main className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6">System Overview</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
              <h3 className="text-blue-800 font-bold mb-1">Your Role</h3>
              <p className="text-blue-600 text-lg">{user.role}</p>
            </div>
            
            <div className="bg-green-50 p-5 rounded-lg border border-green-100">
              <h3 className="text-green-800 font-bold mb-1">Authentication</h3>
              <p className="text-green-600 text-lg">JWT Verified</p>
            </div>
            
            <div className="bg-purple-50 p-5 rounded-lg border border-purple-100">
              <h3 className="text-purple-800 font-bold mb-1">API Connection</h3>
              <p className="text-purple-600 text-lg">Online</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}