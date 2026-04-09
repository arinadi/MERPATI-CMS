import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { users, posts } from "@/db/schema";
import { eq, count } from "drizzle-orm";
import { FileText, FileStack, Users } from "lucide-react";

import { getOptions } from "@/lib/actions/options";
import SeoChecklist from "@/components/admin/seo-checklist";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

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

    let stats: { posts: number; pages: number; users: number };
    try {
        stats = await getStats();
    } catch {
        // DB tables don't exist — redirect to init check which sets cookie and redirects
        redirect("/api/check-init");
    }

    const options = await getOptions(["seo_checklist", "ga_dashboard_url"]);
    const seoChecklist = options.seo_checklist;
    const gaDashboardUrl = options.ga_dashboard_url;

    return (
        <div className="space-y-8">
            {/* Welcome */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight">
                    Welcome back, {session?.user?.name ?? "User"}
                </h1>
                <p className="text-muted-foreground">
                    MERPATI CMS Dashboard — Concise, Practical, Secure, and Independent Media Editorial.
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-12 items-start">
                <div className="lg:col-span-8 xl:col-span-9 space-y-8">
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

                    {/* GA Analytics Embed */}
                    {gaDashboardUrl && (
                        <Card className="shadow-sm border-white/5 bg-zinc-900/50 backdrop-blur-sm overflow-hidden">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg font-bold flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5 text-indigo-500" />
                                    Google Analytics Insights
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Real-time statistics from Google Looker Studio.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="w-full relative bg-zinc-950/50" style={{ height: "600px" }}>
                                    <iframe
                                        src={gaDashboardUrl}
                                        className="absolute inset-0 w-full h-full border-0"
                                        allowFullScreen
                                        sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sidebar Column */}
                <div className="lg:col-span-4 xl:col-span-3">
                    <SeoChecklist initialData={seoChecklist || ""} />
                </div>
            </div>
        </div>
    );
}
