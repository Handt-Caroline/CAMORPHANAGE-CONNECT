// Message Page - Send message to specific orphanage/organization
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import MessageInterface from '@/components/messaging/MessageInterface';

const prisma = new PrismaClient();

interface PageProps {
  params: Promise<{ recipientId: string }>;
}

export default async function MessagePage({ params }: PageProps) {
  const session = await auth();
  const { recipientId } = await params;

  if (!session?.user?.id) {
    redirect('/login');
  }

  // Get recipient information
  let recipient = null;
  let recipientProfile = null;

  if (session.user.role === 'ORGANIZATION') {
    // Organization messaging orphanage
    recipient = await prisma.user.findFirst({
      where: {
        id: recipientId,
        role: 'ORPHANAGE',
      },
    });

    if (recipient) {
      recipientProfile = await prisma.orphanageProfile.findUnique({
        where: { userId: recipient.id },
      });
    }
  } else if (session.user.role === 'ORPHANAGE') {
    // Orphanage messaging organization
    recipient = await prisma.user.findFirst({
      where: {
        id: recipientId,
        role: 'ORGANIZATION',
      },
    });

    if (recipient) {
      recipientProfile = await prisma.organizationProfile.findUnique({
        where: { userId: recipient.id },
      });
    }
  }

  if (!recipient || !recipientProfile) {
    redirect('/dashboard');
  }

  // Get sender profile
  let senderProfile = null;
  if (session.user.role === 'ORGANIZATION') {
    senderProfile = await prisma.organizationProfile.findUnique({
      where: { userId: session.user.id },
    });
  } else {
    senderProfile = await prisma.orphanageProfile.findUnique({
      where: { userId: session.user.id },
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50/30 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <MessageInterface
          currentUser={session.user}
          recipient={recipient}
          recipientProfile={recipientProfile}
          senderProfile={senderProfile}
        />
      </div>
    </div>
  );
}
