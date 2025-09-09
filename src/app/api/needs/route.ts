// FILE: src/app/api/needs/route.ts

import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Fetches all needs for the logged-in orphanage
export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ORPHANAGE') {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const profile = await prisma.orphanageProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!profile) {
    return new NextResponse('Orphanage profile not found', { status: 404 });
  }

  const needs = await prisma.need.findMany({
    where: { orphanageId: profile.id },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(needs);
}

// POST: Creates a new need for the logged-in orphanage
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ORPHANAGE') {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const profile = await prisma.orphanageProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!profile) {
    return new NextResponse('Orphanage profile not found', { status: 404 });
  }

  const { description } = await request.json();
  if (!description) {
    return new NextResponse('Description is required', { status: 400 });
  }

  const newNeed = await prisma.need.create({
    data: {
      description,
      orphanageId: profile.id,
    },
  });

  return NextResponse.json(newNeed);
}

// DELETE: Deletes a specific need for the logged-in orphanage
export async function DELETE(request: Request) {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ORPHANAGE') {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const profile = await prisma.orphanageProfile.findUnique({
        where: { userId: session.user.id },
    });

    if (!profile) {
        return new NextResponse('Orphanage profile not found', { status: 404 });
    }
    
    const { searchParams } = new URL(request.url);
    const needId = searchParams.get('id');

    if (!needId) {
        return new NextResponse('Need ID is required', { status: 400 });
    }

    // Security check: Ensure the need being deleted actually belongs to the user's orphanage.
    const needToDelete = await prisma.need.findFirst({
        where: {
            id: needId,
            orphanageId: profile.id,
        },
    });

    if (!needToDelete) {
        return new NextResponse('Need not found or you do not have permission to delete it', { status: 404 });
    }

    await prisma.need.delete({
        where: { id: needId },
    });

    return new NextResponse(null, { status: 204 }); // 204 No Content is a standard success response for DELETE
}