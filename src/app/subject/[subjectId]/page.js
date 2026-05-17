"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useAppContent } from "@/hook/app/useAppContent";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { ChevronRight } from "lucide-react";
import ProductCard from "@/components/sections/product/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function StandardPage() {
  const { getBookIndex, getProducts, setCurrentPageName } = useAppContent();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const updateViews = async () => {
      const subjectId = window.location.pathname.split("/")[2];
      const x = await getBookIndex(subjectId);
      const y = await getBookIndex(x?.standard)
      setCurrentPageName(y?.standard + " ▶ " + x?.subject);

      const z = await getProducts(subjectId);
      setProducts(z);
      setLoading(false);
    };

    updateViews();

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("Adsense error:", err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mt-20 pb-8">
      {loading ? (
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
      ) : (
        products?.length > 0 && (
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
                <ProductCard
                  key={product}
                  productId={product}
                />
              ))}
            </div>
          </div>
        )
      )}

    </div>
  );
}
