"use client";

import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  BookOpen,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileEdit,
  LogOut,
  Award,
  MessageSquare,
  Send,
  Layers,
  UserCheck,
} from "lucide-react";

interface Assignment {
  id: number;
  title: string;
  description: string;
  deadline: string;
  maxMarks: number;
  courseName: string;
  subjectName: string;
  teacherName: string;
}

interface Submission {
  submissionId: number;
  studentName: string;
  answerContent: string;
  submittedAt: string;
  marksAwarded?: number | null;
  feedback?: string | null;
  status: number; // 0 = Pending, 1 = Evaluated, 2 = Resubmitted
}

export default function StudentDashboard() {
  const router = useRouter();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissionsMap, setSubmissionsMap] = useState<Record<number, Submission | null>>({});
  const [loading, setLoading] = useState(true);

  // Submission Modal States
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [answerContent, setAnswerContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchStudentData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/Student/my-assignments");
      const assignmentList: Assignment[] = res.data;
      setAssignments(assignmentList);

      // Fetch student's submission status for each assignment
      const subMap: Record<number, Submission | null> = {};
      await Promise.all(
        assignmentList.map(async (a) => {
          try {
            const subRes = await api.get(`/Student/assignment/${a.id}/my-submission`);
            subMap[a.id] = subRes.data;
          } catch (err: any) {
            subMap[a.id] = null;
          }
        })
      );
      setSubmissionsMap(subMap);
    } catch (err: any) {
      console.error("Failed to load student assignments", err);
      if (err.response?.status === 401) {
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, []);

  const handleOpenSubmitModal = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    const existingSub = submissionsMap[assignment.id];
    setAnswerContent(existingSub ? existingSub.answerContent : "");
    setMessage(null);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment) return;

    if (!answerContent.trim()) {
      setMessage({ type: "error", text: "Answer content cannot be empty." });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const payload = {
        assignmentId: selectedAssignment.id,
        answerContent: answerContent.trim(),
      };
      await api.post("/Student/submit", payload);
      setMessage({ type: "success", text: "Assignment submitted successfully!" });
      fetchStudentData();
      setTimeout(() => {
        setSelectedAssignment(null);
      }, 1200);
    } catch (err: any) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to submit assignment." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
    router.push("/login");
  };

  const isDeadlinePassed = (deadlineStr: string) => {
    return new Date() > new Date(deadlineStr);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800">
      {/* Top Navbar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 text-white p-2 rounded-lg">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Student Portal</h1>
              <p className="text-xs text-gray-500">Coursework & Submission Tracking</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-1.5 text-xs font-semibold text-gray-600 hover:text-red-600 p-2 rounded-lg hover:bg-gray-100 transition"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Enrolled Coursework</h2>
          <p className="text-sm text-gray-500">
            View active assignments for your courses, submit answers before the deadline, and review teacher feedback.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
            <p className="mt-2 text-sm text-gray-500">Loading your coursework...</p>
          </div>
        ) : assignments.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900">No Assignments Available</h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto mt-1">
              You currently have no published assignments for your enrolled courses.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignments.map((assignment) => {
              const submission = submissionsMap[assignment.id];
              const pastDeadline = isDeadlinePassed(assignment.deadline);

              return (
                <div
                  key={assignment.id}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition flex flex-col justify-between overflow-hidden"
                >
                  <div className="p-6 space-y-4">
                    {/* Header Badges */}
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                        <Layers className="w-3 h-3" /> {assignment.subjectName}
                      </span>
                      <span className="text-xs font-mono text-gray-500">Max: {assignment.maxMarks} Marks</span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{assignment.title}</h3>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <UserCheck className="w-3.5 h-3.5 text-gray-400" /> Teacher: {assignment.teacherName}
                      </p>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">{assignment.description}</p>
                    </div>

                    {/* Course & Deadline Info */}
                    <div className="space-y-1.5 pt-2 border-t border-gray-100 text-xs">
                      <div className="flex items-center justify-between text-gray-500">
                        <span>Course:</span>
                        <span className="font-semibold text-gray-800">{assignment.courseName}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Deadline:</span>
                        <span
                          className={`font-semibold flex items-center gap-1 ${
                            pastDeadline ? "text-red-600" : "text-gray-800"
                          }`}
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(assignment.deadline).toLocaleString([], {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Submission Status & Feedback Display */}
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-600">Status:</span>
                        {submission ? (
                          submission.status === 2 ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-green-100 text-green-800">
                              <CheckCircle2 className="w-3 h-3 mr-1" /> Evaluated
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800">
                              <Clock className="w-3 h-3 mr-1" /> Submitted
                            </span>
                          )
                        ) : pastDeadline ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-red-100 text-red-800">
                            <AlertCircle className="w-3 h-3 mr-1" /> Missed
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-800">
                            <Clock className="w-3 h-3 mr-1" /> Pending
                          </span>
                        )}
                      </div>

                      {submission?.marksAwarded !== null && submission?.marksAwarded !== undefined && (
                        <div className="flex items-center justify-between pt-1 border-t border-slate-200 font-bold text-green-700">
                          <span className="flex items-center gap-1">
                            <Award className="w-4 h-4 text-green-600" /> Score:
                          </span>
                          <span>
                            {submission.marksAwarded} / {assignment.maxMarks}
                          </span>
                        </div>
                      )}

                      {submission?.feedback && (
                        <div className="pt-1 border-t border-slate-200">
                          <span className="font-semibold text-gray-700 flex items-center gap-1">
                            <MessageSquare className="w-3.5 h-3.5 text-indigo-600" /> Teacher Feedback:
                          </span>
                          <p className="text-gray-600 italic mt-0.5 line-clamp-2">"{submission.feedback}"</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer Submit / Edit Action */}
                  <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
                    {pastDeadline ? (
                      <span className="text-xs font-medium text-red-500 block text-center">
                        Deadline Passed - Submissions Closed
                      </span>
                    ) : (
                      <button
                        onClick={() => handleOpenSubmitModal(assignment)}
                        className={`w-full flex items-center justify-center space-x-1.5 text-xs font-bold py-2 px-3 rounded-lg transition ${
                          submission
                            ? "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200"
                            : "bg-indigo-600 text-white hover:bg-indigo-700"
                        }`}
                      >
                        <FileEdit className="w-4 h-4" />
                        <span>{submission ? "Update Submission" : "Submit Answer"}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal for Answer Submission */}
        {selectedAssignment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 space-y-4 border border-gray-100">
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="text-lg font-bold text-gray-900">
                  {submissionsMap[selectedAssignment.id] ? "Update Submission" : "Submit Assignment"}
                </h3>
                <button
                  onClick={() => setSelectedAssignment(null)}
                  className="text-gray-400 hover:text-gray-600 font-bold"
                >
                  ✕
                </button>
              </div>

              {message && (
                <div
                  className={`p-3 rounded-lg text-xs font-medium border ${
                    message.type === "success"
                      ? "bg-green-50 text-green-800 border-green-200"
                      : "bg-red-50 text-red-800 border-red-200"
                  }`}
                >
                  {message.text}
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-bold text-gray-900">{selectedAssignment.title}</h4>
                  <p className="text-xs text-gray-500">{selectedAssignment.description}</p>
                </div>

                <div className="bg-amber-50 p-2.5 rounded-lg text-xs text-amber-800 border border-amber-200 flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>
                    Deadline:{" "}
                    <strong>
                      {new Date(selectedAssignment.deadline).toLocaleString([], {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </strong>
                  </span>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Your Written Answer / Submission Response
                    </label>
                    <textarea
                      value={answerContent}
                      onChange={(e) => setAnswerContent(e.target.value)}
                      required
                      rows={6}
                      className="w-full px-3 py-2 border rounded-lg text-sm text-gray-900 bg-white"
                      placeholder="Write your answer or response here..."
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedAssignment(null)}
                      className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{submitting ? "Submitting..." : "Submit Response"}</span>
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
