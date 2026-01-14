"use client";

import * as React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "@/components/sections/product/product-card";
import Autoplay from "embla-carousel-autoplay";
import { useAppContent } from "@/hook/app/useAppContent";

export function AppProductCarousel() {
  const { getTop5Products } = useAppContent();
  const [top5Products, setTop5Products] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      const productIds = await getTop5Products();
      setTop5Products(productIds);
      setLoading(false);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        {loading ? (
          <CarouselItem>
            <Skeleton className="h-60 w-full bg-rose-50 mt-4 rounded-lg" />
          </CarouselItem>
        ) : (
          top5Products?.map((item, index) => (
            <CarouselItem key={index}>
              <ProductCard
                productId={item}
              />
            </CarouselItem>
          ))
        )}
      </CarouselContent>
    </Carousel>
  );
}
