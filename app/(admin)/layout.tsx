'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/admin/Sidebar';
import { TopBar } from '@/components/admin/TopBar';
import styles from '@/components/admin/admin-layout.module.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className={styles.layout}>
            <TopBar onMenuToggle={() => setSidebarOpen(!isSidebarOpen)} />
            <div className={styles.mainWrapper}>
                <Sidebar isOpen={isSidebarOpen} />
                <main className={styles.content}>
                    {children}
                </main>
            </div>
        </div>
    );
}
