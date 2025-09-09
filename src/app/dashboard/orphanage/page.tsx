// Orphanage Dashboard Page
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import OrphanageDashboard from '@/components/dashboard/NewOrphanageDashboard';

const prisma = new PrismaClient();

export default async function OrphanageDashboardPage() {
  const session = await auth();

  // Strict security check for orphanage role
  if (!session?.user?.id || session.user.role !== 'ORPHANAGE') {
    console.log('Orphanage dashboard access denied:', session?.user?.role);
    redirect('/login');
  }

  // Check if orphanage profile exists
  const profile = await prisma.orphanageProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      needs: {
        where: { status: 'ACTIVE' },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!profile) {
    redirect('/setup-profile');
  }

  // Get pending events for this orphanage
  const pendingEvents = await prisma.event.findMany({
    where: { 
      orphanageId: profile.id,
      status: 'PENDING'
    },
    include: {
      organization: {
        select: { name: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Get recent messages
  const recentMessages = await prisma.message.findMany({
    where: { recipientId: session.user.id },
    include: {
      sender: {
        include: {
          organization: {
            select: { name: true },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  return (
    <OrphanageDashboard 
      profile={profile}
      pendingEvents={pendingEvents}
      recentMessages={recentMessages}
    />
  );
}
