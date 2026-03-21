"use client";

import Link from "next/link";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-[70vh] flex items-center justify-center py-20">
            <div className="container mx-auto px-4">
                <div className="max-w-xl mx-auto text-center space-y-8">
                    <div className="relative">
                        <span className="text-[12rem] font-black text-slate-100 leading-none select-none">404</span>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-24 h-24 bg-indigo-600 rounded-3xl rotate-12 flex items-center justify-center text-white shadow-2xl shadow-indigo-200">
                                <Search className="w-12 h-12 -rotate-12" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-4xl font-black tracking-tight text-slate-900">Halaman Tidak Ditemukan</h1>
                        <p className="text-lg text-slate-500 max-w-md mx-auto leading-relaxed">
                            Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan ke alamat lain.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Link
                            href="/"
                            className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-100 hover:shadow-xl"
                        >
                            <Home className="w-5 h-5" />
                            Kembali ke Beranda
                        </Link>
                        <button
                            onClick={() => window.history.back()}
                            className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Kembali Sebelumnya
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
