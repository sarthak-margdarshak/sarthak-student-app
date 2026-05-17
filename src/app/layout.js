"use client";

import { Laila } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/theme-provider";
import Navbar from "@/components/nav-bar";
import { AppContentProvider } from "@/hook/app/AppContentProvider";
import { AuthProvider } from "@/hook/auth/AppwriteContext";
import { Toaster } from "@/components/ui/sonner";
// import Script from "next/script";
import { useEffect, useState } from "react";
import { APPWRITE_API } from "@/config-global";
import Maintenance from "@/components/maintenance";
import { Client, Databases, Query } from "appwrite";
import { useAuthContext } from "@/hook/auth/useAuthContext";
import { usePathname } from "next/navigation";

const laila = Laila({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin", "devanagari"],
});

import {
  DockNavigation,
  isDockRoute,
} from "@/components/dock-navigation";

function ConditionalDockNavigation() {
  const { user } = useAuthContext();
  const pathname = usePathname();

  if (!user || !isDockRoute(pathname)) return null;

  return <DockNavigation />;
}

export default function RootLayout({ children }) {
  const [underMaintenance, setUnderMaintenance] = useState(false);

  useEffect(() => {
    const checkMaintenanceMode = async () => {
      const client = new Client()
        .setEndpoint(APPWRITE_API.backendUrl)
        .setProject(APPWRITE_API.projectId);
      const databases = new Databases(client);
      const metadataContent = await databases.getDocument(
        APPWRITE_API.databaseId,
        APPWRITE_API.collections.metadata,
        APPWRITE_API.documents.metadataContentDoc,
        [Query.select("student_maintenance")],
      );
      setUnderMaintenance(metadataContent?.student_maintenance);
    };
    checkMaintenanceMode();
  }, []);
  return (
    <html lang="en" data-theme="light" style={{ colorScheme: "light" }}>
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/katex@0.16.0/dist/katex.min.css"
        ></link>
        <title>Sarthak Margdarshak: Mock Test Guidance Guru</title>
        <meta
          name="description"
          content="An app for students to appear mock-test of any competitive exam."
        />
        <meta name="apple-mobile-web-app-title" content="Sarthak" />
        {/* AdSense disabled
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3463000892258610"
          crossOrigin="anonymous"
        />
        */}
      </head>
      <body className={`${laila.className} antialiased`}>
        {underMaintenance ? (
          <Maintenance />
        ) : (
          <AuthProvider>
            <AppContentProvider>
              <ThemeProvider>
                <Navbar />
                <main className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-32">
                  {children}
                </main>
                <ConditionalDockNavigation />
              </ThemeProvider>
            </AppContentProvider>
          </AuthProvider>
        )}
        <Toaster />
      </body>
    </html>
  );
}
