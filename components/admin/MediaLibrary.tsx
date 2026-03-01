'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

// Dummy media items
const mediaList = [
    { id: 1, name: 'photo.jpg', size: '245 KB', url: '#' },
    { id: 2, name: 'hero.png', size: '1.2 MB', url: '#' },
    { id: 3, name: 'banner.jpg', size: '890 KB', url: '#' },
];

export function MediaLibrary() {
    return (
        <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'center' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Media Library</h2>
                <Button variant="primary">Upload New</Button>
            </div>

            <div style={{ padding: '24px', border: '2px dashed var(--admin-border)', borderRadius: '4px', textAlign: 'center', marginBottom: '16px', color: 'var(--admin-text-muted)' }}>
                <p>Drop files to upload</p>
                <p style={{ fontSize: '12px' }}>Maximum upload file size: 4.5 MB</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '16px' }}>
                {mediaList.map((m) => (
                    <div key={m.id} style={{ border: '1px solid var(--admin-border)', borderRadius: '4px', padding: '8px', textAlign: 'center' }}>
                        <div style={{ backgroundColor: '#E5E7EB', height: '100px', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            🖼️
                        </div>
                        <div style={{ fontSize: '12px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--admin-text-muted)' }}>{m.size}</div>
                    </div>
                ))}
            </div>
        </Card>
    );
}
