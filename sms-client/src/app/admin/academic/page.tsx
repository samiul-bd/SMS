"use client";

import { useState, useEffect } from "react";
import { api } from "@/services/api";
import Link from "next/link";

export default function ManageAcademic() {
  const [courses, setCourses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form States
  const [courseName, setCourseName] = useState("");
  const [courseDesc, setCourseDesc] = useState("");
  const [editingCourseId, setEditingCourseId] = useState<number | null>(null);

  const [subjectName, setSubjectName] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState<number | "" >("");
  const [editingSubjectId, setEditingSubjectId] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [courseRes, subjectRes] = await Promise.all([
        api.get("/Admin/courses"),
        api.get("/Admin/subjects")
      ]);
      setCourses(courseRes.data);
      setSubjects(subjectRes.data);
    } catch (err) {
      console.error("Failed to load academic data", err);
    } finally {
      setLoading(false);
    }
  };

  // --- Course CRUD Handlers ---
  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCourseId) {
        await api.put(`/Admin/courses/${editingCourseId}`, { name: courseName, description: courseDesc });
        alert("Course updated successfully!");
      } else {
        await api.post("/Admin/course", { name: courseName, description: courseDesc });
        alert("Course created successfully!");
      }
      setCourseName("");
      setCourseDesc("");
      setEditingCourseId(null);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Operation failed.");
    }
  };

  const handleEditCourse = (course: any) => {
    setEditingCourseId(course.id);
    setCourseName(course.name);
    setCourseDesc(course.description || "");
  };

  const handleDeleteCourse = async (id: number) => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    try {
      await api.delete(`/Admin/courses/${id}`);
      fetchData();
      alert("Course deleted successfully!");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete course.");
    }
  };

  // --- Subject CRUD Handlers ---
  const handleSaveSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId) {
      alert("Please select a course for the subject.");
      return;
    }
    try {
      const payload = { name: subjectName, courseId: Number(selectedCourseId) };
      if (editingSubjectId) {
        await api.put(`/Admin/subjects/${editingSubjectId}`, payload);
        alert("Subject updated successfully!");
      } else {
        await api.post("/Admin/subject", payload);
        alert("Subject created successfully!");
      }
      setSubjectName("");
      setSelectedCourseId("");
      setEditingSubjectId(null);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Operation failed.");
    }
  };

  const handleEditSubject = (subject: any) => {
    setEditingSubjectId(subject.id);
    setSubjectName(subject.name);
    setSelectedCourseId(subject.courseId || subject.CourseId);
  };

  const handleDeleteSubject = async (id: number) => {
    if (!confirm("Are you sure you want to delete this subject?")) return;
    try {
      await api.delete(`/Admin/subjects/${id}`);
      fetchData();
      alert("Subject deleted successfully!");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete subject.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-800">Manage Classes/Courses & Subjects</h1>
          <Link href="/admin" className="text-blue-600 font-semibold hover:underline">&larr; Back to Dashboard</Link>
        </div>

        {loading ? (
          <div className="text-center p-6 text-gray-500">Loading academic data...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* --- COURSES SECTION --- */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-800 mb-4">
                  {editingCourseId ? "Edit Course" : "Add New Course"}
                </h2>
                <form onSubmit={handleSaveCourse} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border rounded-md text-gray-900 bg-white"
                      value={courseName}
                      onChange={(e) => setCourseName(e.target.value)}
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border rounded-md text-gray-900 bg-white"
                      value={courseDesc}
                      onChange={(e) => setCourseDesc(e.target.value)}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 w-full">
                      {editingCourseId ? "Update Course" : "Create Course"}
                    </button>
                    {editingCourseId && (
                      <button 
                        type="button" 
                        onClick={() => { setEditingCourseId(null); setCourseName(""); setCourseDesc(""); }}
                        className="bg-gray-400 text-white px-4 py-2 rounded-md font-semibold hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Course List */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Existing Courses</h2>
                <div className="space-y-3">
                  {courses.map((course) => (
                    <div key={course.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border">
                      <div>
                        <p className="font-semibold text-gray-800">{course.name}</p>
                        <p className="text-xs text-gray-500">{course.description || "No description"}</p>
                      </div>
                      <div className="space-x-2">
                        <button onClick={() => handleEditCourse(course)} className="text-blue-600 text-sm font-medium hover:underline">Edit</button>
                        <button onClick={() => handleDeleteCourse(course.id)} className="text-red-600 text-sm font-medium hover:underline">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* --- SUBJECTS SECTION --- */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-800 mb-4">
                  {editingSubjectId ? "Edit Subject" : "Add New Subject"}
                </h2>
                <form onSubmit={handleSaveSubject} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Course</label>
                    <select 
                      className="w-full px-3 py-2 border rounded-md text-gray-900 bg-white"
                      value={selectedCourseId}
                      onChange={(e) => setSelectedCourseId(e.target.value ? Number(e.target.value) : "")}
                      required
                    >
                      <option value="">-- Choose Course --</option>
                      {courses.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject Name</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border rounded-md text-gray-900 bg-white"
                      value={subjectName}
                      onChange={(e) => setSubjectName(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-700 w-full">
                      {editingSubjectId ? "Update Subject" : "Create Subject"}
                    </button>
                    {editingSubjectId && (
                      <button 
                        type="button" 
                        onClick={() => { setEditingSubjectId(null); setSubjectName(""); setSelectedCourseId(""); }}
                        className="bg-gray-400 text-white px-4 py-2 rounded-md font-semibold hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Subject List */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Existing Subjects</h2>
                <div className="space-y-3">
                  {subjects.map((sub) => (
                    <div key={sub.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border">
                      <div>
                        <p className="font-semibold text-gray-800">{sub.name}</p>
                        <p className="text-xs text-gray-500">Course ID: {sub.courseId || sub.CourseId}</p>
                      </div>
                      <div className="space-x-2">
                        <button onClick={() => handleEditSubject(sub)} className="text-blue-600 text-sm font-medium hover:underline">Edit</button>
                        <button onClick={() => handleDeleteSubject(sub.id)} className="text-red-600 text-sm font-medium hover:underline">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}