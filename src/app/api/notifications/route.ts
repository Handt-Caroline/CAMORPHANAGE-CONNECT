// Notifications API
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Fetch user notifications
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // For now, return mock notifications since we don't have a notifications table
    // In a real implementation, you would fetch from a notifications table
    const mockNotifications = [
      {
        id: '1',
        type: 'EVENT_PROPOSAL',
        title: 'New Event Proposal',
        message: 'You have received a new event proposal from Hope Foundation.',
        isRead: false,
        createdAt: new Date().toISOString(),
        actionUrl: '/dashboard/orphanage?tab=events',
      },
      {
        id: '2',
        type: 'MESSAGE',
        title: 'New Message',
        message: 'You have a new message from Sunshine Orphanage.',
        isRead: false,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        actionUrl: '/dashboard/organization?tab=messages',
      },
      {
        id: '3',
        type: 'VISIT_LOGGED',
        title: 'Visit Logged',
        message: 'A new visit has been logged for your organization.',
        isRead: true,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        actionUrl: '/dashboard/organization?tab=visits',
      },
    ];

    // Filter notifications based on user role
    const filteredNotifications = mockNotifications.filter(notification => {
      if (session.user.role === 'ORPHANAGE') {
        return ['EVENT_PROPOSAL', 'MESSAGE', 'VERIFICATION', 'SYSTEM'].includes(notification.type);
      } else if (session.user.role === 'ORGANIZATION') {
        return ['EVENT_APPROVED', 'EVENT_DECLINED', 'MESSAGE', 'VISIT_LOGGED', 'VERIFICATION', 'SYSTEM'].includes(notification.type);
      } else if (session.user.role === 'ADMIN') {
        return true; // Admins see all notification types
      }
      return false;
    });

    return NextResponse.json(filteredNotifications);
  } catch (error) {
    console.error('GET_NOTIFICATIONS_ERROR', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// POST: Create a new notification (for system use)
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { userId, type, title, message, actionUrl, metadata } = body;

    if (!userId || !type || !title || !message) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // In a real implementation, you would create a notification in the database
    // For now, we'll just return a success response
    const notification = {
      id: Date.now().toString(),
      userId,
      type,
      title,
      message,
      actionUrl,
      metadata,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(notification);
  } catch (error) {
    console.error('CREATE_NOTIFICATION_ERROR', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
