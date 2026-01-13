"use client";

import { useEffect, useState } from "react";
import ProductView from "@/components/sections/product/product-view";

export default function ProductViewPage() {
  const [productId, setProductId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const id = window.location.pathname.split("/")[2];
      setProductId(id)
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (productId === null) {
    return <div>Loading...</div>;
  }

  return (
    <ProductView productId={productId} />
  );
}
