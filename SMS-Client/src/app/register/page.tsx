"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/services/api";
import { UserPlus, CheckCircle2, ArrowLeft, Mail, Lock, User, ShieldCheck } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [requestedRole, setRequestedRole] = useState<number>(0); // 0 = Student, 1 = Teacher
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/Auth/register", {
        name,
        email,
        password,
        role: requestedRole,
      });

      setSuccess(true);
    } catch (err: any) {
      console.error("Registration failed", err);
      setError(
        err.response?.data?.message || err.response?.data || "Registration failed. Email might already be registered."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-md w-full p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-purple-100 text-purple-700 rounded-2xl mb-2">
            <UserPlus className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create an Account</h1>
          <p className="text-xs text-gray-500 max-w-xs mx-auto">
            Submit your registration request for Admin review and account approval.
          </p>
        </div>

        {success ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center space-y-4">
            <div className="inline-flex p-3 bg-green-100 text-green-700 rounded-full">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-green-900">Registration Request Submitted!</h2>
            <p className="text-xs text-green-800 leading-relaxed">
              Your account has been created and is currently <strong>pending approval by an Admin</strong>. You will be able to log in once an Admin approves your role.
            </p>
            <div className="pt-2">
              <Link
                href="/login"
                className="inline-block w-full py-2.5 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 transition"
              >
                Return to Login Page
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs font-medium text-red-700">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm text-gray-900 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm text-gray-900 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Requested Role</label>
              <div className="relative">
                <ShieldCheck className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <select
                  value={requestedRole}
                  onChange={(e) => setRequestedRole(Number(e.target.value))}
                  className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm text-gray-900 bg-white"
                >
                  <option value={0}>Student</option>
                  <option value={1}>Teacher</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm text-gray-900 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm text-gray-900 bg-white"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-purple-600 text-white rounded-lg font-bold text-sm hover:bg-purple-700 transition disabled:opacity-50 shadow-sm"
            >
              {loading ? "Submitting Request..." : "Register Account"}
            </button>

            <div className="text-center pt-2">
              <Link href="/login" className="text-xs text-gray-500 hover:text-purple-600 font-semibold inline-flex items-center space-x-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Already have an account? Sign In</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
