import Link from "next/link";
import { db } from "@/db";
import { redirect } from "next/navigation";

const dummyPosts = [
    { slug: "kebijakan-energi-baru", title: "Breaking: Kebijakan Energi Baru Diumumkan Pemerintah", category: "Politik", date: "28 Feb 2026", excerpt: "Pemerintah secara resmi mengumumkan peta jalan transisi energi menuju emisi nol bersih pada tahun 2050...", image: "#667eea" },
    { slug: "ekonomi-digital-tumbuh", title: "Ekonomi Digital Indonesia Tumbuh 30% di Kuartal Pertama", category: "Ekonomi", date: "27 Feb 2026", excerpt: "Pertumbuhan sektor e-commerce dan fintech menjadi pendorong utama ekonomi digital yang tumbuh melampaui prediksi analis...", image: "#fa709a" },
    { slug: "dampak-perubahan-iklim", title: "Analisis: Dampak Perubahan Iklim terhadap Pertanian Jawa", category: "Lingkungan", date: "26 Feb 2026", excerpt: "Kekeringan panjang dan pergeseran musim hujan mengancam stabilitas produksi beras di Pulau Jawa...", image: "#43e97b" },
    { slug: "timnas-garuda-menang", title: "Olahraga: Timnas Garuda Menang 3-0 di Kualifikasi Piala Dunia", category: "Olahraga", date: "24 Feb 2026", excerpt: "Kemenangan telak atas tim tamu membuka peluang Indonesia lolos ke putaran ketiga kualifikasi...", image: "#fbc2eb" },
    { slug: "festival-batik-nasional", title: "Budaya: Festival Batik Nasional Digelar di Solo", category: "Budaya", date: "23 Feb 2026", excerpt: "Ribuan pengrajin dari seluruh Indonesia berkumpul merayakan hari batik dengan karya-karya inovatif kombinasi motif modern...", image: "#a18cd1" },
];

export const dynamic = "force-dynamic";

export default async function HomePage() {
    try {
        const firstUser = await db.query.users.findFirst();
        if (!firstUser) {
            redirect("/setup");
        }
    } catch {
        // fail silently if DB isn't init
    }
    const featuredPost = dummyPosts[0];
    const regularPosts = dummyPosts.slice(1);

    return (
        <div className="pub-home-grid">
            {/* Featured Articles Column */}
            <div>
                <h2 style={{ fontFamily: "system-ui", fontSize: "16px", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "24px", color: "var(--pub-heading)", borderBottom: "2px solid var(--pub-accent)", paddingBottom: "8px", display: "inline-block" }}>
                    Laporan Utama
                </h2>

                <div className="pub-card" style={{ marginBottom: "48px" }}>
                    <Link href={`/${featuredPost.slug}`}>
                        <div className="pub-card-image" style={{ background: `linear-gradient(135deg, ${featuredPost.image}, #764ba2)` }} />
                    </Link>
                    <div className="pub-card-meta">
                        <Link href={`/category/${featuredPost.category.toLowerCase()}`}>{featuredPost.category}</Link> • {featuredPost.date}
                    </div>
                    <h3 className="pub-card-title" style={{ fontSize: "36px" }}>
                        <Link href={`/${featuredPost.slug}`}>{featuredPost.title}</Link>
                    </h3>
                    <p className="pub-card-excerpt" style={{ fontSize: "18px" }}>
                        {featuredPost.excerpt}
                    </p>
                </div>

                <h2 style={{ fontFamily: "system-ui", fontSize: "16px", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "24px", color: "var(--pub-heading)", borderBottom: "2px solid var(--pub-border)", paddingBottom: "8px" }}>
                    Berita Terkini
                </h2>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
                    {regularPosts.map((post) => (
                        <div key={post.slug} className="pub-card">
                            <Link href={`/${post.slug}`}>
                                <div className="pub-card-image" style={{ aspectRatio: "4/3", background: `linear-gradient(135deg, ${post.image}, #764ba2)` }} />
                            </Link>
                            <div className="pub-card-meta">
                                <Link href={`/category/${post.category.toLowerCase()}`}>{post.category}</Link> • {post.date}
                            </div>
                            <h3 className="pub-card-title" style={{ fontSize: "20px" }}>
                                <Link href={`/${post.slug}`}>{post.title}</Link>
                            </h3>
                            <p className="pub-card-excerpt" style={{ fontSize: "15px" }}>
                                {post.excerpt}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sidebar Column */}
            <aside>
                <div style={{ position: "sticky", top: "120px" }}>
                    <div style={{ padding: "24px", background: "var(--pub-surface)", borderRadius: "8px", marginBottom: "32px" }}>
                        <h3 style={{ fontFamily: "system-ui", fontSize: "18px", color: "var(--pub-heading)", marginBottom: "16px" }}>
                            Berlangganan Newsletter
                        </h3>
                        <p style={{ fontSize: "14px", color: "var(--pub-muted)", marginBottom: "16px", lineHeight: 1.6 }}>
                            Dapatkan ringkasan berita terpenting setiap pagi langsung di email Anda.
                        </p>
                        <form style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                            <input type="email" placeholder="Alamat email..." style={{ padding: "10px 14px", borderRadius: "4px", border: "1px solid var(--pub-border)", fontSize: "14px" }} />
                            <button type="button" style={{ padding: "10px", background: "var(--pub-accent)", color: "#fff", border: "none", borderRadius: "4px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>Daftar</button>
                        </form>
                    </div>

                    <h3 style={{ fontFamily: "system-ui", fontSize: "16px", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "20px", color: "var(--pub-heading)" }}>
                        Populer Minggu Ini
                    </h3>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "16px" }}>
                        {[1, 2, 3, 4, 5].map((num) => (
                            <li key={num} style={{ display: "flex", gap: "16px", alignItems: "flex-start", borderBottom: num !== 5 ? "1px solid var(--pub-border)" : "none", paddingBottom: num !== 5 ? "16px" : "0" }}>
                                <div style={{ fontFamily: "system-ui", fontSize: "32px", fontWeight: 800, color: "var(--pub-border)", lineHeight: 1 }}>{num}</div>
                                <div>
                                    <h4 style={{ fontSize: "16px", margin: "0 0 6px", color: "var(--pub-heading)", lineHeight: 1.4 }}>
                                        <Link href={`/${dummyPosts[num % dummyPosts.length].slug}`} style={{ color: "inherit", textDecoration: "none" }}>
                                            {dummyPosts[num % dummyPosts.length].title}
                                        </Link>
                                    </h4>
                                    <div style={{ fontFamily: "system-ui", fontSize: "11px", color: "var(--pub-accent)", textTransform: "uppercase", fontWeight: 600 }}>
                                        {dummyPosts[num % dummyPosts.length].category}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>
        </div>
    );
}
