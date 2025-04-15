"use client";

import { PATH_AUTH } from "@/routes/paths";
import { redirect } from "next/navigation";

export default function AuthPage() {
  return redirect(PATH_AUTH.login);
}
