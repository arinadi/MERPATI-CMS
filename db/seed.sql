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

-- Welcome Post
INSERT INTO posts (id, title, slug, content, excerpt, status, type, author_id, created_at, updated_at) VALUES
    (
        'post-welcome',
        'Selamat Datang di MERPATI',
        'selamat-datang-di-merpati',
        '<h2>Media Editorial Ringkas, Praktis, Aman, Tetap Independen</h2>
<p>Selamat datang di <strong>MERPATI CMS</strong> — platform penerbitan digital modern yang dirancang khusus untuk jurnalis dan penerbit independen.</p>
<p>MERPATI hadir sebagai alternatif WordPress yang ringan, cepat, dan sepenuhnya gratis. Dibangun di atas arsitektur serverless, MERPATI menghilangkan beban biaya hosting sambil memberikan performa dan keamanan yang jauh lebih baik.</p>
<h3>Fitur Utama</h3>
<ul>
<li><strong>Editor Klasik</strong> — Antarmuka penulisan yang familiar dengan dukungan format teks, heading, daftar, dan penyisipan media.</li>
<li><strong>Perpustakaan Media</strong> — Kelola gambar dan file media dengan mudah melalui upload langsung atau URL publik.</li>
<li><strong>Sistem Tema Modular</strong> — Tampilan frontend yang fleksibel dan dapat dikustomisasi menggunakan React Server Components.</li>
<li><strong>SEO Otomatis</strong> — Open Graph, Twitter Cards, JSON-LD, Sitemap, dan RSS Feed siap pakai.</li>
<li><strong>Notifikasi Telegram</strong> — Dapatkan pemberitahuan langsung di Telegram saat ada posting baru atau pengguna baru.</li>
</ul>
<p>Mulailah menulis dan berbagi cerita Anda dengan dunia. <em>Kebebasan pers dimulai dari kemandirian infrastrukturnya.</em></p>',
        'Selamat datang di MERPATI CMS — platform penerbitan digital modern untuk jurnalis dan penerbit independen.',
        'published',
        'post',
        __SUPER_USER_ID__,
        NOW(),
        NOW()
    )
ON CONFLICT (id) DO NOTHING;

-- Welcome Post ↔ Category & Tag
INSERT INTO term_relationships (object_id, term_id) VALUES
    ('post-welcome', 'cat-umum'),
    ('post-welcome', 'tag-berita')
ON CONFLICT (object_id, term_id) DO NOTHING;

-- Welcome Page
INSERT INTO posts (id, title, slug, content, excerpt, status, type, author_id, created_at, updated_at) VALUES
    (
        'page-tentang',
        'Tentang MERPATI',
        'tentang',
        '<h2>Tentang MERPATI CMS</h2>
<p><strong>MERPATI</strong> adalah singkatan dari <em>Media Editorial Ringkas, Praktis, Aman, Tetap Independen</em>.</p>
<p>Platform ini dirancang untuk memberikan pengalaman penerbitan digital yang familiar bagi pengguna WordPress, namun dengan arsitektur modern berbasis serverless yang menghilangkan biaya hosting dan meningkatkan performa secara drastis.</p>
<h3>Misi Kami</h3>
<p>Menyediakan infrastruktur penerbitan yang mandiri dan gratis bagi jurnalis dan penerbit digital, karena kami percaya bahwa <em>kebebasan pers dimulai dari kemandirian infrastrukturnya</em>.</p>
<h3>Teknologi</h3>
<p>MERPATI dibangun menggunakan Next.js, Tailwind CSS, dan Neon Serverless Postgres, dideploy sepenuhnya di Vercel Free Tier sebagai single endpoint serverless function.</p>',
        'Tentang MERPATI CMS — Media Editorial Ringkas, Praktis, Aman, Tetap Independen.',
        'published',
        'page',
        __SUPER_USER_ID__,
        NOW(),
        NOW()
    )
ON CONFLICT (id) DO NOTHING;

-- Default Menus
INSERT INTO menus (id, name, slug, location) VALUES
    ('menu-main', 'Menu Utama', 'menu-utama', 'primary'),
    ('menu-footer', 'Menu Footer', 'menu-footer', 'footer')
ON CONFLICT (id) DO NOTHING;

