"use client";

import { useState, useEffect } from "react";
import { api } from "@/services/api";
import Link from "next/link";
import { UserCheck, GraduationCap, BookOpen, Layers } from "lucide-react";

export default function AssignTeacher() {
  const [teacherMsg, setTeacherMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [studentMsg, setStudentMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [users, setUsers] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);

  // Assign Teacher Form State
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | "">("");
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | "">("");
  const [submittingTeacher, setSubmittingTeacher] = useState(false);

  // Enroll Student Form State
  const [selectedStudentId, setSelectedStudentId] = useState<number | "">("");
  const [selectedCourseId, setSelectedCourseId] = useState<number | "">("");
  const [submittingStudent, setSubmittingStudent] = useState(false);

  const fetchData = async () => {
    try {
      const [usersRes, subjectsRes, coursesRes] = await Promise.all([
        api.get("/Admin/users"),
        api.get("/Admin/subjects"),
        api.get("/Admin/courses"),
      ]);
      setUsers(usersRes.data);
      setSubjects(subjectsRes.data);
      setCourses(coursesRes.data);
    } catch (err) {
      console.error("Failed to load allocation data", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter teachers vs students based on role property
  const teacherList = users.filter((u) => u.role === "Teacher" || u.Role === "Teacher" || !u.role);
  const studentList = users.filter((u) => u.role === "Student" || u.Role === "Student" || !u.role);

  const handleAssignTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeacherId || !selectedSubjectId) return;

    setSubmittingTeacher(true);
    setTeacherMsg(null);

    try {
      const payload = {
        teacherId: Number(selectedTeacherId),
        subjectId: Number(selectedSubjectId),
      };
      await api.post("/Admin/assign-teacher", payload);
      setTeacherMsg({ type: "success", text: "Teacher assigned to subject successfully!" });
      setSelectedTeacherId("");
      setSelectedSubjectId("");
    } catch (err: any) {
      setTeacherMsg({ type: "error", text: err.response?.data?.message || "Failed to assign teacher." });
    } finally {
      setSubmittingTeacher(false);
    }
  };

  const handleEnrollStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || !selectedCourseId) return;

    setSubmittingStudent(true);
    setStudentMsg(null);

    try {
      const payload = {
        studentId: Number(selectedStudentId),
        courseId: Number(selectedCourseId),
      };
      await api.post("/Admin/enroll-student", payload);
      setStudentMsg({ type: "success", text: "Student enrolled in course successfully!" });
      setSelectedStudentId("");
      setSelectedCourseId("");
    } catch (err: any) {
      setStudentMsg({ type: "error", text: err.response?.data?.message || "Failed to enroll student." });
    } finally {
      setSubmittingStudent(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Academic Allocations</h1>
            <p className="text-xs text-gray-500">Assign teachers to subjects & enroll students into courses</p>
          </div>
          <Link href="/admin" className="text-blue-600 font-semibold hover:underline">&larr; Back to Dashboard</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ASSIGN TEACHER TO SUBJECT */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <div className="flex items-center space-x-2 border-b pb-3">
              <div className="bg-blue-100 text-blue-700 p-2 rounded-lg">
                <UserCheck className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-gray-800">Assign Teacher to Subject</h2>
            </div>

            {teacherMsg && (
              <div className={`p-3 rounded-lg text-xs font-medium ${teacherMsg.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                {teacherMsg.text}
              </div>
            )}

            <form onSubmit={handleAssignTeacher} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Teacher</label>
                <select
                  value={selectedTeacherId}
                  onChange={(e) => setSelectedTeacherId(e.target.value ? Number(e.target.value) : "")}
                  required
                  className="w-full px-3 py-2 border rounded-md text-gray-900 bg-white"
                >
                  <option value="">-- Choose Teacher --</option>
                  {teacherList.map((t: any) => (
                    <option key={t.id || t.Id} value={t.id || t.Id}>
                      {t.name || t.Name} ({t.email || t.Email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Subject</label>
                <select
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value ? Number(e.target.value) : "")}
                  required
                  className="w-full px-3 py-2 border rounded-md text-gray-900 bg-white"
                >
                  <option value="">-- Choose Subject --</option>
                  {subjects.map((s: any) => (
                    <option key={s.id || s.Id} value={s.id || s.Id}>
                      {s.name || s.Name || `Subject ${s.id}`}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={submittingTeacher}
                className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition disabled:opacity-50"
              >
                {submittingTeacher ? "Assigning..." : "Assign Teacher"}
              </button>
            </form>
          </div>

          {/* ENROLL STUDENT TO COURSE */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <div className="flex items-center space-x-2 border-b pb-3">
              <div className="bg-green-100 text-green-700 p-2 rounded-lg">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-gray-800">Enroll Student to Course</h2>
            </div>

            {studentMsg && (
              <div className={`p-3 rounded-lg text-xs font-medium ${studentMsg.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                {studentMsg.text}
              </div>
            )}

            <form onSubmit={handleEnrollStudent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Student</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value ? Number(e.target.value) : "")}
                  required
                  className="w-full px-3 py-2 border rounded-md text-gray-900 bg-white"
                >
                  <option value="">-- Choose Student --</option>
                  {studentList.map((st: any) => (
                    <option key={st.id || st.Id} value={st.id || st.Id}>
                      {st.name || st.Name} ({st.email || st.Email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Course / Class</label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value ? Number(e.target.value) : "")}
                  required
                  className="w-full px-3 py-2 border rounded-md text-gray-900 bg-white"
                >
                  <option value="">-- Choose Course --</option>
                  {courses.map((c: any) => (
                    <option key={c.id || c.Id} value={c.id || c.Id}>
                      {c.name || c.Name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={submittingStudent}
                className="w-full bg-green-600 text-white py-2 rounded-md font-semibold hover:bg-green-700 transition disabled:opacity-50"
              >
                {submittingStudent ? "Enrolling..." : "Enroll Student"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}