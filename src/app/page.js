"use client";

import { AppProductCarousel } from "@/components/sections/app/app-product-carousel";
import StandardCards from "@/components/sections/app/standard-cards";
import { useAppContent } from "@/hook/app/useAppContent";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"; // Assuming this is the correct path for your shadcn Button
import { ArrowDown } from "lucide-react"; // Importing an icon for the button

export default function AppPage() {
  const { setCurrentPageName } = useAppContent();
  const [showScrollDown, setShowScrollDown] = useState(false);

  // This effect handles the logic for showing/hiding the scroll button
  useEffect(() => {
    const handleScroll = () => {
      // Calculate if the user has scrolled to the bottom of the page
      // A small offset (1px) is used to ensure it triggers correctly
      const isAtBottom =
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 1;

      // Show the button if the user is NOT at the bottom, hide it if they are
      setShowScrollDown(!isAtBottom);
    };

    // Add the scroll event listener when the component mounts
    window.addEventListener("scroll", handleScroll);

    // Run the check once on mount to set the initial state
    handleScroll();

    // Cleanup: remove the event listener when the component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); // Empty dependency array means this effect runs only once on mount and unmount

  // This effect sets the page name and handles ads
  useEffect(() => {
    setCurrentPageName("Sarthak Margdarshak");
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("Adsense error:", err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Function to smoothly scroll the page to the bottom
  const scrollToBottom = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };

  return (
    <div className="mt-20 mb-5">
      <AppProductCarousel />

      <StandardCards />

      <div className="m-2">
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-3463000892258610"
          data-ad-slot="8084736432"
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
      </div>

      {/* Conditionally render the floating button */}
      {showScrollDown && (
        <Button
          onClick={scrollToBottom}
          className="fixed bottom-4 right-4 z-50 rounded-full h-14 w-14 shadow-lg"
          variant="secondary"
          aria-label="Scroll to bottom"
        >
          <ArrowDown className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}
