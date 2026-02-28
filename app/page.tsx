import Link from "next/link";

export default function HomePage() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1D2327 0%, #2271B1 100%)",
      color: "#fff",
      fontFamily: "system-ui, -apple-system, sans-serif",
      textAlign: "center",
      padding: "24px",
    }}>
      <h1 style={{ fontSize: "48px", fontWeight: 700, marginBottom: "8px" }}>
        🕊️ MERPATI-CMS
      </h1>
      <p style={{ fontSize: "18px", opacity: 0.85, marginBottom: "32px", maxWidth: "500px" }}>
        Media Editorial Ringkas, Praktis, Aman, Tetap Independen
      </p>
      <p style={{ fontSize: "14px", opacity: 0.65, fontStyle: "italic", marginBottom: "48px" }}>
        &quot;Kebebasan pers dimulai dari kemandirian infrastrukturnya.&quot;
      </p>
      <div style={{ display: "flex", gap: "16px" }}>
        <Link
          href="/login"
          style={{
            padding: "12px 32px",
            background: "#fff",
            color: "#2271B1",
            borderRadius: "6px",
            fontWeight: 600,
            fontSize: "15px",
            textDecoration: "none",
            transition: "transform 150ms ease",
          }}
        >
          Login
        </Link>
        <Link
          href="/dashboard"
          style={{
            padding: "12px 32px",
            background: "rgba(255,255,255,0.15)",
            color: "#fff",
            borderRadius: "6px",
            fontWeight: 600,
            fontSize: "15px",
            textDecoration: "none",
            border: "1px solid rgba(255,255,255,0.3)",
          }}
        >
          Dashboard →
        </Link>
      </div>
    </div>
  );
}
