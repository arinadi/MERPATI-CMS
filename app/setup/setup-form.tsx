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
                // Let Next.js handle the redirect
                return;
            }
            setError(e instanceof Error ? e.message : "Terjadi kesalahan.");
            setLoading(false);
        }
    }

    return (
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

            {error && (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                {loading ? "Menginstal..." : "Install & Initialize"}
            </button>
        </form>
    );
}
