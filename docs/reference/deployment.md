# Deployment (Vercel)

Catatan ini sebelumnya tersimpan sebagai komentar di `.env.production`. File itu
tidak pernah berisi variabel apa pun — semua environment variable produksi diatur
lewat dashboard Vercel (Project → Settings → Environment Variables), bukan lewat
file yang ikut ter-commit.

## Environment variable yang WAJIB di-update saat ganti domain

Contoh di bawah memakai domain `arinano.work`.

| Variable | Kegunaan |
| --- | --- |
| `AUTH_URL` | Root URL yang dipakai Auth.js (NextAuth) untuk proses login dan callback. |
| `NEXT_PUBLIC_SITE_URL` | Dipakai di sisi klien untuk metadata SEO, canonical tag, dan sitemap. |

Lihat `.env.example` untuk daftar lengkap variable beserta formatnya.

## Google OAuth

Ganti domain tidak cukup di Vercel saja. Perbarui juga OAuth 2.0 Client ID di
Google Cloud Console:

1. Tambahkan `https://arinano.work` pada **Authorized JavaScript origins**.
2. Tambahkan `https://arinano.work/api/auth/callback/google` pada
   **Authorized redirect URIs**.

Login lewat Google akan gagal dengan `redirect_uri_mismatch` sampai kedua entri
di atas cocok persis dengan domain baru.
