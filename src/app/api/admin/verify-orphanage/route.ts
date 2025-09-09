// Admin API - Verify Orphanages
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return new NextResponse('Missing id or status', { status: 400 });
    }

    if (!['VERIFIED', 'REJECTED'].includes(status)) {
      return new NextResponse('Invalid status', { status: 400 });
    }

    // Update orphanage verification status
    const updatedOrphanage = await prisma.orphanageProfile.update({
      where: { id },
      data: { verificationStatus: status },
      include: {
        user: {
          select: { email: true },
        },
      },
    });

    // TODO: Send email notification to orphanage about verification status

    return NextResponse.json({
      message: `Orphanage ${status.toLowerCase()} successfully`,
      orphanage: updatedOrphanage,
    });
  } catch (error) {
    console.error('VERIFY_ORPHANAGE_ERROR', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
