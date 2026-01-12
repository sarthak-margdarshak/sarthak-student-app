"use client";

import * as React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import ImageWithOverlayText from "@/components/sections/app/image-with-overlay-text";
import Autoplay from "embla-carousel-autoplay";
import { useAppContent } from "@/hook/app/useAppContent";

export function AppProductCarousel() {
  const { getTop5Products, getProduct } = useAppContent();
  const [top5Products, setTop5Products] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      const productIds = await getTop5Products();
      const products = await Promise.all(productIds.map((id) => getProduct(id)));
      setTop5Products(products);
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
            <Card className="relative overflow-hidden bg-rose-50 h-full">
              <CardContent className="p-6">
                <div className="relative w-full overflow-hidden rounded-lg flex justify-center p-2 mb-4">
                  <div className="flex gap-4 overflow-hidden py-2">
                    <Skeleton className="h-20 w-32 rounded-md flex-shrink-0" />
                    <Skeleton className="h-20 w-32 rounded-md flex-shrink-0" />
                    <Skeleton className="h-20 w-32 rounded-md flex-shrink-0" />
                  </div>
                </div>
                <div className="space-y-4">
                  <Skeleton className="h-8 w-3/4" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                  <Skeleton className="h-10 w-full mt-4" />
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ) : (
          top5Products?.map((item, index) => (
            <CarouselItem key={index}>
              <ImageWithOverlayText
                title={item?.name}
                subheader={item?.description}
                images={item?.images}
                productID={item?.$id}
                availableLang={item?.availableLang}
              />
            </CarouselItem>
          ))
        )}
      </CarouselContent>
    </Carousel>
  );
}
