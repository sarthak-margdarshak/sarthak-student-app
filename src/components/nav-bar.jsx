"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { PATH_AUTH, PATH_DASHBOARD, PATH_PAGE } from "@/routes/paths";
import { useAppContent } from "@/hook/app/useAppContent";
import { useAuthContext } from "@/hook/auth/useAuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";

const Navbar = () => {
  const { currentPage } = useAppContent();
  const { user } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();

  if (currentPage === "attempPage") {
    return null; // Don't render the navbar on the attempt page
  }

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Page Name */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href={PATH_PAGE.root} className="flex items-center">
                <Image
                  src="https://cloud.appwrite.io/v1/storage/buckets/sarthak_datalake_bucket/files/67ba3f6a002ef0a0f7b1/view?project=sarthak-margdarshak"
                  alt="App Logo"
                  width={40}
                  height={40}
                  className="h-10 w-auto"
                />
                <span className="ml-3 text-xl font-semibold text-gray-800 dark:text-white hidden sm:block">
                  Sarthak Margdarshak
                </span>
              </Link>
            </div>
            <div className="ml-4 pl-4 border-l border-gray-300 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-300">
                {currentPage}
              </span>
            </div>
          </div>

          {/* User Profile */}
          {user ? (
            <div className="flex items-center">
              <div className="hidden md:flex items-center">
                <Link
                  href={PATH_DASHBOARD.profile}
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 text-sm font-medium"
                >
                  {user?.name}
                </Link>
              </div>

              <Link
                href={PATH_DASHBOARD.profile}
                className="ml-2 flex-shrink-0 relative"
              >
                <Avatar>
                  <AvatarImage src={user.prefs?.photo} />
                  <AvatarFallback>
                    {user?.name
                      ?.split(" ")
                      .map((x) => (x.length === 0 ? "" : x[0]))
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </div>
          ) : (
            !pathname.includes(PATH_AUTH.login) && (
              <Button
                variant="outline"
                onClick={() => router.push(PATH_AUTH.login)}
              >
                <LogIn />
              </Button>
            )
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
