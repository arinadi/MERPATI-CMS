import Link from "next/link";
import { notFound } from "next/navigation";

const dummyPosts = [
    { slug: "kebijakan-energi-baru", title: "Breaking: Kebijakan Energi Baru Diumumkan Pemerintah", category: "Politik", date: "28 Feb 2026", excerpt: "Pemerintah secara resmi mengumumkan peta jalan transisi energi menuju emisi nol bersih pada tahun 2050...", image: "#667eea" },
    { slug: "ekonomi-digital-tumbuh", title: "Ekonomi Digital Indonesia Tumbuh 30% di Kuartal Pertama", category: "Ekonomi", date: "27 Feb 2026", excerpt: "Pertumbuhan sektor e-commerce dan fintech menjadi pendorong utama ekonomi digital yang tumbuh melampaui prediksi analis...", image: "#fa709a" },
    { slug: "dampak-perubahan-iklim", title: "Analisis: Dampak Perubahan Iklim terhadap Pertanian Jawa", category: "Lingkungan", date: "26 Feb 2026", excerpt: "Kekeringan panjang dan pergeseran musim hujan mengancam stabilitas produksi beras di Pulau Jawa...", image: "#43e97b" },
];

type Props = {
    params: Promise<{ slug: string }>;
};

export default async function CategoryPage({ params }: Props) {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;

    // Format slug ke kata kapital (politik -> Politik)
    const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1);

    // Ambil post untuk kategori ini (dummy: panggil post yang seolah-olah cocok)
    const posts = dummyPosts; // Dalam praktiknya, filter melalui query DB

    const validCategories = ["nasional", "ekonomi", "politik", "teknologi", "olahraga", "opini", "budaya", "lingkungan"];
    if (!validCategories.includes(slug)) {
        notFound();
    }

    return (
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <header style={{ marginBottom: "48px", textAlign: "center" }}>
                <h1 style={{ fontSize: "40px", color: "var(--pub-heading)", marginBottom: "16px" }}>
                    Kategori: {categoryName}
                </h1>
                <p style={{ fontSize: "16px", color: "var(--pub-muted)", fontFamily: "system-ui, sans-serif" }}>
                    Menampilkan artikel terbaru dari rubrik {categoryName}.
                </p>
            </header>

            <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
                {posts.map((post) => (
                    <article key={post.slug} style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>
                        <Link href={`/${post.slug}`} style={{ flexShrink: 0, width: "240px" }}>
                            <div style={{ width: "100%", aspectRatio: "4/3", background: `linear-gradient(135deg, ${post.image}, #764ba2)`, borderRadius: "4px" }} />
                        </Link>
                        <div>
                            <div className="pub-card-meta" style={{ marginBottom: "8px" }}>
                                <span style={{ color: "var(--pub-muted)" }}>{post.date}</span>
                            </div>
                            <h2 className="pub-card-title" style={{ fontSize: "24px", marginBottom: "12px" }}>
                                <Link href={`/${post.slug}`}>{post.title}</Link>
                            </h2>
                            <p className="pub-card-excerpt" style={{ fontSize: "16px", margin: 0 }}>
                                {post.excerpt}
                            </p>
                        </div>
                    </article>
                ))}
            </div>

            <div style={{ marginTop: "48px", textAlign: "center" }}>
                <button style={{ padding: "12px 24px", background: "none", border: "1px solid var(--pub-border)", borderRadius: "24px", fontFamily: "system-ui, sans-serif", fontSize: "14px", fontWeight: 600, color: "var(--pub-heading)", cursor: "pointer" }}>
                    Muat Lebih Banyak
                </button>
            </div>
        </div>
    );
}
