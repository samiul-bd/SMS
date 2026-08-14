"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";
import Link from "next/link";

export default function AdminReports() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await api.get("/Admin/reports"); 
        setReports(res.data);
      } catch (err) {
        console.error("Failed to load reports", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-800">System Reports</h1>
          <Link href="/admin" className="text-blue-600 font-semibold hover:underline">&larr; Back</Link>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold mb-4 text-gray-800">Assignments & Submissions Overview</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="p-3 text-sm font-semibold text-gray-600">Assignment Title</th>
                  <th className="p-3 text-sm font-semibold text-gray-600">Course</th>
                  <th className="p-3 text-sm font-semibold text-gray-600">Total Submissions</th>
                  <th className="p-3 text-sm font-semibold text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={4} className="p-4 text-center text-gray-500">Loading...</td></tr>
                ) : reports.length > 0 ? (
                  reports.map((r: any, i: number) => (
                    <tr key={i} className="border-b hover:bg-gray-50">
                      <td className="p-3 text-sm text-gray-800">{r.title}</td>
                      <td className="p-3 text-sm text-gray-800">{r.courseName}</td>
                      <td className="p-3 text-sm text-gray-800">{r.submissionCount}</td>
                      <td className="p-3 text-sm font-medium text-green-600">{r.status}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={4} className="p-4 text-center text-gray-500">No reports available.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}