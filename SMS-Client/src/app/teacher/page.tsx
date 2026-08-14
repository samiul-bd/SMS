"use client";

import { useState, useEffect } from "react";
import { api } from "@/services/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileText, Plus, CheckCircle, Clock, Trash2, Eye, LogOut, BookOpen, Layers } from "lucide-react";

interface Assignment {
  id: number;
  title: string;
  description: string;
  deadline: string;
  maxMarks: number;
  isPublished: boolean;
  courseId: number;
  courseName: string;
  subjectId: number;
  subjectName: string;
  submissionCount: number;
}

export default function TeacherDashboard() {
  const router = useRouter();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const res = await api.get("/Assignment/my-assignments");
      setAssignments(res.data);
    } catch (err: any) {
      console.error("Failed to load assignments", err);
      if (err.response?.status === 401) {
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this assignment?")) return;
    try {
      await api.delete(`/Assignment/delete/${id}`);
      setMessage({ type: "success", text: "Assignment deleted successfully." });
      setAssignments(assignments.filter((a) => a.id !== id));
    } catch (err: any) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to delete assignment." });
    }
  };

  const handleTogglePublish = async (assignment: Assignment) => {
    try {
      const updatedData = {
        id: assignment.id,
        title: assignment.title,
        description: assignment.description,
        deadline: assignment.deadline,
        maxMarks: assignment.maxMarks,
        courseId: assignment.courseId,
        subjectId: assignment.subjectId,
        isPublished: !assignment.isPublished,
      };
      await api.put("/Assignment/update", updatedData);
      setMessage({
        type: "success",
        text: `Assignment marked as ${!assignment.isPublished ? "Published" : "Draft"}.`,
      });
      fetchAssignments();
    } catch (err: any) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to update assignment status." });
    }
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
    router.push("/login");
  };

  const filteredAssignments = assignments.filter((a) => {
    if (filter === "published") return a.isPublished;
    if (filter === "draft") return !a.isPublished;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800">
      {/* Top Navbar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Teacher Portal</h1>
              <p className="text-xs text-gray-500">Assignment & Submission Management</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/teacher/assignments/create"
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create Assignment</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 text-gray-600 hover:text-red-600 p-2 rounded-lg hover:bg-gray-100 transition"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header Stats & Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Assignments</h2>
            <p className="text-sm text-gray-500">View, manage, publish assignments and grade student submissions.</p>
          </div>

          <div className="flex items-center space-x-2 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
                filter === "all" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              All ({assignments.length})
            </button>
            <button
              onClick={() => setFilter("published")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
                filter === "published" ? "bg-green-600 text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Published ({assignments.filter((a) => a.isPublished).length})
            </button>
            <button
              onClick={() => setFilter("draft")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
                filter === "draft" ? "bg-amber-500 text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Drafts ({assignments.filter((a) => !a.isPublished).length})
            </button>
          </div>
        </div>

        {message && (
          <div
            className={`p-4 rounded-xl text-sm font-medium border ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border-green-200"
                : "bg-red-50 text-red-800 border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Assignments Cards List */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-2 text-sm text-gray-500">Loading assignments...</p>
          </div>
        ) : filteredAssignments.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900">No Assignments Found</h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto mt-1 mb-6">
              {filter === "all"
                ? "You haven't created any assignments yet."
                : `There are no assignments with status '${filter}'.`}
            </p>
            <Link
              href="/teacher/assignments/create"
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Assignment</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssignments.map((assignment) => (
              <div
                key={assignment.id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition flex flex-col justify-between overflow-hidden"
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        assignment.isPublished
                          ? "bg-green-100 text-green-800 border border-green-200"
                          : "bg-amber-100 text-amber-800 border border-amber-200"
                      }`}
                    >
                      {assignment.isPublished ? (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" /> Published
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3 mr-1" /> Draft
                        </>
                      )}
                    </span>
                    <span className="text-xs text-gray-500 font-mono">Max Marks: {assignment.maxMarks}</span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{assignment.title}</h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{assignment.description}</p>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-gray-100 text-xs text-gray-500">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 font-medium text-gray-700">
                        <Layers className="w-3.5 h-3.5 text-blue-500" />
                        {assignment.courseName || "Course"}
                      </span>
                      <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-medium">
                        {assignment.subjectName || "Subject"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span>Deadline:</span>
                      <span className="font-semibold text-gray-800">
                        {new Date(assignment.deadline).toLocaleString([], {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex items-center justify-between">
                  <Link
                    href={`/teacher/assignments/${assignment.id}/submissions`}
                    className="flex items-center space-x-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition"
                  >
                    <Eye className="w-4 h-4" />
                    <span>
                      Submissions ({assignment.submissionCount})
                    </span>
                  </Link>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleTogglePublish(assignment)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded transition ${
                        assignment.isPublished
                          ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                          : "bg-green-50 text-green-700 hover:bg-green-100"
                      }`}
                    >
                      {assignment.isPublished ? "Unpublish" : "Publish"}
                    </button>
                    <button
                      onClick={() => handleDelete(assignment.id)}
                      className="p-1 text-gray-400 hover:text-red-600 rounded hover:bg-red-50 transition"
                      title="Delete Assignment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
