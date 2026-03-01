'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const dummyCategories = [
    { id: 1, name: 'Politics', slug: 'politics', count: 5 },
    { id: 2, name: '— Tech', slug: 'tech', count: 3 },
];

export function CategoryManager() {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
            <div>
                <Card style={{ marginBottom: '24px' }}>
                    <h3 style={{ marginBottom: '12px', fontSize: '14px', borderBottom: '1px solid var(--admin-border)', paddingBottom: '8px' }}>Add New Category</h3>
                    <Input label="Name" placeholder="Category name" />
                    <Input label="Slug" placeholder="category-slug" />
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>Parent Category</label>
                        <select style={{ width: '100%', height: '32px', border: '1px solid var(--admin-border)', borderRadius: '4px', padding: '0 8px' }}>
                            <option value="">None</option>
                            <option value="1">Politics</option>
                            <option value="2">Tech</option>
                        </select>
                    </div>
                    <Button variant="primary">Add New Category</Button>
                </Card>
            </div>

            <div>
                <Card>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--admin-border)' }}>
                                <th style={{ padding: '8px' }}><input type="checkbox" /></th>
                                <th style={{ padding: '8px' }}>Name</th>
                                <th style={{ padding: '8px' }}>Slug</th>
                                <th style={{ padding: '8px' }}>Count</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dummyCategories.map(c => (
                                <tr key={c.id} style={{ borderBottom: '1px solid var(--admin-border)' }}>
                                    <td style={{ padding: '8px' }}><input type="checkbox" /></td>
                                    <td style={{ padding: '8px', fontWeight: 'bold', color: 'var(--admin-primary)' }}>{c.name}</td>
                                    <td style={{ padding: '8px' }}>{c.slug}</td>
                                    <td style={{ padding: '8px' }}>{c.count}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
            </div>
        </div>
    );
}
