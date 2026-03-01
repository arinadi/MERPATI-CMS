'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './admin-layout.module.css';

const navItems = [
    { href: '/admin', icon: '📊', label: 'Dashboard' },
    { href: '/admin/posts', icon: '📝', label: 'Posts' },
    { href: '/admin/media', icon: '📷', label: 'Media' },
    { href: '/admin/categories', icon: '🏷', label: 'Categories' },
    { href: '/admin/tags', icon: '🏷', label: 'Tags' },
    { href: '/admin/themes', icon: '🎨', label: 'Themes' },
    { href: '/admin/users', icon: '👤', label: 'Users' },
    { href: '/admin/settings', icon: '⚙', label: 'Settings' },
];

export function Sidebar({ isOpen }: { isOpen: boolean }) {
    const pathname = usePathname();

    return (
        <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
            <nav className={styles.nav}>
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`${styles.link} ${isActive ? styles.active : ''}`}
                        >
                            <span className={styles.linkIcon}>{item.icon}</span>
                            <span className={styles.linkLabel}>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
