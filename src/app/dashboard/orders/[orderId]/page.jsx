"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  CreditCard,
  FileText,
  ShoppingBag,
} from "lucide-react";
import { useAuthContext } from "@/hook/auth/useAuthContext";
import { useAppContent } from "@/hook/app/useAppContent";
import {
  appwriteDatabases,
  appwriteFunction,
  timeAgo,
  appwriteStorage,
} from "@/hook/auth/AppwriteContext";
import { APPWRITE_API, RAZORPAY_API } from "@/config-global";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { appwriteClient } from "@/hook/app/AppContentProvider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import Script from "next/script";
import confetti from "canvas-confetti";

export default function OrderPage() {
  const router = useRouter();
  const { user } = useAuthContext();
  const { setCurrentPageName, products } = useAppContent();

  const [orderId, setOrderId] = useState(
    window.location.pathname.split("/")[3]
  );
  const [order, setOrder] = useState(null);
  const [product, setProduct] = useState(null);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const initiateFireworks = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  };

  if (order?.status === "success") {
    initiateFireworks();
  }

  useEffect(() => {
    const updateViews = async () => {
      setLoading(true);
      const id = window.location.pathname.split("/")[3];
      setOrderId(id);
      const x = await appwriteDatabases.getDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.orders,
        id
      );
      setOrder(x);
      setCreatingOrder(x?.orderId === null || x?.orderId === "");
      setCurrentPageName(x?.orderId);

      appwriteClient.subscribe(
        `databases.${APPWRITE_API.databaseId}.collections.${APPWRITE_API.collections.orders}.documents.${id}`,
        (response) => {
          setOrder(response.payload);
          setCreatingOrder(
            (response.payload?.orderId === null ||
              response.payload?.orderId) === ""
          );
        }
      );

      setProduct(products[x?.productId]);
      setLoading(false);
    };

    updateViews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Status color mapping
  const statusConfig = {
    created: { color: "bg-yellow-500", text: "Order Created" },
    processing: { color: "bg-blue-500", text: "Processing" },
    success: { color: "bg-green-500", text: "Success" },
    failed: { color: "bg-red-500", text: "Failed" },
  };

  const handleOpenPaymentDialog = () => {
    setIsPaymentDialogOpen(true);
  };

  const handleClosePaymentDialog = () => {
    setIsPaymentDialogOpen(false);
  };

  const handlePayment = async () => {
    if (order.amount_to_be_paid === 0) {
      // If amount is zero
      await startZeroCashPayment();
      return;
    }

    // Create or Update order from razorpay
    setCreatingOrder(true);
    let razorpay_order_id = order?.razorpay_order_id;
    try {
      if (!razorpay_order_id) {
        // Create order_id from backend only if there is no razorpay_order_id
        let response = await appwriteFunction.createExecution(
          APPWRITE_API.functions.sarthakAPI,
          JSON.stringify({ amount: order?.amount_to_be_paid }),
          false,
          "/order/create"
        );
        response = JSON.parse(response.responseBody);
        if (response.success) {
          await appwriteDatabases.updateDocument(
            APPWRITE_API.databaseId,
            APPWRITE_API.collections.orders,
            orderId,
            {
              razorpay_order_id: response.razorPayId,
              payment_mode: "razorpay",
              attempts: 0,
            }
          );
          razorpay_order_id = response.razorPayId;
        } else {
          toast.error("Error in creating an payment order for you.");
        }
      } else {
        // TODO: Check for update in order amount and Edit the razorpay order amount
      }
      setCreatingOrder(false);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      setCreatingOrder(false);
      return;
    }
    handleClosePaymentDialog();

    // Initiate Payment gateway
    if (razorpay_order_id) {
      var options = {
        key: RAZORPAY_API.keyId,
        key_secret: RAZORPAY_API.secret,
        amount: order.amount_to_be_paid,
        currency: "INR",
        name: "Sarthak Margdarshak",
        description: `${product?.name} - Mock Test Series - Enroll`,
        image:
          "https://api.sarthakmargdarshak.in/v1/storage/buckets/sarthak_datalake_bucket/files/67ba3f6a002ef0a0f7b1/view?project=sarthak-margdarshak&mode=admin",
        order_id: razorpay_order_id,
        prefill: {
          email: user.email,
          name: user.name,
        },
        handler: async function (data) {
          await appwriteDatabases.updateDocument(
            APPWRITE_API.databaseId,
            APPWRITE_API.collections.orders,
            orderId,
            {
              status: "processing",
            }
          );

          appwriteFunction.createExecution(
            APPWRITE_API.functions.sarthakAPI,
            JSON.stringify({
              payment_mode: "razorpay",
              sarthak_order_id: orderId,
              razorpay_order_id: razorpay_order_id,
              razorpay_payment_id: data.razorpay_payment_id,
              razorpay_signature: data.razorpay_signature,
            }),
            false,
            "order/confirm"
          );
        },
        notes: { studentId: user.$id, productId: product?.$id },
        theme: { color: "#843030" },
        timeout: 300,
        send_sms_hash: true,
      };

      var rzp1 = new window.Razorpay(options);

      rzp1.on("payment.failed", async function (error) {
        await appwriteDatabases.updateDocument(
          APPWRITE_API.databaseId,
          APPWRITE_API.collections.orders,
          orderId,
          {
            status: "failed",
            last_payment_date: new Date(),
            attempts: order.attempts + 1,
            error_message: `${error?.error?.reason}: ${error?.error?.description}`,
          }
        );
      });
      rzp1.open();
    } else {
      toast.error("Retry Payment by restarting the app");
    }
  };

  const startZeroCashPayment = async () => {
    setCreatingOrder(true);
    try {
      await appwriteDatabases.updateDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.orders,
        orderId,
        {
          payment_mode: "zero_cash",
          attempts: 0,
        }
      );
    } catch (error) {
      toast.error(error.message);
    }
    setCreatingOrder(false);
    handleClosePaymentDialog();

    await appwriteDatabases.updateDocument(
      APPWRITE_API.databaseId,
      APPWRITE_API.collections.orders,
      orderId,
      {
        status: "processing",
      }
    );

    await appwriteFunction.createExecution(
      APPWRITE_API.functions.sarthakAPI,
      JSON.stringify({
        payment_mode: "zero_cash",
        sarthak_order_id: orderId,
        razorpay_order_id: "",
        razorpay_payment_id: "",
        razorpay_signature: "",
      }),
      true,
      "order/confirm"
    );
  };

  const handleDownloadInvoice = async () => {
    try {
      // Get file download URL
      const fileUrl = appwriteStorage.getFileDownload(
        APPWRITE_API.buckets.sarthakDatalakeBucket,
        `invoice_${order?.invoiceId}`
      );

      // Create temporary link element to trigger download
      const link = document.createElement("a");
      link.href = fileUrl;
      link.setAttribute("download", `Invoice-${order.orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Invoice downloaded successfully!");
    } catch (error) {
      console.error("Invoice download error:", error);
      toast.error(error.message || "Failed to download invoice");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Order Details</h1>
          <Skeleton className="h-50 w-full mt-2" />
          <Skeleton className="h-50 w-full mt-2" />
          <Skeleton className="h-50 w-full mt-2" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4">
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Order Details</h1>

        {/* Order Status Card */}
        <Card className="mb-2 bg-slate-100">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Order #{order?.orderId}</CardTitle>
              <CardDescription>
                Placed{" "}
                {timeAgo.format(
                  Date.parse(
                    order?.$createdAt || "2000-01-01T00:00:00.000+00:00"
                  )
                )}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  statusConfig[order?.status]?.color
                } ${
                  order?.status === "processing" ? "animate-pulse-custom" : ""
                }`}
                style={{
                  animation:
                    order?.status === "processing"
                      ? "pulse 1.5s infinite ease-in-out"
                      : "none",
                }}
              ></div>
              <span className="font-medium">
                {statusConfig[order?.status]?.text}
              </span>
            </div>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-start">
              <div className="flex items-center gap-2 flex-1">
                {order?.status === "created" && (
                  <ShoppingBag className="h-5 w-5 text-gray-500" />
                )}
                {order?.status === "processing" && (
                  <Clock className="h-5 w-5 text-gray-500" />
                )}
                {order?.status === "success" && (
                  <CheckCircle className="h-5 w-5 text-gray-500" />
                )}
                {order?.status === "failed" && (
                  <AlertCircle className="h-5 w-5 text-gray-500" />
                )}
                <div>
                  <p className="text-sm font-medium">Payment</p>
                  <Badge
                    variant={
                      order?.status === "success" ? "success" : "outline"
                    }
                  >
                    {order?.status === "success" ? "Paid" : "Pending Payment"}
                  </Badge>
                </div>
              </div>

              {order?.status === "failed" && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{order?.error_message}</AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>

          <div className="bg-slate-300 rounded p-2 m-1">
            {order?.status === "success" && (
              <div className="w-full flex items-center justify-between">
                <p className="text-sm text-gray-800">
                  Thank you for your purchase!
                </p>
                <Button
                  size="sm"
                  className="flex items-center gap-2 bg-red-800"
                  onClick={handleDownloadInvoice}
                >
                  <FileText className="h-4 w-4" />
                  Download Invoice
                </Button>
              </div>
            )}

            {order?.status === "processing" && (
              <p className="text-sm text-gray-500">
                We are validating your payment. Stay tuned!
              </p>
            )}

            {order?.status !== "success" && order?.status !== "processing" && (
              <div className="w-full flex items-center justify-between">
                <p className="text-sm text-gray-800">Click here to purchase!</p>
                <Button
                  size="sm"
                  onClick={handleOpenPaymentDialog}
                  className="flex items-center gap-2 bg-red-800"
                  disabled={creatingOrder}
                >
                  {order?.status === "created"
                    ? "Proceed to Payment"
                    : "Retry Payment"}
                </Button>
              </div>
            )}

            {order?.status !== "success" &&
              order?.status !== "processing" &&
              creatingOrder && (
                <span className="text-sm text-gray-500 italic mt-1">
                  We are analysing your order. Just hang on a min. If it's too
                  much time, please refresh the page.
                </span>
              )}
          </div>
        </Card>

        {/* Order Items Card */}
        <Card className="mb-2 bg-slate-100">
          <CardHeader>
            <CardTitle>Order Item</CardTitle>
            <CardDescription>1 item in your order</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={product?.images[0]}
                    alt={product?.name}
                    className="w-16 h-16 rounded object-cover"
                  />
                  <div>
                    <p className="font-medium">{product?.name}</p>
                  </div>
                </div>
                <p className="font-medium">
                  ₹{(order?.amount_total / 100)?.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Summary Card */}
        <Card className="bg-rose-50 mb-5">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <p className="text-gray-500">Subtotal</p>
                <p>
                  ₹
                  {(
                    order?.amount_total / 100 -
                    order?.amount_total * 0.0018
                  )?.toFixed(2)}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-500">Tax</p>
                <p>₹{(order?.amount_total * 0.0018)?.toFixed(2)}</p>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-medium text-lg">
                <p>Total</p>
                <p>₹{(order?.amount_to_be_paid / 100)?.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>

          <CardFooter className="rounded justify-between">
            <Button variant="outline" onClick={() => router.back()}>
              Back
            </Button>
            {order?.status !== "success" && order?.status !== "processing" && (
              <Button
                onClick={handleOpenPaymentDialog}
                disabled={creatingOrder}
              >
                {order?.status === "created"
                  ? "Proceed to Payment"
                  : "Retry Payment"}
              </Button>
            )}
          </CardFooter>
        </Card>

        <AlertDialog
          open={isPaymentDialogOpen}
          onOpenChange={setIsPaymentDialogOpen}
        >
          <AlertDialogContent className="sm:max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Confirm Payment
              </AlertDialogTitle>
              <AlertDialogDescription>
                Please confirm you want to proceed with payment for your order.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="py-4">
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="font-medium text-sm text-gray-500 mb-2">
                    Order Summary
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p className="text-sm">Order #{order?.orderId}</p>
                      <p className="text-sm font-medium">1 item</p>
                    </div>
                    <div className="flex justify-between font-medium pt-2 border-t border-gray-200">
                      <p>Total to pay</p>
                      <p>₹{(order?.amount_to_be_paid / 100)?.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                <div className="text-sm text-gray-500">
                  <p>
                    By clicking "Pay Now", you will be redirected to our secure
                    payment gateway.
                  </p>
                </div>
              </div>
            </div>

            <AlertDialogFooter className="sm:justify-between">
              <Button
                variant="outline"
                onClick={handleClosePaymentDialog}
                disabled={creatingOrder}
              >
                Cancel
              </Button>
              <Button
                onClick={handlePayment}
                disabled={creatingOrder}
                className="min-w-24"
              >
                {creatingOrder ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing... Do not Click Back...
                  </div>
                ) : (
                  "Pay Now"
                )}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
