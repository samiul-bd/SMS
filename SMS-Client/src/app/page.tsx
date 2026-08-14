"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (!token || !userStr) {
      router.push("/login");
      return;
    }

    try {
      const user = JSON.parse(userStr);
      if (user.role === "Admin") {
        router.push("/admin");
      } else if (user.role === "Teacher") {
        router.push("/teacher");
      } else {
        router.push("/student");
      }
    } catch {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-xl font-semibold text-gray-600">Redirecting...</div>
    </div>
  );
}