'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export function ProfileUI() {
    return (
        <Card style={{ display: 'flex', gap: '32px' }}>
            <div style={{ flex: '0 0 150px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '120px', height: '120px', borderRadius: '50%', backgroundColor: '#E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px' }}>
                    👤
                </div>
                <Button variant="secondary" style={{ marginTop: '16px', width: '100%' }}>Change Avatar</Button>
            </div>
            <div style={{ flex: 1 }}>
                <h3 style={{ marginBottom: '16px', fontSize: '18px' }}>User Profile</h3>
                <Input label="Name" placeholder="John Doe" />
                <Input label="Email" placeholder="john@example.com" disabled />

                <div className="mb-4">
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>Role</label>
                    <input readOnly value="Super User" style={{ width: '100%', padding: '0 8px', height: '32px', border: '1px solid var(--admin-border)', borderRadius: '4px', backgroundColor: '#F0F0F1', color: 'var(--admin-text-muted)' }} />
                </div>

                <div className="mb-4">
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>Bio</label>
                    <textarea style={{ width: '100%', padding: '8px', border: '1px solid var(--admin-border)', borderRadius: '4px', height: '100px', fontSize: '14px' }} placeholder="Short bio..." />
                </div>

                <Button variant="primary">Update Profile</Button>
            </div>
        </Card>
    );
}
