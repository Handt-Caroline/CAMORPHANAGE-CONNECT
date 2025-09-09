// Track orphanage profile visits
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { updateOrphanageScore } from '@/lib/scoreCalculation';

const prisma = new PrismaClient();

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Increment visit count for the orphanage
    const updatedOrphanage = await prisma.orphanageProfile.update({
      where: { id },
      data: {
        visitCount: {
          increment: 1,
        },
      },
      select: {
        id: true,
        visitCount: true,
        score: true,
      },
    });

    // Update the score based on new visit count
    const newScore = await updateOrphanageScore(id);

    return NextResponse.json({
      success: true,
      visitCount: updatedOrphanage.visitCount,
      score: newScore
    });
  } catch (error) {
    console.error('TRACK_VISIT_ERROR', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
