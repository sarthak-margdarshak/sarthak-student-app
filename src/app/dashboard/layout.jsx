"use client";

import AuthGuard from "@/hook/auth/AuthGuard";

export default function DashboardLayout({ children }) {
  return <AuthGuard>{children}</AuthGuard>;
}
