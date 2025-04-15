"use client";

import { SignupForm } from "@/components/sections/auth/signup-form";
import { useAppContent } from "@/hook/app/useAppContent";
import { useEffect } from "react";

export default function SignupPage() {
  const { setCurrentPageName } = useAppContent();

  useEffect(() => {
    setCurrentPageName("Sign Up");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <SignupForm />
      </div>
    </div>
  );
}
