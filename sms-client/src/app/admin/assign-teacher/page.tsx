"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { api } from "@/services/api";
import Link from "next/link";

type AssignFormValues = {
  teacherId: string;
  subjectId: string;
};

export default function AssignTeacher() {
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<AssignFormValues>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, subjectsRes] = await Promise.all([
          api.get("/Admin/users"),
          api.get("/Admin/subjects")
        ]);
        
        // যদি ব্যাকএন্ড থেকে রোল আসে, তবে শুধু Teacher ফিল্টার করতে পারেন। 
        // আপাতত সব ইউজার লিস্টে রাখছি, আপনি চাইলে u.role === 'Teacher' দিয়ে ফিল্টার করতে পারেন।
        setTeachers(usersRes.data); 
        setSubjects(subjectsRes.data);
      } catch (err) {
        console.error("Failed to load data", err);
      }
    };
    fetchData();
  }, []);

  const onSubmit = async (data: AssignFormValues) => {
    setMessage(null);
    try {
      const payload = {
        teacherId: data.teacherId, // DTO অনুযায়ী TeacherId string (GUID)
        subjectId: Number(data.subjectId), // SubjectId number
      };
      
      await api.post("/Admin/assign-teacher", payload);
      setMessage({ type: "success", text: "Teacher assigned to subject successfully!" });
      reset();
    } catch (err: any) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to assign teacher." });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-xl mx-auto space-y-6">
        <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-800">Assign Teacher to Subject</h1>
          <Link href="/admin" className="text-blue-600 font-semibold hover:underline">&larr; Back</Link>
        </div>

        {message && (
          <div className={`p-4 rounded-md text-sm font-medium ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
            {message.text}
          </div>
        )}

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Teacher</label>
              <select 
                {...register("teacherId", { required: "Please select a teacher" })} 
                className="w-full px-3 py-2 border rounded-md text-gray-900 bg-white"
              >
                <option value="">-- Choose Teacher --</option>
                {teachers.map((t: any) => (
                  <option key={t.id} value={t.id}>{t.email || t.userName || t.id}</option>
                ))}
              </select>
              {errors.teacherId && <p className="text-red-500 text-xs mt-1">{errors.teacherId.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Subject</label>
              <select 
                {...register("subjectId", { required: "Please select a subject" })} 
                className="w-full px-3 py-2 border rounded-md text-gray-900 bg-white"
              >
                <option value="">-- Choose Subject --</option>
                {subjects.map((s: any) => (
                  <option key={s.id} value={s.id}>{s.name || s.title || `Subject ${s.id}`}</option>
                ))}
              </select>
              {errors.subjectId && <p className="text-red-500 text-xs mt-1">{errors.subjectId.message}</p>}
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 mt-4">
              Assign Teacher
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}