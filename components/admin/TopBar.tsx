'use client';

import React from 'react';
import Link from 'next/link';
import styles from './admin-layout.module.css';

interface TopBarProps {
    onMenuToggle: () => void;
}

export function TopBar({ onMenuToggle }: TopBarProps) {
    return (
        <header className={styles.topbar}>
            <div className={styles.topbarLeft}>
                <div className={styles.topbarLink} onClick={onMenuToggle}>
                    <span style={{ fontSize: '18px' }}>≡</span>
                </div>
                <Link href="/" className={styles.topbarLink}>
                    <span>🏠</span> Visit Site
                </Link>
            </div>
            <div className={styles.topbarRight}>
                <div className={styles.topbarLink}>
                    <span>Hello, Journalist</span> <span>👤</span>
                </div>
            </div>
        </header>
    );
}
