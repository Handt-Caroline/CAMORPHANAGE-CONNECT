// API endpoint to get top-scored orphanages
import { NextRequest, NextResponse } from 'next/server';
import { getTopOrphanagesByScore } from '@/lib/scoreCalculation';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    // Validate limit
    if (limit < 1 || limit > 50) {
      return NextResponse.json(
        { error: 'Limit must be between 1 and 50' },
        { status: 400 }
      );
    }

    const topOrphanages = await getTopOrphanagesByScore(limit);

    return NextResponse.json({
      success: true,
      data: topOrphanages,
      count: topOrphanages.length
    });
  } catch (error) {
    console.error('Error fetching top orphanages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch top orphanages' },
      { status: 500 }
    );
  }
}
