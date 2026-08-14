"use client";

import { useState, useEffect } from "react";
import { api } from "@/services/api";
import Link from "next/link";

export default function ManageUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [editForm, setEditForm] = useState({ id: 0, name: "", role: "" });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/Admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to load users", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (user: any) => {
    const userId = user.id || user.Id;
    const userName = user.name || user.userName || "";
    const userRole = user.role || user.Role || "";

    setEditingUser(userId);
    setEditForm({ id: Number(userId), name: userName, role: userRole });
  };

  const handleUpdate = async () => {
    try {
      await api.put("/Admin/update-user", editForm);
      setEditingUser(null);
      fetchUsers();
      alert("User updated successfully!");
    } catch (err: any) {
      console.error("API Error Details:", err.response?.data);
      alert(err.response?.data?.message || "Failed to update user.");
    }
  };

  // --- ইউজার ডিলিট করার ফাংশন ---
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/Admin/users/${id}`);
      setUsers(users.filter((u) => (u.id || u.Id) !== id));
      alert("User deleted successfully!");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete user.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-800">Manage Users</h1>
          <Link href="/admin" className="text-blue-600 font-semibold hover:underline">&larr; Back to Dashboard</Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading users...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 uppercase text-xs font-semibold">
                    <th className="px-4 py-3 border-b">Name</th>
                    <th className="px-4 py-3 border-b">Email</th>
                    <th className="px-4 py-3 border-b">Role</th>
                    <th className="px-4 py-3 border-b">Assigned Subjects</th>
                    <th className="px-4 py-3 border-b text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((user) => {
                    const currentId = user.id || user.Id;
                    const currentRole = user.role || user.Role;

                    return (
                      <tr key={currentId} className="hover:bg-gray-50">
                        
                        {/* Name Column */}
                        <td className="px-4 py-3 text-sm text-gray-800">
                          {editingUser === currentId ? (
                            <input 
                              type="text" 
                              className="border p-1 text-sm rounded w-full text-gray-900 bg-white"
                              value={editForm.name}
                              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            />
                          ) : (
                            user.userName || user.name || user.Name
                          )}
                        </td>

                        {/* Email Column */}
                        <td className="px-4 py-3 text-sm text-gray-600">{user.email || user.Email}</td>

                        {/* Role Column */}
                        <td className="px-4 py-3 text-sm">
                          {editingUser === currentId ? (
                            <select 
                              className="border p-1 text-sm rounded w-full text-gray-900 bg-white"
                              value={editForm.role}
                              onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                            >
                              <option value="Admin">Admin</option>
                              <option value="Teacher">Teacher</option>
                              <option value="Student">Student</option>
                            </select>
                          ) : (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              currentRole === 'Admin' ? 'bg-purple-100 text-purple-700' :
                              currentRole === 'Teacher' ? 'bg-blue-100 text-blue-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {currentRole}
                            </span>
                          )}
                        </td>

                        {/* Subjects Column */}
                        <td className="px-4 py-3 text-sm">
                          {currentRole === "Teacher" ? (
                            user.subjects && user.subjects.length > 0 ? (
                              <select defaultValue="" className="w-full px-2 py-1 border rounded text-gray-700 bg-white text-xs outline-none cursor-pointer">
                                <option value="" disabled>View Subjects ({user.subjects.length})</option>
                                {user.subjects.map((sub: any, index: number) => (
                                  <option key={index} disabled>{sub.name || sub.title || sub}</option>
                                ))}
                              </select>
                            ) : (
                              <span className="text-gray-400 italic text-xs">No subjects</span>
                            )
                          ) : (
                            <span className="text-gray-300">-</span>
                          )}
                        </td>

                        {/* Actions Column (Edit, Save, Cancel & Delete) */}
                        <td className="px-4 py-3 text-sm text-center space-x-2">
                          {editingUser === currentId ? (
                            <>
                              <button onClick={handleUpdate} className="text-green-600 font-semibold hover:underline">Save</button>
                              <button onClick={() => setEditingUser(null)} className="text-gray-500 font-semibold hover:underline">Cancel</button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => handleEditClick(user)} className="text-blue-600 font-semibold hover:underline">
                                Edit
                              </button>
                              <button onClick={() => handleDelete(currentId)} className="text-red-600 font-semibold hover:underline">
                                Delete
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}