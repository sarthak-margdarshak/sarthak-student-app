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
      </head>
      <body className={`${laila.className} antialiased`}>
        <AuthProvider>
          <AppContentProvider>
            <ThemeProvider>
              <Navbar />
              <main className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {children}
              </main>
            </ThemeProvider>
          </AppContentProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
