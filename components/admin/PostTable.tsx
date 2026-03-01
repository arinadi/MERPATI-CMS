'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

// Dummy data
const posts = [
    { id: 1, title: 'Welcome to MERPATI CMS', author: 'Admin', categories: ['System'], date: '2/28', status: 'Published' },
    { id: 2, title: 'Draft Post Example', author: 'Journalist 1', categories: ['News'], date: '2/29', status: 'Draft' },
];

export function PostTable() {
    return (
        <Card>
            <div className="flex justify-between flex-wrap gap-4 mb-4" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div>
                    <span style={{ marginRight: '8px' }}>All (15)</span> |
                    <span style={{ margin: '0 8px', color: 'var(--admin-primary)' }}>Published (10)</span> |
                    <span style={{ margin: '0 8px', color: 'var(--admin-primary)' }}>Draft (4)</span> |
                    <span style={{ margin: '0 0 0 8px', color: 'var(--admin-error)' }}>Trash (1)</span>
                </div>
                <div>
                    <Button variant="secondary" style={{ marginRight: '8px' }}>Filter</Button>
                    <Button variant="primary">Search</Button>
                </div>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid var(--admin-border)' }}>
                        <th style={{ padding: '8px' }}><input type="checkbox" /></th>
                        <th style={{ padding: '8px' }}>Title</th>
                        <th style={{ padding: '8px' }}>Author</th>
                        <th style={{ padding: '8px' }}>Categories</th>
                        <th style={{ padding: '8px' }}>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {posts.map(p => (
                        <tr key={p.id} style={{ borderBottom: '1px solid var(--admin-border)' }}>
                            <td style={{ padding: '8px' }}><input type="checkbox" /></td>
                            <td style={{ padding: '8px', fontWeight: 'bold', color: 'var(--admin-primary)' }}>{p.title}</td>
                            <td style={{ padding: '8px' }}>{p.author}</td>
                            <td style={{ padding: '8px' }}>{p.categories.join(', ')}</td>
                            <td style={{ padding: '8px' }}>
                                <div>{p.date}</div>
                                <Badge variant={p.status === 'Published' ? 'success' : 'warning'}>{p.status}</Badge>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Card>
    );
}
