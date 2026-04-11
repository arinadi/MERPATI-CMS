import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center container mx-auto px-4 text-center">
      <div className="font-black italic text-9xl tracking-tighter mb-4" style={{ color: 'var(--news-primary)' }}>
        4<span style={{ color: 'var(--news-accent)' }}>0</span>4
      </div>
      <h1 className="text-3xl font-bold mb-4 uppercase tracking-wider">Halaman Tidak Ditemukan</h1>
      <p className="text-gray-600 mb-8 max-w-md">
        Maaf, halaman yang Anda cari mungkin telah dihapus, diubah namanya, atau tidak tersedia untuk sementara waktu.
      </p>
      <Link href="/" className="px-8 py-3 bg-[var(--news-primary)] text-white font-bold rounded-sm hover:opacity-90 transition-opacity">
        KEMBALI KE BERANDA
      </Link>
    </div>
  );
}
