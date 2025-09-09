// API route to check if user has completed profile setup
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { role, id } = session.user;

    if (role === 'ORPHANAGE') {
      const profile = await prisma.orphanageProfile.findUnique({
        where: { userId: id },
      });
      return NextResponse.json({ 
        hasProfile: !!profile, 
        role,
        profile: profile ? { id: profile.id, name: profile.name } : null
      });
    } 
    
    else if (role === 'ORGANIZATION') {
      const profile = await prisma.organizationProfile.findUnique({
        where: { userId: id },
      });
      return NextResponse.json({ 
        hasProfile: !!profile, 
        role,
        profile: profile ? { id: profile.id, name: profile.name } : null
      });
    }
    
    else if (role === 'ADMIN') {
      // Admins don't need profile setup
      return NextResponse.json({ 
        hasProfile: true, 
        role,
        profile: { id: id, name: 'Administrator' }
      });
    }

    return NextResponse.json({ hasProfile: false, role });
  } catch (error) {
    console.error('PROFILE_CHECK_ERROR', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
