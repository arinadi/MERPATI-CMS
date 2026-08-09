# Reference: Vercel Blob SDK

## Overview
Vercel Blob provides a fast, edge-optimized storage solution for media files without setting up an external S3 bucket manually.

## Installation
```bash
pnpm install @vercel/blob
```

## Setup
Ensure `BLOB_READ_WRITE_TOKEN` is present in `.env.local` (Vercel automatically provisions this when you connect the Blob store).

## Direct Server Upload
Ideal for Server Actions receiving `FormData`.

```typescript
'use server'
import { put } from '@vercel/blob';

export async function uploadImage(formData: FormData) {
  const file = formData.get('file') as File;
  
  if (!file) throw new Error("No file provided");

  const blob = await put(file.name, file, { 
    access: 'public',
    // token is automatically picked up from env
  });

  return blob; // { url, downloadUrl, pathname, size, uploadedAt }
}
```

## Client Uploads (Direct to Blob)
If files are large (Vercel serverless has a 4.5MB request body limit), you must use client uploads.
```bash
pnpm install @vercel/blob/client
```

*Create Route Handler (`app/api/upload/route.ts`):*
```typescript
import { handleUpload } from '@vercel/blob/client';
// Read Vercel documentation for the specific handleUpload boilerplate
```

*Use `upload` hook in client component:*
```typescript
import { upload } from '@vercel/blob/client';
// usage: await upload(file.name, file, { access: 'public', handleUploadUrl: '/api/upload' });
```

## Caveats
* The 4.5MB payload limit on Next.js Serverless functions applies if routing the file through a Server Action `FormData`. For images, it's usually fine, but client direct uploads bypass this limit safely.
