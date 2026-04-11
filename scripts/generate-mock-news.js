import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==========================================
// Mockup Data Settings
// ==========================================
const CATEGORIES = [
  { id: '-cat-1', name: 'Architecture', slug: 'architecture', desc: 'Artikel tentang arsitektur software dan sistem.' },
  { id: '-cat-2', name: 'Tutorial', slug: 'tutorial', desc: 'Panduan langkah demi langkah penggunaan CMS.' },
  { id: '-cat-3', name: 'SEO', slug: 'seo', desc: 'Optimasi mesin pencari dan strategi konten.' },
  { id: '-cat-4', name: 'Design', slug: 'design', desc: 'Desain antarmuka dan pengalaman pengguna.' },
  { id: '-cat-5', name: 'Strategy', slug: 'strategy', desc: 'Strategi media digital dan editorial independen.' },
  { id: '-cat-6', name: 'Performance', slug: 'performance', desc: 'Optimasi performa dan kecepatan web.' },
  { id: '-cat-7', name: 'Editorial', slug: 'editorial', desc: 'Opini editorial dan analisis industri media.' },
];

const IMAGES = {
  architecture: [
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1200'
  ],
  tutorial: [
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=1200'
  ],
  seo: [
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&q=80&w=1200'
  ],
  design: [
    'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&q=80&w=1200'
  ],
  strategy: [
    'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1552581232-414dc5bfd1d5?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=1200'
  ],
  performance: [
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200'
  ],
  editorial: [
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1455390582262-044cdead2708?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=1200'
  ]
};

const RANDOM_TITLES = [
  "Mengapa Serverless adalah Masa Depan Jurnalisme Digital",
  "Panduan Migrasi dari WordPress ke Merpati CMS",
  "Memaksimalkan SEO Native dengan JSON-LD Otomatis",
  "Desain Mobile-First untuk Pembaca Modern",
  "Membangun Komunitas Pembaca Setia dengan Newsletter",
  "Optimasi Core Web Vitals untuk Portal Berita",
  "Pentingnya Independensi Data Media di Era AI",
  "Meningkatkan Engagement dengan Tampilan Clean Mode",
  "Tailwind CSS v4: Standar Baru Styling Front-end Vercel",
  "Review Arsitektur Drizzle ORM pada Skala Enterprise",
  "Apakah SSR Selalu Lebih Baik dari SSG di Next.js 16?",
  "Cara Mengelola CDN Caching yang Efektif untuk Gambar",
  "Pentingnya Aksesibilitas Web (A11y) pada Platform Editorial",
  "Manajemen Konten Bebas Headless CMS",
  "Mengamankan Rute API dari Scraping Konten Ilegal",
  "Integrasi Telegram Bot untuk Notifikasi Berita Real-time",
  "Revolusi Markdown: Kenapa Jurnalis Mulai Menyukai TipTap",
  "Dampak Algoritma Google Terhadap Traffic Publikasi Independen",
  "Menurunkan Biaya Server hingga 90% dengan Cloudflare Workers",
  "Bagaimana MERPATI CMS Menghindari Vendor Lock-in",
  "Panduan Cepat Implementasi RSS Feed",
  "Studi Kasus: Migrasi Publikasi Raksasa ke React Server Components",
  "Menulis UX Copy yang Memancing Klik (Secara Etis)",
  "Database Relasional vs NoSQL untuk Platform Berita Terkini",
  "Pemanfaatan Payload CMS vs MERPATI: Mana yang Lebih Ringan?",
  "Edge Computing: Masa Depan Distribusi Konten Global",
  "Menambahkan Open Graph Image Dinamis dengan Satori",
  "A/B Testing pada Struktur Navigasi Media Berita",
  "Kenapa Load Time Detik Pertama Sangat Krusial",
  "Belajar dari Kegagalan Arsitektur Media Tradisional"
];

