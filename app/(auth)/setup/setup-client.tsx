"use client";

import { useTransition } from "react";
import { installCms } from "@/app/actions/setup";
import { useRouter } from "next/navigation";

export default function SetupClient() {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        startTransition(async () => {
            const result = await installCms(formData);
            if (result && "error" in result && result.error) {
                alert(result.error);
            } else {
                alert("Installation complete! You can now log in.");
                router.push("/login");
            }
        });
    };

    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            background: "linear-gradient(135deg, #1D2327 0%, #2271B1 100%)",
            fontFamily: "system-ui, -apple-system, sans-serif",
            padding: "20px"
        }}>
            <div style={{
                background: "#fff",
                borderRadius: "8px",
                padding: "48px 40px",
                width: "100%",
                maxWidth: "480px",
                boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
            }}>
                <div style={{ textAlign: "center", marginBottom: "32px" }}>
                    <div style={{ fontSize: "48px", marginBottom: "8px" }}>🕊️</div>
                    <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#1E1E1E", marginBottom: "4px" }}>
                        Setup MERPATI-CMS
                    </h1>
                    <p style={{ fontSize: "14px", color: "#646970" }}>
                        Beri tahu kami sedikit tentang situs Anda untuk memulai.
                    </p>
                </div>

                <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <div>
                        <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: 600, color: "#1E1E1E" }}>Site Title</label>
                        <input
                            type="text"
                            name="site_title"
                            placeholder="My News Portal"
                            required
                            disabled={isPending}
                            style={{ width: "100%", padding: "10px 14px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "15px" }}
                        />
                    </div>
                    <div>
                        <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: 600, color: "#1E1E1E" }}>Tagline</label>
                        <input
                            type="text"
                            name="site_tagline"
                            placeholder="Berita Terpercaya"
                            disabled={isPending}
                            style={{ width: "100%", padding: "10px 14px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "15px" }}
                        />
                    </div>
                    <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "8px 0" }} />
                    <div>
                        <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: 600, color: "#1E1E1E" }}>Admin Email (Google Account)</label>
                        <p style={{ fontSize: "12px", color: "#646970", marginBottom: "8px" }}>Alamat email Google yang akan digunakan untuk login sebagai Super User.</p>
                        <input
                            type="email"
                            name="admin_email"
                            placeholder="admin@gmail.com"
                            required
                            disabled={isPending}
                            style={{ width: "100%", padding: "10px 14px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "15px" }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
                        style={{
                            marginTop: "12px",
                            padding: "14px 24px",
                            background: "#2271B1",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            fontSize: "15px",
                            fontWeight: 600,
                            cursor: isPending ? "not-allowed" : "pointer",
                            opacity: isPending ? 0.7 : 1
                        }}
                    >
                        {isPending ? "Menginstal..." : "Install MERPATI-CMS"}
                    </button>
                </form>
            </div>
        </div>
    );
}
