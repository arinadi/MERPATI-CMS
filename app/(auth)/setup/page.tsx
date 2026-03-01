import { db } from "@/db";
import { redirect } from "next/navigation";
import SetupClient from "./setup-client";

export const dynamic = "force-dynamic";

export default async function SetupPage() {
    // If we already have users, redirect to login
    try {
        const firstUser = await db.query.users.findFirst();
        if (firstUser) {
            redirect("/login");
        }
    } catch (e) {
        console.error("Setup Page DB Error:", e);
        // If the table doesn't exist, they haven't run migrations
        return (
            <div style={{ padding: 40, fontFamily: "system-ui" }}>
                <h1>Database Error</h1>
                <p>Could not connect to database or tables are missing.</p>
                <p>Did you forget to run <code>npm run db:push</code>?</p>
            </div>
        );
    }

    return <SetupClient />;
}
