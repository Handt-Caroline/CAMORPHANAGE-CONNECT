// Messages Center Page
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import MessageCenterClient from '@/components/messaging/MessageCenterClient';

const prisma = new PrismaClient();

export default async function MessagesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  // Get all conversations for the current user
  const conversations = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: session.user.id },
        { recipientId: session.user.id }
      ]
    },
    include: {
      sender: {
        include: {
          orphanage: true,
          organization: true,
        }
      },
      recipient: {
        include: {
          orphanage: true,
          organization: true,
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  // Get potential contacts (other users to message)
  let potentialContacts: any[] = [];
  
  if (session.user.role === 'ORGANIZATION') {
    // Organizations can message orphanages
    potentialContacts = await prisma.user.findMany({
      where: { 
        role: 'ORPHANAGE',
        NOT: { id: session.user.id }
      },
      include: {
        orphanage: true,
      }
    });
  } else if (session.user.role === 'ORPHANAGE') {
    // Orphanages can message organizations
    potentialContacts = await prisma.user.findMany({
      where: { 
        role: 'ORGANIZATION',
        NOT: { id: session.user.id }
      },
      include: {
        organization: true,
      }
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
          <p className="text-gray-600">Connect and communicate with partners</p>
        </div>

        <MessageCenterClient 
          currentUser={session.user}
          conversations={conversations}
          potentialContacts={potentialContacts}
        />
      </div>
    </div>
  );
}
