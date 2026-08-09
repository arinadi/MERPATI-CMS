"use client";

import { bootstrapDatabase } from "@/lib/actions/setup";
import { useState } from "react";

export function SetupForm() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError(null);
        try {
            await bootstrapDatabase(formData);
        } catch (e: unknown) {
            if (e instanceof Error && e.message === "NEXT_REDIRECT") {
                return;
            }
            setError(e instanceof Error ? e.message : "Terjadi kesalahan.");
            setLoading(false);
        }
    }

    return (
        <>
            {/* Full-screen loading overlay */}
            {loading && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-6 p-8 rounded-xl">
                        <svg className="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <div className="text-center">
                            <p className="text-lg font-semibold">Menginstal Database...</p>
                            <p className="text-sm text-muted-foreground mt-1">Membuat tabel, seed data, dan konfigurasi awal.</p>
                            <p className="text-xs text-muted-foreground mt-3">Mohon jangan tutup halaman ini.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Full-screen error overlay */}
            {error && !loading && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-4 p-8 rounded-xl max-w-md text-center">
                        <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                            <svg className="h-6 w-6 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-lg font-semibold text-destructive">Instalasi Gagal</p>
                            <p className="text-sm text-muted-foreground mt-2 break-words">{error}</p>
                        </div>
                        <button
                            onClick={() => setError(null)}
                            className="mt-2 rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                            Coba Lagi
                        </button>
                    </div>
                </div>
            )}

            <form action={handleSubmit} className="space-y-4">
                <div>
                    <label
                        htmlFor="siteTitle"
                        className="block text-sm font-medium mb-1.5"
                    >
                        Judul Situs
                    </label>
                    <input
                        type="text"
                        id="siteTitle"
                        name="siteTitle"
                        required
                        placeholder="Contoh: Media Independen Indonesia"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                </div>

                <div>
                    <label
                        htmlFor="siteTagline"
                        className="block text-sm font-medium mb-1.5"
                    >
                        Tagline
                    </label>
                    <input
                        type="text"
                        id="siteTagline"
                        name="siteTagline"
                        required
                        placeholder="Contoh: Berita Terkini, Terpercaya, dan Independen"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Install &amp; Initialize
                </button>
            </form>
        </>
    );
}

