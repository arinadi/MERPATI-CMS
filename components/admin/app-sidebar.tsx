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
    Globe,
    Phone,
    Bell,
    BarChart,
    ChevronRight,
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
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarMenuSubButton,
    SidebarHeader,
    SidebarFooter,
    SidebarRail,
    useSidebar,
} from "@/components/ui/sidebar";
import { Collapsible } from "radix-ui";
import { isSuperUser } from "@/lib/rbac";

interface NavItem {
    title: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    superUserOnly?: boolean;
}

const settingsSubItems = [
    { title: "General", href: "/admin/settings/general", icon: Globe },
    { title: "Contacts", href: "/admin/settings/contacts", icon: Phone },
    { title: "Notifications", href: "/admin/settings/notifications", icon: Bell },
    { title: "Tracking", href: "/admin/settings/tracking", icon: BarChart },
];

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
];

export function AppSidebar({ userRole, hasThemeOptions }: { userRole?: string | null, hasThemeOptions?: boolean }) {
    const pathname = usePathname();
    const { isMobile, setOpenMobile } = useSidebar();

    function handleNavClick() {
        if (isMobile) setOpenMobile(false);
    }
    const filteredItems = navItems.filter((item) => {
        if (item.superUserOnly && !isSuperUser(userRole)) return false;
        return true;
    });

    if (hasThemeOptions) {
        const themeOptionsItem = { title: "Theme Options", href: "/admin/theme-options", icon: Settings, superUserOnly: true };
        filteredItems.push(themeOptionsItem);
    }

    const isSettingsActive = pathname.startsWith("/admin/settings");

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
                                            <Link href={item.href} target={item.href === "/" ? "_blank" : undefined} onClick={handleNavClick}>
                                                <item.icon className="h-4 w-4" />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}

                            {/* Settings collapsible sub-menu */}
                            {isSuperUser(userRole) && (
                                <Collapsible.Root defaultOpen={isSettingsActive} asChild>
                                    <SidebarMenuItem>
                                                        <Collapsible.Trigger asChild>
                                                            <SidebarMenuButton
                                                                isActive={isSettingsActive}
                                                                tooltip="Settings"
                                                            >
                                                <Settings className="h-4 w-4" />
                                                <span>Settings</span>
                                                <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                            </SidebarMenuButton>
                                        </Collapsible.Trigger>
                                        <Collapsible.Content>
                                            <SidebarMenuSub>
                                                {settingsSubItems.map((sub) => (
                                                    <SidebarMenuSubItem key={sub.href}>
                                                        <SidebarMenuSubButton
                                                            asChild
                                                            isActive={pathname === sub.href}
                                                        >
                                                            <Link href={sub.href} onClick={handleNavClick}>
                                                                <sub.icon className="h-3.5 w-3.5" />
                                                                <span>{sub.title}</span>
                                                            </Link>
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>
                                                ))}
                                            </SidebarMenuSub>
                                        </Collapsible.Content>
                                    </SidebarMenuItem>
                                </Collapsible.Root>
                            )}
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
