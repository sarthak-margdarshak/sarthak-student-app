"use client";

import AuthGuard from "@/hook/auth/AuthGuard";

export default function ProductLayout({ children }) {
    return <AuthGuard>{children}</AuthGuard>;
}
