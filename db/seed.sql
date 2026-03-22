-- MERPATI-CMS: Seed Data
-- Executed after init.sql during first setup.
-- __SUPER_USER_ID__ is replaced at runtime with the actual Super User's ID.
-- __SITE_TITLE__ and __SITE_TAGLINE__ are replaced from the setup form.

-- Options (Settings)
INSERT INTO options (key, value, autoload) VALUES
    ('site_title', '__SITE_TITLE__', true),
    ('site_tagline', '__SITE_TAGLINE__', true),
    ('is_initialized', 'true', true),
    ('site_contacts', '[]', true),
    ('telegram_bot_token', '', false),
    ('telegram_chat_id', '', false),
    ('telegram_notify_post', 'false', false),
    ('telegram_notify_user', 'false', false)
ON CONFLICT (key) DO NOTHING;

-- Default Categories
INSERT INTO terms (id, name, slug, taxonomy, description) VALUES
    ('cat-umum', 'Umum', 'umum', 'category', 'Kategori umum untuk artikel yang belum dikategorikan.')
ON CONFLICT (id) DO NOTHING;

-- Default Tags
INSERT INTO terms (id, name, slug, taxonomy, description) VALUES
    ('tag-berita', 'Berita', 'berita', 'tag', 'Tag untuk berita terkini.'),
    ('tag-opini', 'Opini', 'opini', 'tag', 'Tag untuk artikel opini.')
ON CONFLICT (id) DO NOTHING;

-- Mock Categories
INSERT INTO terms (id, name, slug, taxonomy, description) VALUES
    ('cat-architecture', 'Architecture', 'architecture', 'category', 'Artikel tentang arsitektur software dan sistem.'),
    ('cat-tutorial', 'Tutorial', 'tutorial', 'category', 'Panduan langkah demi langkah.'),
    ('cat-seo', 'SEO', 'seo', 'category', 'Optimasi mesin pencari dan strategi konten.'),
    ('cat-design', 'Design', 'design', 'category', 'Desain antarmuka dan pengalaman pengguna.'),
    ('cat-strategy', 'Strategy', 'strategy', 'category', 'Strategi media digital dan editorial.'),
    ('cat-performance', 'Performance', 'performance', 'category', 'Optimasi performa dan kecepatan.'),
    ('cat-editorial', 'Editorial', 'editorial', 'category', 'Opini editorial dan analisis industri.')
ON CONFLICT (id) DO NOTHING;

-- Mock Tags
INSERT INTO terms (id, name, slug, taxonomy, description) VALUES
    ('tag-serverless', 'Serverless', 'serverless', 'tag', ''),
    ('tag-nextjs', 'Next.js', 'nextjs', 'tag', ''),
    ('tag-wordpress', 'WordPress', 'wordpress', 'tag', ''),
    ('tag-seo', 'SEO', 'seo-tag', 'tag', ''),
    ('tag-mobile', 'Mobile', 'mobile', 'tag', ''),
    ('tag-ai', 'AI', 'ai', 'tag', ''),
    ('tag-webperf', 'Web Performance', 'web-performance', 'tag', ''),
    ('tag-newsletter', 'Newsletter', 'newsletter', 'tag', '')
ON CONFLICT (id) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════════════
-- WELCOME POST — Rich Format Demo
-- ═══════════════════════════════════════════════════════════════════════════

