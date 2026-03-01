import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminLayoutUI from "./admin-layout-ui";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();

    // Protect the entire admin dashboard
    if (!session?.user) {
        redirect("/login");
    }

    return (
        <AdminLayoutUI user={session.user}>
            {children}
        </AdminLayoutUI>
    );
}
