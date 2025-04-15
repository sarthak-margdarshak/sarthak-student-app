"use client";

import { NewPasswordForm } from "@/components/sections/auth/new-password-form";
import { useAppContent } from "@/hook/app/useAppContent";
import { useEffect } from "react";

export default function NewPasswordPage() {
  const { setCurrentPageName } = useAppContent();

  useEffect(() => {
    setCurrentPageName("New Password");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <NewPasswordForm />
      </div>
    </div>
  );
}
