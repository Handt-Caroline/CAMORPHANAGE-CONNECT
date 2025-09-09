// FILE: src/app/api/events/manage/route.ts

import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient, EventStatus } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Fetches all events for the logged-in orphanage director
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

  const events = await prisma.event.findMany({
    where: { orphanageId: profile.id },
    // Include the organization's name for display purposes
    include: {
      organization: {
        select: { name: true },
      },
    },
    orderBy: { proposedDate: 'asc' },
  });

  return NextResponse.json(events);
}

// PATCH: Updates the status of an event (e.g., to APPROVED or DECLINED)
export async function PATCH(request: Request) {
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

  const { eventId, status } = await request.json();

  if (!eventId || !status) {
    return new NextResponse('Event ID and status are required', { status: 400 });
  }
  
  if (!Object.values(EventStatus).includes(status)) {
    return new NextResponse('Invalid status value', { status: 400 });
  }

  // Security Check: Verify the event belongs to the director's orphanage before updating
  const eventToUpdate = await prisma.event.findFirst({
      where: { id: eventId, orphanageId: profile.id }
  });

  if (!eventToUpdate) {
      return new NextResponse('Event not found or permission denied', { status: 404 });
  }

  const updatedEvent = await prisma.event.update({
    where: { id: eventId },
    data: { status: status as EventStatus },
  });

  return NextResponse.json(updatedEvent);
}