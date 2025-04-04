"use client";

import GuestGuard from "@/hook/auth/GuestGuard";

export default function AuthLayout({ children }) {
  return <GuestGuard>{children}</GuestGuard>;
}
