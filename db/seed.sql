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
