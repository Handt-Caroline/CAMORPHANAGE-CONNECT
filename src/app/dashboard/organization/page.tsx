// Organization Dashboard Page
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import OrganizationDashboard from '@/components/dashboard/NewOrganizationDashboard';

const prisma = new PrismaClient();

export default async function OrganizationDashboardPage() {
  const session = await auth();

  // Strict security check for organization role
  if (!session?.user?.id || session.user.role !== 'ORGANIZATION') {
    console.log('Organization dashboard access denied:', session?.user?.role);
    redirect('/login');
  }

  // Check if organization profile exists
  const profile = await prisma.organizationProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!profile) {
    redirect('/setup-profile');
  }

  // Get organization's proposed events
  const proposedEvents = await prisma.event.findMany({
    where: { organizationId: profile.id },
    include: {
      orphanage: {
        select: { name: true, address: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Get organization's visits
  const visits = await prisma.visit.findMany({
    where: { organizationId: profile.id },
    include: {
      orphanage: {
        select: { name: true },
      },
    },
    orderBy: { visitDate: 'desc' },
    take: 10,
  });

  // Get recent messages
  const recentMessages = await prisma.message.findMany({
    where: { senderId: session.user.id },
    include: {
      recipient: {
        include: {
          orphanage: {
            select: { name: true },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  // Get all orphanages for browsing
  const orphanages = await prisma.orphanageProfile.findMany({
    where: {
      verificationStatus: 'VERIFIED',
    },
    include: {
      needs: {
        where: { status: 'ACTIVE' },
        take: 3,
      },
    },
    orderBy: { name: 'asc' },
  });

  // Calculate visit statistics
  const visitStats = visits.reduce((acc, visit) => {
    acc[visit.purpose] = (acc[visit.purpose] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <OrganizationDashboard 
      profile={profile}
      proposedEvents={proposedEvents}
      visits={visits}
      recentMessages={recentMessages}
      orphanages={orphanages}
      visitStats={visitStats}
    />
  );
}
