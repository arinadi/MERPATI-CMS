import { NextResponse } from 'next/server';
import { auth } from '@/auth';

// Helper to mock the RPC handler
async function handleAction(action: string, payload: unknown) {
    switch (action) {
        case 'posts.list':
            return { success: true, data: [] };
        case 'posts.create':
            return { success: true, data: { id: 1, ...(payload as Record<string, unknown>) } };
        case 'categories.list':
            return { success: true, data: [] };
        case 'tags.list':
            return { success: true, data: [] };
        case 'users.list':
            return { success: true, data: [] };
        case 'settings.get':
            return { success: true, data: {} };
        default:
            throw new Error(`Unknown action: ${action}`);
    }
}

export async function POST(req: Request) {
    const session = await auth();

    // Basic protection
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { action, payload } = await req.json();

        if (!action) {
            return NextResponse.json({ error: 'Missing action parameter' }, { status: 400 });
        }

        const result = await handleAction(action, payload);
        return NextResponse.json(result);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
