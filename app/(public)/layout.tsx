"use client";

import Link from "next/link";
import "./theme.css";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="pub-wrapper">
            <header className="pub-header">
                <div className="pub-header-top">
                    <Link href="/" className="pub-logo">
                        🕊️ MERPATI
                    </Link>
                    <div className="pub-header-actions">
                        <input type="search" placeholder="Cari berita..." className="pub-search" />
                        <Link href="/login" style={{ fontFamily: "system-ui, sans-serif", fontSize: "14px", fontWeight: 600, color: "var(--pub-accent)" }}>
                            Login
                        </Link>
                    </div>
                </div>
                <nav className="pub-nav">
                    <ul className="pub-nav-list">
                        <li><Link href="/">Terkini</Link></li>
                        <li><Link href="/category/nasional">Nasional</Link></li>
                        <li><Link href="/category/ekonomi">Ekonomi</Link></li>
                        <li><Link href="/category/politik">Politik</Link></li>
                        <li><Link href="/category/teknologi">Teknologi</Link></li>
                        <li><Link href="/category/olahraga">Olahraga</Link></li>
                        <li><Link href="/category/opini">Opini</Link></li>
                    </ul>
                </nav>
            </header>

            <main className="pub-main">
                {children}
            </main>

            <footer className="pub-footer">
                <div className="pub-footer-grid">
                    <div className="pub-footer-col">
                        <div style={{ fontSize: "24px", fontWeight: 800, marginBottom: "16px", fontFamily: "system-ui, sans-serif" }}>
                            🕊️ MERPATI
                        </div>
                        <p style={{ color: "rgba(255,255,255,0.7)", fontFamily: "system-ui, sans-serif", fontSize: "14px", lineHeight: 1.6 }}>
                            Media Editorial Ringkas, Praktis, Aman, Tetap Independen. Berita terpercaya untuk Indonesia.
                        </p>
                    </div>
                    <div className="pub-footer-col">
                        <h3>Kategori</h3>
                        <Link href="/category/nasional" className="pub-footer-link">Nasional</Link>
                        <Link href="/category/ekonomi" className="pub-footer-link">Ekonomi</Link>
                        <Link href="/category/politik" className="pub-footer-link">Politik</Link>
                        <Link href="/category/teknologi" className="pub-footer-link">Teknologi</Link>
                    </div>
                    <div className="pub-footer-col">
                        <h3>Tentang</h3>
                        <Link href="/tentang-kami" className="pub-footer-link">Tentang Kami</Link>
                        <Link href="/redaksi" className="pub-footer-link">Redaksi</Link>
                        <Link href="/kontak" className="pub-footer-link">Kontak</Link>
                        <Link href="/kebijakan-privasi" className="pub-footer-link">Kebijakan Privasi</Link>
                    </div>
                    <div className="pub-footer-col">
                        <h3>Ikuti Kami</h3>
                        <a href="#" className="pub-footer-link">Twitter / X</a>
                        <a href="#" className="pub-footer-link">Facebook</a>
                        <a href="#" className="pub-footer-link">Instagram</a>
                        <a href="#" className="pub-footer-link">RSS Feed</a>
                    </div>
                </div>
                <div style={{ textAlign: "center", marginTop: "60px", paddingTop: "24px", borderTop: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", fontFamily: "system-ui, sans-serif", fontSize: "13px" }}>
                    © {new Date().getFullYear()} MERPATI-CMS. All rights reserved. Built with Next.js & Auth.js.
                </div>
            </footer>
        </div>
    );
}
