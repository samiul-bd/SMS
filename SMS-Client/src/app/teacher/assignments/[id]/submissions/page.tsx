"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/services/api";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Clock, FileCheck, Edit3, User, Calendar, Award, MessageSquare } from "lucide-react";

interface Submission {
  submissionId: number;
  studentName: string;
  answerContent: string;
  submittedAt: string;
  marksAwarded?: number | null;
  feedback?: string | null;
  status: number; // 0 = Submitted, 1 = Evaluated, 2 = Resubmitted
}

export default function SubmissionsPage() {
  const params = useParams();
  const router = useRouter();
  const assignmentId = params.id;

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [marks, setMarks] = useState<number | "">("");
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/Assignment/${assignmentId}/submissions`);
      setSubmissions(res.data);
    } catch (err: any) {
      console.error("Failed to fetch submissions", err);
      if (err.response?.status === 401) {
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (assignmentId) {
      fetchSubmissions();
    }
  }, [assignmentId]);

  const handleOpenGradeModal = (sub: Submission) => {
    setSelectedSubmission(sub);
    setMarks(sub.marksAwarded ?? "");
    setFeedback(sub.feedback ?? "");
    setMessage(null);
  };

  const handleGradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmission) return;

    setSubmitting(true);
    setMessage(null);

    try {
      await api.post("/Assignment/review-submission", {
        submissionId: selectedSubmission.submissionId,
        marksAwarded: Number(marks),
        feedback: feedback,
        status: 2, // 2 = Evaluated (SubmissionStatus.Evaluated)
      });

      setMessage({ type: "success", text: "Submission evaluated successfully!" });
      setSelectedSubmission(null);
      fetchSubmissions();
    } catch (err: any) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to grade submission." });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: any) => {
    const s = String(status).toLowerCase();
    if (s === "evaluated" || status === 2) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
          <CheckCircle2 className="w-3 h-3 mr-1" /> Evaluated
        </span>
      );
    }
    if (s === "submitted" || status === 1) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
          <Clock className="w-3 h-3 mr-1" /> Submitted
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
        <Clock className="w-3 h-3 mr-1" /> Pending Evaluation
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              href="/teacher"
              className="flex items-center space-x-1 text-sm font-semibold text-gray-600 hover:text-blue-600 p-2 rounded-lg hover:bg-gray-100 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Assignments</span>
            </Link>
          </div>
          <h1 className="text-lg font-bold text-gray-900">Student Submissions</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
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

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Assignment #{assignmentId} Submissions</h2>
            <p className="text-sm text-gray-500">Review student work, assign marks, and leave feedback.</p>
          </div>
          <div className="text-sm font-medium bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
            Total Submissions: <span className="font-bold text-blue-600">{submissions.length}</span>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-2 text-sm text-gray-500">Loading student submissions...</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
            <FileCheck className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900">No Submissions Yet</h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto mt-1">
              No students have submitted their work for this assignment so far.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-3">Student</th>
                    <th className="px-6 py-3">Answer Snippet</th>
                    <th className="px-6 py-3">Submitted At</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Marks</th>
                    <th className="px-6 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm">
                  {submissions.map((sub) => (
                    <tr key={sub.submissionId} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-medium text-gray-900 flex items-center space-x-2">
                        <div className="bg-blue-100 text-blue-700 p-1.5 rounded-full">
                          <User className="w-4 h-4" />
                        </div>
                        <span>{sub.studentName}</span>
                      </td>

                      <td className="px-6 py-4 text-gray-600 max-w-xs truncate">
                        {sub.answerContent || <span className="italic text-gray-400">No text answer</span>}
                      </td>

                      <td className="px-6 py-4 text-gray-500 text-xs">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          {new Date(sub.submittedAt).toLocaleString([], {
                            dateStyle: "short",
                            timeStyle: "short",
                          })}
                        </span>
                      </td>

                      <td className="px-6 py-4">{getStatusBadge(sub.status)}</td>

                      <td className="px-6 py-4 font-bold text-gray-900">
                        {sub.marksAwarded !== null && sub.marksAwarded !== undefined ? (
                          <span className="text-green-700 font-semibold flex items-center gap-1">
                            <Award className="w-4 h-4 text-green-600" /> {sub.marksAwarded}
                          </span>
                        ) : (
                          <span className="text-gray-400 font-normal">--</span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleOpenGradeModal(sub)}
                          className="inline-flex items-center space-x-1 text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-200 transition"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>{sub.marksAwarded !== null ? "Re-evaluate" : "Grade"}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal for Grading Submission */}
        {selectedSubmission && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 space-y-4 border border-gray-100 animate-in fade-in zoom-in-95">
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="text-lg font-bold text-gray-900">Evaluate Submission</h3>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="text-gray-400 hover:text-gray-600 font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-xs font-semibold text-gray-400 uppercase">Student Name</span>
                  <p className="text-sm font-bold text-gray-800">{selectedSubmission.studentName}</p>
                </div>

                <div>
                  <span className="text-xs font-semibold text-gray-400 uppercase">Student's Answer</span>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg text-sm text-gray-700 max-h-40 overflow-y-auto border border-gray-200">
                    {selectedSubmission.answerContent || "No submission text provided."}
                  </div>
                </div>

                <form onSubmit={handleGradeSubmit} className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Marks Awarded
                    </label>
                    <input
                      type="number"
                      value={marks}
                      onChange={(e) => setMarks(e.target.value ? Number(e.target.value) : "")}
                      required
                      min={0}
                      className="w-full px-3 py-2 border rounded-lg text-gray-900 bg-white"
                      placeholder="Enter score"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Teacher Feedback
                    </label>
                    <textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border rounded-lg text-gray-900 bg-white"
                      placeholder="Great effort! Clear explanation..."
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedSubmission(null)}
                      className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-4 py-2 text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 rounded-lg disabled:opacity-50"
                    >
                      {submitting ? "Saving..." : "Submit Evaluation"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
