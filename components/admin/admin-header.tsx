"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { LogOut, User as UserIcon, DatabaseZap } from "lucide-react";
import { signOut } from "next-auth/react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { CacheManager } from "@/components/admin/cache/cache-manager";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface AdminHeaderProps {
    userName?: string | null;
    userEmail?: string | null;
    userImage?: string | null;
}

function generateBreadcrumbs(pathname: string) {
    const segments = pathname.split("/").filter(Boolean);
    return segments.map((segment, index) => {
        const href = "/" + segments.slice(0, index + 1).join("/");
        const label = segment.charAt(0).toUpperCase() + segment.slice(1);
        const isLast = index === segments.length - 1;
        return { href, label, isLast };
    });
}

function getInitials(name?: string | null): string {
    if (!name) return "U";
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

export function AdminHeader({ userName, userEmail, userImage }: AdminHeaderProps) {
    const pathname = usePathname();
    const breadcrumbs = generateBreadcrumbs(pathname);

    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <header className="flex h-14 items-center gap-3 border-b bg-background px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="h-5" />

            {/* Breadcrumbs */}
            <Breadcrumb className="flex-1">
                <BreadcrumbList>
                    {breadcrumbs.map((crumb, i) => (
                        <React.Fragment key={crumb.href}>
                            {i > 0 && <BreadcrumbSeparator />}
                            <BreadcrumbItem>
                                {crumb.isLast ? (
                                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink href={crumb.href}>
                                        {crumb.label}
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                        </React.Fragment>
                    ))}
                </BreadcrumbList>
            </Breadcrumb>

            {/* Date */}
            <span className="hidden text-xs text-muted-foreground md:block" suppressHydrationWarning>
                {formattedDate}
            </span>

            {/* Clear Cache Modal */}
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 gap-2 border-dashed border-amber-500/50 hover:border-amber-500 hover:bg-amber-500/10 text-amber-600 dark:text-amber-500 dark:hover:text-amber-400">
                        <DatabaseZap className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Clear Cache</span>
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-xl p-0 border-none bg-transparent shadow-none" aria-describedby="clear-cache-dialog-description">
                    <DialogTitle className="sr-only">Clear Cache</DialogTitle>
                    <div id="clear-cache-dialog-description" className="sr-only">Clear global site cache to refresh Content on frontend.</div>
                    <CacheManager />
                </DialogContent>
            </Dialog>

            {/* User Dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={userImage ?? undefined} alt={userName ?? "User"} />
                            <AvatarFallback className="text-xs">{getInitials(userName)}</AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{userName ?? "User"}</p>
                            <p className="text-xs leading-none text-muted-foreground">
                                {userEmail}
                            </p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href="/admin/profile">
                            <UserIcon className="mr-2 h-4 w-4" />
                            Profile
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="text-destructive focus:text-destructive cursor-pointer"
                        onClick={() => signOut({ callbackUrl: "/login" })}
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    );
}
