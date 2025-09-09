// Users API - Get users by role for messaging
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');

    if (!role) {
      return new NextResponse('Role parameter is required', { status: 400 });
    }

    // Validate role
    if (!['ORPHANAGE', 'ORGANIZATION', 'ADMIN'].includes(role)) {
      return new NextResponse('Invalid role', { status: 400 });
    }

    // Get users by role, excluding the current user
    const users = await prisma.user.findMany({
      where: {
        role: role as 'ORPHANAGE' | 'ORGANIZATION' | 'ADMIN',
        NOT: {
          id: session.user.id
        }
      },
      select: {
        id: true,
        email: true,
        role: true,
        orphanage: role === 'ORPHANAGE' ? {
          select: {
            name: true,
            verificationStatus: true
          }
        } : undefined,
        organization: role === 'ORGANIZATION' ? {
          select: {
            name: true
          }
        } : undefined
      },
      orderBy: role === 'ORPHANAGE'
        ? [
            { orphanage: { verificationStatus: 'desc' } },
            { orphanage: { name: 'asc' } },
            { email: 'asc' }
          ]
        : role === 'ORGANIZATION'
        ? [
            { organization: { name: 'asc' } },
            { email: 'asc' }
          ]
        : [{ email: 'asc' }]
    });

    // Filter out orphanages that don't have profiles or unverified ones for organizations
    const filteredUsers = users.filter((user: typeof users[0]) => {
      if (role === 'ORPHANAGE') {
        return user.orphanage && user.orphanage.verificationStatus === 'VERIFIED';
      }
      if (role === 'ORGANIZATION') {
        return user.organization;
      }
      return true;
    });

    return NextResponse.json(filteredUsers);
  } catch (error) {
    console.error('GET_USERS_ERROR', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
