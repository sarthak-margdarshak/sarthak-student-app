"use client";

import { AppProductCarousel } from "@/components/sections/app/app-product-carousel";
import StandardCards from "@/components/sections/app/standard-cards";
import { useAppContent } from "@/hook/app/useAppContent";
import { useEffect } from "react";

export default function AppPage() {
  const { setCurrentPageName } = useAppContent();
  // const banner = useRef();

  // const atOptions = {
  //   key: "eb842399a2be10f926b5e74d78b3a361",
  //   format: "iframe",
  //   height: 250,
  //   width: 300,
  //   params: {},
  // };

  useEffect(() => {
    // if (banner.current && !banner.current.firstChild) {
    //   const conf = document.createElement("script");
    //   const script = document.createElement("script");
    //   script.type = "text/javascript";
    //   script.src = `//notorietyinflected.com/${atOptions.key}/invoke.js`;
    //   conf.innerHTML = `atOptions = ${JSON.stringify(atOptions)}`;

    //   banner.current.append(conf);
    //   banner.current.append(script);
    // }

    setCurrentPageName("Sarthak Margdarshak");
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("Adsense error:", err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mt-20 mb-5">
      <AppProductCarousel />

      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-3463000892258610"
        data-ad-slot="8084736432"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>

      <StandardCards />
    </div>
  );
}
