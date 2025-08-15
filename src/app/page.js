"use client";

import { AppProductCarousel } from "@/components/sections/app/app-product-carousel";
import StandardCards from "@/components/sections/app/standard-cards";
import { useAppContent } from "@/hook/app/useAppContent";
import { useEffect } from "react";

export default function AppPage() {
  const { setCurrentPageName } = useAppContent();

  useEffect(() => {
    setCurrentPageName("Sarthak Margdarshak");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mt-20 mb-5">
      <AppProductCarousel />

      <StandardCards />
    </div>
  );
}
