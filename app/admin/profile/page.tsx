import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { ProfileForm } from "./profile-form";

export default async function ProfilePage() {
    const session = await auth();
    if (!session?.user?.id) {
        redirect("/login");
    }

    const [user] = await db
        .select({
            name: users.name,
            email: users.email,
        })
        .from(users)
        .where(eq(users.id, session.user.id))
        .limit(1);

    if (!user) {
        redirect("/login");
    }

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
                <p className="text-muted-foreground">
                    Manage your personal account settings.
                </p>
            </div>

            <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
                <div className="p-6 space-y-6">
                    <div>
                        <h3 className="text-lg font-medium leading-none mb-2">Email Address</h3>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <ProfileForm initialName={user.name || ""} />
                </div>
            </div>
        </div>
    );
}
