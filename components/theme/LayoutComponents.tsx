import React from 'react';
import Link from 'next/link';
import { themeEngine } from '@/lib/theme';

export function Header() {
    const config = themeEngine.getThemeConfig();
    return (
        <header style={{ borderBottom: '1px solid var(--pub-border)', padding: '16px 0', backgroundColor: config.settings.colors.background }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 600, margin: 0 }}>
                    <Link href="/" style={{ color: 'var(--pub-heading)' }}>MERPATI CMS</Link>
                </h1>
                <nav style={{ display: 'flex', gap: '24px' }}>
                    <Link href="/">Laporan Utama</Link>
                    <Link href="/">Berita Terkini</Link>
                    <Link href="/admin">Login / Admin</Link>
                </nav>
            </div>
        </header>
    );
}

export function Footer() {
    return (
        <footer style={{ borderTop: '1px solid var(--pub-border)', padding: '32px 0', marginTop: '64px', backgroundColor: 'var(--pub-surface)' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', color: 'var(--pub-muted)', padding: '0 24px' }}>
                <p>© 2026 MERPATI Media. All rights reserved.</p>
                <p>Powered by MERPATI CMS</p>
            </div>
        </footer>
    );
}
