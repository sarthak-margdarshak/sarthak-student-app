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
import { ChevronRight, Loader2, ArrowDown } from "lucide-react"; // Import ArrowDown
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import NestedMockTestAccordion from "@/components/sections/dashboard/nested-mock-test-accordion";
import { appwriteDatabases } from "@/hook/auth/AppwriteContext";
import { APPWRITE_API } from "@/config-global";
import { ID, Query } from "appwrite";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import ImagePortal from "@/components/sections/dashboard/image-portal";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductView({ productId }) {
  const { setCurrentPageName, getProduct } = useAppContent();
  const { user } = useAuthContext();
  const router = useRouter();

  const [product, setProduct] = useState(
    localStorage.getItem(`product_${productId}`)
      ? JSON.parse(localStorage.getItem(`product_${productId}`))
      : {}
  );
  const [langContent, setLangContent] = useState(
    localStorage.getItem(`product_${productId}`)
      ? {
        name: JSON.parse(localStorage.getItem(`product_${productId}`))?.name,
        description: JSON.parse(localStorage.getItem(`product_${productId}`))
          ?.description,
      }
      : {}
  );
  const [currLang, setCurrLang] = useState(null);
  const [loading, setLoading] = useState(
    localStorage.getItem(`product_${productId}`)
      ? false
      : true
  );
  const [enrolled, setEnrolled] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [organizedMockTests, setOrganizedMockTests] = useState({});
  const [loadingMockTests, setLoadingMockTests] = useState(false);
  const [bookIndexList, setBookIndexList] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [showScrollDown, setShowScrollDown] = useState(false); // State for scroll button

  // Effect for showing/hiding the scroll down button
  useEffect(() => {
    const handleScroll = () => {
      const isAtBottom =
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 1;
      setShowScrollDown(!isAtBottom);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Function to smoothly scroll to the bottom
  const scrollToBottom = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };

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
      const x = JSON.parse(localStorage.getItem(`organizedMockTests_${productId}`));
      setOrganizedMockTests(x.organized);
      setBookIndexList(x.bookIndexList);
      return;
    }
    setLoadingMockTests(true);
    try {
      let organized = {};
      let tmpBookIndexList = {};

      let chunkedMockTests = chunkArray(mockTestIds, 1);
      var z = await Promise.allSettled(
        chunkedMockTests.map(async (chunk) => {
          const x = (
            await appwriteDatabases.listDocuments(
              APPWRITE_API.databaseId,
              APPWRITE_API.collections.mockTest,
              [Query.equal("$id", chunk), Query.limit(100)]
            )
          ).documents;

          var y = await Promise.allSettled(
            x.map(async (mt) => {
              if (mt.conceptId) {
                mt.concept = await appwriteDatabases.getDocument(
                  APPWRITE_API.databaseId,
                  APPWRITE_API.collections.bookIndex,
                  mt.conceptId
                );
              } else {
                mt.concept = null;
              }

              if (mt.chapterId) {
                mt.chapter = await appwriteDatabases.getDocument(
                  APPWRITE_API.databaseId,
                  APPWRITE_API.collections.bookIndex,
                  mt.chapterId
                );
              } else {
                mt.chapter = null;
              }

              if (mt.subjectId) {
                mt.subject = await appwriteDatabases.getDocument(
                  APPWRITE_API.databaseId,
                  APPWRITE_API.collections.bookIndex,
                  mt.subjectId
                );
              } else {
                mt.subject = null;
              }

              if (mt.standardId) {
                mt.standard = await appwriteDatabases.getDocument(
                  APPWRITE_API.databaseId,
                  APPWRITE_API.collections.bookIndex,
                  mt.standardId
                );
              } else {
                mt.standard = null;
              }

              return mt;
            })
          );

          return y.map((res) => res.value);
        })
      );

      let mockTests = z
        .map((res) => res.value)
        .flatMap((mts) => {
          return [...mts];
        });

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

  const renderProductData = async () => {
    try {
      setLoading(
        localStorage.getItem(`product_${productId}`) ? false : true
      );
      setProduct(
        localStorage.getItem(`product_${productId}`)
          ? JSON.parse(localStorage.getItem(`product_${productId}`))
          : {}
      );
      setLangContent(
        localStorage.getItem(`product_${productId}`)
          ? {
            name: JSON.parse(localStorage.getItem(`product_${productId}`))
              ?.name,
            description: JSON.parse(
              localStorage.getItem(`product_${productId}`)
            )?.description,
          }
          : {}
      );
      var x = await getProduct(productId);
      if (x) {
        setLangContent({ name: x?.name, description: x?.description });
        setCurrLang(x?.lang);
      }
      setProduct(x);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      renderProductData();
      setCurrentPageName(langContent.name);

      // Check user enrollment
      setEnrolled(
        user.labels.findIndex(
          (label) =>
            label === labels.founder || label === labels.admin || label === productId
        ) !== -1
      );

      organizeMockTests(product.mockTest);
    };

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("Adsense error:", err);
    }

    fetchData();
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

  if (loading) {
    return (
      <div className="mt-20 container mx-auto px-4 md:px-8 space-y-6">
        {/* Carousel Skeleton */}
        <div className="w-full space-y-2">
          <Skeleton className="w-full h-64 md:h-96 rounded-lg bg-slate-200" />
          <Skeleton className="h-4 w-48 mx-auto bg-slate-200" />
        </div>

        <div className="w-full h-1 bg-gray-100" />

        {/* Language Toggle Skeleton */}
        <div className="flex flex-col items-center gap-3">
          <Skeleton className="h-4 w-48 bg-slate-200" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-16 rounded bg-slate-200" />
            <Skeleton className="h-8 w-16 rounded bg-slate-200" />
          </div>
        </div>

        {/* Info Card Skeleton */}
        <Card className="mt-2 relative overflow-hidden bg-slate-50 border-none shadow-sm">
          <CardHeader className="space-y-3">
            <Skeleton className="h-8 w-3/4 bg-slate-200" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full bg-slate-200" />
              <Skeleton className="h-4 w-5/6 bg-slate-200" />
              <Skeleton className="h-4 w-4/5 bg-slate-200" />
            </div>
          </CardHeader>
        </Card>

        <div className="w-full h-1 bg-gray-100" />

        {/* Highlights Pill Skeleton */}
        <div className="flex justify-center">
          <Skeleton className="h-8 w-64 rounded-full bg-slate-200" />
        </div>

        {/* Details List Skeleton */}
        <div className="flex flex-col ml-8 gap-3">
          <Skeleton className="h-6 w-48 bg-slate-200" />
          <Skeleton className="h-6 w-40 bg-slate-200" />
          <Skeleton className="h-6 w-44 bg-slate-200" />
        </div>

        <div className="w-full h-1 bg-gray-100" />

        {/* Enroll/Preview Section Skeleton */}
        <div className="space-y-4 opacity-70">
          <div className="flex justify-center">
            <Skeleton className="h-8 w-56 rounded-full bg-slate-200" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-12 w-full rounded-lg bg-slate-200" />
            <Skeleton className="h-12 w-full rounded-lg bg-slate-200" />
          </div>
        </div>

        {/* Floating Action Button Skeleton */}
        <div className="fixed bottom-0 left-0 right-0 p-4 z-50 flex justify-center bg-transparent">
          <Skeleton className="h-20 w-80 rounded-xl bg-slate-300 shadow-lg" />
        </div>
      </div>
    );
  }

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

      <div className="w-full h-1 bg-gray-200 mt-4"></div>

      {product?.availableLang?.length > 1 && (
        <div className="flex flex-col items-center gap-2 mt-4">
          <p className="text-sm text-gray-500 font-medium">
            Available in languages (click to change):
          </p>
          <div className="flex justify-center gap-2">
            {product?.availableLang?.map((lang) => (
              <Button
                key={lang}
                variant={currLang === lang ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setCurrLang(lang);
                  setLangContent({
                    name: product[lang]?.name,
                    description: product[lang]?.description,
                  });
                  setCurrentPageName(product[lang]?.name);
                }}
              >
                {lang.toUpperCase()}
              </Button>
            ))}
          </div>
        </div>
      )}

      <Card className="mt-2 relative overflow-hidden">
        <CardHeader>
          <CardTitle>{langContent?.name}</CardTitle>
          <CardDescription>{langContent?.description}</CardDescription>
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
            Available Mock Tests
          </AnimatedGradientText>
          <ChevronRight className="ml-1 size-4 stroke-neutral-500 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
        </div>
      </div>

      {loadingMockTests ? (
        <div className="flex items-center justify-center p-8 mb-50">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>
            Downloading and Organising mock tests for you. It may take upto
            40 seconds to 1 minute. Please wait.....
          </span>
        </div>
      ) : (
        <NestedMockTestAccordion
          organizedMockTests={organizedMockTests}
          bookIndexList={bookIndexList}
          productId={productId}
          lang={currLang}
          className="mt-1 mb-50"
        />
      )}

      {!enrolled &&
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
      }

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

      {/* Conditionally render the floating scroll-down button */}
      {showScrollDown && (
        <Button
          onClick={scrollToBottom}
          className="fixed bottom-20 right-4 z-50 rounded-full h-14 w-14 shadow-lg"
          variant="secondary"
          aria-label="Scroll to bottom"
        >
          <ArrowDown className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}
