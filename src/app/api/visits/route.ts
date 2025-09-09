// Visits API - Log and retrieve visits
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Retrieve visits
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const orphanageId = searchParams.get('orphanageId');
    const organizationId = searchParams.get('organizationId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const whereClause: Record<string, unknown> = {};

    if (session.user.role === 'ORPHANAGE') {
      // Orphanage can see visits to their orphanage
      const orphanageProfile = await prisma.orphanageProfile.findUnique({
        where: { userId: session.user.id },
      });
      
      if (!orphanageProfile) {
        return new NextResponse('Orphanage profile not found', { status: 404 });
      }
      
      whereClause.orphanageId = orphanageProfile.id;
    } else if (session.user.role === 'ORGANIZATION') {
      // Organization can see their own visits
      const organizationProfile = await prisma.organizationProfile.findUnique({
        where: { userId: session.user.id },
      });
      
      if (!organizationProfile) {
        return new NextResponse('Organization profile not found', { status: 404 });
      }
      
      whereClause.organizationId = organizationProfile.id;
    } else if (session.user.role === 'ADMIN') {
      // Admin can see all visits, with optional filters
      if (orphanageId) whereClause.orphanageId = orphanageId;
      if (organizationId) whereClause.organizationId = organizationId;
    } else {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const visits = await prisma.visit.findMany({
      where: whereClause,
      include: {
        organization: {
          select: { name: true },
        },
        orphanage: {
          select: { name: true, address: true },
        },
      },
      orderBy: { visitDate: 'desc' },
      skip,
      take: limit,
    });

    return NextResponse.json(visits);
  } catch (error) {
    console.error('GET_VISITS_ERROR', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// POST: Log a new visit
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ORGANIZATION') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { orphanageId, visitDate, purpose, notes } = body;

    if (!orphanageId || !visitDate || !purpose) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Validate purpose
    const validPurposes = ['DONATION', 'TEACHING', 'WORKSHOP', 'ONLINE_CLASS', 'VOLUNTEERING'];
    if (!validPurposes.includes(purpose)) {
      return new NextResponse('Invalid purpose', { status: 400 });
    }

    // Get organization profile
    const organizationProfile = await prisma.organizationProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!organizationProfile) {
      return new NextResponse('Organization profile not found', { status: 404 });
    }

    // Verify orphanage exists
    const orphanage = await prisma.orphanageProfile.findUnique({
      where: { id: orphanageId },
    });

    if (!orphanage) {
      return new NextResponse('Orphanage not found', { status: 404 });
    }

    // Create the visit
    const visit = await prisma.visit.create({
      data: {
        organizationId: organizationProfile.id,
        orphanageId,
        visitDate: new Date(visitDate),
        purpose,
        notes: notes || null,
      },
      include: {
        organization: {
          select: { name: true },
        },
        orphanage: {
          select: { name: true, address: true },
        },
      },
    });

    return NextResponse.json(visit);
  } catch (error) {
    console.error('CREATE_VISIT_ERROR', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
