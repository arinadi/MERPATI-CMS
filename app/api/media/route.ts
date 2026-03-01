import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function POST(req: Request) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // Use Vercel Blob here (mock implemented)
        // const blob = await put(file.name, file, { access: 'public' });
        const mockBlob = { url: 'https://mock.vercel-storage.com/' + file.name, url_download: '...' };

        return NextResponse.json({ success: true, data: mockBlob });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
