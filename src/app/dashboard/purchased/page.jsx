"use client";

import { useEffect, useState } from "react";
import { useAppContent } from "@/hook/app/useAppContent";
import { useAuthContext } from "@/hook/auth/useAuthContext";
import ImageWithOverlayText from "@/components/sections/app/image-with-overlay-text";
import { labels } from "@/lib/labels";
import { Skeleton } from "@/components/ui/skeleton";

export default function PurchasedPage() {
  const { products, setCurrentPageName } = useAppContent();
  const { user } = useAuthContext();
  const [purchasedProducts, setPurchasedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setCurrentPageName("Purchased Mock Tests");
    fetchPurchasedProducts();
  }, [setCurrentPageName, user, products]);

  const fetchPurchasedProducts = async () => {
    setIsLoading(true);
    try {
      const filteredProducts =
        user?.labels
          ?.filter(
            (label) =>
              label !== labels.founder &&
              label !== labels.admin &&
              label !== labels.student &&
              label !== labels.author
          )
          ?.map((productId) => products[productId])
          ?.filter((product) => product !== undefined) || [];

      setPurchasedProducts(filteredProducts);
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
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {purchasedProducts?.map((product) => (
          <ImageWithOverlayText
            key={product.$id}
            src={product.images[0]}
            title={product.name}
            subheader={product.description}
            productID={product.$id}
          />
        ))}
      </div>
      {(!purchasedProducts || purchasedProducts.length === 0) && (
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
