// API route for updating individual events
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    // Validate status
    if (!['PENDING', 'APPROVED', 'DECLINED', 'COMPLETED'].includes(status)) {
      return new NextResponse('Invalid status', { status: 400 });
    }

    // Get the event to check permissions
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        orphanage: true,
        organization: true,
      },
    });

    if (!event) {
      return new NextResponse('Event not found', { status: 404 });
    }

    // Check if user has permission to update this event
    if (session.user.role === 'ORPHANAGE') {
      // Orphanage can approve/decline events for their orphanage
      const orphanageProfile = await prisma.orphanageProfile.findUnique({
        where: { userId: session.user.id },
      });

      if (!orphanageProfile || orphanageProfile.id !== event.orphanageId) {
        return new NextResponse('Forbidden', { status: 403 });
      }
    } else if (session.user.role === 'ORGANIZATION') {
      // Organization can mark their own events as completed
      const organizationProfile = await prisma.organizationProfile.findUnique({
        where: { userId: session.user.id },
      });

      if (!organizationProfile || organizationProfile.id !== event.organizationId) {
        return new NextResponse('Forbidden', { status: 403 });
      }

      // Organizations can only mark events as completed
      if (status !== 'COMPLETED') {
        return new NextResponse('Organizations can only mark events as completed', { status: 400 });
      }
    } else if (session.user.role !== 'ADMIN') {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // Update the event
    const updatedEvent = await prisma.event.update({
      where: { id },
      data: { status },
      include: {
        orphanage: {
          select: { name: true },
        },
        organization: {
          select: { name: true },
        },
      },
    });

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error('UPDATE_EVENT_ERROR', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
