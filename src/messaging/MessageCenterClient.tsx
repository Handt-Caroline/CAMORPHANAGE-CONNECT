'use client';

import { useState } from 'react';
import Link from 'next/link';

interface MessageCenterClientProps {
  currentUser: any;
  conversations: any[];
  potentialContacts: any[];
}

export default function MessageCenterClient({ 
  currentUser, 
  conversations, 
  potentialContacts 
}: MessageCenterClientProps) {
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);

  // Group conversations by unique participants
  const uniqueConversations = conversations.reduce((acc: any[], message) => {
    const otherUserId = message.senderId === currentUser.id ? message.recipientId : message.senderId;
    const existingConv = acc.find(conv => 
      (conv.senderId === otherUserId || conv.recipientId === otherUserId)
    );
    
    if (!existingConv) {
      acc.push(message);
    }
    return acc;
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
      {/* Header with + Button */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Your Conversations</h2>
        <button
          onClick={() => setShowNewMessageModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <span className="text-lg">+</span>
          <span>New Message</span>
        </button>
      </div>

      {/* Conversations List */}
      <div className="divide-y divide-gray-200">
        {uniqueConversations.length > 0 ? (
          uniqueConversations.map((conversation) => {
            const otherUser = conversation.senderId === currentUser.id 
              ? conversation.recipient 
              : conversation.sender;
            
            const otherProfile = otherUser.orphanage || otherUser.organization;
            const profileName = otherProfile?.name || otherUser.email;

            return (
              <Link
                key={conversation.id}
                href={`/message/${otherUser.id}`}
                className="block p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    {otherProfile?.profileImageUrl ? (
                      <img
                        src={otherProfile.profileImageUrl}
                        alt={profileName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                        {profileName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        {profileName}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {new Date(conversation.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {conversation.content}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        otherUser.role === 'ORPHANAGE' 
                          ? 'bg-orange-100 text-orange-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {otherUser.role === 'ORPHANAGE' ? '🏠 Orphanage' : '🏢 Organization'}
                      </span>
                    </div>
                  </div>
                  <div className="text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No conversations yet</h3>
            <p className="text-gray-600 mb-6">Start a conversation by clicking the + button above</p>
          </div>
        )}
      </div>

      {/* New Message Modal */}
      {showNewMessageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 max-h-96 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Start New Conversation</h3>
              <button
                onClick={() => setShowNewMessageModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div className="max-h-80 overflow-y-auto">
              {potentialContacts.length > 0 ? (
                potentialContacts.map((contact) => {
                  const profile = contact.orphanage || contact.organization;
                  const profileName = profile?.name || contact.email;

                  return (
                    <Link
                      key={contact.id}
                      href={`/message/${contact.id}`}
                      onClick={() => setShowNewMessageModal(false)}
                      className="block p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                          {profile?.profileImageUrl ? (
                            <img
                              src={profile.profileImageUrl}
                              alt={profileName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                              {profileName.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {profileName}
                          </h4>
                          <p className="text-xs text-gray-500 truncate">{contact.email}</p>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                            contact.role === 'ORPHANAGE' 
                              ? 'bg-orange-100 text-orange-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {contact.role === 'ORPHANAGE' ? '🏠 Orphanage' : '🏢 Organization'}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className="p-8 text-center">
                  <div className="text-4xl mb-2">🔍</div>
                  <p className="text-gray-600">No contacts available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
