// API route to geocode orphanage addresses and update coordinates
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';
import { geocodeAddress } from '@/lib/geocoding';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { orphanageId, address } = body;

    if (!orphanageId && !address) {
      return new NextResponse('Either orphanageId or address is required', { status: 400 });
    }

    let orphanagesToUpdate;

    if (orphanageId) {
      // Update specific orphanage
      const orphanage = await prisma.orphanageProfile.findUnique({
        where: { id: orphanageId },
      });

      if (!orphanage) {
        return new NextResponse('Orphanage not found', { status: 404 });
      }

      orphanagesToUpdate = [orphanage];
    } else {
      // Update all orphanages without coordinates
      orphanagesToUpdate = await prisma.orphanageProfile.findMany({
        where: {
          OR: [
            { latitude: null },
            { longitude: null },
          ],
        },
      });
    }

    const results = [];

    for (const orphanage of orphanagesToUpdate) {
      const addressToGeocode = address || orphanage.address;
      
      if (!addressToGeocode) {
        results.push({
          id: orphanage.id,
          name: orphanage.name,
          success: false,
          error: 'No address provided',
        });
        continue;
      }

      const coordinates = await geocodeAddress(addressToGeocode);

      if (coordinates) {
        await prisma.orphanageProfile.update({
          where: { id: orphanage.id },
          data: {
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
          },
        });

        results.push({
          id: orphanage.id,
          name: orphanage.name,
          success: true,
          coordinates,
        });
      } else {
        results.push({
          id: orphanage.id,
          name: orphanage.name,
          success: false,
          error: 'Geocoding failed',
        });
      }

      // Add delay to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return NextResponse.json({
      message: 'Geocoding completed',
      results,
      total: orphanagesToUpdate.length,
      successful: results.filter(r => r.success).length,
    });
  } catch (error) {
    console.error('GEOCODING_ERROR', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
