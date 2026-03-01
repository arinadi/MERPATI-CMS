import { db } from "@/db";
import SettingsClient from "./settings-client";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
    const session = await auth();
    if (session?.user?.role !== "super_user") {
        redirect("/dashboard");
    }

    const allSettings = await db.query.settings.findMany();

    // Map array to object map
    const settingsMap: Record<string, string> = {};
    for (const s of allSettings) {
        settingsMap[s.key] = s.value || "";
    }

    return <SettingsClient initialSettings={settingsMap} />;
}