-- Default Menu Items
INSERT INTO menu_items (id, menu_id, title, url, object_id, type, sort_order) VALUES
    ('mi-home', 'menu-main', 'Beranda', '/', NULL, 'custom', 0),
    ('mi-tentang', 'menu-main', 'Tentang', NULL, 'page-tentang', 'page', 1),
    ('mi-footer-home', 'menu-footer', 'Beranda', '/', NULL, 'custom', 0),
    ('mi-footer-tentang', 'menu-footer', 'Tentang', NULL, 'page-tentang', 'page', 1)
ON CONFLICT (id) DO NOTHING;

-- Mock Categories
INSERT INTO terms (id, name, slug, taxonomy, description) VALUES
    ('cat-architecture', 'Architecture', 'architecture', 'category', ''),
    ('cat-tutorial', 'Tutorial', 'tutorial', 'category', ''),
    ('cat-seo', 'SEO', 'seo', 'category', ''),
    ('cat-design', 'Design', 'design', 'category', ''),
    ('cat-strategy', 'Strategy', 'strategy', 'category', ''),
    ('cat-performance', 'Performance', 'performance', 'category', ''),
    ('cat-editorial', 'Editorial', 'editorial', 'category', '')
ON CONFLICT (id) DO NOTHING;

-- Mock Posts
INSERT INTO posts (id, title, slug, content, excerpt, status, type, author_id, featured_image, created_at, updated_at) VALUES
    ('post-mock-1', 'Mengapa Serverless adalah Masa Depan Jurnalisme Digital', 'mengapa-serverless-adalah-masa-depan-jurnalisme-digital', '<p>Industri media sering kali terjebak dalam biaya infrastruktur yang membengkak seiring dengan naiknya trafik. Saat berita viral, server tradisional seringkali tumbang atau membutuhkan biaya skalabilitas yang sangat mahal.</p><p>Di sinilah arsitektur <strong>Serverless</strong> masuk sebagai solusi radikal. Dengan memanfaatkan edge network dan React Server Components, halaman dirender seketika dan didistribusikan ke seluruh dunia tanpa perlu menyewa server khusus.</p><h3>Keuntungan Utama</h3><ul><li><strong>Biaya Nol:</strong> Memanfaatkan Free Tier Vercel dengan optimal.</li><li><strong>Kecepatan Kilat:</strong> Sub-200ms page loads yang disukai Google.</li><li><strong>Keamanan:</strong> Tidak ada database tradisional yang bisa diinjeksi SQL secara konvensional.</li></ul><p>Merpati CMS dibangun tepat di atas filosofi ini, memastikan kebebasan pers dimulai dari kebebasan infrastruktur.</p>', 'Meninggalkan server tradisional dan beralih ke arsitektur serverless di Vercel memberikan kebebasan luar biasa bagi penerbit independen tanpa pusing memikirkan biaya hosting bulanan.', 'published', 'post', __SUPER_USER_ID__, 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200', '2026-03-12 10:00:00', '2026-03-12 10:00:00'),
    ('post-mock-2', 'Panduan Migrasi dari WordPress ke Merpati CMS', 'panduan-migrasi-dari-wordpress-ke-merpati-cms', '<p>Banyak penerbit merasa terjebak dengan WordPress karena sejarah konten yang panjang. Namun, migrasi tidak harus menjadi mimpi buruk.</p><p>Proses migrasi ke Merpati CMS telah disederhanakan melalui skrip import kami yang secara otomatis mengonversi format wp_posts menjadi Markdown atau struktur JSON-LD yang ramah SEO.</p><p>Jangan biarkan platform usang menahan laju inovasi media Anda. Kecepatan adalah mata uang baru di dunia editorial digital.</p>', 'Langkah demi langkah memindahkan ribuan artikel dari CMS legacy WordPress Anda ke lingkungan modern Merpati CMS tanpa kehilangan ranking SEO.', 'published', 'post', __SUPER_USER_ID__, 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200', '2026-03-10 10:00:00', '2026-03-10 10:00:00'),
    ('post-mock-3', 'Memaksimalkan SEO Native dengan JSON-LD Otomatis', 'memaksimalkan-seo-native-dengan-json-ld-otomatis', '<p>SEO bukan lagi sekadar memasukkan kata kunci ke dalam teks. Mesin pencari modern membutuhkan konteks, dan cara terbaik memberikannya adalah melalui JSON-LD.</p><p>Setiap kali Anda menerbitkan artikel di Merpati CMS, sistem secara otomatis merakit schema NewsArticle, Author, dan Organization. Ini memastikan artikel Anda memiliki peluang lebih tinggi untuk masuk ke Google Top Stories.</p>', 'Bagaimana Merpati CMS menyuntikkan schema markup yang kaya secara otomatis untuk mendominasi hasil pencarian Google dan Google News.', 'published', 'post', __SUPER_USER_ID__, 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200', '2026-03-08 10:00:00', '2026-03-08 10:00:00'),
    ('post-mock-4', 'Desain Mobile-First untuk Pembaca Modern', 'desain-mobile-first-untuk-pembaca-modern', '<p>Kami membuang paradigma lama di mana dashboard harus diakses melalui layar desktop yang lebar. Jurnalisme modern terjadi di lapangan.</p><p>Oleh karena itu, dashboard penulisan dan antarmuka pembaca kami dirancang dengan pendekatan mobile-first. Anda bisa menulis, mengedit, dan menerbitkan langsung dari smartphone Anda dengan pengalaman yang sama mulusnya dengan di desktop.</p>', 'Lebih dari 80% pembaca berita mengakses melalui ponsel. Merpati CMS mendesain antarmuka publik dan dashboard admin untuk jempol terlebih dahulu.', 'published', 'post', __SUPER_USER_ID__, 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=1200', '2026-03-05 10:00:00', '2026-03-05 10:00:00'),
    ('post-mock-5', 'Membangun Komunitas Pembaca Setia dengan Newsletter', 'membangun-komunitas-pembaca-setia-dengan-newsletter', '<p>Ketergantungan pada lalu lintas media sosial membuat banyak media rentan terhadap perubahan algoritma yang tiba-tiba. Jalan keluar terbaik adalah membangun saluran komunikasi langsung dengan pembaca Anda.</p><p>Newsletter memberikan tingkat keterlibatan yang jauh lebih tinggi. Integrasi Merpati CMS dengan platform email modern memudahkan Anda mengirimkan rangkuman mingguan otomatis langsung dari editor kami.</p>', 'Algoritma media sosial terus berubah. Pelajari mengapa memiliki daftar email pembaca (newsletter) adalah aset paling berharga bagi media independen.', 'published', 'post', __SUPER_USER_ID__, 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?auto=format&fit=crop&q=80&w=1200', '2026-02-28 10:00:00', '2026-02-28 10:00:00'),
    ('post-mock-6', 'Optimasi Core Web Vitals untuk Berita', 'optimasi-core-web-vitals-untuk-berita', '<p>Situs berita sering kali lambat karena banyaknya iklan, pelacak, dan gambar yang tidak dioptimalkan. Namun, dengan pendekatan arsitektur modern, Anda bisa memiliki fungsionalitas penuh sekaligus memanjakan pengguna.</p><p>Pelajari strategi pemuatan dinamis, optimasi gambar dengan format WebP, dan penangguhan skrip pihak ketiga yang kami terapkan secara bawaan di Merpati CMS.</p>', 'Google semakin memprioritaskan pengalaman pengguna. Panduan mencapai skor hijau sempurna di PageSpeed Insights tanpa mengorbankan fungsionalitas.', 'published', 'post', __SUPER_USER_ID__, 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200', '2026-02-25 10:00:00', '2026-02-25 10:00:00'),
    ('post-mock-7', 'Pentingnya Independensi Data di Era AI', 'pentingnya-independensi-data-di-era-ai', '<p>Kita memasuki era di mana konten yang Anda terbitkan dapat dengan cepat dicerna dan didaur ulang oleh model bahasa besar (LLM). Hal ini menimbulkan pertanyaan besar mengenai hak cipta dan monetisasi.</p><p>Memiliki infrastruktur Anda sendiri, alih-alih bergantung pada platform publikasi tertutup, memastikan Anda memiliki kendali penuh atas bagaimana konten Anda diindeks dan diakses oleh bot perayap web.</p>', 'Saat model AI mengambil konten dari web tanpa kompensasi, melindungi data dan infrastruktur Anda sendiri menjadi lebih penting dari sebelumnya.', 'published', 'post', __SUPER_USER_ID__, 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1200', '2026-02-20 10:00:00', '2026-02-20 10:00:00')
ON CONFLICT (id) DO NOTHING;

-- Relationships
INSERT INTO term_relationships (object_id, term_id) VALUES
    ('post-mock-1', 'cat-architecture'),
    ('post-mock-2', 'cat-tutorial'),
    ('post-mock-3', 'cat-seo'),
    ('post-mock-4', 'cat-design'),
    ('post-mock-5', 'cat-strategy'),
    ('post-mock-6', 'cat-performance'),
    ('post-mock-7', 'cat-editorial')
ON CONFLICT (object_id, term_id) DO NOTHING;
