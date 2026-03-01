import React from 'react';
import { Button } from '@/components/ui/Button';

export default function Login() {
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'linear-gradient(135deg, #2271B1, #135E96, #0A4B78)' }}>
            <div style={{ padding: '48px', backgroundColor: 'var(--admin-card-bg)', borderRadius: '8px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', textAlign: 'center', width: '100%', maxWidth: '400px' }}>
                <h1 style={{ marginBottom: '8px', fontSize: '24px', fontWeight: 'bold' }}>MERPATI CMS</h1>
                <p style={{ color: 'var(--admin-text-muted)', marginBottom: '32px' }}>Press freedom begins with infrastructure independence.</p>

                <form action="/api/auth/signin/google" method="POST">
                    <Button variant="primary" style={{ width: '100%', height: '48px', fontSize: '16px' }} type="submit">
                        🔵 Login with Google
                    </Button>
                </form>
            </div>
        </div>
    );
}