INSERT INTO posts (id, title, slug, content, excerpt, status, type, author_id, featured_image, created_at, updated_at) VALUES
    (
        'post-welcome',
        'Selamat Datang di MERPATI CMS',
        'selamat-datang-di-merpati',
'<h2>Media Editorial Ringkas, Praktis, Aman, Tetap Independen</h2>
<p>Selamat datang di <strong>MERPATI CMS</strong> — platform penerbitan digital modern yang dirancang khusus untuk jurnalis dan penerbit independen. MERPATI hadir sebagai alternatif WordPress yang ringan, cepat, dan sepenuhnya gratis.</p>
<blockquote><p>Kebebasan pers dimulai dari kemandirian infrastrukturnya. MERPATI menghilangkan beban biaya hosting sambil memberikan performa dan keamanan yang jauh lebih baik.</p></blockquote>

<h3>Fitur Utama</h3>
<ol>
<li><strong>Editor Klasik</strong> — Antarmuka penulisan yang familiar dengan dukungan format teks, heading, daftar, dan penyisipan media.</li>
<li><strong>Perpustakaan Media</strong> — Kelola gambar dan file media dengan mudah melalui upload langsung atau URL publik.</li>
<li><strong>Sistem Tema Modular</strong> — Tampilan frontend yang fleksibel dan dapat dikustomisasi menggunakan React Server Components.</li>
<li><strong>SEO Otomatis</strong> — Open Graph, Twitter Cards, JSON-LD, Sitemap, dan RSS Feed siap pakai.</li>
<li><strong>Notifikasi Telegram</strong> — Dapatkan pemberitahuan langsung di Telegram saat ada posting baru atau pengguna baru.</li>
</ol>

<h3>Arsitektur Serverless</h3>
<p>Dibangun di atas arsitektur <em>serverless</em>, MERPATI menggunakan stack teknologi modern:</p>
<table>
<thead><tr><th>Komponen</th><th>Teknologi</th><th>Fungsi</th></tr></thead>
<tbody>
<tr><td>Frontend</td><td>Next.js 16</td><td>React Server Components + ISR caching</td></tr>
<tr><td>Database</td><td>Neon Postgres</td><td>Serverless SQL database</td></tr>
<tr><td>Styling</td><td>Tailwind CSS v4</td><td>Utility-first CSS framework</td></tr>
<tr><td>Auth</td><td>NextAuth.js v5</td><td>OAuth + session management</td></tr>
<tr><td>Hosting</td><td>Vercel</td><td>Edge network + serverless functions</td></tr>
</tbody>
</table>

<h3>Contoh Kode</h3>
<p>Berikut contoh bagaimana MERPATI menggunakan <code>unstable_cache</code> untuk meng-cache query database:</p>
<pre><code>export const getCachedOption = unstable_cache(
    async (key: string) => {
        const result = await db
            .select({ value: options.value })
            .from(options)
            .where(eq(options.key, key))
            .limit(1)&#59;
        return result[0]?.value ?? null&#59;
    },
    ["site-option"],
    { revalidate: 3600, tags: ["site-options"] }
)&#59;</code></pre>

<hr>
<p>Mulailah menulis dan berbagi cerita Anda dengan dunia. Kunjungi <a href="/admin">dashboard admin</a> untuk mulai membuat konten.</p>',
        'Selamat datang di MERPATI CMS — platform penerbitan digital modern untuk jurnalis dan penerbit independen.',
        'published',
        'post',
        __SUPER_USER_ID__,
        'https://ogz548k8xc6tssmc.public.blob.vercel-storage.com/merpati-cms-banner-GxDJW9itzYo0sn51HCorGUn6i0q4IY.png',
        NOW(),
        NOW()
    )
ON CONFLICT (id) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════════════
-- MOCK POSTS — Rich Format Content
-- ═══════════════════════════════════════════════════════════════════════════

