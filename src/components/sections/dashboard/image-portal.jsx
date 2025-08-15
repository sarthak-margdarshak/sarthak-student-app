// src/components/ImagePortal.js
"use client";

import Image from "next/image";
import { X } from "lucide-react";

export default function ImagePortal({ imageUrl, onClose }) {
  // If no image URL is provided, don't render anything
  if (!imageUrl) {
    return null;
  }

  // Handle clicks on the backdrop to close the portal
  const handleBackdropClick = (e) => {
    // Check if the click is on the backdrop itself, not on the image
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-black bg-opacity-80 z-[1000] flex justify-center items-center p-4 transition-opacity duration-300"
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 z-[1001]"
        aria-label="Close image view"
      >
        <X size={32} />
      </button>

      {/* Image Container */}
      <div className="relative w-full h-full max-w-4xl max-h-[90vh]">
        <Image
          src={imageUrl}
          alt="Full screen view"
          fill
          className="object-contain"
          unoptimized={imageUrl.startsWith("https://")}
        />
      </div>
    </div>
  );
}
