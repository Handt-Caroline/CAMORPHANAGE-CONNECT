'use client';

import Link from 'next/link';

interface OrphanageActionsProps {
  orphanageId: string;
  orphanageUserId: string;
  userRole?: string;
}

export default function OrphanageActions({ 
  orphanageId, 
  orphanageUserId, 
  userRole 
}: OrphanageActionsProps) {
  return (
    <div className="space-y-3">
      {userRole === 'ORGANIZATION' ? (
        <>
          <Link 
            href={`/message/${orphanageUserId}`}
            className="w-full px-4 py-2 bg-orange-100 text-orange-700 rounded-xl hover:bg-orange-200 transition-colors duration-200 text-sm font-medium block text-center"
          >
            📧 Send Message
          </Link>
          <Link 
            href={`/propose-event/${orphanageId}`}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 text-sm font-medium block text-center"
          >
            📅 Propose Event
          </Link>
        </>
      ) : (
        <>
          <button 
            onClick={() => alert('Please log in as an organization to send messages')}
            className="w-full px-4 py-2 bg-gray-100 text-gray-500 rounded-xl cursor-not-allowed text-sm font-medium"
          >
            📧 Send Message
          </button>
          <button 
            onClick={() => alert('Please log in as an organization to propose events')}
            className="w-full px-4 py-2 bg-gray-100 text-gray-500 rounded-xl cursor-not-allowed text-sm font-medium"
          >
            📅 Propose Event
          </button>
        </>
      )}
    </div>
  );
}
