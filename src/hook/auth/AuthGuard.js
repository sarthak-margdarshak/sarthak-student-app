"use client";

import { useAuthContext } from "./useAuthContext";
import { redirect, usePathname } from "next/navigation";
import { PATH_AUTH } from "@/routes/paths";

export default function AuthGuard({ children }) {
  const { user } = useAuthContext();

  if (user === null) {
    return redirect(PATH_AUTH.login);
  }

  return <>{children}</>;
}
