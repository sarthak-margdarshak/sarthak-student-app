"use client";

import AuthGuard from "@/hook/auth/AuthGuard";

export default function SubjectLayout({ children }) {
    return <AuthGuard>{children}</AuthGuard>;
}
