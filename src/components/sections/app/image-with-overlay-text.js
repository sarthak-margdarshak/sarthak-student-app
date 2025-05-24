"use client";

import { PATH_PAGE } from "@/routes/paths";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const ImageWithOverlayText = ({ src, title, subheader, productID }) => {
  return (
    <Link href={PATH_PAGE.product(productID)}>
      <div className="relative w-full h-64 md:h-96 overflow-hidden rounded-lg group transition-transform duration-300 hover:scale-[1.02]">
        <Image
          src={src}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          priority
          unoptimized={src.startsWith("https://")}
        />

        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 30%, rgba(0,0,0,0) 70%)",
              backdropFilter: "blur(20px)",
              WebkitMaskImage:
                "linear-gradient(to top right, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 70%)",
              maskImage:
                "linear-gradient(to top right, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 70%)",
            }}
          ></div>

          <div
            className="absolute bottom-0 left-0 w-full h-full"
            style={{
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              WebkitMaskImage:
                "linear-gradient(to top right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 20%, rgba(0,0,0,0) 60%)",
              maskImage:
                "linear-gradient(to top right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 20%, rgba(0,0,0,0) 60%)",
            }}
          ></div>
        </div>

        <div className="absolute bottom-4 left-4 text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-2">
            {title}
            <ChevronRight className="w-6 h-6 animate-[pulse-x_1.5s_ease-in-out_infinite]" />
          </h2>
          <p className="text-sm md:text-base max-w-md line-clamp-2 mr-20">
            {subheader}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ImageWithOverlayText;
