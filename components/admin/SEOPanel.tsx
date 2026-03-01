'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

export function SEOPanel() {
    return (
        <Card>
            <h3 style={{ marginBottom: '12px', fontSize: '14px', borderBottom: '1px solid var(--admin-border)', paddingBottom: '8px' }}>SEO Settings</h3>
            <Input label="SEO Title" placeholder="Override default title" />
            <Input label="Meta Description" placeholder="Short summary" />
            <Input label="Canonical URL" placeholder="https://..." />
            <div style={{ marginTop: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', fontSize: '13px' }}>
                    <input type="checkbox" style={{ marginRight: '8px' }} defaultChecked />
                    Indexable (allow search engines)
                </label>
            </div>
        </Card>
    );
}
