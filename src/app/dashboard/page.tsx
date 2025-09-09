// Dashboard router - redirects users to appropriate dashboard based on role
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function DashboardPage() {
  const session = await auth();

  // Security check: Ensure user is authenticated
  if (!session?.user?.id || !session?.user?.role) {
    console.log('Dashboard access denied: No valid session');
    redirect('/login');
  }

  const { role, id } = session.user;

  console.log(`Dashboard access for user ${id} with role: ${role}`);

  // Role-based routing with strict validation
  if (role === 'ORPHANAGE') {
    const orphanageProfile = await prisma.orphanageProfile.findUnique({
      where: { userId: id },
    });

    if (!orphanageProfile) {
      console.log('Orphanage profile not found, redirecting to setup');
      redirect('/setup-profile');
    }

    console.log('Redirecting to orphanage dashboard');
    redirect('/dashboard/orphanage');
  }

  if (role === 'ORGANIZATION') {
    const organizationProfile = await prisma.organizationProfile.findUnique({
      where: { userId: id },
    });

    if (!organizationProfile) {
      console.log('Organization profile not found, redirecting to setup');
      redirect('/setup-profile');
    }

    console.log('Redirecting to organization dashboard');
    redirect('/dashboard/organization');
  }

  if (role === 'ADMIN') {
    console.log('Redirecting to admin dashboard');
    redirect('/dashboard/admin');
  }

  // Invalid role fallback
  console.log(`Invalid role: ${role}, redirecting to login`);
  redirect('/login');
}
