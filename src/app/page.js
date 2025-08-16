"use client";

import { AppProductCarousel } from "@/components/sections/app/app-product-carousel";
import StandardCards from "@/components/sections/app/standard-cards";
import { useAppContent } from "@/hook/app/useAppContent";
import { useEffect, useRef } from "react";

export default function AppPage() {
  const { setCurrentPageName } = useAppContent();
  const banner = useRef();

  const atOptions = {
    key: "eb842399a2be10f926b5e74d78b3a361",
    format: "iframe",
    height: 250,
    width: 300,
    params: {},
  };

  useEffect(() => {
    setCurrentPageName("Sarthak Margdarshak");
    if (banner.current && !banner.current.firstChild) {
      const conf = document.createElement("script");
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `//notorietyinflected.com/${atOptions.key}/invoke.js`;
      conf.innerHTML = `atOptions = ${JSON.stringify(atOptions)}`;

      banner.current.append(conf);
      banner.current.append(script);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [banner]);

  return (
    <div className="mt-20 mb-5">
      <AppProductCarousel />

      <StandardCards />
    </div>
  );
}
