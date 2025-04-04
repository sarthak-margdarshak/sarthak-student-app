"use client";

import { Laila } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/theme-provider";
import Navbar from "@/components/nav-bar";
import { AppContentProvider } from "@/hook/app/AppContentProvider";
import { AuthProvider } from "@/hook/auth/AppwriteContext";
import { Toaster } from "@/components/ui/sonner";

const laila = Laila({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin", "devanagari"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light" style={{ colorScheme: "light" }}>
      <body className={`${laila.className} antialiased`}>
        <AuthProvider>
          <AppContentProvider>
            <ThemeProvider>
              <Navbar />
              <div className="mt-20 mx-4 sm:mx-6 md:mx-12 lg:mx-24 xl:mx-32">
                {children}
              </div>
            </ThemeProvider>
          </AppContentProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
