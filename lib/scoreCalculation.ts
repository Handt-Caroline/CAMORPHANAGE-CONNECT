// Orphanage Score Calculation Utilities
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface ScoreFactors {
  visitCount: number;
  actualVisits: number;
  events: number;
  needs: number;
  verificationStatus: string;
  daysSinceCreation: number;
}

/**
 * Calculate orphanage score based on various engagement factors
 * Score ranges from 0 to 100
 */
export function calculateOrphanageScore(factors: ScoreFactors): number {
  let score = 0;

  // Base score for verification status (0-20 points)
  switch (factors.verificationStatus) {
    case 'VERIFIED':
      score += 20;
      break;
    case 'PENDING':
      score += 10;
      break;
    case 'UNVERIFIED':
      score += 0;
      break;
    default:
      score += 0;
  }

  // Profile visit count (0-25 points)
  // Logarithmic scale to prevent runaway scores
  if (factors.visitCount > 0) {
    score += Math.min(25, Math.log10(factors.visitCount + 1) * 10);
  }

  // Actual organization visits (0-30 points)
  // Higher weight for actual visits vs profile views
  if (factors.actualVisits > 0) {
    score += Math.min(30, factors.actualVisits * 3);
  }

  // Events hosted/participated (0-15 points)
  if (factors.events > 0) {
    score += Math.min(15, factors.events * 2);
  }

  // Active needs posted (0-10 points)
  // Shows engagement and transparency
  if (factors.needs > 0) {
    score += Math.min(10, factors.needs * 1.5);
  }

  // Recency bonus/penalty (0-5 points)
  // Newer profiles get a small boost, very old inactive ones get penalty
  if (factors.daysSinceCreation < 30) {
    score += 5; // New profile boost
  } else if (factors.daysSinceCreation > 365 && factors.visitCount === 0) {
    score -= 5; // Inactive old profile penalty
  }

  // Ensure score is between 0 and 100
  return Math.max(0, Math.min(100, Math.round(score * 100) / 100));
}

/**
 * Update score for a specific orphanage
 */
export async function updateOrphanageScore(orphanageId: string): Promise<number> {
  try {
    // Get orphanage data with related counts
    const orphanage = await prisma.orphanageProfile.findUnique({
      where: { id: orphanageId },
      include: {
        visits: true,
        events: true,
        needs: {
          where: { status: 'ACTIVE' }
        },
        user: {
          select: { createdAt: true }
        }
      }
    });

    if (!orphanage) {
      throw new Error(`Orphanage with ID ${orphanageId} not found`);
    }

    // Calculate factors
    const daysSinceCreation = Math.floor(
      (Date.now() - orphanage.user.createdAt.getTime()) / (1000 * 60 * 60 * 24)
    );

    const factors: ScoreFactors = {
      visitCount: orphanage.visitCount,
      actualVisits: orphanage.visits.length,
      events: orphanage.events.length,
      needs: orphanage.needs.length,
      verificationStatus: orphanage.verificationStatus,
      daysSinceCreation
    };

    // Calculate new score
    const newScore = calculateOrphanageScore(factors);

    // Update the score in database
    await prisma.orphanageProfile.update({
      where: { id: orphanageId },
      data: { score: newScore }
    });

    return newScore;
  } catch (error) {
    console.error(`Error updating score for orphanage ${orphanageId}:`, error);
    throw error;
  }
}

/**
 * Update scores for all orphanages
 */
export async function updateAllOrphanageScores(): Promise<void> {
  try {
    const orphanages = await prisma.orphanageProfile.findMany({
      select: { id: true }
    });

    console.log(`Updating scores for ${orphanages.length} orphanages...`);

    for (const orphanage of orphanages) {
      await updateOrphanageScore(orphanage.id);
    }

    console.log('All orphanage scores updated successfully');
  } catch (error) {
    console.error('Error updating all orphanage scores:', error);
    throw error;
  }
}

/**
 * Get top orphanages by score
 */
export async function getTopOrphanagesByScore(limit: number = 10) {
  return await prisma.orphanageProfile.findMany({
    where: {
      verificationStatus: 'VERIFIED'
    },
    orderBy: [
      { score: 'desc' },
      { visitCount: 'desc' },
      { name: 'asc' }
    ],
    take: limit,
    include: {
      needs: {
        where: { status: 'ACTIVE' },
        take: 3
      },
      visits: {
        take: 1,
        orderBy: { visitDate: 'desc' }
      }
    }
  });
}

/**
 * Increment visit count and update score
 */
export async function incrementVisitCount(orphanageId: string): Promise<void> {
  try {
    // Increment visit count
    await prisma.orphanageProfile.update({
      where: { id: orphanageId },
      data: {
        visitCount: {
          increment: 1
        }
      }
    });

    // Update score based on new visit count
    await updateOrphanageScore(orphanageId);
  } catch (error) {
    console.error(`Error incrementing visit count for orphanage ${orphanageId}:`, error);
    throw error;
  }
}
