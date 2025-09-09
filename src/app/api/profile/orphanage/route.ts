// FILE: src/app/api/profile/orphanage/route.ts

import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Fetches the profile for the logged-in director
export async function GET() {
    const session = await auth();

    if (!session?.user || session.user.role !== 'ORPHANAGE') {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    let profile = await prisma.orphanageProfile.findUnique({
        where: { userId: session.user.id },
    });

    // If a profile doesn't exist for this user, create a default one
    if (!profile) {
        profile = await prisma.orphanageProfile.create({
            data: {
                userId: session.user.id,
                name: 'New Orphanage Profile', // Default name
                description: 'Please update your description.',
                address: '',
                // Use new fields, ensuring optional ones can be null
                profileImageUrl: null, 
                directorName: null,
                registrationNumber: null,
                legalDocumentsUrl: null,
            }
        });
    }

    return NextResponse.json(profile);
}


// POST: Updates the profile for the logged-in director
export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user || session.user.role !== 'ORPHANAGE') {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    // Destructure all the new fields from the request body
    const body = await request.json();
    const { 
        name, 
        description, 
        address, 
        phone, 
        profileImageUrl,
        directorName,
        registrationNumber,
        legalDocumentsUrl
    } = body;
    
    const updatedProfile = await prisma.orphanageProfile.update({
      where: { userId: session.user.id },
      data: {
        name,
        description,
        address,
        phone,
        // Use the new field names to update the database
        profileImageUrl,
        directorName,
        registrationNumber,
        legalDocumentsUrl
      },
    });

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error("UPDATE_ORPHANAGE_PROFILE_ERROR", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}