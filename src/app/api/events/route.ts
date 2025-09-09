// FILE: src/app/api/events/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const session = await auth();
    console.log('Session in events POST:', session);

    if (!session?.user || session.user.role !== 'ORGANIZATION') {
      console.log('Unauthorized POST attempt:', session?.user?.role);
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const organizationProfile = await prisma.organizationProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!organizationProfile) {
      console.log('Organization profile not found for user:', session.user.id);
      return new NextResponse('Organization profile not found', { status: 404 });
    }

    const body = await request.json();
    const { title, description, proposedDate, orphanageId } = body;

    if (!title || !proposedDate || !orphanageId) {
      console.log('Missing required fields:', { title, proposedDate, orphanageId });
      return new NextResponse('Missing required fields', { status: 400 });
    }

    const newEvent = await prisma.event.create({
      data: {
        title,
        description,
        proposedDate: new Date(proposedDate),
        orphanageId,
        organizationId: organizationProfile.id,
        status: 'PENDING', // Default status for new proposals
      },
    });

    return NextResponse.json(newEvent);
  } catch (error) {
    console.error("CREATE_EVENT_ERROR", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}