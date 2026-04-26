"use client";

import React from "react";
import Link from "next/link";
import { Home, History, FileText, ReceiptText } from "lucide-react";
import { Dock, DockIcon } from "@/components/magicui/dock";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export function DockNavigation() {
    const pathname = usePathname();

    const isActive = (path) => pathname === path;

    return (
        <div className="fixed bottom-4 left-0 right-0 z-50 pointer-events-none flex justify-center">
            <div className="pointer-events-auto">
                <Dock magnification={60} distance={100}>
                    <DockIcon className="bg-white/10 dark:bg-black/10">
                        <Link
                            href="/"
                            title="Home"
                            className={cn(
                                "flex size-full items-center justify-center rounded-full transition-colors",
                                isActive("/") ? "bg-white/20 dark:bg-white/20" : ""
                            )}
                        >
                            <Home className="size-6 text-neutral-500 dark:text-neutral-400" />
                        </Link>
                    </DockIcon>
                    <DockIcon className="bg-white/10 dark:bg-black/10">
                        <Link
                            href="/dashboard/purchased"
                            title="Purchased Mock Test Series"
                            className={cn(
                                "flex size-full items-center justify-center rounded-full transition-colors",
                                isActive("/dashboard/purchased") ? "bg-white/20 dark:bg-white/20" : ""
                            )}
                        >
                            <FileText className="size-6 text-neutral-500 dark:text-neutral-400" />
                        </Link>
                    </DockIcon>
                    <DockIcon className="bg-white/10 dark:bg-black/10">
                        <Link
                            href="/dashboard/attempt"
                            title="Your Attempt History"
                            className={cn(
                                "flex size-full items-center justify-center rounded-full transition-colors",
                                pathname?.startsWith("/dashboard/attempt") ? "bg-white/20 dark:bg-white/20" : ""
                            )}
                        >
                            <History className="size-6 text-neutral-500 dark:text-neutral-400" />
                        </Link>
                    </DockIcon>
                    <DockIcon className="bg-white/10 dark:bg-black/10">
                        <Link
                            href="/dashboard/orders"
                            title="Your Order History"
                            className={cn(
                                "flex size-full items-center justify-center rounded-full transition-colors",
                                pathname?.startsWith("/dashboard/orders") ? "bg-white/20 dark:bg-white/20" : ""
                            )}
                        >
                            <ReceiptText className="size-6 text-neutral-500 dark:text-neutral-400" />
                        </Link>
                    </DockIcon>
                </Dock>
            </div>
        </div>
    );
}
