"use client";

import { AppProductCarousel } from "@/components/sections/app/app-product-carousel";
import StandardCards from "@/components/sections/app/standard-cards";
import { useAppContent } from "@/hook/app/useAppContent";
import { useEffect, useRef } from "react";
import Script from "next/script";

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
      script.src = `//www.profitabledisplaynetwork.com/${atOptions.key}/invoke.js`;
      conf.innerHTML = `atOptions = ${JSON.stringify(atOptions)}`;

      banner.current.append(conf);
      banner.current.append(script);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [banner]);

  return (
    <div className="mt-20 mb-5">
      <AppProductCarousel />

      <div
        className="mx-2 my-5 border border-gray-200 justify-center items-center text-white text-center"
        style={{
          height: 50, // <== these may be different

          width: 320, // <== these may be different

          marginLeft: "0.5rem",

          marginRight: "0.5rem",

          marginTop: "1.25rem",

          marginBottom: "1.25rem",

          color: "#ffffff",

          textAlign: "center",

          justifyContent: "center",

          alignItems: "center",

          borderWidth: "1px",

          borderColor: "#E5E7EB",
        }}
        ref={banner}
      ></div>
      <StandardCards />
    </div>
  );
}
