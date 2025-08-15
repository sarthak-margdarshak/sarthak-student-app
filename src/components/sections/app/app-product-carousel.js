"use client";

import * as React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import ImageWithOverlayText from "@/components/sections/app/image-with-overlay-text";
import Autoplay from "embla-carousel-autoplay";
import { useAppContent } from "@/hook/app/useAppContent";

export function AppProductCarousel() {
  const { top3Products, products } = useAppContent();

  return (
    <Carousel
      className="w-full"
      plugins={[
        Autoplay({
          delay: 5000,
        }),
      ]}
    >
      <CarouselContent>
        {top3Products?.map((item, index) => (
          <CarouselItem key={item}>
            <ImageWithOverlayText
              title={products[item]?.name}
              subheader={products[item]?.description}
              images={products[item]?.images}
              productID={item}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
