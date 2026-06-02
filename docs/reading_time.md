# Reading Time — Research & Implementation

## 1. Dasar Ilmiah — Kecepatan Baca Manusia

### Data dari Riset Akademik (Wikipedia / Studi 2012)

| Segmen Pembaca | Kecepatan Baca | Catatan |
|---|---|---|
| Rata-rata pembaca dewasa (silent reading) | **200–238 wpm** | Rentang umum yang paling banyak dikutip |
| Rata-rata lintas 17 bahasa (studi 2012) | **184 ±29 wpm** | Membaca keras; silent ~20% lebih cepat |
| Setara karakter/menit (all languages) | **~1.000 cpm** | Konsisten lintas bahasa |
| Speed reader terlatih | 400–700 wpm | Tapi komprehensi menurun drastis |
| Batas fisiologis (anatomi mata) | **maks ~900 wpm** | Di atas ini tidak mungkin secara fisik |
| Audio books (kenyamanan) | 150–160 wpm | Acuan narasi audio |

> Untuk bahasa **Asia** (Arab, Hebrew, China, Jepang), angka WPM lebih rendah dari bahasa Latin. Namun karakter-per-menit tetap sekitar ~1.000.

---

## 2. Bagaimana Platform Besar Menghitung Reading Time

### Medium (Platform Referensi Utama)

- **Teks:** ~265 wpm
- **Gambar — sliding scale:**
  - Gambar 1: 12 detik
  - Gambar 2: 11 detik
  - Gambar 3: 10 detik
  - … turun 1 detik per gambar
  - Gambar ke-11+: masing-masing 3 detik

```
readingTime = (wordCount / 265 * 60) + imageSeconds
```

### Library `reading-time` npm (ngryman — 68K+ download/minggu)

```ts
type ReadingTimeResults = {
  minutes: number;   // dibulatkan ke atas
  time: number;      // ms presisi
  words: { total: number };
};
// Default: 200 wpm, word bound = whitespace
```

---

## 3. Faktor yang Mempengaruhi Kalkulasi

### Jenis Konten

| Konten | Penyesuaian |
|---|---|
| Teks biasa | Baseline WPM |
| Gambar | +3–12 detik (sliding scale) |
| Blok kode `<pre><code>` | Opsional di-exclude (baca kode lebih lambat) |
| Video embed | Diabaikan (durasi tidak terukur dari HTML) |

### Bahasa

| Bahasa | WPM Rekomendasi |
|---|---|
| Inggris | 200–265 wpm |
| **Indonesia** | **200 wpm** (kata lebih panjang morfologis) |
| CJK (China/Jepang/Korea) | 500 karakter/menit |

### Pre-processing Wajib

```js
// Strip HTML sebelum hitung kata
const plainText = html
  .replace(/<[^>]+>/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();
```

---

## 4. Keputusan Arsitektur: Server-side vs DB vs Client JS

| | DB | Client JS | **Server compute** ✅ |
|---|---|---|---|
| SEO / SSR | ✅ | ❌ flash | ✅ |
| Schema migration | perlu | tidak | tidak |
| Akurasi jika konten diedit | perlu update | ✅ | ✅ |
| Tersedia di listing/card | ✅ | partial | ✅ |
| Overhead | minimal | hydration JS | **zero** |

**Kesimpulan:** Hitung di **server saat render** (server component), tanpa DB column baru dan tanpa client JS. Cocok dengan arsitektur Next.js MERPATI-CMS yang sudah async server component.

---

## 5. Formula yang Diimplementasikan

```ts
// lib/utils/reading-time.ts
export function getReadingTime(html: string, wpm = 200): number {
  // 1. Strip HTML
  const text = html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // 2. Hitung kata
  const wordCount = text.split(' ').filter(Boolean).length;

  // 3. Hitung gambar (Medium sliding scale)
  const imageCount = (html.match(/<img[^>]+>/gi) || []).length;
  let imageSeconds = 0;
  for (let i = 0; i < imageCount; i++) {
    imageSeconds += Math.max(3, 12 - i);
  }

  // 4. Total waktu → menit (minimum 1)
  const totalSeconds = (wordCount / wpm) * 60 + imageSeconds;
  return Math.max(1, Math.ceil(totalSeconds / 60));
}
```

---

## 6. Pola Tampilan

| Platform | Format |
|---|---|
| Medium | `5 min read` |
| Dev.to | `5 min read` |
| Ghost CMS | `5 minute read` |
| **MERPATI-CMS** | `3 menit baca` |

---

## 7. File yang Dimodifikasi

- `lib/utils/reading-time.ts` — **[NEW]** helper function
- `themes/news/components/single-post.tsx` — tambah kalkulasi & tampilan
