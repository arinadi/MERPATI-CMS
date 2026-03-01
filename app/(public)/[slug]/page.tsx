import Link from "next/link";
import { notFound } from "next/navigation";

// Ini data dummy. Di Fase 3, query database lewat Drizzle.
const dummyPosts: Record<string, Record<string, string>> = {
    "kebijakan-energi-baru": {
        title: "Breaking: Kebijakan Energi Baru Diumumkan Pemerintah",
        author: "Rina Sari",
        category: "Politik",
        date: "28 Feb 2026",
        image: "#667eea",
        content: `
      <p>Pemerintah secara resmi mengumumkan peta jalan transisi energi menuju emisi nol bersih pada tahun 2050. Keputusan ini diumumkan langsung oleh Presiden usai rapat terbatas di Istana Negara siang ini.</p>
      <p>Menurut rencana, pemerintah akan mempercepat penghentian operasional sejumlah PLTU batu bara di Pulau Jawa dan Sumatera dalam lima tahun ke depan. Dana transisi senilai $20 miliar yang disepakati bersama lembaga internasional akan cair secara bertahap mulai kuartal ketiga tahun ini.</p>
      <h2>Fokus pada Energi Terbarukan</h2>
      <p>"Fokus utama kita sekarang adalah membangun ekosistem panel surya dan panas bumi terintegrasi," ujar Menteri Energi dalam jumpa pers. Pemerintah juga berencana memberikan insentif pajak skala besar untuk investasi di sektor energi angin lepas pantai di kawasan Indonesia Timur.</p>
      <p>Para pengamat lingkungan menyambut baik pengumuman ini, namun menekankan pentingnya transparansi dalam alokasi dana dan program pelatihan ulang bagi pekerja di sektor bahan bakar fosil yang terdampak.</p>
      <p>Di sisi lain, indeks saham pertambangan di bursa lokal dilaporkan terkoreksi tajam segera setelah pengumuman resmi dirilis ke publik.</p>
    `
    },
    "ekonomi-digital-tumbuh": {
        title: "Ekonomi Digital Indonesia Tumbuh 30% di Kuartal Pertama",
        author: "Budi Santoso",
        category: "Ekonomi",
        date: "27 Feb 2026",
        image: "#fa709a",
        content: "<p>Pertumbuhan sektor e-commerce dan fintech menjadi pendorong utama ekonomi digital. Berdasarkan laporan terbaru BPS, kontribusi sektor digital melampaui 12% dari total PDB nasional bulan ini...</p>"
    },
    "dampak-perubahan-iklim": {
        title: "Analisis: Dampak Perubahan Iklim terhadap Pertanian Jawa",
        author: "Dewi Lestari",
        category: "Lingkungan",
        date: "26 Feb 2026",
        image: "#43e97b",
        content: "<p>Kekeringan panjang dan pergeseran musim hujan mengancam stabilitas produksi beras di Pulau Jawa. Survei satelit menunjukkan penyusutan air irigasi di lima bendungan utama...</p>"
    }
};

type Props = {
    params: Promise<{ slug: string }>;
};

export default async function PostPage({ params }: Props) {
    // Tunggu params resolve sesuai Next.js 15
    const resolvedParams = await params;
    const slug = resolvedParams.slug;
    const post = dummyPosts[slug];

    if (!post) {
        // Kalau slug tidak ketemu, kembalikan 404
        notFound();
    }

    return (
        <article className="pub-article">
            <header className="pub-article-header">
                <div className="pub-card-meta" style={{ justifyContent: "center", display: "flex", gap: "8px" }}>
                    <Link href={`/category/${post.category.toLowerCase()}`}>{post.category}</Link>
                    <span style={{ color: "var(--pub-border)" }}>•</span>
                    <span style={{ color: "var(--pub-muted)" }}>{post.date}</span>
                </div>
                <h1 className="pub-article-title">{post.title}</h1>
                <div className="pub-article-author">
                    <div className="pub-article-avatar" style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", color: "#fff", background: "var(--pub-accent)" }}>
                        {post.author[0]}
                    </div>
                    <div>
                        Ditulis oleh <strong>{post.author}</strong><br />
                        <span style={{ fontSize: "12px" }}>Waktu baca: 3 menit</span>
                    </div>
                </div>
            </header>

            <div
                className="pub-article-hero"
                style={{ background: `linear-gradient(135deg, ${post.image}, #764ba2)` }}
            />

            <div
                className="pub-article-content"
                dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Share & Tags */}
            <footer style={{ marginTop: "60px", paddingTop: "24px", borderTop: "1px solid var(--pub-border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "24px" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                        <span style={{ fontFamily: "system-ui", fontSize: "13px", fontWeight: 600, color: "var(--pub-heading)" }}>Tags:</span>
                        {["breaking", "nasional", "kebijakan"].map(tag => (
                            <Link key={tag} href={`/tag/${tag}`} style={{ fontFamily: "system-ui", fontSize: "13px", color: "var(--pub-accent)", background: "var(--pub-surface)", padding: "2px 8px", borderRadius: "4px", textDecoration: "none" }}>
                                #{tag}
                            </Link>
                        ))}
                    </div>
                    <div style={{ display: "flex", gap: "12px" }}>
                        <span style={{ fontFamily: "system-ui", fontSize: "13px", fontWeight: 600, color: "var(--pub-heading)" }}>Bagikan:</span>
                        <button style={{ padding: "4px 12px", background: "#1DA1F2", color: "#fff", border: "none", borderRadius: "16px", cursor: "pointer", fontSize: "13px", fontFamily: "system-ui" }}>Twitter</button>
                        <button style={{ padding: "4px 12px", background: "#4267B2", color: "#fff", border: "none", borderRadius: "16px", cursor: "pointer", fontSize: "13px", fontFamily: "system-ui" }}>Facebook</button>
                        <button style={{ padding: "4px 12px", background: "#25D366", color: "#fff", border: "none", borderRadius: "16px", cursor: "pointer", fontSize: "13px", fontFamily: "system-ui" }}>WhatsApp</button>
                    </div>
                </div>
            </footer>
        </article>
    );
}
