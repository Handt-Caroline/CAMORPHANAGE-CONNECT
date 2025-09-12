'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface Contact {
  id: string;
  email: string;
  role: string;
  orphanage?: {
    name: string;
  };
  organization?: {
    name: string;
  };
}

export default function FloatingMessageButton() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      // Determine which type of contacts to fetch based on user role
      const targetRole = session?.user?.role === 'ORGANIZATION' ? 'ORPHANAGE' : 'ORGANIZATION';

      const response = await fetch(`/api/users?role=${targetRole}`);
      if (response.ok) {
        const data = await response.json();
        setContacts(data);
      }
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.role]);

  useEffect(() => {
    if (isOpen && contacts.length === 0) {
      fetchContacts();
    }
  }, [isOpen, contacts.length, fetchContacts]);

  // Don't show the button if user is not logged in or is an admin
  if (!session?.user || session.user.role === 'ADMIN') {
    return null;
  }

  const getContactName = (contact: Contact) => {
    if (contact.orphanage) return contact.orphanage.name;
    if (contact.organization) return contact.organization.name;
    return contact.email;
  };

  const getContactIcon = (contact: Contact) => {
    return contact.role === 'ORPHANAGE' ? '🏠' : '🏢';
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* Contacts List */}
        {isOpen && (
          <div className="mb-4 bg-white rounded-xl shadow-2xl border border-gray-200 w-80 max-h-96 overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-blue-600">
              <h3 className="text-lg font-semibold text-white">
                Start New Conversation
              </h3>
              <p className="text-blue-100 text-sm">
                {session.user.role === 'ORGANIZATION' 
                  ? 'Choose an orphanage to message'
                  : 'Choose an organization to message'
                }
              </p>
            </div>
            
            <div className="max-h-80 overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading contacts...</p>
                </div>
              ) : contacts.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {contacts.map((contact) => (
                    <Link
                      key={contact.id}
                      href={`/message/${contact.id}`}
                      onClick={() => setIsOpen(false)}
                      className="block p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-lg">
                          {getContactIcon(contact)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {getContactName(contact)}
                          </h4>
                          <p className="text-xs text-gray-500 truncate">
                            {contact.email}
                          </p>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                            contact.role === 'ORPHANAGE' 
                              ? 'bg-orange-100 text-orange-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {contact.role === 'ORPHANAGE' ? 'Orphanage' : 'Organization'}
                          </span>
                        </div>
                        <div className="text-gray-400">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                          </svg>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="text-4xl mb-2">🔍</div>
                  <p className="text-gray-600 font-medium">No contacts available</p>
                  <p className="text-gray-500 text-sm mt-1">
                    {session.user.role === 'ORGANIZATION' 
                      ? 'No verified orphanages found'
                      : 'No organizations found'
                    }
                  </p>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <Link
                href="/messages"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                View All Messages
              </Link>
            </div>
          </div>
        )}

        {/* Main Floating Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 ${
            isOpen 
              ? 'bg-red-500 hover:bg-red-600 rotate-45' 
              : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
          }`}
        >
          <div className="flex items-center justify-center text-white text-xl font-bold">
            {isOpen ? '×' : '+'}
          </div>
        </button>

        {/* Tooltip */}
        {!isOpen && (
          <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
            Start new conversation
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        )}
      </div>
    </>
  );
}
