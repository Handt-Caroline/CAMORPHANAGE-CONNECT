// FILE: src/app/api/upload/route.ts

import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'profile-image', 'document', 'gallery'

    if (!file) {
      return new NextResponse('No file provided', { status: 400 });
    }

    // Validate file type and size
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return new NextResponse('File too large (max 10MB)', { status: 400 });
    }

    // Define allowed file types based on upload type
    const allowedTypes: Record<string, string[]> = {
      'profile-image': ['image/jpeg', 'image/png', 'image/webp'],
      'document': ['application/pdf', 'image/jpeg', 'image/png'],
      'gallery': ['image/jpeg', 'image/png', 'image/webp'],
    };

    if (type && allowedTypes[type] && !allowedTypes[type].includes(file.type)) {
      return new NextResponse('Invalid file type', { status: 400 });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split('.').pop();
    const filename = `${type || 'file'}-${timestamp}-${randomString}.${extension}`;

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
    });

    return NextResponse.json({
      url: blob.url,
      filename: filename,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error('UPLOAD_ERROR', error);
    return new NextResponse('Upload failed', { status: 500 });
  }
}