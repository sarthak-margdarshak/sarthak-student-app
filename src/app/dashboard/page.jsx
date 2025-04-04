"use client";

import { PATH_DASHBOARD } from "@/routes/paths";
import { redirect } from "next/navigation";

export default function DashboardPage() {
  return redirect(PATH_DASHBOARD.profile);
}
