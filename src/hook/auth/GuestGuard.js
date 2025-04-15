"use client";

import {useAuthContext} from "@/hook/auth/useAuthContext";
import {redirect} from "next/navigation";
import {PATH_PAGE} from "@/routes/paths";

export default function GuestGuard({ children }) {
  const { user } = useAuthContext();

  if (user !== null) {
    return redirect(PATH_PAGE.root)
  }

  return <>{children}</>;
}