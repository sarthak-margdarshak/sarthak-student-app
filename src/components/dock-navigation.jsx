"use client";

import React from "react";
import Link from "next/link";
import { Home, History, FileText, ReceiptText } from "lucide-react";
import { Dock, DockIcon } from "@/components/magicui/dock";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

/** Routes where the bottom dock is shown (one per dock button). */
export const DOCK_ROUTES = [
    "/",
    "/dashboard/purchased",
    "/dashboard/attempt",
    "/dashboard/orders",
];

export function isDockRoute(pathname) {
    return Boolean(pathname && DOCK_ROUTES.includes(pathname));
}

function DockNavItem({
    href,
    title,
    label,
    Icon,
    active,
    ...dockProps
}) {
    return (
        <div className="flex flex-col items-center gap-1">
            <DockIcon className="bg-white/10 dark:bg-black/10" {...dockProps}>
                <Link
                    href={href}
                    title={title}
                    className={cn(
                        "flex size-full items-center justify-center rounded-full transition-colors",
                        active ? "bg-primary" : ""
                    )}
                >
                    <Icon
                        className={cn(
                            "size-6",
                            active
                                ? "text-primary-foreground"
                                : "text-neutral-500 dark:text-neutral-400"
                        )}
                    />
                </Link>
            </DockIcon>
            <span className="text-[10px] leading-none text-neutral-600 dark:text-neutral-300">
                {label}
            </span>
        </div>
    );
}

export function DockNavigation() {
    const pathname = usePathname();

    const isActive = (path) => pathname === path;

    return (
        <div className="fixed bottom-4 left-0 right-0 z-50 pointer-events-none flex justify-center">
            <div className="pointer-events-auto">
                <Dock magnification={60} distance={100}>
                    <DockNavItem
                        href="/"
                        title="Home"
                        label="Home"
                        Icon={Home}
                        active={isActive("/")}
                    />
                    <DockNavItem
                        href="/dashboard/purchased"
                        title="Purchased Mock Test Series"
                        label="Tests"
                        Icon={FileText}
                        active={isActive("/dashboard/purchased")}
                    />
                    <DockNavItem
                        href="/dashboard/attempt"
                        title="Your Attempt History"
                        label="Attempts"
                        Icon={History}
                        active={isActive("/dashboard/attempt")}
                    />
                    <DockNavItem
                        href="/dashboard/orders"
                        title="Your Order History"
                        label="Orders"
                        Icon={ReceiptText}
                        active={isActive("/dashboard/orders")}
                    />
                </Dock>
            </div>
        </div>
    );
}
