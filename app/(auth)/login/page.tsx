import { db } from "@/db";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
    try {
        const firstUser = await db.query.users.findFirst();
        if (!firstUser) {
            redirect("/setup");
        }
    } catch {
        // DB not setup, fail silently and let them stay on login or whatever
    }

    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            background: "linear-gradient(135deg, #1D2327 0%, #2271B1 100%)",
            fontFamily: "system-ui, -apple-system, sans-serif",
        }}>
            <div style={{
                background: "#fff",
                borderRadius: "8px",
                padding: "48px 40px",
                textAlign: "center",
                width: "100%",
                maxWidth: "400px",
                boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
            }}>
                <div style={{ fontSize: "48px", marginBottom: "8px" }}>🕊️</div>
                <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#1E1E1E", marginBottom: "4px" }}>
                    MERPATI-CMS
                </h1>
                <p style={{ fontSize: "13px", color: "#646970", marginBottom: "32px" }}>
                    Media Editorial Ringkas, Praktis, Aman, Tetap Independen
                </p>

                <form action={async () => {
                    "use server";
                    console.log("=== DEBUG OAUTH ===");
                    console.log("AUTH_GOOGLE_ID:", process.env.AUTH_GOOGLE_ID);
                    console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
                    console.log("AUTH_GOOGLE_SECRET length:", process.env.AUTH_GOOGLE_SECRET?.length || 0);
                    console.log("GOOGLE_CLIENT_SECRET length:", process.env.GOOGLE_CLIENT_SECRET?.length || 0);
                    const { signIn } = await import("@/auth");
                    await signIn("google", { redirectTo: "/dashboard" });
                }}>
                    <button
                        type="submit"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "10px",
                            width: "100%",
                            padding: "12px 24px",
                            background: "#4285F4",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            fontSize: "15px",
                            fontWeight: 500,
                            cursor: "pointer",
                        }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Login dengan Google
                    </button>
                </form>

                {process.env.NODE_ENV === "development" && (
                    <form action={async () => {
                        "use server";
                        const { signIn } = await import("@/auth");
                        await signIn("credentials", {
                            email: "dev@merpati.com",
                            redirectTo: "/dashboard"
                        });
                    }} style={{ marginTop: "12px" }}>
                        <button
                            type="submit"
                            style={{
                                display: "block",
                                width: "100%",
                                padding: "12px 24px",
                                background: "#1D2327",
                                color: "#fff",
                                border: "none",
                                borderRadius: "6px",
                                fontSize: "15px",
                                fontWeight: 500,
                                cursor: "pointer",
                            }}
                        >
                            👨‍💻 Sign in with Dev Mode
                        </button>
                    </form>
                )}

                <p style={{
                    marginTop: "32px",
                    fontSize: "12px",
                    color: "#646970",
                    fontStyle: "italic",
                    lineHeight: 1.5,
                }}>
                    &quot;Kebebasan pers dimulai dari kemandirian infrastrukturnya.&quot;
                </p>
            </div>
        </div>
    );
}
