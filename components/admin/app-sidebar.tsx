"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    FileText,
    FileStack,
    FolderTree,
    Tags,
    Image as ImageIcon,
    Users,
    Settings,
    Menu as MenuIcon,
    DatabaseZap,
    ExternalLink,
} from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarHeader,
    SidebarFooter,
    SidebarRail,
} from "@/components/ui/sidebar";
import { isSuperUser } from "@/lib/rbac";

interface NavItem {
    title: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    superUserOnly?: boolean;
}

const navItems: NavItem[] = [
    { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { title: "Visit Site", href: "/", icon: ExternalLink },
    { title: "Posts", href: "/admin/posts", icon: FileText },
    { title: "Categories", href: "/admin/categories", icon: FolderTree },
    { title: "Tags", href: "/admin/tags", icon: Tags },
    { title: "Pages", href: "/admin/pages", icon: FileStack },
    { title: "Media", href: "/admin/media", icon: ImageIcon },
    { title: "Menus", href: "/admin/menus", icon: MenuIcon, superUserOnly: true },
    { title: "Users", href: "/admin/users", icon: Users, superUserOnly: true },
    { title: "Cache", href: "/admin/cache", icon: DatabaseZap, superUserOnly: true },
    { title: "Settings", href: "/admin/settings", icon: Settings, superUserOnly: true },
];

export function AppSidebar({ userRole, hasThemeOptions }: { userRole?: string | null, hasThemeOptions?: boolean }) {
    const pathname = usePathname();

    const filteredItems = navItems.filter((item) => {
        if (item.superUserOnly && !isSuperUser(userRole)) return false;
        return true;
    });

    if (hasThemeOptions) {
        // Insert Theme Options before Settings
        const settingsIndex = filteredItems.findIndex(i => i.title === "Settings");
        const themeOptionsItem = { title: "Theme Options", href: "/admin/theme-options", icon: Settings, superUserOnly: true };
        if (settingsIndex !== -1) {
            filteredItems.splice(settingsIndex, 0, themeOptionsItem);
        } else {
            filteredItems.push(themeOptionsItem);
        }
    }

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <div className="flex items-center gap-2 px-2 py-1.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-sm">
                        M
                    </div>
                    <span className="font-semibold text-sm group-data-[collapsible=icon]:hidden">
                        MERPATI CMS
                    </span>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Menu</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {filteredItems.map((item) => {
                                const isActive =
                                    item.href === "/admin"
                                        ? pathname === "/admin"
                                        : item.href === "/"
                                        ? false
                                        : pathname.startsWith(item.href);

                                return (
                                    <SidebarMenuItem key={item.href}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive}
                                            tooltip={item.title}
                                        >
                                            <Link href={item.href} target={item.href === "/" ? "_blank" : undefined}>
                                                <item.icon className="h-4 w-4" />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <div className="px-2 py-1.5 text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
                    © {new Date().getFullYear()} MERPATI
                </div>
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    );
}
