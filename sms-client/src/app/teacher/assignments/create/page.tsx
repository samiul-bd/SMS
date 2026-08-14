"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { api } from "@/services/api";
import Link from "next/link";

const assignmentSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().min(5, { message: "Description must be at least 5 characters" }),
  deadline: z.string().min(1, { message: "Deadline is required" }),
  maxMarks: z.coerce.number().min(1, { message: "Maximum marks must be at least 1" }),
  courseId: z.string().min(1, { message: "Please select a course" }),
  subjectId: z.string().min(1, { message: "Please select a subject" }),
  isPublished: z.boolean(),
});

type AssignmentFormValues = z.infer<typeof assignmentSchema>;

export default function CreateAssignment() {
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);

  const form = useForm<AssignmentFormValues>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      isPublished: true,
    },
  });

  useEffect(() => {
    // Course এবং Subject দুটোই একসাথে লোড করা হচ্ছে
    const fetchData = async () => {
      try {
        const [courseRes, subjectRes] = await Promise.all([
          api.get("/Admin/courses"),
          api.get("/Assignment/my-subjects") // <-- শুধুমাত্র এই টিচারের সাবজেক্ট ফেচ করা হচ্ছে
        ]);
        setCourses(courseRes.data);
        setSubjects(subjectRes.data);
      } catch (err) {
        console.error("Failed to load data", err);
      }
    };
    fetchData();
  }, []);

  const onSubmit = async (data: AssignmentFormValues) => {
    setMessage(null);
    try {
      const payload = {
        ...data,
        courseId: Number(data.courseId),
        subjectId: Number(data.subjectId),
      };
      await api.post("/Assignment/create", payload);
      setMessage({ type: "success", text: "Assignment created successfully!" });
      form.reset();
    } catch (err: any) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to create assignment." });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-800">Create New Assignment</h1>
          <Link href="/teacher" className="text-blue-600 font-semibold hover:underline">&larr; Back</Link>
        </div>

        {message && (
          <div className={`p-4 rounded-md text-sm font-medium ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
            {message.text}
          </div>
        )}

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Course</label>
                <select {...form.register("courseId")} className="w-full px-3 py-2 border rounded-md text-gray-900 bg-white">
                  <option value="">-- Choose Course --</option>
                  {courses.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.name || c.title || `Course ${c.id}`}</option>
                  ))}
                </select>
                {form.formState.errors.courseId && <p className="text-red-500 text-xs mt-1">{form.formState.errors.courseId.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Subject</label>
                <select {...form.register("subjectId")} className="w-full px-3 py-2 border rounded-md text-gray-900 bg-white">
                  <option value="">-- Choose Subject --</option>
                  {subjects.map((s: any) => (
                    <option key={s.id} value={s.id}>{s.name || s.title || `Subject ${s.id}`}</option>
                  ))}
                </select>
                {form.formState.errors.subjectId && <p className="text-red-500 text-xs mt-1">{form.formState.errors.subjectId.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assignment Title</label>
              <input {...form.register("title")} className="w-full px-3 py-2 border rounded-md text-gray-900 bg-white" placeholder="e.g. Data Structures Lab 1" />
              {form.formState.errors.title && <p className="text-red-500 text-xs mt-1">{form.formState.errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea {...form.register("description")} rows={4} className="w-full px-3 py-2 border rounded-md text-gray-900 bg-white" placeholder="Assignment details and instructions..." />
              {form.formState.errors.description && <p className="text-red-500 text-xs mt-1">{form.formState.errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                <input type="datetime-local" {...form.register("deadline")} className="w-full px-3 py-2 border rounded-md text-gray-900 bg-white" />
                {form.formState.errors.deadline && <p className="text-red-500 text-xs mt-1">{form.formState.errors.deadline.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Marks</label>
                <input type="number" {...form.register("maxMarks")} className="w-full px-3 py-2 border rounded-md text-gray-900 bg-white" placeholder="e.g. 100" />
                {form.formState.errors.maxMarks && <p className="text-red-500 text-xs mt-1">{form.formState.errors.maxMarks.message}</p>}
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <input type="checkbox" {...form.register("isPublished")} id="isPublished" className="w-4 h-4 text-blue-600 border-gray-300 rounded" />
              <label htmlFor="isPublished" className="text-sm font-medium text-gray-700">Publish Immediately (otherwise saved as draft)</label>
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 mt-4">Create Assignment</button>
          </form>
        </div>
      </div>
    </div>
  );
}