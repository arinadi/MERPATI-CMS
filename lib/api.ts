export async function rpcCall<T>(action: string, payload: unknown = {}): Promise<T> {
    const res = await fetch('/api/rpc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, payload })
    });

    const result = await res.json();
    if (!res.ok) {
        throw new Error(result.error || 'API Request Failed');
    }

    return result.data;
}

export async function uploadMedia(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/media', {
        method: 'POST',
        body: formData
    });

    const result = await res.json();
    if (!res.ok) {
        throw new Error(result.error || 'Upload failed');
    }

    return result.data;
}
