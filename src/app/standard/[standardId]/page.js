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
import { cn } from "@/lib/utils";
import { useAppContent } from "@/hook/app/useAppContent";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { PATH_PAGE } from "@/routes/paths";
import ImageWithOverlayText from "@/components/sections/app/image-with-overlay-text";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { ShinyButton } from "@/components/magicui/shiny-button";
import { Skeleton } from "@/components/ui/skeleton";

export default function StandardPage() {
  const { getAvailableSubjects, getBookIndex, getProduct, getProducts, setCurrentPageName } = useAppContent();

  const [standardId, setStandardId] = useState(
    window.location.pathname.split("/")[2]
  );
  const [subjects, setSubjects] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const id = window.location.pathname.split("/")[2];
      setStandardId(id);
      const x = await getBookIndex(id);
      setCurrentPageName(x?.standard);

      const y = await getAvailableSubjects(id);
      setSubjects(y);

      const z = await getProducts(id);
      const tmpIDs = z.map(async (p) => await getProduct(p))
      const tmpProducts = await Promise.all(tmpIDs)
      setProducts(tmpProducts);
      console.log(tmpProducts);

      setLoading(false);
    };

    fetchData();

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("Adsense error:", err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mt-20">
      {loading ? (
        <div className="space-y-8">
          {/* Product Skeleton */}
          <div>
            <div className="z-10 flex items-center mt-4 mb-4">
              <Skeleton className="h-8 w-64 rounded-full" />
            </div>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <Card
                  key={index}
                  className="relative overflow-hidden bg-rose-50 h-[300px]"
                >
                  <CardContent className="p-6 h-full flex flex-col justify-between">
                    <div>
                      <Skeleton className="w-full h-40 rounded-lg mb-4" />
                      <Skeleton className="h-8 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                    <Skeleton className="h-10 w-full mt-4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Subject Skeleton */}
          <div>
            <div className="z-10 flex items-center mb-4">
              <Skeleton className="h-8 w-80 rounded-full" />
            </div>
            <div className="mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, index) => (
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
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          {products?.length > 0 && (
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

              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {products?.map((product) => (
                  <ImageWithOverlayText
                    key={product.$id}
                    images={product?.images}
                    title={product?.name}
                    subheader={product?.description}
                    productID={product.$id}
                    availableLang={product?.availableLang}
                  />
                ))}
              </div>
            </div>
          )}

          {subjects?.length > 0 && (
            <div>
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
                {subjects?.map((subject) => (
                  <Card
                    key={subject.$id}
                    className="relative overflow-hidden bg-slate-100"
                  >
                    <ShineBorder
                      shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
                    />
                    <CardHeader>
                      <CardTitle>{subject?.subject}</CardTitle>
                      <CardDescription>Mock Test Series</CardDescription>
                    </CardHeader>
                    <CardContent></CardContent>
                    <CardFooter>
                      <Link href={PATH_PAGE.subject(subject.$id)}>
                        <ShinyButton className="w-full bg-red-800">
                          Explore
                        </ShinyButton>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <div className="m-2">
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-3463000892258610"
          data-ad-slot="8084736432"
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
      </div>
    </div>
  );
}