INSERT INTO posts (id, title, slug, content, excerpt, status, type, author_id, featured_image, created_at, updated_at) VALUES
('post-mock-1', 'Mengapa Serverless adalah Masa Depan Jurnalisme Digital', 'mengapa-serverless-adalah-masa-depan-jurnalisme-digital',
'<h2>Revolusi Infrastruktur Media</h2>
<p>Industri media sering kali terjebak dalam biaya infrastruktur yang membengkak seiring dengan naiknya trafik. Saat berita viral, server tradisional seringkali <strong>tumbang</strong> atau membutuhkan biaya skalabilitas yang sangat mahal.</p>
<blockquote><p>Dengan arsitektur serverless, Anda hanya membayar untuk apa yang Anda gunakan — dan dengan Free Tier, sering kali biayanya nol.</p></blockquote>

<h3>Perbandingan Biaya</h3>
<table>
<thead><tr><th>Aspek</th><th>Server Tradisional</th><th>Serverless</th></tr></thead>
<tbody>
<tr><td>Biaya bulanan</td><td>$50-500/bulan</td><td>$0 (Free Tier)</td></tr>
<tr><td>Skalabilitas</td><td>Manual, lambat</td><td>Otomatis, instan</td></tr>
<tr><td>Maintenance</td><td>Update OS, patch</td><td>Zero maintenance</td></tr>
<tr><td>Keamanan</td><td>Konfigurasi manual</td><td>Built-in</td></tr>
</tbody>
</table>

<h3>Keuntungan Utama</h3>
<ul>
<li><strong>Biaya Nol:</strong> Memanfaatkan Free Tier Vercel dengan optimal.</li>
<li><strong>Kecepatan Kilat:</strong> Sub-200ms page loads yang disukai Google.</li>
<li><strong>Keamanan:</strong> Tidak ada database tradisional yang bisa diinjeksi SQL secara konvensional.</li>
<li><strong>Auto-scaling:</strong> Tidak perlu khawatir saat trafik melonjak.</li>
</ul>

<h3>Implementasi di MERPATI</h3>
<p>MERPATI CMS menggunakan <code>Neon Serverless Postgres</code> sebagai database utama. Koneksi dilakukan melalui HTTP, bukan TCP, sehingga setiap request adalah stateless:</p>
<pre><code>import { neon } from "@neondatabase/serverless"&#59;
import { drizzle } from "drizzle-orm/neon-http"&#59;

const sql = neon(process.env.DATABASE_URL!)&#59;
export const db = drizzle(sql)&#59;</code></pre>

<p>Merpati CMS dibangun tepat di atas filosofi ini, memastikan <em>kebebasan pers dimulai dari kebebasan infrastruktur</em>.</p>',
'Meninggalkan server tradisional dan beralih ke arsitektur serverless memberikan kebebasan luar biasa bagi penerbit independen tanpa biaya hosting.',
'published', 'post', __SUPER_USER_ID__,
'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200',
'2026-03-12 10:00:00', '2026-03-12 10:00:00'),

('post-mock-2', 'Panduan Migrasi dari WordPress ke Merpati CMS', 'panduan-migrasi-dari-wordpress-ke-merpati-cms',
'<h2>Meninggalkan WordPress Tanpa Kehilangan SEO</h2>
<p>Banyak penerbit merasa terjebak dengan WordPress karena sejarah konten yang panjang. Namun, migrasi <strong>tidak harus menjadi mimpi buruk</strong>.</p>

<h3>Langkah-Langkah Migrasi</h3>
<ol>
<li><strong>Export konten WordPress</strong> — Gunakan plugin WP All Export untuk mengekspor semua post dan page ke format CSV.</li>
<li><strong>Mapping field</strong> — Sesuaikan kolom CSV dengan struktur database MERPATI:
<ul>
<li><code>post_title</code> → <code>title</code></li>
<li><code>post_name</code> → <code>slug</code></li>
<li><code>post_content</code> → <code>content</code></li>
<li><code>post_excerpt</code> → <code>excerpt</code></li>
</ul></li>
<li><strong>Import ke Neon</strong> — Jalankan script migrasi untuk memasukkan data ke database MERPATI.</li>
<li><strong>Redirect 301</strong> — Konfigurasi redirect agar URL lama tetap berfungsi.</li>
<li><strong>Verifikasi SEO</strong> — Pastikan semua meta tag, sitemap, dan structured data berfungsi.</li>
</ol>

<blockquote><p>Jangan biarkan platform usang menahan laju inovasi media Anda. Kecepatan adalah mata uang baru di dunia editorial digital.</p></blockquote>

<h3>Contoh Redirect Configuration</h3>
<pre><code>// next.config.ts
module.exports = {
  async redirects() {
    return [
      {
        source: "/wp-content/:path*",
        destination: "/media/:path*",
        permanent: true,
      },
    ]&#59;
  },
}&#59;</code></pre>

<p>Proses migrasi ke Merpati CMS telah disederhanakan melalui skrip import yang secara otomatis mengonversi format <code>wp_posts</code> menjadi struktur yang ramah SEO.</p>',
'Langkah demi langkah memindahkan ribuan artikel dari WordPress ke Merpati CMS tanpa kehilangan ranking SEO.',
'published', 'post', __SUPER_USER_ID__,
'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200',
'2026-03-10 10:00:00', '2026-03-10 10:00:00'),

