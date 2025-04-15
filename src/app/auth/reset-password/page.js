"use client";

import { ResetPasswordForm } from "@/components/sections/auth/reset-password-form";
import { useAppContent } from "@/hook/app/useAppContent";
import { useEffect } from "react";

export default function ResetPasswordPage() {
  const { setCurrentPageName } = useAppContent();

  useEffect(() => {
    setCurrentPageName("Reset Password");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <ResetPasswordForm />
      </div>
    </div>
  );
}
