"use client";

import { ShineBorder } from "@/components/magicui/shine-border";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useAppContent } from "@/hook/app/useAppContent";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { PATH_PAGE } from "@/routes/paths";
import { ShinyButton } from "@/components/magicui/shiny-button";
import { useEffect, useState } from "react";

export default function StandardCards() {
  const { getAvailableStandards } = useAppContent();
  const [standards, setStandards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStandards = async () => {
      const tmpStandards = await getAvailableStandards();
      setStandards(tmpStandards);
      setLoading(false);
    };
    fetchStandards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getAvailableStandards]);

  return (
    <div>
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

      <div className="mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {loading
          ? Array.from({ length: 5 }).map((_, index) => (
            <Card
              key={index}
              className="relative overflow-hidden bg-slate-100"
            >
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardFooter>
                <Skeleton className="h-9 w-full rounded-md" />
              </CardFooter>
            </Card>
          ))
          : standards?.map((standard) => (
            <Card
              key={standard.$id}
              className="relative overflow-hidden bg-slate-100"
            >
              <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
              <CardHeader>
                <CardTitle>{standard?.standard}</CardTitle>
                <CardDescription>Mock Test Series</CardDescription>
              </CardHeader>
              <CardFooter>
                <Link href={PATH_PAGE.standard(standard.$id)}>
                  <ShinyButton className="w-full bg-red-800">
                    Explore
                  </ShinyButton>
                </Link>
              </CardFooter>
            </Card>
          ))}
      </div>
    </div>
  );
}
