// Analytics API - Calculate visit statistics and impact metrics
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'overview';
    const timeframe = searchParams.get('timeframe') || '12months';

    // Calculate date range based on timeframe
    const now = new Date();
    let startDate: Date;
    
    switch (timeframe) {
      case '1month':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        break;
      case '3months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
        break;
      case '6months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
        break;
      case '12months':
      default:
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        break;
    }

    if (session.user.role === 'ORPHANAGE') {
      return await getOrphanageAnalytics(session.user.id, startDate, type);
    } else if (session.user.role === 'ORGANIZATION') {
      return await getOrganizationAnalytics(session.user.id, startDate, type);
    } else if (session.user.role === 'ADMIN') {
      return await getAdminAnalytics(startDate, type);
    }

    return new NextResponse('Forbidden', { status: 403 });
  } catch (error) {
    console.error('ANALYTICS_ERROR', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

async function getOrphanageAnalytics(userId: string, startDate: Date, type: string) {
  const orphanageProfile = await prisma.orphanageProfile.findUnique({
    where: { userId },
  });

  if (!orphanageProfile) {
    return new NextResponse('Orphanage profile not found', { status: 404 });
  }

  // Get visits to this orphanage
  const visits = await prisma.visit.findMany({
    where: {
      orphanageId: orphanageProfile.id,
      visitDate: { gte: startDate },
    },
    include: {
      organization: {
        select: { name: true },
      },
    },
  });

  // Calculate purpose breakdown
  const purposeBreakdown = visits.reduce((acc, visit) => {
    acc[visit.purpose] = (acc[visit.purpose] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Calculate monthly visit trends
  const monthlyVisits = visits.reduce((acc, visit) => {
    const month = visit.visitDate.toISOString().slice(0, 7); // YYYY-MM
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Get unique organizations that visited
  const uniqueOrganizations = new Set(visits.map(v => v.organizationId)).size;

  // Get active needs count
  const activeNeeds = await prisma.need.count({
    where: {
      orphanageId: orphanageProfile.id,
      status: 'ACTIVE',
    },
  });

  // Get pending events count
  const pendingEvents = await prisma.event.count({
    where: {
      orphanageId: orphanageProfile.id,
      status: 'PENDING',
    },
  });

  const analytics = {
    totalVisits: visits.length,
    uniqueOrganizations,
    activeNeeds,
    pendingEvents,
    purposeBreakdown,
    monthlyVisits,
    topOrganizations: Object.entries(
      visits.reduce((acc, visit) => {
        const orgName = visit.organization.name;
        acc[orgName] = (acc[orgName] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    )
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count })),
  };

  return NextResponse.json(analytics);
}

async function getOrganizationAnalytics(userId: string, startDate: Date, type: string) {
  const organizationProfile = await prisma.organizationProfile.findUnique({
    where: { userId },
  });

  if (!organizationProfile) {
    return new NextResponse('Organization profile not found', { status: 404 });
  }

  // Get visits by this organization
  const visits = await prisma.visit.findMany({
    where: {
      organizationId: organizationProfile.id,
      visitDate: { gte: startDate },
    },
    include: {
      orphanage: {
        select: { name: true },
      },
    },
  });

  // Calculate purpose breakdown
  const purposeBreakdown = visits.reduce((acc, visit) => {
    acc[visit.purpose] = (acc[visit.purpose] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Calculate monthly visit trends
  const monthlyVisits = visits.reduce((acc, visit) => {
    const month = visit.visitDate.toISOString().slice(0, 7); // YYYY-MM
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Get unique orphanages helped
  const uniqueOrphanages = new Set(visits.map(v => v.orphanageId)).size;

  // Get events statistics
  const totalEvents = await prisma.event.count({
    where: { organizationId: organizationProfile.id },
  });

  const approvedEvents = await prisma.event.count({
    where: {
      organizationId: organizationProfile.id,
      status: 'APPROVED',
    },
  });

  const analytics = {
    totalVisits: visits.length,
    uniqueOrphanages,
    totalEvents,
    approvedEvents,
    purposeBreakdown,
    monthlyVisits,
    topOrphanages: Object.entries(
      visits.reduce((acc, visit) => {
        const orphanageName = visit.orphanage.name;
        acc[orphanageName] = (acc[orphanageName] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    )
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count })),
  };

  return NextResponse.json(analytics);
}

async function getAdminAnalytics(startDate: Date, type: string) {
  // Platform-wide analytics for admins
  const totalUsers = await prisma.user.count();
  const totalOrphanages = await prisma.orphanageProfile.count();
  const totalOrganizations = await prisma.organizationProfile.count();
  const totalVisits = await prisma.visit.count({
    where: { visitDate: { gte: startDate } },
  });
  const totalEvents = await prisma.event.count();

  // Get visits for purpose breakdown
  const visits = await prisma.visit.findMany({
    where: { visitDate: { gte: startDate } },
    select: { purpose: true, visitDate: true },
  });

  const purposeBreakdown = visits.reduce((acc, visit) => {
    acc[visit.purpose] = (acc[visit.purpose] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const monthlyVisits = visits.reduce((acc, visit) => {
    const month = visit.visitDate.toISOString().slice(0, 7);
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const analytics = {
    totalUsers,
    totalOrphanages,
    totalOrganizations,
    totalVisits,
    totalEvents,
    purposeBreakdown,
    monthlyVisits,
  };

  return NextResponse.json(analytics);
}
