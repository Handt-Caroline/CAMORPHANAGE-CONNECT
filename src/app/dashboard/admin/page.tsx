// Admin Dashboard Page
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import AdminDashboard from '@/components/dashboard/AdminDashboard';

const prisma = new PrismaClient();

export default async function AdminDashboardPage() {
  const session = await auth();

  // Strict security check for admin role
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    console.log('Admin dashboard access denied:', session?.user?.role);
    redirect('/login');
  }

  // Get pending verifications
  const pendingOrphanages = await prisma.orphanageProfile.findMany({
    where: { verificationStatus: 'PENDING' },
    include: {
      user: {
        select: { email: true, createdAt: true },
      },
    },
    orderBy: { id: 'desc' },
  });

  const pendingOrganizations = await prisma.organizationProfile.findMany({
    include: {
      user: {
        select: { email: true, createdAt: true },
      },
    },
    orderBy: { id: 'desc' },
    take: 10, // Limit to recent organizations
  });

  // Get platform statistics
  const stats = {
    totalUsers: await prisma.user.count(),
    totalOrphanages: await prisma.orphanageProfile.count(),
    totalOrganizations: await prisma.organizationProfile.count(),
    verifiedOrphanages: await prisma.orphanageProfile.count({
      where: { verificationStatus: 'VERIFIED' },
    }),
    verifiedOrganizations: await prisma.organizationProfile.count(),
    totalEvents: await prisma.event.count(),
    totalVisits: await prisma.visit.count(),
    totalMessages: await prisma.message.count(),
  };

  // Get recent activity
  const recentEvents = await prisma.event.findMany({
    include: {
      organization: { select: { name: true } },
      orphanage: { select: { name: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  const recentVisits = await prisma.visit.findMany({
    include: {
      organization: { select: { name: true } },
      orphanage: { select: { name: true } },
    },
    orderBy: { visitDate: 'desc' },
    take: 10,
  });

  return (
    <AdminDashboard 
      pendingOrphanages={pendingOrphanages}
      pendingOrganizations={pendingOrganizations}
      stats={stats}
      recentEvents={recentEvents}
      recentVisits={recentVisits}
    />
  );
}
