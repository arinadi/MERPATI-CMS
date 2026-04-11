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

-- MOCK CATEGORIES (TEKNOLOGI & PUBLISHING)
INSERT INTO terms (id, name, slug, taxonomy, description) VALUES
    ('-cat-1', 'Architecture', 'architecture', 'category', 'Artikel tentang arsitektur software dan sistem.'),
    ('-cat-2', 'Tutorial', 'tutorial', 'category', 'Panduan langkah demi langkah penggunaan CMS.'),
    ('-cat-3', 'SEO', 'seo', 'category', 'Optimasi mesin pencari dan strategi konten.'),
    ('-cat-4', 'Design', 'design', 'category', 'Desain antarmuka dan pengalaman pengguna.'),
    ('-cat-5', 'Strategy', 'strategy', 'category', 'Strategi media digital dan editorial independen.'),
    ('-cat-6', 'Performance', 'performance', 'category', 'Optimasi performa dan kecepatan web.'),
    ('-cat-7', 'Editorial', 'editorial', 'category', 'Opini editorial dan analisis industri media.')
ON CONFLICT (id) DO NOTHING;

-- MOCK POSTS (CLEANUP-FRIENDLY NEGATIVE IDS)
INSERT INTO posts (id, title, slug, content, excerpt, status, type, author_id, featured_image, created_at, updated_at) VALUES
('-1', 'Mengapa Serverless adalah Masa Depan Jurnalisme Digital', 'architecture-mock-1', '<h2>Pendahuluan</h2>
<p>Industri media sering kali terjebak dalam biaya infrastruktur yang membengkak seiring dengan naiknya trafik.</p>
<p>Dalam ranah <strong>Architecture</strong>, pendekatan modern telah membuktikan bahwa kecepatan dan skalabilitas bisa didapat dengan <em>zero configuration</em> asal kita memilih stack teknologi yang tepat.</p>
<p><em>Tulisan dummy bernomor ID 1 ini merupakan pelengkap data untuk memastikan tema editorial Anda dapat mendemonstrasikan layout dengan konten yang relevan.</em></p>
<h3>Arsitektur & Konsep</h3>
<p>Menggunakan Next.js App Router dan Drizzle ORM, aliran data dari serverless database dapat sampai ke client dalam sub-200ms. Keberhasilan ini juga bergantung pada edge latency.</p>
<ul>
<li>Zero-bundle Javascript berkat RSC</li>
<li>Sistem Cache yang cerdas dan tervalidasi menggunakan <code>unstable_cache</code></li>
<li>Database ringan via poolless connection</li>
</ul>
<blockquote><p>Inovasi sejati terjadi saat kompleksitas backend tidak lagi menghalangi jurnalis dalam merilis laporan beritanya.</p></blockquote>', 'Industri media sering kali terjebak dalam biaya infrastruktur yang membengkak seiring dengan naiknya trafik. Artikel ini membahas studi kasus dan praktik terbaik mengenai mengapa serverless adalah masa depan jurnalisme digital.', 'published', 'post', __SUPER_USER_ID__, '{"url":"https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200","alt_text":"Ilustrasi Architecture Content (Unsplash)"}', '2026-04-09 18:00:00', '2026-04-09 18:00:00'),
('-2', 'Panduan Migrasi dari WordPress ke Merpati CMS', 'architecture-mock-2', '<h2>Pendahuluan</h2>
<p>Banyak penerbit merasa terjebak dengan WordPress karena sejarah konten yang panjang. Namun, migrasi tidak harus menjadi mimpi buruk.</p>
<p>Dalam ranah <strong>Architecture</strong>, pendekatan modern telah membuktikan bahwa kecepatan dan skalabilitas bisa didapat dengan <em>zero configuration</em> asal kita memilih stack teknologi yang tepat.</p>
<p><em>Tulisan dummy bernomor ID 2 ini merupakan pelengkap data untuk memastikan tema editorial Anda dapat mendemonstrasikan layout dengan konten yang relevan.</em></p>
<h3>Arsitektur & Konsep</h3>
<p>Menggunakan Next.js App Router dan Drizzle ORM, aliran data dari serverless database dapat sampai ke client dalam sub-200ms. Keberhasilan ini juga bergantung pada edge latency.</p>
<ul>
<li>Zero-bundle Javascript berkat RSC</li>
<li>Sistem Cache yang cerdas dan tervalidasi menggunakan <code>unstable_cache</code></li>
<li>Database ringan via poolless connection</li>
</ul>
<blockquote><p>Inovasi sejati terjadi saat kompleksitas backend tidak lagi menghalangi jurnalis dalam merilis laporan beritanya.</p></blockquote>', 'Banyak penerbit merasa terjebak dengan WordPress karena sejarah konten yang panjang. Namun, migrasi tidak harus menjadi mimpi buruk. Artikel ini membahas studi kasus dan praktik terbaik mengenai panduan migrasi dari wordpress ke merpati cms.', 'published', 'post', __SUPER_USER_ID__, '{"url":"https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200","alt_text":"Ilustrasi Architecture Content (Unsplash)"}', '2026-04-09 12:00:00', '2026-04-09 12:00:00'),
('-3', 'Memaksimalkan SEO Native dengan JSON-LD Otomatis', 'architecture-mock-3', '<h2>Pendahuluan</h2>
<p>SEO bukan lagi sekadar memasukkan kata kunci ke dalam teks. Mesin pencari modern membutuhkan konteks.</p>
<p>Dalam ranah <strong>Architecture</strong>, pendekatan modern telah membuktikan bahwa kecepatan dan skalabilitas bisa didapat dengan <em>zero configuration</em> asal kita memilih stack teknologi yang tepat.</p>
<p><em>Tulisan dummy bernomor ID 3 ini merupakan pelengkap data untuk memastikan tema editorial Anda dapat mendemonstrasikan layout dengan konten yang relevan.</em></p>
<h3>Arsitektur & Konsep</h3>
<p>Menggunakan Next.js App Router dan Drizzle ORM, aliran data dari serverless database dapat sampai ke client dalam sub-200ms. Keberhasilan ini juga bergantung pada edge latency.</p>
<ul>
<li>Zero-bundle Javascript berkat RSC</li>
<li>Sistem Cache yang cerdas dan tervalidasi menggunakan <code>unstable_cache</code></li>
<li>Database ringan via poolless connection</li>
</ul>
<blockquote><p>Inovasi sejati terjadi saat kompleksitas backend tidak lagi menghalangi jurnalis dalam merilis laporan beritanya.</p></blockquote>', 'SEO bukan lagi sekadar memasukkan kata kunci ke dalam teks. Mesin pencari modern membutuhkan konteks. Artikel ini membahas studi kasus dan praktik terbaik mengenai memaksimalkan seo native dengan json-ld otomatis.', 'published', 'post', __SUPER_USER_ID__, '{"url":"https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200","alt_text":"Ilustrasi Architecture Content (Unsplash)"}', '2026-04-09 06:00:00', '2026-04-09 06:00:00'),
('-4', 'Desain Mobile-First untuk Pembaca Modern', 'architecture-mock-4', '<h2>Pendahuluan</h2>
<p>Kami membuang paradigma lama di mana dashboard harus diakses melalui layar desktop yang lebar.</p>
<p>Dalam ranah <strong>Architecture</strong>, pendekatan modern telah membuktikan bahwa kecepatan dan skalabilitas bisa didapat dengan <em>zero configuration</em> asal kita memilih stack teknologi yang tepat.</p>
<p><em>Tulisan dummy bernomor ID 4 ini merupakan pelengkap data untuk memastikan tema editorial Anda dapat mendemonstrasikan layout dengan konten yang relevan.</em></p>
<h3>Arsitektur & Konsep</h3>
<p>Menggunakan Next.js App Router dan Drizzle ORM, aliran data dari serverless database dapat sampai ke client dalam sub-200ms. Keberhasilan ini juga bergantung pada edge latency.</p>
<ul>
<li>Zero-bundle Javascript berkat RSC</li>
<li>Sistem Cache yang cerdas dan tervalidasi menggunakan <code>unstable_cache</code></li>
<li>Database ringan via poolless connection</li>
</ul>
<blockquote><p>Inovasi sejati terjadi saat kompleksitas backend tidak lagi menghalangi jurnalis dalam merilis laporan beritanya.</p></blockquote>', 'Kami membuang paradigma lama di mana dashboard harus diakses melalui layar desktop yang lebar. Artikel ini membahas studi kasus dan praktik terbaik mengenai desain mobile-first untuk pembaca modern.', 'published', 'post', __SUPER_USER_ID__, '{"url":"https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1200","alt_text":"Ilustrasi Architecture Content (Unsplash)"}', '2026-04-09 00:00:00', '2026-04-09 00:00:00'),
('-5', 'Membangun Komunitas Pembaca Setia dengan Newsletter', 'architecture-mock-5', '<h2>Pendahuluan</h2>
<p>Ketergantungan pada lalu lintas media sosial membuat banyak media rentan terhadap perubahan algoritma yang tiba-tiba.</p>
<p>Dalam ranah <strong>Architecture</strong>, pendekatan modern telah membuktikan bahwa kecepatan dan skalabilitas bisa didapat dengan <em>zero configuration</em> asal kita memilih stack teknologi yang tepat.</p>
<p><em>Tulisan dummy bernomor ID 5 ini merupakan pelengkap data untuk memastikan tema editorial Anda dapat mendemonstrasikan layout dengan konten yang relevan.</em></p>
<h3>Arsitektur & Konsep</h3>
<p>Menggunakan Next.js App Router dan Drizzle ORM, aliran data dari serverless database dapat sampai ke client dalam sub-200ms. Keberhasilan ini juga bergantung pada edge latency.</p>
<ul>
<li>Zero-bundle Javascript berkat RSC</li>
<li>Sistem Cache yang cerdas dan tervalidasi menggunakan <code>unstable_cache</code></li>
<li>Database ringan via poolless connection</li>
</ul>
<blockquote><p>Inovasi sejati terjadi saat kompleksitas backend tidak lagi menghalangi jurnalis dalam merilis laporan beritanya.</p></blockquote>', 'Ketergantungan pada lalu lintas media sosial membuat banyak media rentan terhadap perubahan algoritma yang tiba-tiba. Artikel ini membahas studi kasus dan praktik terbaik mengenai membangun komunitas pembaca setia dengan newsletter.', 'published', 'post', __SUPER_USER_ID__, '{"url":"https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200","alt_text":"Ilustrasi Architecture Content (Unsplash)"}', '2026-04-08 18:00:00', '2026-04-08 18:00:00'),
('-6', 'Optimasi Core Web Vitals untuk Portal Berita', 'architecture-mock-6', '<h2>Pendahuluan</h2>
<p>Situs berita sering kali lambat karena banyaknya iklan, pelacak, dan gambar yang tidak dioptimalkan.</p>
<p>Dalam ranah <strong>Architecture</strong>, pendekatan modern telah membuktikan bahwa kecepatan dan skalabilitas bisa didapat dengan <em>zero configuration</em> asal kita memilih stack teknologi yang tepat.</p>
<p><em>Tulisan dummy bernomor ID 6 ini merupakan pelengkap data untuk memastikan tema editorial Anda dapat mendemonstrasikan layout dengan konten yang relevan.</em></p>
<h3>Arsitektur & Konsep</h3>
<p>Menggunakan Next.js App Router dan Drizzle ORM, aliran data dari serverless database dapat sampai ke client dalam sub-200ms. Keberhasilan ini juga bergantung pada edge latency.</p>
<ul>
<li>Zero-bundle Javascript berkat RSC</li>
<li>Sistem Cache yang cerdas dan tervalidasi menggunakan <code>unstable_cache</code></li>
<li>Database ringan via poolless connection</li>
</ul>
<blockquote><p>Inovasi sejati terjadi saat kompleksitas backend tidak lagi menghalangi jurnalis dalam merilis laporan beritanya.</p></blockquote>', 'Situs berita sering kali lambat karena banyaknya iklan, pelacak, dan gambar yang tidak dioptimalkan. Artikel ini membahas studi kasus dan praktik terbaik mengenai optimasi core web vitals untuk portal berita.', 'published', 'post', __SUPER_USER_ID__, '{"url":"https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200","alt_text":"Ilustrasi Architecture Content (Unsplash)"}', '2026-04-08 12:00:00', '2026-04-08 12:00:00'),
('-7', 'Pentingnya Independensi Data Media di Era AI', 'tutorial-mock-7', '<h2>Pendahuluan</h2>
<p>Kita memasuki era di mana konten yang Anda terbitkan dapat dengan cepat dicerna dan didaur ulang oleh model AI.</p>
<p>Dalam ranah <strong>Tutorial</strong>, pendekatan modern telah membuktikan bahwa kecepatan dan skalabilitas bisa didapat dengan <em>zero configuration</em> asal kita memilih stack teknologi yang tepat.</p>
<p><em>Tulisan dummy bernomor ID 7 ini merupakan pelengkap data untuk memastikan tema editorial Anda dapat mendemonstrasikan layout dengan konten yang relevan.</em></p>
<h3>Arsitektur & Konsep</h3>
<p>Menggunakan Next.js App Router dan Drizzle ORM, aliran data dari serverless database dapat sampai ke client dalam sub-200ms. Keberhasilan ini juga bergantung pada edge latency.</p>
<ul>
<li>Zero-bundle Javascript berkat RSC</li>
<li>Sistem Cache yang cerdas dan tervalidasi menggunakan <code>unstable_cache</code></li>
<li>Database ringan via poolless connection</li>
</ul>
<blockquote><p>Inovasi sejati terjadi saat kompleksitas backend tidak lagi menghalangi jurnalis dalam merilis laporan beritanya.</p></blockquote>', 'Kita memasuki era di mana konten yang Anda terbitkan dapat dengan cepat dicerna dan didaur ulang oleh model AI. Artikel ini membahas studi kasus dan praktik terbaik mengenai pentingnya independensi data media di era ai.', 'published', 'post', __SUPER_USER_ID__, '{"url":"https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200","alt_text":"Ilustrasi Tutorial Content (Unsplash)"}', '2026-04-08 06:00:00', '2026-04-08 06:00:00'),
('-8', 'Meningkatkan Engagement dengan Tampilan Clean Mode', 'tutorial-mock-8', '<h2>Pendahuluan</h2>
<p>Industri media sering kali terjebak dalam biaya infrastruktur yang membengkak seiring dengan naiknya trafik.</p>
<p>Dalam ranah <strong>Tutorial</strong>, pendekatan modern telah membuktikan bahwa kecepatan dan skalabilitas bisa didapat dengan <em>zero configuration</em> asal kita memilih stack teknologi yang tepat.</p>
<p><em>Tulisan dummy bernomor ID 8 ini merupakan pelengkap data untuk memastikan tema editorial Anda dapat mendemonstrasikan layout dengan konten yang relevan.</em></p>
<h3>Arsitektur & Konsep</h3>
<p>Menggunakan Next.js App Router dan Drizzle ORM, aliran data dari serverless database dapat sampai ke client dalam sub-200ms. Keberhasilan ini juga bergantung pada edge latency.</p>
<ul>
<li>Zero-bundle Javascript berkat RSC</li>
<li>Sistem Cache yang cerdas dan tervalidasi menggunakan <code>unstable_cache</code></li>
<li>Database ringan via poolless connection</li>
</ul>
<blockquote><p>Inovasi sejati terjadi saat kompleksitas backend tidak lagi menghalangi jurnalis dalam merilis laporan beritanya.</p></blockquote>', 'Industri media sering kali terjebak dalam biaya infrastruktur yang membengkak seiring dengan naiknya trafik. Artikel ini membahas studi kasus dan praktik terbaik mengenai meningkatkan engagement dengan tampilan clean mode.', 'published', 'post', __SUPER_USER_ID__, '{"url":"https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1200","alt_text":"Ilustrasi Tutorial Content (Unsplash)"}', '2026-04-08 00:00:00', '2026-04-08 00:00:00'),
('-9', 'Tailwind CSS v4: Standar Baru Styling Front-end Vercel', 'tutorial-mock-9', '<h2>Pendahuluan</h2>
<p>Banyak penerbit merasa terjebak dengan WordPress karena sejarah konten yang panjang. Namun, migrasi tidak harus menjadi mimpi buruk.</p>
<p>Dalam ranah <strong>Tutorial</strong>, pendekatan modern telah membuktikan bahwa kecepatan dan skalabilitas bisa didapat dengan <em>zero configuration</em> asal kita memilih stack teknologi yang tepat.</p>
<p><em>Tulisan dummy bernomor ID 9 ini merupakan pelengkap data untuk memastikan tema editorial Anda dapat mendemonstrasikan layout dengan konten yang relevan.</em></p>
<h3>Arsitektur & Konsep</h3>
<p>Menggunakan Next.js App Router dan Drizzle ORM, aliran data dari serverless database dapat sampai ke client dalam sub-200ms. Keberhasilan ini juga bergantung pada edge latency.</p>
<ul>
<li>Zero-bundle Javascript berkat RSC</li>
<li>Sistem Cache yang cerdas dan tervalidasi menggunakan <code>unstable_cache</code></li>
<li>Database ringan via poolless connection</li>
</ul>
<blockquote><p>Inovasi sejati terjadi saat kompleksitas backend tidak lagi menghalangi jurnalis dalam merilis laporan beritanya.</p></blockquote>', 'Banyak penerbit merasa terjebak dengan WordPress karena sejarah konten yang panjang. Namun, migrasi tidak harus menjadi mimpi buruk. Artikel ini membahas studi kasus dan praktik terbaik mengenai tailwind css v4: standar baru styling front-end vercel.', 'published', 'post', __SUPER_USER_ID__, '{"url":"https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1200","alt_text":"Ilustrasi Tutorial Content (Unsplash)"}', '2026-04-07 18:00:00', '2026-04-07 18:00:00'),
('-10', 'Review Arsitektur Drizzle ORM pada Skala Enterprise', 'tutorial-mock-10', '<h2>Pendahuluan</h2>
<p>SEO bukan lagi sekadar memasukkan kata kunci ke dalam teks. Mesin pencari modern membutuhkan konteks.</p>
<p>Dalam ranah <strong>Tutorial</strong>, pendekatan modern telah membuktikan bahwa kecepatan dan skalabilitas bisa didapat dengan <em>zero configuration</em> asal kita memilih stack teknologi yang tepat.</p>
<p><em>Tulisan dummy bernomor ID 10 ini merupakan pelengkap data untuk memastikan tema editorial Anda dapat mendemonstrasikan layout dengan konten yang relevan.</em></p>
<h3>Arsitektur & Konsep</h3>
<p>Menggunakan Next.js App Router dan Drizzle ORM, aliran data dari serverless database dapat sampai ke client dalam sub-200ms. Keberhasilan ini juga bergantung pada edge latency.</p>
<ul>
<li>Zero-bundle Javascript berkat RSC</li>
<li>Sistem Cache yang cerdas dan tervalidasi menggunakan <code>unstable_cache</code></li>
<li>Database ringan via poolless connection</li>
</ul>
<blockquote><p>Inovasi sejati terjadi saat kompleksitas backend tidak lagi menghalangi jurnalis dalam merilis laporan beritanya.</p></blockquote>', 'SEO bukan lagi sekadar memasukkan kata kunci ke dalam teks. Mesin pencari modern membutuhkan konteks. Artikel ini membahas studi kasus dan praktik terbaik mengenai review arsitektur drizzle orm pada skala enterprise.', 'published', 'post', __SUPER_USER_ID__, '{"url":"https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=1200","alt_text":"Ilustrasi Tutorial Content (Unsplash)"}', '2026-04-07 12:00:00', '2026-04-07 12:00:00'),
('-11', 'Apakah SSR Selalu Lebih Baik dari SSG di Next.js 16?', 'tutorial-mock-11', '<h2>Pendahuluan</h2>
<p>Kami membuang paradigma lama di mana dashboard harus diakses melalui layar desktop yang lebar.</p>
<p>Dalam ranah <strong>Tutorial</strong>, pendekatan modern telah membuktikan bahwa kecepatan dan skalabilitas bisa didapat dengan <em>zero configuration</em> asal kita memilih stack teknologi yang tepat.</p>
<p><em>Tulisan dummy bernomor ID 11 ini merupakan pelengkap data untuk memastikan tema editorial Anda dapat mendemonstrasikan layout dengan konten yang relevan.</em></p>
<h3>Arsitektur & Konsep</h3>
<p>Menggunakan Next.js App Router dan Drizzle ORM, aliran data dari serverless database dapat sampai ke client dalam sub-200ms. Keberhasilan ini juga bergantung pada edge latency.</p>
<ul>
<li>Zero-bundle Javascript berkat RSC</li>
<li>Sistem Cache yang cerdas dan tervalidasi menggunakan <code>unstable_cache</code></li>
<li>Database ringan via poolless connection</li>
</ul>
<blockquote><p>Inovasi sejati terjadi saat kompleksitas backend tidak lagi menghalangi jurnalis dalam merilis laporan beritanya.</p></blockquote>', 'Kami membuang paradigma lama di mana dashboard harus diakses melalui layar desktop yang lebar. Artikel ini membahas studi kasus dan praktik terbaik mengenai apakah ssr selalu lebih baik dari ssg di next.js 16?.', 'published', 'post', __SUPER_USER_ID__, '{"url":"https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200","alt_text":"Ilustrasi Tutorial Content (Unsplash)"}', '2026-04-07 06:00:00', '2026-04-07 06:00:00'),
('-12', 'Cara Mengelola CDN Caching yang Efektif untuk Gambar', 'tutorial-mock-12', '<h2>Pendahuluan</h2>
<p>Ketergantungan pada lalu lintas media sosial membuat banyak media rentan terhadap perubahan algoritma yang tiba-tiba.</p>
<p>Dalam ranah <strong>Tutorial</strong>, pendekatan modern telah membuktikan bahwa kecepatan dan skalabilitas bisa didapat dengan <em>zero configuration</em> asal kita memilih stack teknologi yang tepat.</p>
<p><em>Tulisan dummy bernomor ID 12 ini merupakan pelengkap data untuk memastikan tema editorial Anda dapat mendemonstrasikan layout dengan konten yang relevan.</em></p>
<h3>Arsitektur & Konsep</h3>
<p>Menggunakan Next.js App Router dan Drizzle ORM, aliran data dari serverless database dapat sampai ke client dalam sub-200ms. Keberhasilan ini juga bergantung pada edge latency.</p>
<ul>
<li>Zero-bundle Javascript berkat RSC</li>
<li>Sistem Cache yang cerdas dan tervalidasi menggunakan <code>unstable_cache</code></li>
<li>Database ringan via poolless connection</li>
</ul>
<blockquote><p>Inovasi sejati terjadi saat kompleksitas backend tidak lagi menghalangi jurnalis dalam merilis laporan beritanya.</p></blockquote>', 'Ketergantungan pada lalu lintas media sosial membuat banyak media rentan terhadap perubahan algoritma yang tiba-tiba. Artikel ini membahas studi kasus dan praktik terbaik mengenai cara mengelola cdn caching yang efektif untuk gambar.', 'published', 'post', __SUPER_USER_ID__, '{"url":"https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1200","alt_text":"Ilustrasi Tutorial Content (Unsplash)"}', '2026-04-07 00:00:00', '2026-04-07 00:00:00'),
('-13', 'Pentingnya Aksesibilitas Web (A11y) pada Platform Editorial', 'seo-mock-13', '<h2>Pendahuluan</h2>
<p>Situs berita sering kali lambat karena banyaknya iklan, pelacak, dan gambar yang tidak dioptimalkan.</p>
<p>Dalam ranah <strong>SEO</strong>, pendekatan modern telah membuktikan bahwa kecepatan dan skalabilitas bisa didapat dengan <em>zero configuration</em> asal kita memilih stack teknologi yang tepat.</p>
<p><em>Tulisan dummy bernomor ID 13 ini merupakan pelengkap data untuk memastikan tema editorial Anda dapat mendemonstrasikan layout dengan konten yang relevan.</em></p>
<h3>Arsitektur & Konsep</h3>
<p>Menggunakan Next.js App Router dan Drizzle ORM, aliran data dari serverless database dapat sampai ke client dalam sub-200ms. Keberhasilan ini juga bergantung pada edge latency.</p>
<ul>
<li>Zero-bundle Javascript berkat RSC</li>
<li>Sistem Cache yang cerdas dan tervalidasi menggunakan <code>unstable_cache</code></li>
<li>Database ringan via poolless connection</li>
</ul>
<blockquote><p>Inovasi sejati terjadi saat kompleksitas backend tidak lagi menghalangi jurnalis dalam merilis laporan beritanya.</p></blockquote>', 'Situs berita sering kali lambat karena banyaknya iklan, pelacak, dan gambar yang tidak dioptimalkan. Artikel ini membahas studi kasus dan praktik terbaik mengenai pentingnya aksesibilitas web (a11y) pada platform editorial.', 'published', 'post', __SUPER_USER_ID__, '{"url":"https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200","alt_text":"Ilustrasi SEO Content (Unsplash)"}', '2026-04-06 18:00:00', '2026-04-06 18:00:00'),
('-14', 'Manajemen Konten Bebas Headless CMS', 'seo-mock-14', '<h2>Pendahuluan</h2>
<p>Kita memasuki era di mana konten yang Anda terbitkan dapat dengan cepat dicerna dan didaur ulang oleh model AI.</p>
<p>Dalam ranah <strong>SEO</strong>, pendekatan modern telah membuktikan bahwa kecepatan dan skalabilitas bisa didapat dengan <em>zero configuration</em> asal kita memilih stack teknologi yang tepat.</p>
<p><em>Tulisan dummy bernomor ID 14 ini merupakan pelengkap data untuk memastikan tema editorial Anda dapat mendemonstrasikan layout dengan konten yang relevan.</em></p>
<h3>Arsitektur & Konsep</h3>
<p>Menggunakan Next.js App Router dan Drizzle ORM, aliran data dari serverless database dapat sampai ke client dalam sub-200ms. Keberhasilan ini juga bergantung pada edge latency.</p>
<ul>
<li>Zero-bundle Javascript berkat RSC</li>
<li>Sistem Cache yang cerdas dan tervalidasi menggunakan <code>unstable_cache</code></li>
<li>Database ringan via poolless connection</li>
</ul>
<blockquote><p>Inovasi sejati terjadi saat kompleksitas backend tidak lagi menghalangi jurnalis dalam merilis laporan beritanya.</p></blockquote>', 'Kita memasuki era di mana konten yang Anda terbitkan dapat dengan cepat dicerna dan didaur ulang oleh model AI. Artikel ini membahas studi kasus dan praktik terbaik mengenai manajemen konten bebas headless cms.', 'published', 'post', __SUPER_USER_ID__, '{"url":"https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&q=80&w=1200","alt_text":"Ilustrasi SEO Content (Unsplash)"}', '2026-04-06 12:00:00', '2026-04-06 12:00:00'),
('-15', 'Mengamankan Rute API dari Scraping Konten Ilegal', 'seo-mock-15', '<h2>Pendahuluan</h2>
<p>Industri media sering kali terjebak dalam biaya infrastruktur yang membengkak seiring dengan naiknya trafik.</p>
<p>Dalam ranah <strong>SEO</strong>, pendekatan modern telah membuktikan bahwa kecepatan dan skalabilitas bisa didapat dengan <em>zero configuration</em> asal kita memilih stack teknologi yang tepat.</p>
<p><em>Tulisan dummy bernomor ID 15 ini merupakan pelengkap data untuk memastikan tema editorial Anda dapat mendemonstrasikan layout dengan konten yang relevan.</em></p>
<h3>Arsitektur & Konsep</h3>
<p>Menggunakan Next.js App Router dan Drizzle ORM, aliran data dari serverless database dapat sampai ke client dalam sub-200ms. Keberhasilan ini juga bergantung pada edge latency.</p>
<ul>
<li>Zero-bundle Javascript berkat RSC</li>
<li>Sistem Cache yang cerdas dan tervalidasi menggunakan <code>unstable_cache</code></li>
<li>Database ringan via poolless connection</li>
</ul>
<blockquote><p>Inovasi sejati terjadi saat kompleksitas backend tidak lagi menghalangi jurnalis dalam merilis laporan beritanya.</p></blockquote>', 'Industri media sering kali terjebak dalam biaya infrastruktur yang membengkak seiring dengan naiknya trafik. Artikel ini membahas studi kasus dan praktik terbaik mengenai mengamankan rute api dari scraping konten ilegal.', 'published', 'post', __SUPER_USER_ID__, '{"url":"https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200","alt_text":"Ilustrasi SEO Content (Unsplash)"}', '2026-04-06 06:00:00', '2026-04-06 06:00:00'),
('-16', 'Integrasi Telegram Bot untuk Notifikasi Berita Real-time', 'seo-mock-16', '<h2>Pendahuluan</h2>
<p>Banyak penerbit merasa terjebak dengan WordPress karena sejarah konten yang panjang. Namun, migrasi tidak harus menjadi mimpi buruk.</p>
<p>Dalam ranah <strong>SEO</strong>, pendekatan modern telah membuktikan bahwa kecepatan dan skalabilitas bisa didapat dengan <em>zero configuration</em> asal kita memilih stack teknologi yang tepat.</p>
<p><em>Tulisan dummy bernomor ID 16 ini merupakan pelengkap data untuk memastikan tema editorial Anda dapat mendemonstrasikan layout dengan konten yang relevan.</em></p>
<h3>Arsitektur & Konsep</h3>
<p>Menggunakan Next.js App Router dan Drizzle ORM, aliran data dari serverless database dapat sampai ke client dalam sub-200ms. Keberhasilan ini juga bergantung pada edge latency.</p>
<ul>
<li>Zero-bundle Javascript berkat RSC</li>
<li>Sistem Cache yang cerdas dan tervalidasi menggunakan <code>unstable_cache</code></li>
<li>Database ringan via poolless connection</li>
</ul>
<blockquote><p>Inovasi sejati terjadi saat kompleksitas backend tidak lagi menghalangi jurnalis dalam merilis laporan beritanya.</p></blockquote>', 'Banyak penerbit merasa terjebak dengan WordPress karena sejarah konten yang panjang. Namun, migrasi tidak harus menjadi mimpi buruk. Artikel ini membahas studi kasus dan praktik terbaik mengenai integrasi telegram bot untuk notifikasi berita real-time.', 'published', 'post', __SUPER_USER_ID__, '{"url":"https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&q=80&w=1200","alt_text":"Ilustrasi SEO Content (Unsplash)"}', '2026-04-06 00:00:00', '2026-04-06 00:00:00'),
('-17', 'Revolusi Markdown: Kenapa Jurnalis Mulai Menyukai TipTap', 'seo-mock-17', '<h2>Pendahuluan</h2>
<p>SEO bukan lagi sekadar memasukkan kata kunci ke dalam teks. Mesin pencari modern membutuhkan konteks.</p>
<p>Dalam ranah <strong>SEO</strong>, pendekatan modern telah membuktikan bahwa kecepatan dan skalabilitas bisa didapat dengan <em>zero configuration</em> asal kita memilih stack teknologi yang tepat.</p>
<p><em>Tulisan dummy bernomor ID 17 ini merupakan pelengkap data untuk memastikan tema editorial Anda dapat mendemonstrasikan layout dengan konten yang relevan.</em></p>
<h3>Arsitektur & Konsep</h3>
<p>Menggunakan Next.js App Router dan Drizzle ORM, aliran data dari serverless database dapat sampai ke client dalam sub-200ms. Keberhasilan ini juga bergantung pada edge latency.</p>
<ul>
<li>Zero-bundle Javascript berkat RSC</li>
<li>Sistem Cache yang cerdas dan tervalidasi menggunakan <code>unstable_cache</code></li>
<li>Database ringan via poolless connection</li>
</ul>
<blockquote><p>Inovasi sejati terjadi saat kompleksitas backend tidak lagi menghalangi jurnalis dalam merilis laporan beritanya.</p></blockquote>', 'SEO bukan lagi sekadar memasukkan kata kunci ke dalam teks. Mesin pencari modern membutuhkan konteks. Artikel ini membahas studi kasus dan praktik terbaik mengenai revolusi markdown: kenapa jurnalis mulai menyukai tiptap.', 'published', 'post', __SUPER_USER_ID__, '{"url":"https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200","alt_text":"Ilustrasi SEO Content (Unsplash)"}', '2026-04-05 18:00:00', '2026-04-05 18:00:00'),
('-18', 'Dampak Algoritma Google Terhadap Traffic Publikasi Independen', 'seo-mock-18', '<h2>Pendahuluan</h2>
<p>Kami membuang paradigma lama di mana dashboard harus diakses melalui layar desktop yang lebar.</p>
<p>Dalam ranah <strong>SEO</strong>, pendekatan modern telah membuktikan bahwa kecepatan dan skalabilitas bisa didapat dengan <em>zero configuration</em> asal kita memilih stack teknologi yang tepat.</p>
<p><em>Tulisan dummy bernomor ID 18 ini merupakan pelengkap data untuk memastikan tema editorial Anda dapat mendemonstrasikan layout dengan konten yang relevan.</em></p>
<h3>Arsitektur & Konsep</h3>
<p>Menggunakan Next.js App Router dan Drizzle ORM, aliran data dari serverless database dapat sampai ke client dalam sub-200ms. Keberhasilan ini juga bergantung pada edge latency.</p>
<ul>
<li>Zero-bundle Javascript berkat RSC</li>
<li>Sistem Cache yang cerdas dan tervalidasi menggunakan <code>unstable_cache</code></li>
<li>Database ringan via poolless connection</li>
</ul>
<blockquote><p>Inovasi sejati terjadi saat kompleksitas backend tidak lagi menghalangi jurnalis dalam merilis laporan beritanya.</p></blockquote>', 'Kami membuang paradigma lama di mana dashboard harus diakses melalui layar desktop yang lebar. Artikel ini membahas studi kasus dan praktik terbaik mengenai dampak algoritma google terhadap traffic publikasi independen.', 'published', 'post', __SUPER_USER_ID__, '{"url":"https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&q=80&w=1200","alt_text":"Ilustrasi SEO Content (Unsplash)"}', '2026-04-05 12:00:00', '2026-04-05 12:00:00'),
('-19', 'Menurunkan Biaya Server hingga 90% dengan Cloudflare Workers', 'design-mock-19', '<h2>Pendahuluan</h2>
<p>Ketergantungan pada lalu lintas media sosial membuat banyak media rentan terhadap perubahan algoritma yang tiba-tiba.</p>
<p>Dalam ranah <strong>Design</strong>, pendekatan modern telah membuktikan bahwa kecepatan dan skalabilitas bisa didapat dengan <em>zero configuration</em> asal kita memilih stack teknologi yang tepat.</p>
<p><em>Tulisan dummy bernomor ID 19 ini merupakan pelengkap data untuk memastikan tema editorial Anda dapat mendemonstrasikan layout dengan konten yang relevan.</em></p>
<h3>Arsitektur & Konsep</h3>
<p>Menggunakan Next.js App Router dan Drizzle ORM, aliran data dari serverless database dapat sampai ke client dalam sub-200ms. Keberhasilan ini juga bergantung pada edge latency.</p>
<ul>
<li>Zero-bundle Javascript berkat RSC</li>
<li>Sistem Cache yang cerdas dan tervalidasi menggunakan <code>unstable_cache</code></li>
<li>Database ringan via poolless connection</li>
</ul>
<blockquote><p>Inovasi sejati terjadi saat kompleksitas backend tidak lagi menghalangi jurnalis dalam merilis laporan beritanya.</p></blockquote>', 'Ketergantungan pada lalu lintas media sosial membuat banyak media rentan terhadap perubahan algoritma yang tiba-tiba. Artikel ini membahas studi kasus dan praktik terbaik mengenai menurunkan biaya server hingga 90% dengan cloudflare workers.', 'published', 'post', __SUPER_USER_ID__, '{"url":"https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=1200","alt_text":"Ilustrasi Design Content (Unsplash)"}', '2026-04-05 06:00:00', '2026-04-05 06:00:00'),
('-20', 'Bagaimana MERPATI CMS Menghindari Vendor Lock-in', 'design-mock-20', '<h2>Pendahuluan</h2>
<p>Situs berita sering kali lambat karena banyaknya iklan, pelacak, dan gambar yang tidak dioptimalkan.</p>
<p>Dalam ranah <strong>Design</strong>, pendekatan modern telah membuktikan bahwa kecepatan dan skalabilitas bisa didapat dengan <em>zero configuration</em> asal kita memilih stack teknologi yang tepat.</p>
<p><em>Tulisan dummy bernomor ID 20 ini merupakan pelengkap data untuk memastikan tema editorial Anda dapat mendemonstrasikan layout dengan konten yang relevan.</em></p>
<h3>Arsitektur & Konsep</h3>
<p>Menggunakan Next.js App Router dan Drizzle ORM, aliran data dari serverless database dapat sampai ke client dalam sub-200ms. Keberhasilan ini juga bergantung pada edge latency.</p>
<ul>
<li>Zero-bundle Javascript berkat RSC</li>
<li>Sistem Cache yang cerdas dan tervalidasi menggunakan <code>unstable_cache</code></li>
<li>Database ringan via poolless connection</li>
</ul>
<blockquote><p>Inovasi sejati terjadi saat kompleksitas backend tidak lagi menghalangi jurnalis dalam merilis laporan beritanya.</p></blockquote>', 'Situs berita sering kali lambat karena banyaknya iklan, pelacak, dan gambar yang tidak dioptimalkan. Artikel ini membahas studi kasus dan praktik terbaik mengenai bagaimana merpati cms menghindari vendor lock-in.', 'published', 'post', __SUPER_USER_ID__, '{"url":"https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=1200","alt_text":"Ilustrasi Design Content (Unsplash)"}', '2026-04-05 00:00:00', '2026-04-05 00:00:00'),
('-21', 'Panduan Cepat Implementasi RSS Feed', 'design-mock-21', '<h2>Pendahuluan</h2>
<p>Kita memasuki era di mana konten yang Anda terbitkan dapat dengan cepat dicerna dan didaur ulang oleh model AI.</p>
<p>Dalam ranah <strong>Design</strong>, pendekatan modern telah membuktikan bahwa kecepatan dan skalabilitas bisa didapat dengan <em>zero configuration</em> asal kita memilih stack teknologi yang tepat.</p>
<p><em>Tulisan dummy bernomor ID 21 ini merupakan pelengkap data untuk memastikan tema editorial Anda dapat mendemonstrasikan layout dengan konten yang relevan.</em></p>
<h3>Arsitektur & Konsep</h3>
<p>Menggunakan Next.js App Router dan Drizzle ORM, aliran data dari serverless database dapat sampai ke client dalam sub-200ms. Keberhasilan ini juga bergantung pada edge latency.</p>
<ul>
<li>Zero-bundle Javascript berkat RSC</li>
<li>Sistem Cache yang cerdas dan tervalidasi menggunakan <code>unstable_cache</code></li>
<li>Database ringan via poolless connection</li>
</ul>
<blockquote><p>Inovasi sejati terjadi saat kompleksitas backend tidak lagi menghalangi jurnalis dalam merilis laporan beritanya.</p></blockquote>', 'Kita memasuki era di mana konten yang Anda terbitkan dapat dengan cepat dicerna dan didaur ulang oleh model AI. Artikel ini membahas studi kasus dan praktik terbaik mengenai panduan cepat implementasi rss feed.', 'published', 'post', __SUPER_USER_ID__, '{"url":"https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&q=80&w=1200","alt_text":"Ilustrasi Design Content (Unsplash)"}', '2026-04-04 18:00:00', '2026-04-04 18:00:00'),
('-22', 'Studi Kasus: Migrasi Publikasi Raksasa ke React Server Components', 'design-mock-22', '<h2>Pendahuluan</h2>
<p>Industri media sering kali terjebak dalam biaya infrastruktur yang membengkak seiring dengan naiknya trafik.</p>
<p>Dalam ranah <strong>Design</strong>, pendekatan modern telah membuktikan bahwa kecepatan dan skalabilitas bisa didapat dengan <em>zero configuration</em> asal kita memilih stack teknologi yang tepat.</p>
<p><em>Tulisan dummy bernomor ID 22 ini merupakan pelengkap data untuk memastikan tema editorial Anda dapat mendemonstrasikan layout dengan konten yang relevan.</em></p>
<h3>Arsitektur & Konsep</h3>
<p>Menggunakan Next.js App Router dan Drizzle ORM, aliran data dari serverless database dapat sampai ke client dalam sub-200ms. Keberhasilan ini juga bergantung pada edge latency.</p>
<ul>
<li>Zero-bundle Javascript berkat RSC</li>
<li>Sistem Cache yang cerdas dan tervalidasi menggunakan <code>unstable_cache</code></li>
<li>Database ringan via poolless connection</li>
</ul>
<blockquote><p>Inovasi sejati terjadi saat kompleksitas backend tidak lagi menghalangi jurnalis dalam merilis laporan beritanya.</p></blockquote>', 'Industri media sering kali terjebak dalam biaya infrastruktur yang membengkak seiring dengan naiknya trafik. Artikel ini membahas studi kasus dan praktik terbaik mengenai studi kasus: migrasi publikasi raksasa ke react server components.', 'published', 'post', __SUPER_USER_ID__, '{"url":"https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&q=80&w=1200","alt_text":"Ilustrasi Design Content (Unsplash)"}', '2026-04-04 12:00:00', '2026-04-04 12:00:00'),
('-23', 'Menulis UX Copy yang Memancing Klik (Secara Etis)', 'design-mock-23', '<h2>Pendahuluan</h2>
<p>Banyak penerbit merasa terjebak dengan WordPress karena sejarah konten yang panjang. Namun, migrasi tidak harus menjadi mimpi buruk.</p>
<p>Dalam ranah <strong>Design</strong>, pendekatan modern telah membuktikan bahwa kecepatan dan skalabilitas bisa didapat dengan <em>zero configuration</em> asal kita memilih stack teknologi yang tepat.</p>
<p><em>Tulisan dummy bernomor ID 23 ini merupakan pelengkap data untuk memastikan tema editorial Anda dapat mendemonstrasikan layout dengan konten yang relevan.</em></p>
<h3>Arsitektur & Konsep</h3>
<p>Menggunakan Next.js App Router dan Drizzle ORM, aliran data dari serverless database dapat sampai ke client dalam sub-200ms. Keberhasilan ini juga bergantung pada edge latency.</p>
<ul>
<li>Zero-bundle Javascript berkat RSC</li>
<li>Sistem Cache yang cerdas dan tervalidasi menggunakan <code>unstable_cache</code></li>
<li>Database ringan via poolless connection</li>
</ul>
<blockquote><p>Inovasi sejati terjadi saat kompleksitas backend tidak lagi menghalangi jurnalis dalam merilis laporan beritanya.</p></blockquote>', 'Banyak penerbit merasa terjebak dengan WordPress karena sejarah konten yang panjang. Namun, migrasi tidak harus menjadi mimpi buruk. Artikel ini membahas studi kasus dan praktik terbaik mengenai menulis ux copy yang memancing klik (secara etis).', 'published', 'post', __SUPER_USER_ID__, '{"url":"https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=1200","alt_text":"Ilustrasi Design Content (Unsplash)"}', '2026-04-04 06:00:00', '2026-04-04 06:00:00'),
('-24', 'Database Relasional vs NoSQL untuk Platform Berita Terkini', 'design-mock-24', '<h2>Pendahuluan</h2>
<p>SEO bukan lagi sekadar memasukkan kata kunci ke dalam teks. Mesin pencari modern membutuhkan konteks.</p>
<p>Dalam ranah <strong>Design</strong>, pendekatan modern telah membuktikan bahwa kecepatan dan skalabilitas bisa didapat dengan <em>zero configuration</em> asal kita memilih stack teknologi yang tepat.</p>
<p><em>Tulisan dummy bernomor ID 24 ini merupakan pelengkap data untuk memastikan tema editorial Anda dapat mendemonstrasikan layout dengan konten yang relevan.</em></p>
<h3>Arsitektur & Konsep</h3>
<p>Menggunakan Next.js App Router dan Drizzle ORM, aliran data dari serverless database dapat sampai ke client dalam sub-200ms. Keberhasilan ini juga bergantung pada edge latency.</p>
<ul>
<li>Zero-bundle Javascript berkat RSC</li>
<li>Sistem Cache yang cerdas dan tervalidasi menggunakan <code>unstable_cache</code></li>
<li>Database ringan via poolless connection</li>
</ul>
<blockquote><p>Inovasi sejati terjadi saat kompleksitas backend tidak lagi menghalangi jurnalis dalam merilis laporan beritanya.</p></blockquote>', 'SEO bukan lagi sekadar memasukkan kata kunci ke dalam teks. Mesin pencari modern membutuhkan konteks. Artikel ini membahas studi kasus dan praktik terbaik mengenai database relasional vs nosql untuk platform berita terkini.', 'published', 'post', __SUPER_USER_ID__, '{"url":"https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=1200","alt_text":"Ilustrasi Design Content (Unsplash)"}', '2026-04-04 00:00:00', '2026-04-04 00:00:00'),
('-25', 'Pemanfaatan Payload CMS vs MERPATI: Mana yang Lebih Ringan?', 'strategy-mock-25', '<h2>Pendahuluan</h2>
<p>Kami membuang paradigma lama di mana dashboard harus diakses melalui layar desktop yang lebar.</p>
<p>Dalam ranah <strong>Strategy</strong>, pendekatan modern telah membuktikan bahwa kecepatan dan skalabilitas bisa didapat dengan <em>zero configuration</em> asal kita memilih stack teknologi yang tepat.</p>
<p><em>Tulisan dummy bernomor ID 25 ini merupakan pelengkap data untuk memastikan tema editorial Anda dapat mendemonstrasikan layout dengan konten yang relevan.</em></p>
<h3>Arsitektur & Konsep</h3>
<p>Menggunakan Next.js App Router dan Drizzle ORM, aliran data dari serverless database dapat sampai ke client dalam sub-200ms. Keberhasilan ini juga bergantung pada edge latency.</p>
<ul>
<li>Zero-bundle Javascript berkat RSC</li>
<li>Sistem Cache yang cerdas dan tervalidasi menggunakan <code>unstable_cache</code></li>
<li>Database ringan via poolless connection</li>
</ul>
<blockquote><p>Inovasi sejati terjadi saat kompleksitas backend tidak lagi menghalangi jurnalis dalam merilis laporan beritanya.</p></blockquote>', 'Kami membuang paradigma lama di mana dashboard harus diakses melalui layar desktop yang lebar. Artikel ini membahas studi kasus dan praktik terbaik mengenai pemanfaatan payload cms vs merpati: mana yang lebih ringan?.', 'published', 'post', __SUPER_USER_ID__, '{"url":"https://images.unsplash.com/photo-1596526131083-e8c633c948d2?auto=format&fit=crop&q=80&w=1200","alt_text":"Ilustrasi Strategy Content (Unsplash)"}', '2026-04-03 18:00:00', '2026-04-03 18:00:00'),
('-26', 'Edge Computing: Masa Depan Distribusi Konten Global', 'strategy-mock-26', '<h2>Pendahuluan</h2>
<p>Ketergantungan pada lalu lintas media sosial membuat banyak media rentan terhadap perubahan algoritma yang tiba-tiba.</p>
<p>Dalam ranah <strong>Strategy</strong>, pendekatan modern telah membuktikan bahwa kecepatan dan skalabilitas bisa didapat dengan <em>zero configuration</em> asal kita memilih stack teknologi yang tepat.</p>
<p><em>Tulisan dummy bernomor ID 26 ini merupakan pelengkap data untuk memastikan tema editorial Anda dapat mendemonstrasikan layout dengan konten yang relevan.</em></p>
<h3>Arsitektur & Konsep</h3>
<p>Menggunakan Next.js App Router dan Drizzle ORM, aliran data dari serverless database dapat sampai ke client dalam sub-200ms. Keberhasilan ini juga bergantung pada edge latency.</p>
<ul>
<li>Zero-bundle Javascript berkat RSC</li>
<li>Sistem Cache yang cerdas dan tervalidasi menggunakan <code>unstable_cache</code></li>
<li>Database ringan via poolless connection</li>
</ul>
<blockquote><p>Inovasi sejati terjadi saat kompleksitas backend tidak lagi menghalangi jurnalis dalam merilis laporan beritanya.</p></blockquote>', 'Ketergantungan pada lalu lintas media sosial membuat banyak media rentan terhadap perubahan algoritma yang tiba-tiba. Artikel ini membahas studi kasus dan praktik terbaik mengenai edge computing: masa depan distribusi konten global.', 'published', 'post', __SUPER_USER_ID__, '{"url":"https://images.unsplash.com/photo-1552581232-414dc5bfd1d5?auto=format&fit=crop&q=80&w=1200","alt_text":"Ilustrasi Strategy Content (Unsplash)"}', '2026-04-03 12:00:00', '2026-04-03 12:00:00'),
('-27', 'Menambahkan Open Graph Image Dinamis dengan Satori', 'strategy-mock-27', '<h2>Pendahuluan</h2>
<p>Situs berita sering kali lambat karena banyaknya iklan, pelacak, dan gambar yang tidak dioptimalkan.</p>
<p>Dalam ranah <strong>Strategy</strong>, pendekatan modern telah membuktikan bahwa kecepatan dan skalabilitas bisa didapat dengan <em>zero configuration</em> asal kita memilih stack teknologi yang tepat.</p>
<p><em>Tulisan dummy bernomor ID 27 ini merupakan pelengkap data untuk memastikan tema editorial Anda dapat mendemonstrasikan layout dengan konten yang relevan.</em></p>
<h3>Arsitektur & Konsep</h3>
<p>Menggunakan Next.js App Router dan Drizzle ORM, aliran data dari serverless database dapat sampai ke client dalam sub-200ms. Keberhasilan ini juga bergantung pada edge latency.</p>
<ul>
<li>Zero-bundle Javascript berkat RSC</li>
<li>Sistem Cache yang cerdas dan tervalidasi menggunakan <code>unstable_cache</code></li>
<li>Database ringan via poolless connection</li>
</ul>
<blockquote><p>Inovasi sejati terjadi saat kompleksitas backend tidak lagi menghalangi jurnalis dalam merilis laporan beritanya.</p></blockquote>', 'Situs berita sering kali lambat karena banyaknya iklan, pelacak, dan gambar yang tidak dioptimalkan. Artikel ini membahas studi kasus dan praktik terbaik mengenai menambahkan open graph image dinamis dengan satori.', 'published', 'post', __SUPER_USER_ID__, '{"url":"https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1200","alt_text":"Ilustrasi Strategy Content (Unsplash)"}', '2026-04-03 06:00:00', '2026-04-03 06:00:00'),
('-28', 'A/B Testing pada Struktur Navigasi Media Berita', 'strategy-mock-28', '<h2>Pendahuluan</h2>
<p>Kita memasuki era di mana konten yang Anda terbitkan dapat dengan cepat dicerna dan didaur ulang oleh model AI.</p>
<p>Dalam ranah <strong>Strategy</strong>, pendekatan modern telah membuktikan bahwa kecepatan dan skalabilitas bisa didapat dengan <em>zero configuration</em> asal kita memilih stack teknologi yang tepat.</p>
<p><em>Tulisan dummy bernomor ID 28 ini merupakan pelengkap data untuk memastikan tema editorial Anda dapat mendemonstrasikan layout dengan konten yang relevan.</em></p>
<h3>Arsitektur & Konsep</h3>
<p>Menggunakan Next.js App Router dan Drizzle ORM, aliran data dari serverless database dapat sampai ke client dalam sub-200ms. Keberhasilan ini juga bergantung pada edge latency.</p>
<ul>
<li>Zero-bundle Javascript berkat RSC</li>
<li>Sistem Cache yang cerdas dan tervalidasi menggunakan <code>unstable_cache</code></li>
<li>Database ringan via poolless connection</li>
</ul>
<blockquote><p>Inovasi sejati terjadi saat kompleksitas backend tidak lagi menghalangi jurnalis dalam merilis laporan beritanya.</p></blockquote>', 'Kita memasuki era di mana konten yang Anda terbitkan dapat dengan cepat dicerna dan didaur ulang oleh model AI. Artikel ini membahas studi kasus dan praktik terbaik mengenai a/b testing pada struktur navigasi media berita.', 'published', 'post', __SUPER_USER_ID__, '{"url":"https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=1200","alt_text":"Ilustrasi Strategy Content (Unsplash)"}', '2026-04-03 00:00:00', '2026-04-03 00:00:00'),
('-29', 'Kenapa Load Time Detik Pertama Sangat Krusial', 'strategy-mock-29', '<h2>Pendahuluan</h2>
<p>Industri media sering kali terjebak dalam biaya infrastruktur yang membengkak seiring dengan naiknya trafik.</p>
<p>Dalam ranah <strong>Strategy</strong>, pendekatan modern telah membuktikan bahwa kecepatan dan skalabilitas bisa didapat dengan <em>zero configuration</em> asal kita memilih stack teknologi yang tepat.</p>
<p><em>Tulisan dummy bernomor ID 29 ini merupakan pelengkap data untuk memastikan tema editorial Anda dapat mendemonstrasikan layout dengan konten yang relevan.</em></p>
<h3>Arsitektur & Konsep</h3>
<p>Menggunakan Next.js App Router dan Drizzle ORM, aliran data dari serverless database dapat sampai ke client dalam sub-200ms. Keberhasilan ini juga bergantung pada edge latency.</p>
<ul>
<li>Zero-bundle Javascript berkat RSC</li>
<li>Sistem Cache yang cerdas dan tervalidasi menggunakan <code>unstable_cache</code></li>
<li>Database ringan via poolless connection</li>
</ul>
<blockquote><p>Inovasi sejati terjadi saat kompleksitas backend tidak lagi menghalangi jurnalis dalam merilis laporan beritanya.</p></blockquote>', 'Industri media sering kali terjebak dalam biaya infrastruktur yang membengkak seiring dengan naiknya trafik. Artikel ini membahas studi kasus dan praktik terbaik mengenai kenapa load time detik pertama sangat krusial.', 'published', 'post', __SUPER_USER_ID__, '{"url":"https://images.unsplash.com/photo-1596526131083-e8c633c948d2?auto=format&fit=crop&q=80&w=1200","alt_text":"Ilustrasi Strategy Content (Unsplash)"}', '2026-04-02 18:00:00', '2026-04-02 18:00:00'),
('-30', 'Belajar dari Kegagalan Arsitektur Media Tradisional', 'strategy-mock-30', '<h2>Pendahuluan</h2>
<p>Banyak penerbit merasa terjebak dengan WordPress karena sejarah konten yang panjang. Namun, migrasi tidak harus menjadi mimpi buruk.</p>
<p>Dalam ranah <strong>Strategy</strong>, pendekatan modern telah membuktikan bahwa kecepatan dan skalabilitas bisa didapat dengan <em>zero configuration</em> asal kita memilih stack teknologi yang tepat.</p>
<p><em>Tulisan dummy bernomor ID 30 ini merupakan pelengkap data untuk memastikan tema editorial Anda dapat mendemonstrasikan layout dengan konten yang relevan.</em></p>
<h3>Arsitektur & Konsep</h3>
<p>Menggunakan Next.js App Router dan Drizzle ORM, aliran data dari serverless database dapat sampai ke client dalam sub-200ms. Keberhasilan ini juga bergantung pada edge latency.</p>
<ul>
<li>Zero-bundle Javascript berkat RSC</li>
<li>Sistem Cache yang cerdas dan tervalidasi menggunakan <code>unstable_cache</code></li>
<li>Database ringan via poolless connection</li>
</ul>
<blockquote><p>Inovasi sejati terjadi saat kompleksitas backend tidak lagi menghalangi jurnalis dalam merilis laporan beritanya.</p></blockquote>', 'Banyak penerbit merasa terjebak dengan WordPress karena sejarah konten yang panjang. Namun, migrasi tidak harus menjadi mimpi buruk. Artikel ini membahas studi kasus dan praktik terbaik mengenai belajar dari kegagalan arsitektur media tradisional.', 'published', 'post', __SUPER_USER_ID__, '{"url":"https://images.unsplash.com/photo-1552581232-414dc5bfd1d5?auto=format&fit=crop&q=80&w=1200","alt_text":"Ilustrasi Strategy Content (Unsplash)"}', '2026-04-02 12:00:00', '2026-04-02 12:00:00'),
('-31', 'Mengapa Serverless adalah Masa Depan Jurnalisme Digital', 'performance-mock-31', '<h2>Pendahuluan</h2>
<p>SEO bukan lagi sekadar memasukkan kata kunci ke dalam teks. Mesin pencari modern membutuhkan konteks.</p>
<p>Dalam ranah <strong>Performance</strong>, pendekatan modern telah membuktikan bahwa kecepatan dan skalabilitas bisa didapat dengan <em>zero configuration</em> asal kita memilih stack teknologi yang tepat.</p>
<p><em>Tulisan dummy bernomor ID 31 ini merupakan pelengkap data untuk memastikan tema editorial Anda dapat mendemonstrasikan layout dengan konten yang relevan.</em></p>
<h3>Arsitektur & Konsep</h3>
<p>Menggunakan Next.js App Router dan Drizzle ORM, aliran data dari serverless database dapat sampai ke client dalam sub-200ms. Keberhasilan ini juga bergantung pada edge latency.</p>
<ul>
<li>Zero-bundle Javascript berkat RSC</li>
<li>Sistem Cache yang cerdas dan tervalidasi menggunakan <code>unstable_cache</code></li>
<li>Database ringan via poolless connection</li>
</ul>
<blockquote><p>Inovasi sejati terjadi saat kompleksitas backend tidak lagi menghalangi jurnalis dalam merilis laporan beritanya.</p></blockquote>', 'SEO bukan lagi sekadar memasukkan kata kunci ke dalam teks. Mesin pencari modern membutuhkan konteks. Artikel ini membahas studi kasus dan praktik terbaik mengenai mengapa serverless adalah masa depan jurnalisme digital.', 'published', 'post', __SUPER_USER_ID__, '{"url":"https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200","alt_text":"Ilustrasi Performance Content (Unsplash)"}', '2026-04-02 06:00:00', '2026-04-02 06:00:00'),
('-32', 'Panduan Migrasi dari WordPress ke Merpati CMS', 'performance-mock-32', '<h2>Pendahuluan</h2>
<p>Kami membuang paradigma lama di mana dashboard harus diakses melalui layar desktop yang lebar.</p>
<p>Dalam ranah <strong>Performance</strong>, pendekatan modern telah membuktikan bahwa kecepatan dan skalabilitas bisa didapat dengan <em>zero configuration</em> asal kita memilih stack teknologi yang tepat.</p>
<p><em>Tulisan dummy bernomor ID 32 ini merupakan pelengkap data untuk memastikan tema editorial Anda dapat mendemonstrasikan layout dengan konten yang relevan.</em></p>
<h3>Arsitektur & Konsep</h3>
<p>Menggunakan Next.js App Router dan Drizzle ORM, aliran data dari serverless database dapat sampai ke client dalam sub-200ms. Keberhasilan ini juga bergantung pada edge latency.</p>
<ul>
<li>Zero-bundle Javascript berkat RSC</li>
<li>Sistem Cache yang cerdas dan tervalidasi menggunakan <code>unstable_cache</code></li>
<li>Database ringan via poolless connection</li>
</ul>
<blockquote><p>Inovasi sejati terjadi saat kompleksitas backend tidak lagi menghalangi jurnalis dalam merilis laporan beritanya.</p></blockquote>', 'Kami membuang paradigma lama di mana dashboard harus diakses melalui layar desktop yang lebar. Artikel ini membahas studi kasus dan praktik terbaik mengenai panduan migrasi dari wordpress ke merpati cms.', 'published', 'post', __SUPER_USER_ID__, '{"url":"https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200","alt_text":"Ilustrasi Performance Content (Unsplash)"}', '2026-04-02 00:00:00', '2026-04-02 00:00:00'),
('-33', 'Memaksimalkan SEO Native dengan JSON-LD Otomatis', 'performance-mock-33', '<h2>Pendahuluan</h2>
<p>Ketergantungan pada lalu lintas media sosial membuat banyak media rentan terhadap perubahan algoritma yang tiba-tiba.</p>
<p>Dalam ranah <strong>Performance</strong>, pendekatan modern telah membuktikan bahwa kecepatan dan skalabilitas bisa didapat dengan <em>zero configuration</em> asal kita memilih stack teknologi yang tepat.</p>
<p><em>Tulisan dummy bernomor ID 33 ini merupakan pelengkap data untuk memastikan tema editorial Anda dapat mendemonstrasikan layout dengan konten yang relevan.</em></p>
<h3>Arsitektur & Konsep</h3>
<p>Menggunakan Next.js App Router dan Drizzle ORM, aliran data dari serverless database dapat sampai ke client dalam sub-200ms. Keberhasilan ini juga bergantung pada edge latency.</p>
<ul>
<li>Zero-bundle Javascript berkat RSC</li>
<li>Sistem Cache yang cerdas dan tervalidasi menggunakan <code>unstable_cache</code></li>
<li>Database ringan via poolless connection</li>
</ul>
<blockquote><p>Inovasi sejati terjadi saat kompleksitas backend tidak lagi menghalangi jurnalis dalam merilis laporan beritanya.</p></blockquote>', 'Ketergantungan pada lalu lintas media sosial membuat banyak media rentan terhadap perubahan algoritma yang tiba-tiba. Artikel ini membahas studi kasus dan praktik terbaik mengenai memaksimalkan seo native dengan json-ld otomatis.', 'published', 'post', __SUPER_USER_ID__, '{"url":"https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1200","alt_text":"Ilustrasi Performance Content (Unsplash)"}', '2026-04-01 18:00:00', '2026-04-01 18:00:00'),
('-34', 'Desain Mobile-First untuk Pembaca Modern', 'performance-mock-34', '<h2>Pendahuluan</h2>
<p>Situs berita sering kali lambat karena banyaknya iklan, pelacak, dan gambar yang tidak dioptimalkan.</p>
<p>Dalam ranah <strong>Performance</strong>, pendekatan modern telah membuktikan bahwa kecepatan dan skalabilitas bisa didapat dengan <em>zero configuration</em> asal kita memilih stack teknologi yang tepat.</p>
<p><em>Tulisan dummy bernomor ID 34 ini merupakan pelengkap data untuk memastikan tema editorial Anda dapat mendemonstrasikan layout dengan konten yang relevan.</em></p>
<h3>Arsitektur & Konsep</h3>
<p>Menggunakan Next.js App Router dan Drizzle ORM, aliran data dari serverless database dapat sampai ke client dalam sub-200ms. Keberhasilan ini juga bergantung pada edge latency.</p>
<ul>
<li>Zero-bundle Javascript berkat RSC</li>
<li>Sistem Cache yang cerdas dan tervalidasi menggunakan <code>unstable_cache</code></li>
<li>Database ringan via poolless connection</li>
</ul>
<blockquote><p>Inovasi sejati terjadi saat kompleksitas backend tidak lagi menghalangi jurnalis dalam merilis laporan beritanya.</p></blockquote>', 'Situs berita sering kali lambat karena banyaknya iklan, pelacak, dan gambar yang tidak dioptimalkan. Artikel ini membahas studi kasus dan praktik terbaik mengenai desain mobile-first untuk pembaca modern.', 'published', 'post', __SUPER_USER_ID__, '{"url":"https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200","alt_text":"Ilustrasi Performance Content (Unsplash)"}', '2026-04-01 12:00:00', '2026-04-01 12:00:00'),
('-35', 'Membangun Komunitas Pembaca Setia dengan Newsletter', 'performance-mock-35', '<h2>Pendahuluan</h2>
<p>Kita memasuki era di mana konten yang Anda terbitkan dapat dengan cepat dicerna dan didaur ulang oleh model AI.</p>
<p>Dalam ranah <strong>Performance</strong>, pendekatan modern telah membuktikan bahwa kecepatan dan skalabilitas bisa didapat dengan <em>zero configuration</em> asal kita memilih stack teknologi yang tepat.</p>
<p><em>Tulisan dummy bernomor ID 35 ini merupakan pelengkap data untuk memastikan tema editorial Anda dapat mendemonstrasikan layout dengan konten yang relevan.</em></p>
<h3>Arsitektur & Konsep</h3>
<p>Menggunakan Next.js App Router dan Drizzle ORM, aliran data dari serverless database dapat sampai ke client dalam sub-200ms. Keberhasilan ini juga bergantung pada edge latency.</p>
<ul>
<li>Zero-bundle Javascript berkat RSC</li>
<li>Sistem Cache yang cerdas dan tervalidasi menggunakan <code>unstable_cache</code></li>
<li>Database ringan via poolless connection</li>
</ul>
<blockquote><p>Inovasi sejati terjadi saat kompleksitas backend tidak lagi menghalangi jurnalis dalam merilis laporan beritanya.</p></blockquote>', 'Kita memasuki era di mana konten yang Anda terbitkan dapat dengan cepat dicerna dan didaur ulang oleh model AI. Artikel ini membahas studi kasus dan praktik terbaik mengenai membangun komunitas pembaca setia dengan newsletter.', 'published', 'post', __SUPER_USER_ID__, '{"url":"https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200","alt_text":"Ilustrasi Performance Content (Unsplash)"}', '2026-04-01 06:00:00', '2026-04-01 06:00:00'),
('-36', 'Optimasi Core Web Vitals untuk Portal Berita', 'performance-mock-36', '<h2>Pendahuluan</h2>
<p>Industri media sering kali terjebak dalam biaya infrastruktur yang membengkak seiring dengan naiknya trafik.</p>
<p>Dalam ranah <strong>Performance</strong>, pendekatan modern telah membuktikan bahwa kecepatan dan skalabilitas bisa didapat dengan <em>zero configuration</em> asal kita memilih stack teknologi yang tepat.</p>
<p><em>Tulisan dummy bernomor ID 36 ini merupakan pelengkap data untuk memastikan tema editorial Anda dapat mendemonstrasikan layout dengan konten yang relevan.</em></p>
<h3>Arsitektur & Konsep</h3>
<p>Menggunakan Next.js App Router dan Drizzle ORM, aliran data dari serverless database dapat sampai ke client dalam sub-200ms. Keberhasilan ini juga bergantung pada edge latency.</p>
<ul>
<li>Zero-bundle Javascript berkat RSC</li>
<li>Sistem Cache yang cerdas dan tervalidasi menggunakan <code>unstable_cache</code></li>
<li>Database ringan via poolless connection</li>
</ul>
<blockquote><p>Inovasi sejati terjadi saat kompleksitas backend tidak lagi menghalangi jurnalis dalam merilis laporan beritanya.</p></blockquote>', 'Industri media sering kali terjebak dalam biaya infrastruktur yang membengkak seiring dengan naiknya trafik. Artikel ini membahas studi kasus dan praktik terbaik mengenai optimasi core web vitals untuk portal berita.', 'published', 'post', __SUPER_USER_ID__, '{"url":"https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200","alt_text":"Ilustrasi Performance Content (Unsplash)"}', '2026-04-01 00:00:00', '2026-04-01 00:00:00'),
('-37', 'Pentingnya Independensi Data Media di Era AI', 'editorial-mock-37', '<h2>Pendahuluan</h2>
<p>Banyak penerbit merasa terjebak dengan WordPress karena sejarah konten yang panjang. Namun, migrasi tidak harus menjadi mimpi buruk.</p>
<p>Dalam ranah <strong>Editorial</strong>, pendekatan modern telah membuktikan bahwa kecepatan dan skalabilitas bisa didapat dengan <em>zero configuration</em> asal kita memilih stack teknologi yang tepat.</p>
<p><em>Tulisan dummy bernomor ID 37 ini merupakan pelengkap data untuk memastikan tema editorial Anda dapat mendemonstrasikan layout dengan konten yang relevan.</em></p>
<h3>Arsitektur & Konsep</h3>
<p>Menggunakan Next.js App Router dan Drizzle ORM, aliran data dari serverless database dapat sampai ke client dalam sub-200ms. Keberhasilan ini juga bergantung pada edge latency.</p>
<ul>
<li>Zero-bundle Javascript berkat RSC</li>
<li>Sistem Cache yang cerdas dan tervalidasi menggunakan <code>unstable_cache</code></li>
<li>Database ringan via poolless connection</li>
</ul>
<blockquote><p>Inovasi sejati terjadi saat kompleksitas backend tidak lagi menghalangi jurnalis dalam merilis laporan beritanya.</p></blockquote>', 'Banyak penerbit merasa terjebak dengan WordPress karena sejarah konten yang panjang. Namun, migrasi tidak harus menjadi mimpi buruk. Artikel ini membahas studi kasus dan praktik terbaik mengenai pentingnya independensi data media di era ai.', 'published', 'post', __SUPER_USER_ID__, '{"url":"https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1200","alt_text":"Ilustrasi Editorial Content (Unsplash)"}', '2026-03-31 18:00:00', '2026-03-31 18:00:00'),
('-38', 'Meningkatkan Engagement dengan Tampilan Clean Mode', 'editorial-mock-38', '<h2>Pendahuluan</h2>
<p>SEO bukan lagi sekadar memasukkan kata kunci ke dalam teks. Mesin pencari modern membutuhkan konteks.</p>
<p>Dalam ranah <strong>Editorial</strong>, pendekatan modern telah membuktikan bahwa kecepatan dan skalabilitas bisa didapat dengan <em>zero configuration</em> asal kita memilih stack teknologi yang tepat.</p>
<p><em>Tulisan dummy bernomor ID 38 ini merupakan pelengkap data untuk memastikan tema editorial Anda dapat mendemonstrasikan layout dengan konten yang relevan.</em></p>
<h3>Arsitektur & Konsep</h3>
<p>Menggunakan Next.js App Router dan Drizzle ORM, aliran data dari serverless database dapat sampai ke client dalam sub-200ms. Keberhasilan ini juga bergantung pada edge latency.</p>
<ul>
<li>Zero-bundle Javascript berkat RSC</li>
<li>Sistem Cache yang cerdas dan tervalidasi menggunakan <code>unstable_cache</code></li>
<li>Database ringan via poolless connection</li>
</ul>
<blockquote><p>Inovasi sejati terjadi saat kompleksitas backend tidak lagi menghalangi jurnalis dalam merilis laporan beritanya.</p></blockquote>', 'SEO bukan lagi sekadar memasukkan kata kunci ke dalam teks. Mesin pencari modern membutuhkan konteks. Artikel ini membahas studi kasus dan praktik terbaik mengenai meningkatkan engagement dengan tampilan clean mode.', 'published', 'post', __SUPER_USER_ID__, '{"url":"https://images.unsplash.com/photo-1455390582262-044cdead2708?auto=format&fit=crop&q=80&w=1200","alt_text":"Ilustrasi Editorial Content (Unsplash)"}', '2026-03-31 12:00:00', '2026-03-31 12:00:00'),
('-39', 'Tailwind CSS v4: Standar Baru Styling Front-end Vercel', 'editorial-mock-39', '<h2>Pendahuluan</h2>
<p>Kami membuang paradigma lama di mana dashboard harus diakses melalui layar desktop yang lebar.</p>
<p>Dalam ranah <strong>Editorial</strong>, pendekatan modern telah membuktikan bahwa kecepatan dan skalabilitas bisa didapat dengan <em>zero configuration</em> asal kita memilih stack teknologi yang tepat.</p>
<p><em>Tulisan dummy bernomor ID 39 ini merupakan pelengkap data untuk memastikan tema editorial Anda dapat mendemonstrasikan layout dengan konten yang relevan.</em></p>
<h3>Arsitektur & Konsep</h3>
<p>Menggunakan Next.js App Router dan Drizzle ORM, aliran data dari serverless database dapat sampai ke client dalam sub-200ms. Keberhasilan ini juga bergantung pada edge latency.</p>
<ul>
<li>Zero-bundle Javascript berkat RSC</li>
<li>Sistem Cache yang cerdas dan tervalidasi menggunakan <code>unstable_cache</code></li>
<li>Database ringan via poolless connection</li>
</ul>
<blockquote><p>Inovasi sejati terjadi saat kompleksitas backend tidak lagi menghalangi jurnalis dalam merilis laporan beritanya.</p></blockquote>', 'Kami membuang paradigma lama di mana dashboard harus diakses melalui layar desktop yang lebar. Artikel ini membahas studi kasus dan praktik terbaik mengenai tailwind css v4: standar baru styling front-end vercel.', 'published', 'post', __SUPER_USER_ID__, '{"url":"https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&q=80&w=1200","alt_text":"Ilustrasi Editorial Content (Unsplash)"}', '2026-03-31 06:00:00', '2026-03-31 06:00:00'),
('-40', 'Review Arsitektur Drizzle ORM pada Skala Enterprise', 'editorial-mock-40', '<h2>Pendahuluan</h2>
<p>Ketergantungan pada lalu lintas media sosial membuat banyak media rentan terhadap perubahan algoritma yang tiba-tiba.</p>
<p>Dalam ranah <strong>Editorial</strong>, pendekatan modern telah membuktikan bahwa kecepatan dan skalabilitas bisa didapat dengan <em>zero configuration</em> asal kita memilih stack teknologi yang tepat.</p>
<p><em>Tulisan dummy bernomor ID 40 ini merupakan pelengkap data untuk memastikan tema editorial Anda dapat mendemonstrasikan layout dengan konten yang relevan.</em></p>
<h3>Arsitektur & Konsep</h3>
<p>Menggunakan Next.js App Router dan Drizzle ORM, aliran data dari serverless database dapat sampai ke client dalam sub-200ms. Keberhasilan ini juga bergantung pada edge latency.</p>
<ul>
<li>Zero-bundle Javascript berkat RSC</li>
<li>Sistem Cache yang cerdas dan tervalidasi menggunakan <code>unstable_cache</code></li>
<li>Database ringan via poolless connection</li>
</ul>
<blockquote><p>Inovasi sejati terjadi saat kompleksitas backend tidak lagi menghalangi jurnalis dalam merilis laporan beritanya.</p></blockquote>', 'Ketergantungan pada lalu lintas media sosial membuat banyak media rentan terhadap perubahan algoritma yang tiba-tiba. Artikel ini membahas studi kasus dan praktik terbaik mengenai review arsitektur drizzle orm pada skala enterprise.', 'published', 'post', __SUPER_USER_ID__, '{"url":"https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=1200","alt_text":"Ilustrasi Editorial Content (Unsplash)"}', '2026-03-31 00:00:00', '2026-03-31 00:00:00'),
('-41', 'Apakah SSR Selalu Lebih Baik dari SSG di Next.js 16?', 'editorial-mock-41', '<h2>Pendahuluan</h2>
<p>Situs berita sering kali lambat karena banyaknya iklan, pelacak, dan gambar yang tidak dioptimalkan.</p>
<p>Dalam ranah <strong>Editorial</strong>, pendekatan modern telah membuktikan bahwa kecepatan dan skalabilitas bisa didapat dengan <em>zero configuration</em> asal kita memilih stack teknologi yang tepat.</p>
<p><em>Tulisan dummy bernomor ID 41 ini merupakan pelengkap data untuk memastikan tema editorial Anda dapat mendemonstrasikan layout dengan konten yang relevan.</em></p>
<h3>Arsitektur & Konsep</h3>
<p>Menggunakan Next.js App Router dan Drizzle ORM, aliran data dari serverless database dapat sampai ke client dalam sub-200ms. Keberhasilan ini juga bergantung pada edge latency.</p>
<ul>
<li>Zero-bundle Javascript berkat RSC</li>
<li>Sistem Cache yang cerdas dan tervalidasi menggunakan <code>unstable_cache</code></li>
<li>Database ringan via poolless connection</li>
</ul>
<blockquote><p>Inovasi sejati terjadi saat kompleksitas backend tidak lagi menghalangi jurnalis dalam merilis laporan beritanya.</p></blockquote>', 'Situs berita sering kali lambat karena banyaknya iklan, pelacak, dan gambar yang tidak dioptimalkan. Artikel ini membahas studi kasus dan praktik terbaik mengenai apakah ssr selalu lebih baik dari ssg di next.js 16?.', 'published', 'post', __SUPER_USER_ID__, '{"url":"https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1200","alt_text":"Ilustrasi Editorial Content (Unsplash)"}', '2026-03-30 18:00:00', '2026-03-30 18:00:00'),
('-42', 'Cara Mengelola CDN Caching yang Efektif untuk Gambar', 'editorial-mock-42', '<h2>Pendahuluan</h2>
<p>Kita memasuki era di mana konten yang Anda terbitkan dapat dengan cepat dicerna dan didaur ulang oleh model AI.</p>
<p>Dalam ranah <strong>Editorial</strong>, pendekatan modern telah membuktikan bahwa kecepatan dan skalabilitas bisa didapat dengan <em>zero configuration</em> asal kita memilih stack teknologi yang tepat.</p>
<p><em>Tulisan dummy bernomor ID 42 ini merupakan pelengkap data untuk memastikan tema editorial Anda dapat mendemonstrasikan layout dengan konten yang relevan.</em></p>
<h3>Arsitektur & Konsep</h3>
<p>Menggunakan Next.js App Router dan Drizzle ORM, aliran data dari serverless database dapat sampai ke client dalam sub-200ms. Keberhasilan ini juga bergantung pada edge latency.</p>
<ul>
<li>Zero-bundle Javascript berkat RSC</li>
<li>Sistem Cache yang cerdas dan tervalidasi menggunakan <code>unstable_cache</code></li>
<li>Database ringan via poolless connection</li>
</ul>
<blockquote><p>Inovasi sejati terjadi saat kompleksitas backend tidak lagi menghalangi jurnalis dalam merilis laporan beritanya.</p></blockquote>', 'Kita memasuki era di mana konten yang Anda terbitkan dapat dengan cepat dicerna dan didaur ulang oleh model AI. Artikel ini membahas studi kasus dan praktik terbaik mengenai cara mengelola cdn caching yang efektif untuk gambar.', 'published', 'post', __SUPER_USER_ID__, '{"url":"https://images.unsplash.com/photo-1455390582262-044cdead2708?auto=format&fit=crop&q=80&w=1200","alt_text":"Ilustrasi Editorial Content (Unsplash)"}', '2026-03-30 12:00:00', '2026-03-30 12:00:00')
ON CONFLICT (id) DO NOTHING;

-- MOCK TERM RELATIONSHIPS
INSERT INTO term_relationships (object_id, term_id) VALUES
('-1', '-cat-1'),
('-2', '-cat-1'),
('-3', '-cat-1'),
('-4', '-cat-1'),
('-5', '-cat-1'),
('-6', '-cat-1'),
('-7', '-cat-2'),
('-8', '-cat-2'),
('-9', '-cat-2'),
('-10', '-cat-2'),
('-11', '-cat-2'),
('-12', '-cat-2'),
('-13', '-cat-3'),
('-14', '-cat-3'),
('-15', '-cat-3'),
('-16', '-cat-3'),
('-17', '-cat-3'),
('-18', '-cat-3'),
('-19', '-cat-4'),
('-20', '-cat-4'),
('-21', '-cat-4'),
('-22', '-cat-4'),
('-23', '-cat-4'),
('-24', '-cat-4'),
('-25', '-cat-5'),
('-26', '-cat-5'),
('-27', '-cat-5'),
('-28', '-cat-5'),
('-29', '-cat-5'),
('-30', '-cat-5'),
('-31', '-cat-6'),
('-32', '-cat-6'),
('-33', '-cat-6'),
('-34', '-cat-6'),
('-35', '-cat-6'),
('-36', '-cat-6'),
('-37', '-cat-7'),
('-38', '-cat-7'),
('-39', '-cat-7'),
('-40', '-cat-7'),
('-41', '-cat-7'),
('-42', '-cat-7')
ON CONFLICT (object_id, term_id) DO NOTHING;

-- MOCK RELATED POSTS (Circular assignments among negative IDs)
INSERT INTO post_relationships (post_id, related_post_id) VALUES
    ('-1', '-2'),
    ('-1', '-3'),
    ('-1', '-4'),
    ('-2', '-3'),
    ('-2', '-4'),
    ('-2', '-5'),
    ('-3', '-4'),
    ('-3', '-5'),
    ('-3', '-6'),
    ('-4', '-5'),
    ('-4', '-6'),
    ('-4', '-7'),
    ('-5', '-6'),
    ('-5', '-7'),
    ('-5', '-8'),
    ('-6', '-7'),
    ('-6', '-8'),
    ('-6', '-9'),
    ('-7', '-8'),
    ('-7', '-9'),
    ('-7', '-10'),
    ('-8', '-9'),
    ('-8', '-10'),
    ('-8', '-11'),
    ('-9', '-10'),
    ('-9', '-11'),
    ('-9', '-12'),
    ('-10', '-11'),
    ('-10', '-12'),
    ('-10', '-13'),
    ('-11', '-12'),
    ('-11', '-13'),
    ('-11', '-14'),
    ('-12', '-13'),
    ('-12', '-14'),
    ('-12', '-15'),
    ('-13', '-14'),
    ('-13', '-15'),
    ('-13', '-16'),
    ('-14', '-15'),
    ('-14', '-16'),
    ('-14', '-17'),
    ('-15', '-16'),
    ('-15', '-17'),
    ('-15', '-18'),
    ('-16', '-17'),
    ('-16', '-18'),
    ('-16', '-19'),
    ('-17', '-18'),
    ('-17', '-19'),
    ('-17', '-20'),
    ('-18', '-19'),
    ('-18', '-20'),
    ('-18', '-21'),
    ('-19', '-20'),
    ('-19', '-21'),
    ('-19', '-22'),
    ('-20', '-21'),
    ('-20', '-22'),
    ('-20', '-23'),
    ('-21', '-22'),
    ('-21', '-23'),
    ('-21', '-24'),
    ('-22', '-23'),
    ('-22', '-24'),
    ('-22', '-25'),
    ('-23', '-24'),
    ('-23', '-25'),
    ('-23', '-26'),
    ('-24', '-25'),
    ('-24', '-26'),
    ('-24', '-27'),
    ('-25', '-26'),
    ('-25', '-27'),
    ('-25', '-28'),
    ('-26', '-27'),
    ('-26', '-28'),
    ('-26', '-29'),
    ('-27', '-28'),
    ('-27', '-29'),
    ('-27', '-30'),
    ('-28', '-29'),
    ('-28', '-30'),
    ('-28', '-31'),
    ('-29', '-30'),
    ('-29', '-31'),
    ('-29', '-32'),
    ('-30', '-31'),
    ('-30', '-32'),
    ('-30', '-33'),
    ('-31', '-32'),
    ('-31', '-33'),
    ('-31', '-34'),
    ('-32', '-33'),
    ('-32', '-34'),
    ('-32', '-35'),
    ('-33', '-34'),
    ('-33', '-35'),
    ('-33', '-36'),
    ('-34', '-35'),
    ('-34', '-36'),
    ('-34', '-37'),
    ('-35', '-36'),
    ('-35', '-37'),
    ('-35', '-38'),
    ('-36', '-37'),
    ('-36', '-38'),
    ('-36', '-39'),
    ('-37', '-38'),
    ('-37', '-39'),
    ('-37', '-40'),
    ('-38', '-39'),
    ('-38', '-40'),
    ('-38', '-41'),
    ('-39', '-40'),
    ('-39', '-41'),
    ('-39', '-42'),
    ('-40', '-41'),
    ('-40', '-42'),
    ('-40', '-1'),
    ('-41', '-42'),
    ('-41', '-1'),
    ('-41', '-2'),
    ('-42', '-1'),
    ('-42', '-2'),
    ('-42', '-3')
ON CONFLICT (post_id, related_post_id) DO NOTHING;

-- MENUS
INSERT INTO menus (id, name, slug, location) VALUES
    ('menu-main', 'Menu Utama', 'menu-utama', 'primary'),
    ('menu-footer', 'Menu Footer', 'menu-footer', 'footer')
ON CONFLICT (id) DO NOTHING;

INSERT INTO menu_items (id, menu_id, title, url, object_id, type, sort_order) VALUES
    ('mi-home', 'menu-main', 'Beranda', '/', NULL, 'custom', 0),
    ('mi-cat-1', 'menu-main', 'Architecture', NULL, '-cat-1', 'category', 1),
    ('mi-cat-2', 'menu-main', 'Tutorial', NULL, '-cat-2', 'category', 2),
    ('mi-cat-3', 'menu-main', 'SEO', NULL, '-cat-3', 'category', 3),
    ('mi-cat-4', 'menu-main', 'Design', NULL, '-cat-4', 'category', 4),
    ('mi-cat-5', 'menu-main', 'Strategy', NULL, '-cat-5', 'category', 5),
    ('mi-cat-6', 'menu-main', 'Performance', NULL, '-cat-6', 'category', 6),
    ('mi-cat-7', 'menu-main', 'Editorial', NULL, '-cat-7', 'category', 7),
    ('mi-tentang', 'menu-main', 'Tentang', NULL, 'page-tentang', 'page', 8),
    ('mi-footer-home', 'menu-footer', 'Beranda', '/', NULL, 'custom', 0),
    ('mi-footer-tentang', 'menu-footer', 'Tentang', NULL, 'page-tentang', 'page', 1)
ON CONFLICT (id) DO NOTHING;
