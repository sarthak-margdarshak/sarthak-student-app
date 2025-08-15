"use client";

import { PATH_PAGE } from "@/routes/paths";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ShinyButton } from "@/components/magicui/shiny-button";

const ImageWithOverlayText = ({ images, title, subheader, productID }) => {
  return (
    <Link href={PATH_PAGE.product(productID)}>
      <Card className="relative overflow-hidden bg-rose-50">
        <CardContent>
          <div className="relative w-full overflow-hidden rounded-lg group flex justify-center p-2 mb-4">
            <div className="flex gap-4 overflow-x-auto py-2">
              {images?.map((src, index) => (
                <Image
                  key={index}
                  src={src}
                  alt={`${title} image ${index + 1}`}
                  width={120}
                  height={80}
                  className="object-cover rounded-md flex-shrink-0 h-50 w-auto"
                  priority={index === 0}
                  unoptimized={src.startsWith("https://")}
                />
              ))}
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-2">
            {title}
            <ChevronRight className="w-6 h-6 animate-[pulse-x_1.5s_ease-in-out_infinite]" />
          </h2>
          <p className="text-sm md:text-base max-w-md line-clamp-2">
            {subheader}
          </p>
          <ShinyButton className="w-full bg-slate-800 m-1">Explore</ShinyButton>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ImageWithOverlayText;
