# API Reference: Vercel Blob Storage

## Overview
- **Service**: Vercel Blob — CDN-backed file storage
- **Free Tier**: 500MB storage, 1000 put/copy/del operations per month
- **CDN**: Files served from Vercel's global edge network
- **SDK**: `@vercel/blob`

## Installation
```bash
pnpm add @vercel/blob
```

## Environment Variable
```bash
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxx
```
Generated in Vercel Dashboard → Storage → Blob → Create Store.

## Core API

### Upload (Put)
```typescript
import { put } from '@vercel/blob';

const blob = await put('articles/hero.jpg', file, {
  access: 'public',
  contentType: file.type,
});
// blob.url → "https://xxx.public.blob.vercel-storage.com/articles/hero-abc123.jpg"
```

### Delete
```typescript
import { del } from '@vercel/blob';

await del('https://xxx.public.blob.vercel-storage.com/articles/hero-abc123.jpg');
```

### List
```typescript
import { list } from '@vercel/blob';

const { blobs, cursor } = await list({ prefix: 'articles/', limit: 100 });
```

### Server-Side Upload (Next.js API Route)
```typescript
// app/api/media/route.ts
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;

  const blob = await put(file.name, file, {
    access: 'public',
    contentType: file.type,
  });

  return NextResponse.json({ url: blob.url, size: file.size });
}
```

## Rate Limits
| Operation | Free Tier |
|---|---|
| Put / Copy / Delete | 1,000 / month |
| Total storage | 500 MB |
| File size limit | 500 MB per file (but we restrict to 4.5MB) |

## Error Codes
| Error | Description |
|---|---|
| `BlobAccessError` | Invalid or expired token |
| `BlobServiceNotAvailable` | Service temporarily down |
| `BlobContentTypeNotAllowed` | Invalid content type |
| `BlobFileTooLarge` | Exceeds size limit |

## Caveats
- **Token must be server-side only** — never expose `BLOB_READ_WRITE_TOKEN` to client
- **URLs are permanent** — once uploaded, URL doesn't change (can cache forever)
- **No folder structure** — paths are just key prefixes, not real folders
- **Max 4.5MB for free tier serverless** — Vercel serverless body size limit is 4.5MB
