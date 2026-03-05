import { auth } from "@/auth";
import { redirect } from "next/navigation";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";

export default async function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    return (
        <TooltipProvider>
            <SidebarProvider>
                <AppSidebar userRole={session.user.role} />
                <SidebarInset>
                    <AdminHeader
                        userName={session.user.name}
                        userEmail={session.user.email}
                        userImage={session.user.image}
                    />
                    <main className="flex-1 p-4 md:p-6">{children}</main>
                </SidebarInset>
            </SidebarProvider>
        </TooltipProvider>
    );
}
