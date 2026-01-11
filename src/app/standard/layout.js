"use client";

import AuthGuard from "@/hook/auth/AuthGuard";

export default function StandardLayout({ children }) {
    return <AuthGuard>{children}</AuthGuard>;
}
