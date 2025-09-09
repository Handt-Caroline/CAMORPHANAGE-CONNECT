// Messages API - Send and retrieve messages
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Retrieve messages for the current user
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const conversationWith = searchParams.get('with');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    if (conversationWith) {
      // Get conversation between current user and specific user
      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: session.user.id, recipientId: conversationWith },
            { senderId: conversationWith, recipientId: session.user.id },
          ],
        },
        include: {
          sender: {
            select: {
              id: true,
              email: true,
              role: true,
            },
          },
          recipient: {
            select: {
              id: true,
              email: true,
              role: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      });

      // Mark messages as read if they were sent to the current user
      await prisma.message.updateMany({
        where: {
          senderId: conversationWith,
          recipientId: session.user.id,
          isRead: false,
        },
        data: { isRead: true },
      });

      return NextResponse.json(messages.reverse()); // Reverse to show oldest first
    } else {
      // Get all conversations (latest message from each conversation)
      const conversations = await prisma.$queryRaw`
        SELECT DISTINCT
          CASE 
            WHEN m.senderId = ${session.user.id} THEN m.recipientId
            ELSE m.senderId
          END as otherUserId,
          m.content as lastMessage,
          m.createdAt as lastMessageAt,
          m.isRead,
          u.email as otherUserEmail,
          u.role as otherUserRole,
          COALESCE(op.name, org.name) as otherUserName
        FROM Message m
        JOIN User u ON (
          CASE 
            WHEN m.senderId = ${session.user.id} THEN u.id = m.recipientId
            ELSE u.id = m.senderId
          END
        )
        LEFT JOIN OrphanageProfile op ON u.id = op.userId
        LEFT JOIN OrganizationProfile org ON u.id = org.userId
        WHERE m.senderId = ${session.user.id} OR m.recipientId = ${session.user.id}
        ORDER BY m.createdAt DESC
      `;

      return NextResponse.json(conversations);
    }
  } catch (error) {
    console.error('GET_MESSAGES_ERROR', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// POST: Send a new message
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { recipientId, content } = body;

    if (!recipientId || !content) {
      return new NextResponse('Missing recipientId or content', { status: 400 });
    }

    // Verify recipient exists
    const recipient = await prisma.user.findUnique({
      where: { id: recipientId },
    });

    if (!recipient) {
      return new NextResponse('Recipient not found', { status: 404 });
    }

    // Create the message
    const message = await prisma.message.create({
      data: {
        senderId: session.user.id,
        recipientId,
        content,
      },
      include: {
        sender: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
        recipient: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error('SEND_MESSAGE_ERROR', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
