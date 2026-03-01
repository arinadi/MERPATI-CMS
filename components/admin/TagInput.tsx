'use client';

import React, { useState, KeyboardEvent } from 'react';
import { Card } from '@/components/ui/Card';

export function TagInput() {
    const [tags, setTags] = useState<string[]>(['news', 'urgent']);
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const newTag = inputValue.trim();
            if (newTag && !tags.includes(newTag)) {
                setTags([...tags, newTag]);
            }
            setInputValue('');
        }
    };

    const removeTag = (indexToRemove: number) => {
        setTags(tags.filter((_, idx) => idx !== indexToRemove));
    };

    return (
        <Card>
            <h3 style={{ marginBottom: '12px', fontSize: '14px', borderBottom: '1px solid var(--admin-border)', paddingBottom: '8px' }}>Tags</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                {tags.map((tag, idx) => (
                    <span
                        key={idx}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            backgroundColor: '#E5E7EB',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '12px'
                        }}
                    >
                        {tag}
                        <button
                            style={{ background: 'none', border: 'none', marginLeft: '4px', cursor: 'pointer', fontSize: '12px' }}
                            onClick={() => removeTag(idx)}
                        >
                            &times;
                        </button>
                    </span>
                ))}
            </div>
            <input
                type="text"
                placeholder="Add tag and press Enter"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid var(--admin-border)',
                    borderRadius: '4px',
                    fontSize: '13px'
                }}
            />
        </Card>
    );
}
