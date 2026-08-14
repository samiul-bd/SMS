"use client";

import { useState, useEffect } from "react";
import { api } from "@/services/api";
import Link from "next/link";
import { Users, UserCheck, Shield, CheckCircle2, XCircle, Clock, Trash2, Edit3 } from "lucide-react";

export default function ManageUsers() {
  const [activeTab, setActiveTab] = useState<"users" | "pending">("users");
  const [users, setUsers] = useState<any[]>([]);
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit User State
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [editForm, setEditForm] = useState({ id: 0, name: "", role: "" });

  // Approve User Modal State
  const [approvingUser, setApprovingUser] = useState<any | null>(null);
  const [assignedRole, setAssignedRole] = useState<number>(0); // 0 = Student, 1 = Teacher, 2 = Admin
  const [approving, setApproving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, pendingRes] = await Promise.all([
        api.get("/Admin/users"),
        api.get("/Admin/pending-users"),
      ]);
      setUsers(usersRes.data);
      setPendingUsers(pendingRes.data);
    } catch (err) {
      console.error("Failed to load user management data", err);
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
      fetchData();
      alert("User updated successfully!");
    } catch (err: any) {
      console.error("API Error Details:", err.response?.data);
      alert(err.response?.data?.message || "Failed to update user.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/Admin/users/${id}`);
      fetchData();
      alert("User deleted successfully!");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete user.");
    }
  };

  const handleApproveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!approvingUser) return;

    setApproving(true);
    try {
      await api.post("/Admin/approve-user", {
        userId: approvingUser.id || approvingUser.Id,
        assignedRole: Number(assignedRole),
        isApproved: true,
      });

      alert(`User ${approvingUser.email} approved successfully!`);
      setApprovingUser(null);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to approve user.");
    } finally {
      setApproving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Management & Approvals</h1>
            <p className="text-xs text-gray-500">Manage user accounts and approve pending registration requests</p>
          </div>
          <Link href="/admin" className="text-blue-600 font-semibold hover:underline">&larr; Back to Dashboard</Link>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2.5 text-sm font-bold border-b-2 transition ${
              activeTab === "users"
                ? "border-purple-600 text-purple-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Active Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-4 py-2.5 text-sm font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === "pending"
                ? "border-purple-600 text-purple-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <span>Pending Approvals</span>
            {pendingUsers.length > 0 && (
              <span className="bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full font-extrabold">
                {pendingUsers.length}
              </span>
            )}
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center bg-white rounded-xl border border-gray-100 text-gray-500 text-sm">
            Loading user data...
          </div>
        ) : activeTab === "users" ? (
          /* TAB 1: ACTIVE USERS */
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold border-b">
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Allocated Subjects / Courses</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {users.map((user) => {
                    const currentId = user.id || user.Id;
                    const currentRole = user.role || user.Role;

                    return (
                      <tr key={currentId} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3 font-medium text-gray-900">
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

                        <td className="px-4 py-3 text-gray-600">{user.email || user.Email}</td>

                        <td className="px-4 py-3">
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
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                currentRole === "Admin"
                                  ? "bg-purple-100 text-purple-700 border border-purple-200"
                                  : currentRole === "Teacher"
                                  ? "bg-blue-100 text-blue-700 border border-blue-200"
                                  : "bg-green-100 text-green-700 border border-green-200"
                              }`}
                            >
                              {currentRole}
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-3">
                          {user.isApproved !== false ? (
                            <span className="inline-flex items-center text-xs font-semibold text-green-700">
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-xs font-semibold text-amber-700">
                              <Clock className="w-3.5 h-3.5 mr-1" /> Pending
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-3 text-xs">
                          {currentRole === "Teacher" ? (
                            user.subjects && user.subjects.length > 0 ? (
                              <select defaultValue="" className="w-full px-2 py-1 border rounded text-gray-700 bg-white text-xs outline-none cursor-pointer">
                                <option value="" disabled>View Subjects ({user.subjects.length})</option>
                                {user.subjects.map((sub: any, index: number) => (
                                  <option key={index} disabled>{sub.name || sub.title || sub}</option>
                                ))}
                              </select>
                            ) : (
                              <span className="text-gray-400 italic">No subjects assigned</span>
                            )
                          ) : currentRole === "Student" ? (
                            user.courses && user.courses.length > 0 ? (
                              <select defaultValue="" className="w-full px-2 py-1 border rounded text-gray-700 bg-white text-xs outline-none cursor-pointer">
                                <option value="" disabled>View Courses ({user.courses.length})</option>
                                {user.courses.map((c: any, index: number) => (
                                  <option key={index} disabled>{c.name || c.title || c}</option>
                                ))}
                              </select>
                            ) : (
                              <span className="text-gray-400 italic">No courses enrolled</span>
                            )
                          ) : (
                            <span className="text-gray-300">-</span>
                          )}
                        </td>

                        <td className="px-4 py-3 text-center space-x-2">
                          {editingUser === currentId ? (
                            <>
                              <button onClick={handleUpdate} className="text-green-600 font-semibold hover:underline">Save</button>
                              <button onClick={() => setEditingUser(null)} className="text-gray-500 font-semibold hover:underline">Cancel</button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => handleEditClick(user)} className="text-blue-600 font-semibold hover:underline">Edit</button>
                              <button onClick={() => handleDelete(currentId)} className="text-red-600 font-semibold hover:underline">Delete</button>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* TAB 2: PENDING USER APPROVALS */
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 font-bold text-gray-800">
              Pending Anonymous Registrations
            </div>

            {pendingUsers.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm">
                No pending registration requests requiring approval.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold border-b">
                      <th className="px-4 py-3">Applicant Name</th>
                      <th className="px-4 py-3">Email Address</th>
                      <th className="px-4 py-3">Requested Role</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {pendingUsers.map((pUser) => {
                      const pId = pUser.id || pUser.Id;
                      return (
                        <tr key={pId} className="hover:bg-gray-50 transition">
                          <td className="px-4 py-3 font-semibold text-gray-900">{pUser.name}</td>
                          <td className="px-4 py-3 text-gray-600">{pUser.email}</td>
                          <td className="px-4 py-3">
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                              {pUser.requestedRole || pUser.role || "Student"} (Requested)
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => {
                                setApprovingUser(pUser);
                                const reqRoleStr = String(pUser.requestedRole || pUser.role).toLowerCase();
                                setAssignedRole(reqRoleStr === "teacher" ? 1 : reqRoleStr === "admin" ? 2 : 0);
                              }}
                              className="inline-flex items-center space-x-1 text-xs font-bold bg-green-600 text-white hover:bg-green-700 px-3 py-1.5 rounded-lg transition shadow-sm"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                              <span>Approve & Assign Role</span>
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

        {/* Modal for Approving User & Assigning Approved Role */}
        {approvingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4 border border-gray-100">
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="text-lg font-bold text-gray-900">Approve User Account</h3>
                <button
                  onClick={() => setApprovingUser(null)}
                  className="text-gray-400 hover:text-gray-600 font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleApproveSubmit} className="space-y-4">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1 text-xs">
                  <div>
                    <span className="font-semibold text-gray-500">Applicant:</span>{" "}
                    <strong className="text-gray-900">{approvingUser.name}</strong>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-500">Email:</span>{" "}
                    <strong className="text-gray-900">{approvingUser.email}</strong>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Select Approved System Role
                  </label>
                  <select
                    value={assignedRole}
                    onChange={(e) => setAssignedRole(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg text-sm text-gray-900 bg-white"
                  >
                    <option value={0}>Student</option>
                    <option value={1}>Teacher</option>
                    <option value={2}>Admin</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setApprovingUser(null)}
                    className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={approving}
                    className="px-4 py-2 text-xs font-bold bg-green-600 text-white hover:bg-green-700 rounded-lg disabled:opacity-50"
                  >
                    {approving ? "Approving..." : "Confirm Approval"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}