// Individual Need API - Update and delete specific needs
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// PATCH: Update a specific need
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ORPHANAGE') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status, description } = body;

    // Get orphanage profile
    const orphanageProfile = await prisma.orphanageProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!orphanageProfile) {
      return new NextResponse('Orphanage profile not found', { status: 404 });
    }

    // Verify the need belongs to this orphanage
    const existingNeed = await prisma.need.findFirst({
      where: {
        id,
        orphanageId: orphanageProfile.id,
      },
    });

    if (!existingNeed) {
      return new NextResponse('Need not found or access denied', { status: 404 });
    }

    // Update the need
    const updateData: any = {};
    if (status) updateData.status = status;
    if (description) updateData.description = description;

    const updatedNeed = await prisma.need.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedNeed);
  } catch (error) {
    console.error('UPDATE_NEED_ERROR', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// DELETE: Delete a specific need
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ORPHANAGE') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { id } = await params;

    // Get orphanage profile
    const orphanageProfile = await prisma.orphanageProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!orphanageProfile) {
      return new NextResponse('Orphanage profile not found', { status: 404 });
    }

    // Verify the need belongs to this orphanage
    const existingNeed = await prisma.need.findFirst({
      where: {
        id,
        orphanageId: orphanageProfile.id,
      },
    });

    if (!existingNeed) {
      return new NextResponse('Need not found or access denied', { status: 404 });
    }

    // Delete the need
    await prisma.need.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('DELETE_NEED_ERROR', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
