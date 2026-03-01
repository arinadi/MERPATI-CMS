'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';

export function PublishBox() {
    const { showToast } = useToast();

    const handlePublish = () => {
        showToast('Post published successfully!', 'success');
    };

    const handleDraft = () => {
        showToast('Draft saved!', 'info');
    };

    return (
        <Card style={{ backgroundColor: '#F6F7F7' }}>
            <h3 style={{ marginBottom: '12px', fontSize: '14px', borderBottom: '1px solid var(--admin-border)', paddingBottom: '8px' }}>Publish</h3>
            <div style={{ marginBottom: '16px', fontSize: '13px' }}>
                <div style={{ marginBottom: '8px' }}><strong>Status:</strong> Draft</div>
                <div><strong>Visibility:</strong> Public</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button variant="secondary" onClick={handleDraft}>Save Draft</Button>
                <Button variant="primary" onClick={handlePublish}>Publish</Button>
            </div>
        </Card>
    );
}
