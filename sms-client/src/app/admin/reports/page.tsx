"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";
import Link from "next/link";
import { FileText, CheckCircle2, Clock, Calendar, User, Award, MessageSquare, Eye, Layers } from "lucide-react";

export default function AdminReports() {
  const [activeTab, setActiveTab] = useState<"assignments" | "submissions">("assignments");
  const [assignments, setAssignments] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State for Viewing Detailed Submission
  const [selectedSubmission, setSelectedSubmission] = useState<any | null>(null);

  useEffect(() => {
    fetchReportsData();
  }, []);

  const fetchReportsData = async () => {
    setLoading(true);
    try {
      const [assignmentsRes, submissionsRes] = await Promise.all([
        api.get("/Admin/assignments"),
        api.get("/Admin/submissions"),
      ]);
      setAssignments(assignmentsRes.data);
      setSubmissions(submissionsRes.data);
    } catch (err) {
      console.error("Failed to load admin reports", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: any) => {
    const s = String(status).toLowerCase();
    if (s === "evaluated" || status === 2) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
          <CheckCircle2 className="w-3 h-3 mr-1" /> Evaluated
        </span>
      );
    }
    if (s === "submitted" || status === 1) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
          <Clock className="w-3 h-3 mr-1" /> Submitted
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
        <Clock className="w-3 h-3 mr-1" /> Pending
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">System Reports & Submissions</h1>
            <p className="text-xs text-gray-500">View detailed assignment stats and inspect student answers</p>
          </div>
          <Link href="/admin" className="text-blue-600 font-semibold hover:underline">&larr; Back to Dashboard</Link>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("assignments")}
            className={`px-4 py-2.5 text-sm font-bold border-b-2 transition ${
              activeTab === "assignments"
                ? "border-purple-600 text-purple-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            All System Assignments ({assignments.length})
          </button>
          <button
            onClick={() => setActiveTab("submissions")}
            className={`px-4 py-2.5 text-sm font-bold border-b-2 transition ${
              activeTab === "submissions"
                ? "border-purple-600 text-purple-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            All Student Submissions ({submissions.length})
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-600 border-t-transparent"></div>
            <p className="mt-2 text-sm text-gray-500">Loading system data...</p>
          </div>
        ) : activeTab === "assignments" ? (
          /* TAB 1: ALL ASSIGNMENTS */
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 font-bold text-gray-800">
              System Assignments Overview
            </div>
            {assignments.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm">No assignments found in the system.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase border-b">
                      <th className="p-3">Title</th>
                      <th className="p-3">Course</th>
                      <th className="p-3">Subject</th>
                      <th className="p-3">Teacher</th>
                      <th className="p-3">Deadline</th>
                      <th className="p-3">Max Marks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {assignments.map((a: any, i: number) => (
                      <tr key={i} className="hover:bg-gray-50 transition">
                        <td className="p-3 font-semibold text-gray-900">{a.title}</td>
                        <td className="p-3 text-gray-600">{a.courseName}</td>
                        <td className="p-3 text-gray-600">{a.subjectName}</td>
                        <td className="p-3 text-gray-600">{a.teacherName}</td>
                        <td className="p-3 text-gray-500 text-xs">
                          {new Date(a.deadline).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}
                        </td>
                        <td className="p-3 font-bold text-gray-900">{a.maxMarks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          /* TAB 2: ALL SUBMISSIONS DETAILED VIEW */
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 font-bold text-gray-800">
              Detailed Student Submissions List
            </div>
            {submissions.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm">No submissions recorded yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase border-b">
                      <th className="p-3">Student Name</th>
                      <th className="p-3">Assignment</th>
                      <th className="p-3">Course / Subject</th>
                      <th className="p-3">Submitted At</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Marks</th>
                      <th className="p-3 text-right">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {submissions.map((sub: any, i: number) => {
                      const displayTitle = sub.assignmentTitle || sub.assignmentName || (sub.assignmentId ? `Assignment #${sub.assignmentId}` : "Assignment Work");
                      const displayCourse = [sub.courseName, sub.subjectName].filter(Boolean).join(" - ") || "General Coursework";

                      return (
                        <tr key={i} className="hover:bg-gray-50 transition">
                          <td className="p-3 font-semibold text-gray-900 flex items-center space-x-2">
                            <User className="w-4 h-4 text-purple-600" />
                            <span>{sub.studentName || "Student"}</span>
                          </td>
                          <td className="p-3 text-gray-900 font-medium">{displayTitle}</td>
                          <td className="p-3 text-gray-600 text-xs">{displayCourse}</td>
                          <td className="p-3 text-gray-500 text-xs">
                            {new Date(sub.submittedAt).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}
                          </td>
                          <td className="p-3">{getStatusBadge(sub.status)}</td>
                          <td className="p-3 font-bold text-gray-900">
                            {sub.marksAwarded !== null && sub.marksAwarded !== undefined ? sub.marksAwarded : "--"}
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => setSelectedSubmission({ ...sub, displayTitle, displayCourse })}
                              className="inline-flex items-center space-x-1 text-xs font-semibold bg-purple-50 text-purple-700 hover:bg-purple-100 px-3 py-1.5 rounded-lg border border-purple-200 transition"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Inspect</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Modal for Admin inspecting detailed submission */}
        {selectedSubmission && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 space-y-4 border border-gray-100">
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="text-lg font-bold text-gray-900">Submission Details Inspection</h3>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="text-gray-400 hover:text-gray-600 font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase">Student Name</span>
                    <p className="font-bold text-gray-900">{selectedSubmission.studentName || "Student"}</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase">Assignment</span>
                    <p className="font-bold text-gray-900">{selectedSubmission.displayTitle || selectedSubmission.assignmentTitle || "Assignment Work"}</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase">Course / Subject</span>
                    <p className="text-gray-700 font-medium">{selectedSubmission.displayCourse || "General Coursework"}</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase">Submitted At</span>
                    <p className="text-gray-700 font-medium">
                      {new Date(selectedSubmission.submittedAt).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}
                    </p>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-semibold text-gray-500 uppercase">Written Answer Content</span>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg text-sm text-gray-800 max-h-48 overflow-y-auto border border-gray-200 font-mono">
                    {selectedSubmission.answerContent || "No answer text submitted."}
                  </div>
                </div>

                <div className="bg-purple-50 p-3 rounded-lg border border-purple-200 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-purple-900 uppercase">Evaluation Status</span>
                    {getStatusBadge(selectedSubmission.status)}
                  </div>
                  <div className="flex justify-between items-center pt-1 font-bold text-gray-900">
                    <span>Marks Awarded:</span>
                    <span className="text-purple-700 font-extrabold text-base">
                      {selectedSubmission.marksAwarded !== null && selectedSubmission.marksAwarded !== undefined ? selectedSubmission.marksAwarded : "Not Graded Yet"}
                    </span>
                  </div>
                  {selectedSubmission.feedback && (
                    <div className="pt-2 border-t border-purple-200 text-xs">
                      <span className="font-bold text-purple-900">Teacher Feedback:</span>
                      <p className="text-purple-800 italic mt-0.5">"{selectedSubmission.feedback}"</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="px-4 py-2 text-xs font-semibold bg-gray-700 text-white rounded-lg hover:bg-gray-800"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}