('post-mock-3', 'Memaksimalkan SEO Native dengan JSON-LD Otomatis', 'memaksimalkan-seo-native-dengan-json-ld-otomatis',
'<h2>SEO Bukanlah Sekadar Kata Kunci</h2>
<p>SEO bukan lagi sekadar memasukkan kata kunci ke dalam teks. Mesin pencari modern membutuhkan <strong>konteks</strong>, dan cara terbaik memberikannya adalah melalui <a href="https://schema.org">JSON-LD structured data</a>.</p>

<h3>Apa itu JSON-LD?</h3>
<p><code>JSON-LD</code> (JavaScript Object Notation for Linked Data) adalah format yang direkomendasikan oleh Google untuk structured data. Format ini memungkinkan mesin pencari memahami konteks konten Anda tanpa harus mengurai HTML.</p>

<h3>Schema yang Dihasilkan MERPATI</h3>
<p>Setiap kali Anda menerbitkan artikel, sistem secara otomatis merakit schema berikut:</p>
<pre><code>{
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  "headline": "Judul Artikel Anda",
  "author": {
    "@type": "Person",
    "name": "Nama Penulis"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Nama Situs Anda"
  },
  "datePublished": "2026-03-08T10:00:00Z"
}</code></pre>

<h3>Dampak pada Performa SEO</h3>
<table>
<thead><tr><th>Metrik</th><th>Tanpa JSON-LD</th><th>Dengan JSON-LD</th></tr></thead>
<tbody>
<tr><td>Rich Snippets</td><td>Tidak muncul</td><td>✅ Muncul di SERP</td></tr>
<tr><td>Google News</td><td>Sulit masuk</td><td>✅ Eligible</td></tr>
<tr><td>Knowledge Graph</td><td>Tidak terindeks</td><td>✅ Terindeks</td></tr>
<tr><td>CTR rata-rata</td><td>2-3%</td><td>5-8%</td></tr>
</tbody>
</table>

<p>Ini memastikan artikel Anda memiliki peluang lebih tinggi untuk masuk ke <strong>Google Top Stories</strong> dan mendapatkan rich snippets yang menarik perhatian pembaca.</p>',
'Bagaimana MERPATI CMS menyuntikkan schema markup secara otomatis untuk mendominasi hasil pencarian Google.',
'published', 'post', __SUPER_USER_ID__,
'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200',
'2026-03-08 10:00:00', '2026-03-08 10:00:00'),

('post-mock-4', 'Desain Mobile-First untuk Pembaca Modern', 'desain-mobile-first-untuk-pembaca-modern',
'<h2>Jurnalisme Modern Terjadi di Lapangan</h2>
<p>Kami membuang paradigma lama di mana dashboard harus diakses melalui layar desktop yang lebar. Lebih dari <strong>80% pembaca berita</strong> mengakses melalui ponsel mereka.</p>

<h3>Prinsip Mobile-First</h3>
<p>Pendekatan mobile-first berarti kita mendesain untuk layar terkecil terlebih dahulu, kemudian <em>progressively enhance</em> untuk layar yang lebih besar:</p>
<ol>
<li><strong>Touch-first interactions</strong> — Semua tombol dan link memiliki area sentuh minimum 44px.</li>
<li><strong>Responsive typography</strong> — Ukuran font menyesuaikan layar dengan <code>clamp()</code> CSS.</li>
<li><strong>Lazy loading</strong> — Gambar dimuat hanya saat akan terlihat di viewport.</li>
<li><strong>Minimal JavaScript</strong> — React Server Components mengurangi bundle size drastis.</li>
</ol>

<h3>Contoh Responsive Typography</h3>
<pre><code>.article-body {
  font-size: 1.125rem&#59;     /* 18px - nyaman di mobile */
  line-height: 1.9&#59;        /* Longgar untuk keterbacaan */
}

.article-body h2 {
  font-size: clamp(1.5rem, 4vw, 2rem)&#59;
  margin-top: 2em&#59;
}</code></pre>

<blockquote><p>Dashboard penulisan dan antarmuka pembaca dirancang dengan pendekatan mobile-first. Anda bisa menulis, mengedit, dan menerbitkan langsung dari smartphone.</p></blockquote>

<h3>Statistik Mobile vs Desktop</h3>
<ul>
<li><strong>82%</strong> traffic berita berasal dari mobile</li>
<li><strong>3 detik</strong> — batas waktu loading sebelum 53% pengguna pergi</li>
<li><strong>70%</strong> peningkatan engagement dengan desain mobile-first</li>
</ul>',
'Lebih dari 80% pembaca berita mengakses melalui ponsel. MERPATI CMS mendesain antarmuka publik dan admin untuk mobile-first.',
'published', 'post', __SUPER_USER_ID__,
'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=1200',
'2026-03-05 10:00:00', '2026-03-05 10:00:00'),

