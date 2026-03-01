'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export function SettingsUI() {
    const [activeTab, setActiveTab] = useState('general');

    return (
        <Card>
            <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid var(--admin-border)', marginBottom: '16px', paddingBottom: '8px' }}>
                <button
                    onClick={() => setActiveTab('general')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: activeTab === 'general' ? 'bold' : 'normal', borderBottom: activeTab === 'general' ? '2px solid var(--admin-primary)' : 'none' }}
                >
                    General
                </button>
                <button
                    onClick={() => setActiveTab('telegram')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: activeTab === 'telegram' ? 'bold' : 'normal', borderBottom: activeTab === 'telegram' ? '2px solid var(--admin-primary)' : 'none' }}
                >
                    Telegram
                </button>
            </div>

            {activeTab === 'general' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <Input label="Site Title" placeholder="MERPATI CMS" />
                    <Input label="Tagline" placeholder="Journalist Platform" />
                    <Input label="Description" placeholder="A platform for journalists." />
                    <Input label="Posts Per Page" type="number" defaultValue={10} />
                    <Button variant="primary" style={{ alignSelf: 'flex-start' }}>Save Settings</Button>
                </div>
            )}

            {activeTab === 'telegram' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <Input label="Bot Token" type="password" placeholder="123456789:ABCdefGHIjklMNOpqRSTuvWXYZ" />
                    <Input label="Chat ID" placeholder="-1001234567890" />
                    <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                        <label style={{ fontSize: '13px' }}><input type="checkbox" defaultChecked /> Notify on Publish</label>
                        <label style={{ fontSize: '13px' }}><input type="checkbox" defaultChecked /> Notify on New User</label>
                    </div>
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <Button variant="secondary">Test Notification</Button>
                        <Button variant="primary">Save Settings</Button>
                    </div>
                </div>
            )}
        </Card>
    );
}
