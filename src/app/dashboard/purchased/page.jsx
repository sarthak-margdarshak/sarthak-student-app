"use client";

import { useEffect, useState } from "react";
import { useAppContent } from "@/hook/app/useAppContent";
import { useAuthContext } from "@/hook/auth/useAuthContext";
import ProductCard from "@/components/sections/product/product-card";
import { labels } from "@/lib/labels";
import { Skeleton } from "@/components/ui/skeleton";

export default function PurchasedPage() {
  const { setCurrentPageName } = useAppContent();
  const { user } = useAuthContext();
  const [purchasedProductIds, setPurchasedProductIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setCurrentPageName("Purchased Mock Tests");
    fetchPurchasedProducts();
  }, [setCurrentPageName, user]);

  const fetchPurchasedProducts = async () => {
    setIsLoading(true);
    try {
      const filteredProductIds =
        user?.labels
          ?.filter(
            (label) =>
              label !== labels.founder &&
              label !== labels.admin &&
              label !== labels.student &&
              label !== labels.author
          )
      setPurchasedProductIds(filteredProductIds);
    } catch (error) {
      console.error("Error fetching purchased products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const SkeletonCard = () => (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[200px] w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="mt-20 container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-20 container">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {purchasedProductIds?.map((productId) => (
          <ProductCard
            key={productId}
            productId={productId}
          />
        ))}
      </div>
      {(!purchasedProductIds || purchasedProductIds.length === 0) && (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-2">No Purchased Tests</h2>
          <p className="text-gray-600">
            You haven&apos;t purchased any mock test series yet.
          </p>
        </div>
      )}
    </div>
  );
}
