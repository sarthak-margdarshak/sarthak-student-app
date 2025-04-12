"use client";

import GuestGuard from "@/hook/auth/GuestGuard";

export default function AuthLayout({ children }) {
  return (
    <div className="mt-20">
      <GuestGuard>{children}</GuestGuard>
    </div>
  );
}
