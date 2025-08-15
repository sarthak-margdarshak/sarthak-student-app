"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useAppContent } from "@/hook/app/useAppContent";
import { useEffect, useState } from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { BorderBeam } from "@/components/magicui/border-beam";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { NeonGradientCard } from "@/components/magicui/neon-gradient-card";
import { useAuthContext } from "@/hook/auth/useAuthContext";
import { labels } from "@/lib/labels";
import { PATH_AUTH, PATH_DASHBOARD } from "@/routes/paths";
import { useRouter } from "next/navigation";
import { ChevronRight, Loader2 } from "lucide-react";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import NestedMockTestAccordion from "@/components/sections/dashboard/nested-mock-test-accordion";
import { appwriteDatabases } from "@/hook/auth/AppwriteContext";
import { APPWRITE_API } from "@/config-global";
import { ID, Query } from "appwrite";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import ImagePortal from "@/components/sections/dashboard/image-portal";

export default function ProductViewPage() {
  const { setCurrentPageName, products } = useAppContent();
  const { user } = useAuthContext();
  const router = useRouter();

  const [productId, setProductId] = useState(
    window.location.pathname.split("/")[2]
  );
  const [product, setProduct] = useState({});
  const [enrolled, setEnrolled] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [organizedMockTests, setOrganizedMockTests] = useState({});
  const [loadingMockTests, setLoadingMockTests] = useState(false);
  const [bookIndexList, setBookIndexList] = useState({});
  const [productLevel, setProductLevel] = useState("standard");
  const [selectedImage, setSelectedImage] = useState(null);

  function chunkArray(arr, chunkSize) {
    const result = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      result.push(arr.slice(i, i + chunkSize));
    }
    return result;
  }

  // Function to organize mock tests by standard, subject, chapter, and concept
  const organizeMockTests = async (mockTestIds) => {
    if (localStorage.getItem(`organizedMockTests_${productId}`)) {
      const x = JSON.parse(
        localStorage.getItem(`organizedMockTests_${productId}`)
      );
      setOrganizedMockTests(x.organized);
      setBookIndexList(x.bookIndexList);
      return;
    }
    setLoadingMockTests(true);
    try {
      let organized = {};
      let tmpBookIndexList = {};

      let mockTests = [];
      let chunkedMockTests = chunkArray(mockTestIds, 100);
      for (const chunk of chunkedMockTests) {
        const x = (
          await appwriteDatabases.listDocuments(
            APPWRITE_API.databaseId,
            APPWRITE_API.collections.mockTest,
            [Query.equal("$id", chunk), Query.limit(100)]
          )
        ).documents;
        mockTests = [...mockTests, ...x];
      }

      for (const mockTestId of mockTestIds) {
        const mockTest = mockTests.find((v, i) => v.$id === mockTestId);

        let conceptId = null;
        let chapterId = null;
        let subjectId = null;
        let standardId = null;

        if (mockTest?.concept) {
          conceptId = mockTest.concept?.$id;
          chapterId = mockTest.chapter?.$id;
          subjectId = mockTest.subject?.$id;
          standardId = mockTest.standard?.$id;
          tmpBookIndexList = {
            ...tmpBookIndexList,
            [mockTest.concept?.$id]: mockTest.concept,
            [mockTest.chapter?.$id]: mockTest.chapter,
            [mockTest.subject?.$id]: mockTest.subject,
            [mockTest.standard?.$id]: mockTest.standard,
          };
        } else {
          if (mockTest?.chapter) {
            chapterId = mockTest.chapter?.$id;
            subjectId = mockTest.subject?.$id;
            standardId = mockTest.standard?.$id;
            tmpBookIndexList = {
              ...tmpBookIndexList,
              [mockTest.chapter?.$id]: mockTest.chapter,
              [mockTest.subject?.$id]: mockTest.subject,
              [mockTest.standard?.$id]: mockTest.standard,
            };
          } else {
            if (mockTest?.subject) {
              subjectId = mockTest.subject?.$id;
              standardId = mockTest.standard?.$id;
              tmpBookIndexList = {
                ...tmpBookIndexList,
                [mockTest.subject?.$id]: mockTest.subject,
                [mockTest.standard?.$id]: mockTest.standard,
              };
            } else {
              standardId = mockTest.standard?.$id;
              tmpBookIndexList = {
                ...tmpBookIndexList,
                [mockTest.standard?.$id]: mockTest.standard,
              };
            }
          }
        }

        if (standardId && !organized[standardId]) {
          organized[standardId] = {
            subjects: {},
            mockTests: [],
          };
        }
        if (subjectId && !organized[standardId].subjects[subjectId]) {
          organized[standardId].subjects[subjectId] = {
            chapters: {},
            mockTests: [],
          };
        }
        if (
          chapterId &&
          !organized[standardId].subjects[subjectId].chapters[chapterId]
        ) {
          organized[standardId].subjects[subjectId].chapters[chapterId] = {
            concepts: {},
            mockTests: [],
          };
        }
        if (
          conceptId &&
          !organized[standardId].subjects[subjectId].chapters[chapterId]
            .concepts[conceptId]
        ) {
          organized[standardId].subjects[subjectId].chapters[
            chapterId
          ].concepts[conceptId] = {
            mockTests: [],
          };
        }

        if (conceptId) {
          organized[standardId].subjects[subjectId].chapters[
            chapterId
          ].concepts[conceptId].mockTests = [
            ...organized[standardId].subjects[subjectId].chapters[chapterId]
              .concepts[conceptId].mockTests,
            mockTestId,
          ];
        } else {
          if (chapterId) {
            organized[standardId].subjects[subjectId].chapters[
              chapterId
            ].mockTests = [
              ...organized[standardId].subjects[subjectId].chapters[chapterId]
                .mockTests,
              mockTestId,
            ];
          } else {
            if (subjectId) {
              organized[standardId].subjects[subjectId].mockTests = [
                ...organized[standardId].subjects[subjectId].mockTests,
                mockTestId,
              ];
            } else {
              organized[standardId].mockTests = [
                ...organized[standardId].mockTests,
                mockTestId,
              ];
            }
          }
        }
      }

      setBookIndexList(tmpBookIndexList);
      setOrganizedMockTests(organized);
      setLoadingMockTests(false);
      localStorage.setItem(
        `organizedMockTests_${productId}`,
        JSON.stringify({
          organized: organized,
          bookIndexList: tmpBookIndexList,
        })
      );
    } catch (error) {
      console.error("Error organizing mock tests:", error);
      toast.error("Failed to load mock tests");
      setLoadingMockTests(false);
    }
  };

  useEffect(() => {
    const updateViews = async () => {
      const id = window.location.pathname.split("/")[2];
      setProductId(id);
      if (user) {
        setEnrolled(
          user.labels.findIndex(
            (label) =>
              label === labels.founder || label === labels.admin || label === id
          ) !== -1
        );
      }
      setProduct(products[id]);
      setCurrentPageName(products[id]?.name);

      if (products[id]?.subject) {
        setProductLevel("subject");
      } else {
        setProductLevel("standard");
      }
      await organizeMockTests(products[id]?.mockTest);
    };

    updateViews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const enrollIn = async () => {
    if (user) {
      // Create an Order
      setPlacingOrder(true);
      try {
        const x = await appwriteDatabases.createDocument(
          APPWRITE_API.databaseId,
          APPWRITE_API.collections.orders,
          ID.unique(),
          {
            amount_total: parseFloat(product.sellPrice) * 100,
            amount_to_be_paid: parseFloat(product.sellPrice) * 100,
            studentId: user.$id,
            productId: productId,
            status: "created",
            attempts: 0,
          }
        );
        router.push(PATH_DASHBOARD.orders.view(x.$id));
        toast.success("Order Created successfully");
      } catch (error) {
        if (error.code === 409) {
          const x = (
            await appwriteDatabases.listDocuments(
              APPWRITE_API.databaseId,
              APPWRITE_API.collections.orders,
              [
                Query.equal("studentId", user.$id),
                Query.equal("productId", productId),
                Query.select(["$id"]),
              ]
            )
          ).documents[0];

          router.push(PATH_DASHBOARD.orders.view(x.$id));
        } else {
          toast.error(error.message);
        }
      }
      setPlacingOrder(false);
    } else {
      router.push(PATH_AUTH.login);
    }
  };

  return (
    <div className="mt-20">
      <ImagePortal
        imageUrl={selectedImage}
        onClose={() => setSelectedImage(null)}
      />

      {/**
       * 1. Carousel
       * 2. Series Name
       * 3. Series Description
       * 4. Fixed Bottom Button -> Enroll Now / Explore Mock Tests
       * 5. Series Highlights
       *
       */}
      <Carousel
        className="w-full"
        plugins={[
          Autoplay({
            delay: 5000,
          }),
        ]}
      >
        <CarouselContent>
          {product?.images?.map((item, index) => (
            <CarouselItem key={item}>
              <div
                className="relative w-full h-64 md:h-96 overflow-hidden rounded-lg"
                onClick={() => setSelectedImage(item)}
              >
                <Image
                  src={item}
                  alt={item}
                  fill
                  className="object-cover"
                  priority
                  unoptimized={item.startsWith("https://")}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <p className="text-center text-sm text-gray-500 mt-2 italic">
        Click on an image to view full screen
      </p>

      <Card className="mt-2 relative overflow-hidden">
        <CardHeader>
          <CardTitle>{product?.name}</CardTitle>
          <CardDescription>{product?.description}</CardDescription>
        </CardHeader>

        <BorderBeam
          duration={6}
          size={400}
          className="from-transparent via-red-500 to-transparent"
        />

        <BorderBeam
          duration={6}
          delay={3}
          size={400}
          className="from-transparent via-blue-500 to-transparent"
        />
      </Card>

      <div className="w-full h-1 bg-gray-200 mt-4"></div>

      <div className="z-10 flex items-center">
        <div
          className={cn(
            "mt-4 group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800"
          )}
        >
          <AnimatedShinyText className="font-bold inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
            <span>✨ Mock Test Series Highlights</span>
            <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
          </AnimatedShinyText>
        </div>
      </div>

      <div className="flex flex-col ml-8 gap-2 mt-2">
        <div>
          👉{" "}
          <Badge variant="destructive">{`${product?.mockTest?.length} Mock Tests Inside`}</Badge>
        </div>
        <div>
          👉{" "}
          <Badge variant="destructive">{`Standard - ${product?.standard?.standard}`}</Badge>
        </div>
        {product?.subject && (
          <div>
            👉{" "}
            <Badge variant="destructive">{`Subject - ${product?.subject?.subject}`}</Badge>
          </div>
        )}
      </div>

      {!enrolled ? (
        <div>
          <div className="flex items-center justify-between mt-4 mb-4">
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
              🔍 <hr className="mx-2 h-4 w-px shrink-0 bg-neutral-500" />
              <AnimatedGradientText className="text-sm font-bold">
                Preview Mock Test
              </AnimatedGradientText>
              <ChevronRight className="ml-1 size-4 stroke-neutral-500 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
            </div>
          </div>

          {loadingMockTests ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Loading mock tests...</span>
            </div>
          ) : (
            <div className="opacity-60">
              <NestedMockTestAccordion
                organizedMockTests={organizedMockTests}
                bookIndexList={bookIndexList}
                productId={productId}
                className="mt-4"
              />
            </div>
          )}

          <div className="fixed bottom-0 left-0 right-0 p-4 z-50 flex justify-center">
            <NeonGradientCard className="max-w-sm items-center justify-center text-center">
              <div className="grid grid-cols-2">
                <div className="col-span-1 flex flex-col">
                  <div className="font-bold text-2xl">{`₹ ${product?.sellPrice}`}</div>
                  <div className="text-xs line-through">{`₹ ${product?.mrp}`}</div>
                </div>
                <Button
                  onClick={enrollIn}
                  className="w-full h-full max-w-md col-span-1"
                  disabled={placingOrder}
                >
                  {placingOrder && <Loader2 className="animate-spin" />}
                  Enroll Now
                </Button>
              </div>
            </NeonGradientCard>
          </div>
        </div>
      ) : (
        <div>
          <div className="w-full h-1 bg-gray-200 mt-4"></div>

          <div className="flex items-center justify-between mt-4 mb-4">
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
                Organized Mock Tests
              </AnimatedGradientText>
              <ChevronRight className="ml-1 size-4 stroke-neutral-500 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
            </div>
          </div>

          {loadingMockTests ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>
                Downloading and Organising mock tests for you. It may take upto
                40 seconds. Please wait.....
              </span>
            </div>
          ) : (
            <NestedMockTestAccordion
              organizedMockTests={organizedMockTests}
              bookIndexList={bookIndexList}
              productId={productId}
              productLevel={productLevel}
              className="mt-1"
            />
          )}
        </div>
      )}
    </div>
  );
}
