"use client";

import { useEffect, useState } from "react";
import { useAppContent } from "@/hook/app/useAppContent";
import { appwriteDatabases } from "@/hook/auth/AppwriteContext";
import { APPWRITE_API } from "@/config-global";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Query } from "appwrite";

export default function OrdersListPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { products, setCurrentPageName } = useAppContent();

  // Status color mapping
  const statusConfig = {
    created: { bg: "bg-yellow-100 hover:bg-yellow-200", text: "Order Created" },
    processing: { bg: "bg-blue-100 hover:bg-blue-200", text: "Processing" },
    success: { bg: "bg-green-100 hover:bg-green-200", text: "Success" },
    failed: { bg: "bg-red-100 hover:bg-red-200", text: "Failed" },
  };

  useEffect(() => {
    setCurrentPageName("Orders");

    const fetchOrders = async () => {
      try {
        const response = await appwriteDatabases.listDocuments(
          APPWRITE_API.databaseId,
          APPWRITE_API.collections.orders,
          [Query.orderDesc("$createdAt")]
        );
        setOrders(response.documents);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
      setLoading(false);
    };

    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setCurrentPageName]);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="space-y-4">
        {orders.map((order) => (
          <Link href={`/dashboard/orders/${order.$id}`} key={order.$id}>
            <Card
              className={`p-4 cursor-pointer transition-all duration-200 ${
                statusConfig[order.status]?.bg ||
                "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-500">
                      Order #{order.orderId}
                    </p>
                  </div>
                  <p className="font-medium">
                    {products[order.productId]?.name || "Unknown Product"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(order.$createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-sm text-gray-500">
                    ₹{(order.amount_to_be_paid / 100).toFixed(2)}
                  </p>
                  <Badge
                    variant={
                      order.status === "success"
                        ? "default"
                        : order.status === "failed"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {statusConfig[order.status]?.text || "Unknown Status"}
                  </Badge>
                </div>
              </div>
            </Card>
          </Link>
        ))}

        {orders.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
}
