"use client";

import { cn } from "@/lib/utils";
import React from "react";

export const ShineBorderCard = ({
  children,
  className,
  containerClassName,
  duration = 2000,
  borderRadius = "1rem",
  backgroundColor = "white",
  backgroundImage,
}) => {
  return (
    <div
      className={cn("relative p-[1px] overflow-hidden", containerClassName)}
      style={{
        borderRadius: borderRadius,
      }}
    >
      {/* Animated border */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(var(--angle, 0deg), transparent, transparent, #7c3aed, transparent, transparent)",
          borderRadius: borderRadius,
          animation: `rotate ${duration}ms linear infinite`,
        }}
      />

      {/* Content */}
      <div
        className={cn("relative", className)}
        style={{
          backgroundColor: backgroundColor,
          backgroundImage: backgroundImage,
          borderRadius: borderRadius,
        }}
      >
        {children}
      </div>

      {/* CSS Animation */}
      <style jsx global>{`
        @property --angle {
          syntax: "<angle>";
          initial-value: 0deg;
          inherits: false;
        }

        @keyframes rotate {
          to {
            --angle: 360deg;
          }
        }
      `}</style>
    </div>
  );
};