const RANDOM_INTRO = [
  "Industri media sering kali terjebak dalam biaya infrastruktur yang membengkak seiring dengan naiknya trafik.",
  "Banyak penerbit merasa terjebak dengan WordPress karena sejarah konten yang panjang. Namun, migrasi tidak harus menjadi mimpi buruk.",
  "SEO bukan lagi sekadar memasukkan kata kunci ke dalam teks. Mesin pencari modern membutuhkan konteks.",
  "Kami membuang paradigma lama di mana dashboard harus diakses melalui layar desktop yang lebar.",
  "Ketergantungan pada lalu lintas media sosial membuat banyak media rentan terhadap perubahan algoritma yang tiba-tiba.",
  "Situs berita sering kali lambat karena banyaknya iklan, pelacak, dan gambar yang tidak dioptimalkan.",
  "Kita memasuki era di mana konten yang Anda terbitkan dapat dengan cepat dicerna dan didaur ulang oleh model AI."
];

function generateFeaturedImageJSON(url, categoryName) {
  return JSON.stringify({
    url: url,
    alt_text: `Ilustrasi ${categoryName} Content (Unsplash)`
  });
}

function escapeSql(str) {
  return str.replace(/'/g, "''");
}

let postIdCounter = 1;

function generatePosts() {
  const posts = [];
  const relationships = [];

  CATEGORIES.forEach(cat => {
    const images = IMAGES[cat.slug] || IMAGES.architecture;
    
    // Generate 6 posts per category
    for (let i = 0; i < 6; i++) {
       const title = RANDOM_TITLES[(postIdCounter - 1) % RANDOM_TITLES.length];
       const intro = RANDOM_INTRO[(postIdCounter - 1) % RANDOM_INTRO.length];
       const excerpt = `${intro} Artikel ini membahas studi kasus dan praktik terbaik mengenai ${title.toLowerCase()}.`;
       
       const content = `<h2>Pendahuluan</h2>\n<p>${intro}</p>\n<p>Dalam ranah <strong>${cat.name}</strong>, pendekatan modern telah membuktikan bahwa kecepatan dan skalabilitas bisa didapat dengan <em>zero configuration</em> asal kita memilih stack teknologi yang tepat.</p>\n<p><em>Tulisan dummy bernomor ID ${postIdCounter} ini merupakan pelengkap data untuk memastikan tema editorial Anda dapat mendemonstrasikan layout dengan konten yang relevan.</em></p>\n<h3>Arsitektur & Konsep</h3>\n<p>Menggunakan Next.js App Router dan Drizzle ORM, aliran data dari serverless database dapat sampai ke client dalam sub-200ms. Keberhasilan ini juga bergantung pada edge latency.</p>\n<ul>\n<li>Zero-bundle Javascript berkat RSC</li>\n<li>Sistem Cache yang cerdas dan tervalidasi menggunakan <code>unstable_cache</code></li>\n<li>Database ringan via poolless connection</li>\n</ul>\n<blockquote><p>Inovasi sejati terjadi saat kompleksitas backend tidak lagi menghalangi jurnalis dalam merilis laporan beritanya.</p></blockquote>`;
       
       const img = images[i % images.length];
       const featuredImage = generateFeaturedImageJSON(img, cat.name);
       const postId = `-${postIdCounter}`;

       // Calculate mock dates (descending from today down)
       const today = new Date('2026-04-10T00:00:00Z');
       today.setHours(today.getHours() - (postIdCounter * 6));
       const dateStr = today.toISOString().replace('T', ' ').substring(0, 19);

       posts.push(`('${postId}', '${escapeSql(title)}', '${cat.slug}-mock-${postIdCounter}', '${escapeSql(content)}', '${escapeSql(excerpt)}', 'published', 'post', __SUPER_USER_ID__, '${escapeSql(featuredImage)}', '${dateStr}', '${dateStr}')`);
       
       relationships.push(`('${postId}', '${cat.id}')`);
       
       postIdCounter++;
    }
  });

  return { posts, relationships };
}

async function main() {
  // Read original seed.sql
  const dbDir = path.join(__dirname, '..', 'db');
  const seedPath = path.join(dbDir, 'seed.sql');
  let seedContent = fs.readFileSync(seedPath, 'utf8');

  // We'll locate the mock posts block
  const mockStartIndicator = '-- MOCK POSTS — Rich Format Content';
  
  const parts = seedContent.split(mockStartIndicator);
  if (parts.length < 2) {
      console.log('Cannot find mock section. Terminating.');
      return;
  }
  let baseContent = parts[0];

  const { posts, relationships } = generatePosts();

  let newMockSql = `
-- MOCK CATEGORIES (TEKNOLOGI & PUBLISHING)
INSERT INTO terms (id, name, slug, taxonomy, description) VALUES
${CATEGORIES.map(c => `    ('${c.id}', '${c.name}', '${c.slug}', 'category', '${escapeSql(c.desc)}')`).join(',\n')}
ON CONFLICT (id) DO NOTHING;

-- MOCK POSTS (CLEANUP-FRIENDLY NEGATIVE IDS)
INSERT INTO posts (id, title, slug, content, excerpt, status, type, author_id, featured_image, created_at, updated_at) VALUES
${posts.join(',\n')}
ON CONFLICT (id) DO NOTHING;

-- MOCK TERM RELATIONSHIPS
INSERT INTO term_relationships (object_id, term_id) VALUES
${relationships.join(',\n')}
ON CONFLICT (object_id, term_id) DO NOTHING;

-- MOCK RELATED POSTS (Circular assignments among negative IDs)
INSERT INTO post_relationships (post_id, related_post_id) VALUES
`;

  // Provide every mock post with 3 related posts
  let related = [];
  for (let i = 1; i < postIdCounter; i++) {
     let r1 = (i % (postIdCounter - 1)) + 1;
     let r2 = ((i + 1) % (postIdCounter - 1)) + 1;
     let r3 = ((i + 2) % (postIdCounter - 1)) + 1;
     if (r1 === i) r1 = (r1 + 1) % (postIdCounter - 1) + 1;
     if (r2 === i) r2 = (r2 + 2) % (postIdCounter - 1) + 1;
     if (r3 === i) r3 = (r3 + 3) % (postIdCounter - 1) + 1;

     related.push(`    ('-${i}', '-${r1}')`);
     related.push(`    ('-${i}', '-${r2}')`);
     related.push(`    ('-${i}', '-${r3}')`);
  }

  newMockSql += related.join(',\n') + '\nON CONFLICT (post_id, related_post_id) DO NOTHING;\n';

  // Remove the old string-based mock categories that used UUID or 'cat-architecture' from db/seed.sql
  // Because baseContent contains legacy: INSERT INTO terms (id, name, slug) VALUES ('cat-architecture' ...)
  // We can just regex replace the "Mock Categories" segment out of baseContent so we don't duplicate them.
  // Remove old Mock Categories block (ends before next -- ═══ separator)
  let cleanedBaseContent = baseContent.replace(/-- Mock Categories[\s\S]*?(?=\n-- ═)/, '');
  // Remove old Mock Tags block (ends before next -- ═══ separator)
  cleanedBaseContent = cleanedBaseContent.replace(/-- Mock Tags[\s\S]*?(?=\n-- ═)/, '');

  let newMenusSql = `
-- MENUS
INSERT INTO menus (id, name, slug, location) VALUES
    ('menu-main', 'Menu Utama', 'menu-utama', 'primary'),
    ('menu-footer', 'Menu Footer', 'menu-footer', 'footer')
ON CONFLICT (id) DO NOTHING;

INSERT INTO menu_items (id, menu_id, title, url, object_id, type, sort_order) VALUES
    ('mi-home', 'menu-main', 'Beranda', '/', NULL, 'custom', 0),
${CATEGORIES.map((cat, idx) => `    ('mi-cat-${idx + 1}', 'menu-main', '${cat.name}', NULL, '${cat.id}', 'category', ${idx + 1})`).join(',\n')},
    ('mi-tentang', 'menu-main', 'Tentang', NULL, 'page-tentang', 'page', ${CATEGORIES.length + 1}),
    ('mi-footer-home', 'menu-footer', 'Beranda', '/', NULL, 'custom', 0),
    ('mi-footer-tentang', 'menu-footer', 'Tentang', NULL, 'page-tentang', 'page', 1)
ON CONFLICT (id) DO NOTHING;
`;

  const finalSeed = cleanedBaseContent + newMockSql + newMenusSql;
  
  fs.writeFileSync(seedPath, finalSeed);
  console.log('Successfully overwritten db/seed.sql with specific tech/MERPATI mock data using negative IDs.');

  // Delete the old original_seed.txt 
  if (fs.existsSync('original_seed.txt')) {
      fs.unlinkSync('original_seed.txt');
  }
}

main();