('post-mock-5', 'Membangun Komunitas Pembaca Setia dengan Newsletter', 'membangun-komunitas-pembaca-setia-dengan-newsletter',
'<h2>Mengapa Newsletter Lebih Berharga dari Media Sosial</h2>
<p>Ketergantungan pada lalu lintas media sosial membuat banyak media <strong>rentan</strong> terhadap perubahan algoritma yang tiba-tiba. Jalan keluar terbaik adalah membangun saluran komunikasi langsung.</p>

<blockquote><p>Daftar email pembaca adalah aset paling berharga bagi media independen. Tidak ada algoritma yang bisa menghalangi Anda menjangkau audiens Anda sendiri.</p></blockquote>

<h3>Email vs Media Sosial</h3>
<table>
<thead><tr><th>Aspek</th><th>Email Newsletter</th><th>Media Sosial</th></tr></thead>
<tbody>
<tr><td>Reach</td><td>90-95% (inbox)</td><td>2-5% (algoritma)</td></tr>
<tr><td>Kontrol</td><td>Penuh</td><td>Bergantung platform</td></tr>
<tr><td>CTR rata-rata</td><td>15-25%</td><td>1-3%</td></tr>
<tr><td>Data ownership</td><td>Milik Anda</td><td>Milik platform</td></tr>
</tbody>
</table>

<h3>Strategi Newsletter yang Efektif</h3>
<ol>
<li><strong>Konsistensi</strong> — Kirim newsletter pada jadwal yang sama setiap minggu.</li>
<li><strong>Kurasi, bukan spam</strong> — Pilih 3-5 artikel terbaik, bukan semua konten.</li>
<li><strong>Personalisasi</strong> — Gunakan nama pembaca dan segmentasi berdasarkan minat.</li>
<li><strong>Call-to-action jelas</strong> — Setiap email harus punya tujuan yang spesifik.</li>
</ol>

<h3>Integrasi dengan MERPATI</h3>
<p>MERPATI CMS menyediakan <code>RSS Feed</code> otomatis di <code>/rss.xml</code> yang bisa dihubungkan dengan platform email seperti:</p>
<ul>
<li><a href="https://mailchimp.com">Mailchimp</a> — RSS-to-Email campaign</li>
<li><a href="https://buttondown.email">Buttondown</a> — Minimalis dan developer-friendly</li>
<li><a href="https://substack.com">Substack</a> — Platform newsletter lengkap</li>
</ul>

<p>Newsletter memberikan tingkat keterlibatan yang <em>jauh lebih tinggi</em> dibanding media sosial.</p>',
'Algoritma media sosial terus berubah. Pelajari mengapa memiliki daftar email pembaca adalah aset paling berharga bagi media independen.',
'published', 'post', __SUPER_USER_ID__,
'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?auto=format&fit=crop&q=80&w=1200',
'2026-02-28 10:00:00', '2026-02-28 10:00:00'),

