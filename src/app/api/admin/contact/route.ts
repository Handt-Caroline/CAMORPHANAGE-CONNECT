// Admin Contact API - Get admin user ID for contact purposes
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

    // Don't allow admin users to contact themselves
    if (session.user.role === 'ADMIN') {
      return new NextResponse('Admin users cannot contact admin', { status: 403 });
    }

    // Find the first admin user
    const admin = await prisma.user.findFirst({
      where: {
        role: 'ADMIN'
      },
      select: {
        id: true
      }
    });

    if (!admin) {
      return new NextResponse('No admin found', { status: 404 });
    }

    return NextResponse.json({ adminId: admin.id });
  } catch (error) {
    console.error('GET_ADMIN_CONTACT_ERROR', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
