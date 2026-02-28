import Link from "next/link";

export default function DeniedPage() {
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
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>🚫</div>
                <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#D63638", marginBottom: "12px" }}>
                    Akses Ditolak
                </h1>
                <p style={{ fontSize: "14px", color: "#646970", marginBottom: "24px", lineHeight: 1.6 }}>
                    Anda belum diundang untuk menggunakan MERPATI-CMS. Silakan hubungi administrator.
                </p>
                <Link
                    href="/login"
                    style={{
                        display: "inline-block",
                        padding: "10px 24px",
                        background: "#2271B1",
                        color: "#fff",
                        borderRadius: "6px",
                        fontSize: "14px",
                        fontWeight: 500,
                        textDecoration: "none",
                    }}
                >
                    Kembali ke Login
                </Link>
            </div>
        </div>
    );
}