('post-mock-6', 'Optimasi Core Web Vitals untuk Berita', 'optimasi-core-web-vitals-untuk-berita',
'<h2>Skor Hijau Sempurna di PageSpeed</h2>
<p>Situs berita sering kali lambat karena banyaknya iklan, pelacak, dan gambar yang tidak dioptimalkan. Google semakin memprioritaskan <strong>Core Web Vitals</strong> sebagai faktor ranking.</p>

<h3>Tiga Metrik Kunci</h3>
<ol>
<li><strong>LCP (Largest Contentful Paint)</strong> — Waktu render elemen terbesar. Target: <code>&lt; 2.5 detik</code>.</li>
<li><strong>FID (First Input Delay)</strong> — Waktu respons interaksi pertama. Target: <code>&lt; 100ms</code>.</li>
<li><strong>CLS (Cumulative Layout Shift)</strong> — Stabilitas visual. Target: <code>&lt; 0.1</code>.</li>
</ol>

<h3>Strategi Optimasi MERPATI</h3>
<table>
<thead><tr><th>Strategi</th><th>Metrik</th><th>Dampak</th></tr></thead>
<tbody>
<tr><td>React Server Components</td><td>LCP + FID</td><td>Zero JS bundle untuk konten statis</td></tr>
<tr><td>ISR Caching</td><td>LCP</td><td>Response ~90ms dari cache</td></tr>
<tr><td>Responsive images</td><td>LCP + CLS</td><td>Ukuran gambar sesuai viewport</td></tr>
<tr><td>Font preloading</td><td>CLS</td><td>Mencegah layout shift dari font swap</td></tr>
</tbody>
</table>

<h3>Contoh: Cache Configuration</h3>
<pre><code>// lib/queries/cache-timestamp.ts
export const getCacheTimestamp = unstable_cache(
    async () => new Date().toISOString(),
    ["cache-timestamp"],
    { revalidate: 3600, tags: ["site-options", "posts"] }
)&#59;</code></pre>

<blockquote><p>Dengan MERPATI CMS, setiap halaman publik di-cache selama 1 jam. Response time rata-rata hanya 90ms setelah cache terbentuk — 16x lebih cepat dari request pertama.</p></blockquote>

<h3>Hasil Benchmark</h3>
<ul>
<li><strong>Request pertama:</strong> ~1400ms (cold start + DB query ke Neon)</li>
<li><strong>Request selanjutnya:</strong> ~90ms (dari cache)</li>
<li><strong>PageSpeed Score:</strong> 95-100 di mobile dan desktop</li>
</ul>',
'Google semakin memprioritaskan pengalaman pengguna. Panduan mencapai skor hijau sempurna di PageSpeed tanpa mengorbankan fungsionalitas.',
'published', 'post', __SUPER_USER_ID__,
'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200',
'2026-02-25 10:00:00', '2026-02-25 10:00:00'),

('post-mock-7', 'Pentingnya Independensi Data di Era AI', 'pentingnya-independensi-data-di-era-ai',
'<h2>Konten Anda, Infrastruktur Anda</h2>
<p>Kita memasuki era di mana konten yang Anda terbitkan dapat dengan cepat dicerna dan didaur ulang oleh <strong>model bahasa besar (LLM)</strong>. Hal ini menimbulkan pertanyaan besar mengenai hak cipta dan monetisasi.</p>

<h3>Risiko Platform Tertutup</h3>
<p>Menerbitkan konten di platform tertutup berarti Anda menyerahkan kontrol:</p>
<ul>
<li><strong>Data ownership</strong> — Platform memiliki data Anda, bukan Anda.</li>
<li><strong>Monetisasi</strong> — Platform menentukan model revenue, bukan Anda.</li>
<li><strong>De-platforming</strong> — Akun Anda bisa ditutup kapan saja tanpa peringatan.</li>
<li><strong>AI training</strong> — Konten Anda digunakan untuk melatih AI tanpa kompensasi.</li>
</ul>

<blockquote><p>Memiliki infrastruktur Anda sendiri, alih-alih bergantung pada platform publikasi tertutup, memastikan Anda memiliki kendali penuh atas konten Anda.</p></blockquote>

<h3>Kontrol Bot Perayap</h3>
<p>Dengan MERPATI CMS, Anda memiliki kontrol penuh atas <code>robots.txt</code> dan tag meta:</p>
<pre><code># robots.txt — Blokir bot AI tertentu
User-agent: GPTBot
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: Google-Extended
Disallow: /</code></pre>

<h3>Self-Hosting vs SaaS</h3>
<table>
<thead><tr><th>Aspek</th><th>Self-Hosted (MERPATI)</th><th>SaaS Platform</th></tr></thead>
<tbody>
<tr><td>Data ownership</td><td>100% milik Anda</td><td>Milik platform</td></tr>
<tr><td>Portabilitas</td><td>Export kapan saja</td><td>Lock-in</td></tr>
<tr><td>Biaya jangka panjang</td><td>$0 (Free Tier)</td><td>$10-100/bulan</td></tr>
<tr><td>Kontrol AI crawling</td><td>Penuh</td><td>Terbatas</td></tr>
</tbody>
</table>

<p>Di era AI, <em>independensi data bukan lagi kemewahan — tapi kebutuhan</em>.</p>',
'Saat model AI mengambil konten dari web tanpa kompensasi, melindungi data dan infrastruktur Anda sendiri menjadi lebih penting dari sebelumnya.',
'published', 'post', __SUPER_USER_ID__,
'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1200',
'2026-02-20 10:00:00', '2026-02-20 10:00:00')
ON CONFLICT (id) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════════════
-- PAGES — Rich Format Demo
-- ═══════════════════════════════════════════════════════════════════════════

