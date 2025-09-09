// FILE: src/app/api/orphanages/route.ts

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Search and filter parameters
    const search = searchParams.get('search') || '';
    const location = searchParams.get('location') || '';
    const needs = searchParams.get('needs') || '';
    const verified = searchParams.get('verified');
    const hasEvents = searchParams.get('hasEvents');
    const sortBy = searchParams.get('sortBy') || 'name';
    const sortOrder = searchParams.get('sortOrder') || 'asc';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const includeCoordinates = searchParams.get('includeCoordinates') === 'true';
    const includeNeeds = searchParams.get('includeNeeds') === 'true';

    const skip = (page - 1) * limit;

    // Build where clause
    const whereClause: any = {};

    // Text search in name and description
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Location filter
    if (location) {
      whereClause.address = { contains: location, mode: 'insensitive' };
    }

    // Verification status filter
    if (verified !== null) {
      whereClause.verificationStatus = verified === 'true' ? 'VERIFIED' : { not: 'VERIFIED' };
    }

    // Needs filter
    if (needs) {
      whereClause.needs = {
        some: {
          description: { contains: needs, mode: 'insensitive' },
          status: 'ACTIVE',
        },
      };
    }

    // Has upcoming events filter
    if (hasEvents === 'true') {
      whereClause.events = {
        some: {
          status: 'APPROVED',
          proposedDate: { gte: new Date() },
        },
      };
    }

    // Build select clause
    const selectClause: any = {
      id: true,
      name: true,
      description: true,
      address: true,
      verificationStatus: true,
      createdAt: true,
    };

    if (includeCoordinates) {
      selectClause.latitude = true;
      selectClause.longitude = true;
    }

    // Build include clause
    const includeClause: any = {};

    if (includeNeeds) {
      includeClause.needs = {
        where: { status: 'ACTIVE' },
        select: {
          id: true,
          description: true,
          createdAt: true,
        },
        take: 5,
      };
    }

    // Build order by clause
    const orderByClause: any = {};
    if (sortBy === 'name') {
      orderByClause.name = sortOrder;
    } else if (sortBy === 'created') {
      orderByClause.createdAt = sortOrder;
    } else if (sortBy === 'location') {
      orderByClause.address = sortOrder;
    } else {
      orderByClause.name = 'asc';
    }

    // Get total count for pagination
    const totalCount = await prisma.orphanageProfile.count({ where: whereClause });

    // Get orphanages
    const orphanages = await prisma.orphanageProfile.findMany({
      where: whereClause,
      include: includeClause,
      orderBy: orderByClause,
      skip,
      take: limit,
    });

    return NextResponse.json({
      orphanages,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
      },
      filters: {
        search,
        location,
        needs,
        verified,
        hasEvents,
        sortBy,
        sortOrder,
      },
    });
  } catch (error) {
    console.error("GET_ORPHANAGES_ERROR", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
