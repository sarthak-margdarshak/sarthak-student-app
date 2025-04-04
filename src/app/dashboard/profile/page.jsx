// app/profile/page.jsx
"use client";

import ProfileCard from "@/components/sections/dashboard/profile-card";
import { useAppContent } from "@/hook/app/useAppContent";
import { useEffect } from "react";

export default function ProfilePage() {
  const { setCurrentPageName } = useAppContent();

  useEffect(() => {
    setCurrentPageName("Profile");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <ProfileCard />;
}
