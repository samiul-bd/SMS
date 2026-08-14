"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";
import { jwtDecode } from "jwt-decode";
import { User } from "@/types/auth";

// Zod Schema for Validation
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setError(null);
    try {
      const response = await api.post("/auth/login", data);
      
      // Handle both object { token: "..." } and direct string responses
      const token = response.data.token || response.data; 

      if (!token || typeof token !== "string") {
        throw new Error("Invalid token received from server.");
      }
      
      // Save token
      localStorage.setItem("token", token);
      
      // Decode token
      const decodedToken: any = jwtDecode(token);
      console.log("Decoded Token:", decodedToken);
      
      // Handle .NET Default Claim Types
      const userRole = decodedToken.role || decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      const userName = decodedToken.name || decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
      const userEmail = decodedToken.email || decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"];

      const user: User = {
        id: decodedToken.nameid || decodedToken.sub || "",
        name: userName || "User",
        email: userEmail || data.email,
        role: userRole,
      };

      localStorage.setItem("user", JSON.stringify(user));

      // Redirect based on role
      if (userRole === "Admin") router.push("/admin");
      else if (userRole === "Teacher") router.push("/teacher");
      else if (userRole === "Student") router.push("/student");
      else {
        setError(`Unrecognized role: ${userRole}. Cannot redirect.`);
      }
      
    } catch (err: any) {
      console.error("Login Error Details:", err);
      if (err.message === "Network Error") {
        setError("Network/SSL Error: Cannot connect to API. Is backend running?");
      } else {
        setError(err.response?.data?.message || err.message || "Invalid credentials. Please try again.");
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          System Login
        </h2>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm text-center border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              {...register("email")}
              type="email"
              className="w-full px-4 py-2 border rounded-md text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="admin@sms.com"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              {...register("password")}
              type="password"
              className="w-full px-4 py-2 border rounded-md text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}