// FILE: src/app/api/events/my-proposals/route.ts

import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Fetches all events proposed by the logged-in organization
export async function GET() {
  try {
    const session = await auth();
    console.log('Session in my-proposals:', session);

    if (!session?.user || session.user.role !== 'ORGANIZATION') {
      console.log('Unauthorized access attempt:', session?.user?.role);
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const profile = await prisma.organizationProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      console.log('Organization profile not found for user:', session.user.id);
      return new NextResponse('Organization profile not found', { status: 404 });
    }

    const events = await prisma.event.findMany({
      where: { organizationId: profile.id },
      // Include the orphanage's name for context
      include: {
        orphanage: {
          select: { name: true },
        },
      },
      orderBy: { proposedDate: 'desc' },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error in my-proposals API:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
