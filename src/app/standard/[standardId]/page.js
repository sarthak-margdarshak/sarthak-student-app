"use client";

import { useEffect, useState } from "react";
import { ShineBorder } from "@/components/magicui/shine-border";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAppContent } from "@/hook/app/useAppContent";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { PATH_PAGE } from "@/routes/paths";
import ImageWithOverlayText from "@/components/sections/app/image-with-overlay-text";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import { ArrowRightIcon } from "@radix-ui/react-icons";

export default function StandardPage() {
  const { setCurrentPageName, standards, products, subjects } = useAppContent();

  const [standardId, setStandardId] = useState(
    window.location.pathname.split("/")[2]
  );
  const [standard, setStandard] = useState({});

  useEffect(() => {
    const updateViews = async () => {
      const id = window.location.pathname.split("/")[2];
      setStandardId(id);
      setStandard(standards[id]);
      setCurrentPageName(standards[id]?.name);
    };

    updateViews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mt-20">
      <div className="z-10 flex items-center mt-4">
        <div className="group relative flex items-center rounded-full px-4 py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f] ">
          <span
            className={cn(
              "absolute inset-0 block h-full w-full animate-gradient rounded-[inherit] bg-gradient-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-[length:300%_100%] p-[1px]"
            )}
            style={{
              WebkitMask:
                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "destination-out",
              mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              maskComposite: "subtract",
              WebkitClipPath: "padding-box",
            }}
          />
          🎉 <hr className="mx-2 h-4 w-px shrink-0 bg-neutral-500" />
          <AnimatedGradientText className="text-sm font-bold">
            Online Mock Test Series
          </AnimatedGradientText>
          <ChevronRight
            className="ml-1 size-4 stroke-neutral-500 transition-transform
 duration-300 ease-in-out group-hover:translate-x-0.5"
          />
        </div>
      </div>

      <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {standard?.productIDs?.map((productId) => (
          <ImageWithOverlayText
            key={productId}
            src={products[productId]?.images[0]}
            title={products[productId]?.name}
            subheader={products[productId]?.description}
            productID={productId}
          />
        ))}
      </div>

      <div className="z-10 flex items-center">
        <div
          className={cn(
            "mt-4 group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800"
          )}
        >
          <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
            <span>✨ Explore mock test series SUBJECT wise</span>
            <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
          </AnimatedShinyText>
        </div>
      </div>

      <div className="mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {standard?.subjects?.map((subjectId) => (
          <Card key={subjectId} className="relative overflow-hidden">
            <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
            <CardHeader>
              <CardTitle>{subjects[subjectId]?.name}</CardTitle>
              <CardDescription>Mock Test Series</CardDescription>
            </CardHeader>
            <CardContent></CardContent>
            <CardFooter>
              <Link href={PATH_PAGE.subject(subjectId)}>
                <Button className="w-full">Explore</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