INSERT INTO posts (id, title, slug, content, excerpt, status, type, author_id, created_at, updated_at) VALUES
    (
        'page-tentang',
        'Tentang MERPATI',
        'tentang',
'<h2>Tentang MERPATI CMS</h2>
<p><strong>MERPATI</strong> adalah singkatan dari <em>Media Editorial Ringkas, Praktis, Aman, Tetap Independen</em>.</p>

<blockquote><p>Platform ini dirancang untuk memberikan pengalaman penerbitan digital yang familiar bagi pengguna WordPress, namun dengan arsitektur modern berbasis serverless.</p></blockquote>

<h3>Misi Kami</h3>
<p>Menyediakan infrastruktur penerbitan yang <strong>mandiri</strong> dan <strong>gratis</strong> bagi jurnalis dan penerbit digital, karena kami percaya bahwa kebebasan pers dimulai dari kemandirian infrastrukturnya.</p>

<h3>Teknologi</h3>
<table>
<thead><tr><th>Layer</th><th>Teknologi</th><th>Peran</th></tr></thead>
<tbody>
<tr><td>Framework</td><td>Next.js 16</td><td>Full-stack React framework</td></tr>
<tr><td>Database</td><td>Neon Postgres</td><td>Serverless SQL</td></tr>
<tr><td>ORM</td><td>Drizzle ORM</td><td>Type-safe database queries</td></tr>
<tr><td>Auth</td><td>NextAuth.js v5</td><td>Google OAuth + session</td></tr>
<tr><td>UI Admin</td><td>shadcn/ui</td><td>Component library</td></tr>
<tr><td>Hosting</td><td>Vercel</td><td>Edge deployment</td></tr>
</tbody>
</table>

<h3>Fitur Lengkap</h3>
<ol>
<li><strong>Multi-user dengan role</strong> — Super User dan User biasa.</li>
<li><strong>Editor WYSIWYG</strong> — TipTap-based dengan toolbar familiar.</li>
<li><strong>Media Library</strong> — Upload dan manage gambar via Vercel Blob.</li>
<li><strong>SEO otomatis</strong> — Open Graph, Twitter Cards, JSON-LD, Sitemap, RSS.</li>
<li><strong>Sistem Tema</strong> — Theme switching via environment variable.</li>
<li><strong>Caching layer</strong> — <code>unstable_cache</code> untuk performa optimal.</li>
<li><strong>Notifikasi Telegram</strong> — Real-time notification untuk konten baru.</li>
</ol>

<h3>Open Source</h3>
<p>MERPATI CMS sepenuhnya <a href="https://github.com">open source</a>. Anda bebas menggunakan, memodifikasi, dan mendistribusikannya.</p>

<hr>
<p><em>Dibangun dengan ❤️ untuk kebebasan pers.</em></p>',
        'Tentang MERPATI CMS — Media Editorial Ringkas, Praktis, Aman, Tetap Independen.',
        'published',
        'page',
        __SUPER_USER_ID__,
        NOW(),
        NOW()
    )
