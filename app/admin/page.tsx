import { auth } from "@/auth";
import { db } from "@/db";
import { users, posts } from "@/db/schema";
import { eq, count } from "drizzle-orm";
import { FileText, FileStack, Users } from "lucide-react";

async function getStats() {
    const [postsCount] = await db
        .select({ count: count() })
        .from(posts)
        .where(eq(posts.type, "post"));

    const [pagesCount] = await db
        .select({ count: count() })
        .from(posts)
        .where(eq(posts.type, "page"));

    const [usersCount] = await db
        .select({ count: count() })
        .from(users);

    return {
        posts: postsCount?.count ?? 0,
        pages: pagesCount?.count ?? 0,
        users: usersCount?.count ?? 0,
    };
}

const statCards = [
    { key: "posts" as const, label: "Total Posts", icon: FileText, color: "bg-blue-500/10 text-blue-600" },
    { key: "pages" as const, label: "Total Pages", icon: FileStack, color: "bg-emerald-500/10 text-emerald-600" },
    { key: "users" as const, label: "Total Users", icon: Users, color: "bg-violet-500/10 text-violet-600" },
];

export default async function AdminDashboard() {
    const session = await auth();
    const stats = await getStats();

    return (
        <div className="space-y-8">
            {/* Welcome */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight">
                    Selamat Datang, {session?.user?.name ?? "User"}
                </h1>
                <p className="text-muted-foreground">
                    MERPATI CMS Dashboard — Media Editorial Ringkas, Praktis, Aman, Tetap Independen
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {statCards.map((card) => (
                    <div
                        key={card.key}
                        className="rounded-xl border bg-card p-6 shadow-sm"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${card.color}`}>
                                <card.icon className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">{card.label}</p>
                                <p className="text-3xl font-bold">{stats[card.key]}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
