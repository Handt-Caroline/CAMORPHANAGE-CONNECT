// API route for setting up user profiles after registration
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { role } = session.user;

    if (role === 'ORPHANAGE') {
      const { name, description, address, phone, directorName, registrationNumber } = body;

      if (!name || !description || !address) {
        return new NextResponse('Missing required fields', { status: 400 });
      }

      // Check if profile already exists
      const existingProfile = await prisma.orphanageProfile.findUnique({
        where: { userId: session.user.id },
      });

      if (existingProfile) {
        return NextResponse.json({ message: 'Profile already exists' }, { status: 400 });
      }

      const profile = await prisma.orphanageProfile.create({
        data: {
          userId: session.user.id,
          name,
          description,
          address,
          phone,
          directorName,
          registrationNumber,
          verificationStatus: 'PENDING',
        },
      });

      return NextResponse.json(profile);
    } 
    
    else if (role === 'ORGANIZATION') {
      const {
        name,
        contactPerson,
        phone,
        description,
        address,
        registrationNumber,
        profileImageUrl,
        purposes
      } = body;

      if (!name || !purposes || purposes.length === 0) {
        return new NextResponse('Missing required fields', { status: 400 });
      }

      // Check if profile already exists
      const existingProfile = await prisma.organizationProfile.findUnique({
        where: { userId: session.user.id },
      });

      if (existingProfile) {
        return NextResponse.json({ message: 'Profile already exists' }, { status: 400 });
      }

      const profile = await prisma.organizationProfile.create({
        data: {
          userId: session.user.id,
          name,
          contactPerson,
          phone,
          description,
          address,
          registrationNumber,
          profileImageUrl,
          purposes: JSON.stringify(purposes),
        },
      });

      return NextResponse.json(profile);
    }

    return new NextResponse('Invalid role', { status: 400 });
  } catch (error) {
    console.error('PROFILE_SETUP_ERROR', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