ON CONFLICT (id) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════════════
-- TERM RELATIONSHIPS (Post ↔ Category & Tag)
-- ═══════════════════════════════════════════════════════════════════════════

INSERT INTO term_relationships (object_id, term_id) VALUES
    ('post-welcome', 'cat-umum'),
    ('post-welcome', 'tag-berita'),
    ('post-mock-1', 'cat-architecture'),
    ('post-mock-1', 'tag-serverless'),
    ('post-mock-1', 'tag-nextjs'),
    ('post-mock-2', 'cat-tutorial'),
    ('post-mock-2', 'tag-wordpress'),
    ('post-mock-2', 'tag-seo'),
    ('post-mock-3', 'cat-seo'),
    ('post-mock-3', 'tag-seo'),
    ('post-mock-3', 'tag-nextjs'),
    ('post-mock-4', 'cat-design'),
    ('post-mock-4', 'tag-mobile'),
    ('post-mock-5', 'cat-strategy'),
    ('post-mock-5', 'tag-newsletter'),
    ('post-mock-6', 'cat-performance'),
    ('post-mock-6', 'tag-webperf'),
    ('post-mock-6', 'tag-nextjs'),
    ('post-mock-7', 'cat-editorial'),
    ('post-mock-7', 'tag-ai')
ON CONFLICT (object_id, term_id) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════════════
-- POST RELATIONSHIPS (Related Posts)
-- Each post has 3 related posts for sidebar display
-- ═══════════════════════════════════════════════════════════════════════════

INSERT INTO post_relationships (post_id, related_post_id) VALUES
    -- Welcome → mock 1, 6, 7
    ('post-welcome', 'post-mock-1'),
    ('post-welcome', 'post-mock-6'),
    ('post-welcome', 'post-mock-7'),
    -- Serverless → welcome, 6, 7
    ('post-mock-1', 'post-welcome'),
    ('post-mock-1', 'post-mock-6'),
    ('post-mock-1', 'post-mock-7'),
    -- WordPress Migration → 3, 6, welcome
    ('post-mock-2', 'post-mock-3'),
    ('post-mock-2', 'post-mock-6'),
    ('post-mock-2', 'post-welcome'),
    -- SEO JSON-LD → 2, 6, 4
    ('post-mock-3', 'post-mock-2'),
    ('post-mock-3', 'post-mock-6'),
    ('post-mock-3', 'post-mock-4'),
    -- Mobile-First → 6, 3, 5
    ('post-mock-4', 'post-mock-6'),
    ('post-mock-4', 'post-mock-3'),
    ('post-mock-4', 'post-mock-5'),
    -- Newsletter → 7, 4, 2
    ('post-mock-5', 'post-mock-7'),
    ('post-mock-5', 'post-mock-4'),
    ('post-mock-5', 'post-mock-2'),
    -- Core Web Vitals → 1, 4, 3
    ('post-mock-6', 'post-mock-1'),
    ('post-mock-6', 'post-mock-4'),
    ('post-mock-6', 'post-mock-3'),
    -- Independensi Data → 1, 5, welcome
    ('post-mock-7', 'post-mock-1'),
    ('post-mock-7', 'post-mock-5'),
    ('post-mock-7', 'post-welcome')
ON CONFLICT (post_id, related_post_id) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════════════
-- MENUS
-- ═══════════════════════════════════════════════════════════════════════════

INSERT INTO menus (id, name, slug, location) VALUES
    ('menu-main', 'Menu Utama', 'menu-utama', 'primary'),
    ('menu-footer', 'Menu Footer', 'menu-footer', 'footer')
ON CONFLICT (id) DO NOTHING;

INSERT INTO menu_items (id, menu_id, title, url, object_id, type, sort_order) VALUES
    ('mi-home', 'menu-main', 'Beranda', '/', NULL, 'custom', 0),
    ('mi-tentang', 'menu-main', 'Tentang', NULL, 'page-tentang', 'page', 1),
    ('mi-footer-home', 'menu-footer', 'Beranda', '/', NULL, 'custom', 0),
    ('mi-footer-tentang', 'menu-footer', 'Tentang', NULL, 'page-tentang', 'page', 1)
ON CONFLICT (id) DO NOTHING;
