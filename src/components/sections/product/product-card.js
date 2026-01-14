"use client";

import { PATH_PAGE } from "@/routes/paths";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ShinyButton } from "@/components/magicui/shiny-button";
import { useAppContent } from "@/hook/app/useAppContent";
import { useEffect, useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";

export default function ProductCard({ productId }) {
  const { getProduct } = useAppContent();
  const [product, setProduct] = useState(
    localStorage.getItem(`product_${productId}`)
      ? JSON.parse(localStorage.getItem(`product_${productId}`))
      : {}
  );
  const [loading, setLoading] = useState(
    localStorage.getItem(`product_${productId}`)
      ? false
      : true
  );

  useEffect(() => {
    const fetchData = async () => {
      const x = await getProduct(productId);
      setProduct(x);
      setLoading(false);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <Card className="relative overflow-hidden bg-rose-50/50">
        <CardContent className="space-y-4">
          <div className="flex justify-center p-2 mb-4">
            <div className="flex gap-4 overflow-x-auto py-2 w-full">
              <Skeleton className="h-20 w-32 rounded-md bg-slate-200" />
              <Skeleton className="h-20 w-32 rounded-md bg-slate-200" />
            </div>
          </div>
          <Skeleton className="h-8 w-3/4 bg-slate-200" />
          <Skeleton className="h-4 w-full bg-slate-200" />
          <Skeleton className="h-4 w-2/3 bg-slate-200" />
          <Skeleton className="h-10 w-full bg-slate-800/10 mt-4 rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Link href={PATH_PAGE.product(product.$id)}>
      <Card className="relative overflow-hidden bg-rose-50">
        <CardContent>
          <div className="relative w-full overflow-hidden rounded-lg group flex justify-center mb-4">
            <div className="flex gap-4 overflow-x-auto py-2">
              {product?.images?.map((src, index) => (
                <Image
                  key={index}
                  src={src}
                  alt={`${product?.name} image ${index + 1}`}
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
            {product?.name}
            <ChevronRight className="w-6 h-6 animate-[pulse-x_1.5s_ease-in-out_infinite]" />
          </h2>
          <p className="text-sm md:text-base max-w-md line-clamp-2">
            {product?.description}
          </p>

          {product?.availableLang && product?.availableLang.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2 bg-white/40 p-2 rounded-lg backdrop-blur-sm border border-white/20">
              <span className="text-xs font-medium text-slate-600 mr-1">Available in:</span>
              {product?.availableLang.map((lang) => (
                <span
                  key={lang}
                  className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm"
                >
                  {lang.toUpperCase()}
                </span>
              ))}
            </div>
          )}
          <ShinyButton className="w-full bg-slate-800 m-1">Explore</ShinyButton>
        </CardContent>
      </Card>
    </Link>
  );
};