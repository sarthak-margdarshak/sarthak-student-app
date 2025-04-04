"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useAppContent } from "@/hook/app/useAppContent";
import { useEffect, useState } from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { SparklesText } from "@/components/magicui/sparkles-text";
import { BorderBeam } from "@/components/magicui/border-beam";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { PulsatingButton } from "@/components/magicui/pulsating-button";
import { NeonGradientCard } from "@/components/magicui/neon-gradient-card";

export default function ProductViewPage() {
  const { setCurrentPageName, products } = useAppContent();

  const [productId, setProductId] = useState(
    window.location.pathname.split("/")[2]
  );
  const [product, setProduct] = useState({});

  useEffect(() => {
    const updateViews = async () => {
      const id = window.location.pathname.split("/")[2];
      setProductId(id);
      setProduct(products[id]);
      setCurrentPageName(products[id]?.name);
    };

    updateViews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {/**
       * 1. Carousel
       * 2. Series Name
       * 3. Series Description
       * 4. Fixed Bottom Button -> Enroll Now / Explore Mock Tests
       * 5. Series Highlights
       *
       */}
      <Carousel
        className="w-full"
        plugins={[
          Autoplay({
            delay: 5000,
          }),
        ]}
      >
        <CarouselContent>
          {product?.images?.map((item, index) => (
            <CarouselItem key={item}>
              <div className="relative w-full h-64 md:h-96 overflow-hidden rounded-lg">
                <Image
                  src={item}
                  alt={item}
                  fill
                  className="object-cover"
                  priority
                  unoptimized={item.startsWith("https://")}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      {/* <SparklesText className="text-2xl mt-4" text={product?.name} /> */}
      <Card className="mt-2 relative overflow-hidden">
        <CardHeader>
          <CardTitle>{product?.name}</CardTitle>
          <CardDescription>{product?.description}</CardDescription>
        </CardHeader>

        <BorderBeam
          duration={6}
          size={400}
          className="from-transparent via-red-500 to-transparent"
        />

        <BorderBeam
          duration={6}
          delay={3}
          size={400}
          className="from-transparent via-blue-500 to-transparent"
        />
      </Card>
      <div className="z-10 flex items-center">
        <div
          className={cn(
            "mt-4 group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800"
          )}
        >
          <AnimatedShinyText className="font-bold inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
            <span>✨ Mock Test Series Highlights</span>
            <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
          </AnimatedShinyText>
        </div>
      </div>
      <div className="flex flex-col ml-8 gap-2 mt-2">
        <div>
          👉{" "}
          <Badge variant="destructive">{`${product?.mockTest?.length} Mock Tests Inside`}</Badge>
        </div>
        <div>
          👉{" "}
          <Badge variant="destructive">{`Standard - ${product?.standard?.standard}`}</Badge>
        </div>
        {product?.subject && (
          <div>
            👉{" "}
            <Badge variant="destructive">{`Subject - ${product?.subject?.subject}`}</Badge>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 z-50 flex justify-center">
        <NeonGradientCard className="max-w-sm items-center justify-center text-center">
          <div className="grid grid-cols-2">
            <div className="col-span-1 flex flex-col">
              <div className="font-bold text-2xl">{`₹ ${product?.sellPrice}`}</div>
              <div className="text-xs line-through">{`₹ ${product?.mrp}`}</div>
            </div>
            <PulsatingButton className="w-full max-w-md col-span-1">
              Enroll Now
            </PulsatingButton>
          </div>
        </NeonGradientCard>
      </div>
    </div>
  );
}
