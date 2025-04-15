"use client";

import { LoginForm } from "@/components/sections/auth/login-form";
import { useAppContent } from "@/hook/app/useAppContent";
import { useEffect } from "react";

export default function LoginPage() {
  const { setCurrentPageName } = useAppContent();

  useEffect(() => {
    setCurrentPageName("Log In");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
    </div>
  );
}
