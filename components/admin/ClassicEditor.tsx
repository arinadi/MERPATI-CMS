'use client';

import React, { useRef, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export function ClassicEditor() {
    const contentEditableRef = useRef<HTMLDivElement>(null);
    const [isHtmlMode, setHtmlMode] = useState(false);
    const [htmlContent, setHtmlContent] = useState('<p>Start writing...</p>');

    const format = (command: string, value?: string) => {
        document.execCommand(command, false, value);
        if (contentEditableRef.current) {
            setHtmlContent(contentEditableRef.current.innerHTML);
        }
    };

    const toggleHtml = () => {
        setHtmlMode(!isHtmlMode);
    };

    return (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '8px', borderBottom: '1px solid var(--admin-border)', backgroundColor: '#F6F7F7', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                <Button variant="secondary" onClick={() => format('bold')} title="Bold">B</Button>
                <Button variant="secondary" onClick={() => format('italic')} title="Italic">I</Button>
                <Button variant="secondary" onClick={() => format('insertUnorderedList')} title="List">≡</Button>
                <Button variant="secondary" onClick={toggleHtml} title="HTML Mode">{'<>'}</Button>
            </div>
            <div style={{ padding: '16px' }}>
                {isHtmlMode ? (
                    <textarea
                        style={{ width: '100%', height: '400px', padding: '8px', fontFamily: 'monospace', border: 'none', resize: 'vertical' }}
                        value={htmlContent}
                        onChange={(e) => setHtmlContent(e.target.value)}
                    />
                ) : (
                    <div
                        ref={contentEditableRef}
                        contentEditable
                        suppressContentEditableWarning
                        style={{ width: '100%', minHeight: '400px', outline: 'none', fontFamily: 'var(--font-editor)', fontSize: '16px' }}
                        onInput={(e) => setHtmlContent(e.currentTarget.innerHTML)}
                    >
                        <p>Start writing...</p>
                    </div>
                )}
            </div>
        </Card>
    );
}
