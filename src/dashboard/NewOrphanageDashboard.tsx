// Enhanced Orphanage Dashboard Component
'use client';

import { useState } from 'react';
import ContactAdminLink from '@/components/shared/ContactAdminLink';
import { OrphanageProfile, Need, Event, Message, User } from '@prisma/client';

type OrphanageProfileWithNeeds = OrphanageProfile & {
  needs: Need[];
};

type EventWithOrganization = Event & {
  organization: {
    name: string;
  };
};

type MessageWithSender = Message & {
  sender: User & {
    organization: {
      name: string;
    } | null;
  };
};

interface OrphanageDashboardProps {
  profile: OrphanageProfileWithNeeds;
  pendingEvents: EventWithOrganization[];
  recentMessages: MessageWithSender[];
}

export default function OrphanageDashboard({ 
  profile, 
  pendingEvents, 
  recentMessages 
}: OrphanageDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);

  const handleEventAction = async (eventId: string, action: 'APPROVED' | 'DECLINED') => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/events/${eventId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: action }),
      });

      if (res.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to update event:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'needs', label: 'Needs', icon: '📋' },
    { id: 'events', label: 'Events', icon: '🎉' },
    { id: 'messages', label: 'Messages', icon: '💬' },
    { id: 'analytics', label: 'Analytics', icon: '📈' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50/30">
      {/* Header */}
      <div className="bg-white border-b border-orange-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                {profile.name}
              </h1>
              <p className="text-gray-600 mt-2">Orphanage Director Dashboard</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                profile.verificationStatus === 'VERIFIED' 
                  ? 'bg-green-100 text-green-800' 
                  : profile.verificationStatus === 'PENDING'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {profile.verificationStatus}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Stats */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl shadow-lg p-6 border border-orange-100">
                  <div className="flex items-center">
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <span className="text-2xl">📋</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Active Needs</p>
                      <p className="text-2xl font-bold text-gray-900">{profile.needs.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border border-orange-100">
                  <div className="flex items-center">
                    <div className="p-3 bg-yellow-100 rounded-lg">
                      <span className="text-2xl">⏳</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Pending Events</p>
                      <p className="text-2xl font-bold text-gray-900">{pendingEvents.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border border-orange-100">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <span className="text-2xl">💬</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">New Messages</p>
                      <p className="text-2xl font-bold text-gray-900">{recentMessages.filter(m => !m.isRead).length}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pending Events */}
              {pendingEvents.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg border border-orange-100">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Pending Event Approvals</h3>
                  </div>
                  <div className="p-6 space-y-4">
                    {pendingEvents.map((event) => (
                      <div key={event.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{event.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                            <p className="text-sm text-gray-500 mt-2">
                              From: {event.organization.name} • 
                              Date: {new Date(event.proposedDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <button
                              onClick={() => handleEventAction(event.id, 'APPROVED')}
                              disabled={isLoading}
                              className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 disabled:opacity-50"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleEventAction(event.id, 'DECLINED')}
                              disabled={isLoading}
                              className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 disabled:opacity-50"
                            >
                              Decline
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Recent Messages */}
              <div className="bg-white rounded-xl shadow-lg border border-orange-100">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Messages</h3>
                </div>
                <div className="p-6">
                  {recentMessages.length > 0 ? (
                    <div className="space-y-3">
                      {recentMessages.slice(0, 3).map((message) => (
                        <div key={message.id} className="border-l-4 border-orange-500 pl-4">
                          <p className="text-sm font-medium text-gray-900">
                            {message.sender.organization?.name || 'Unknown Organization'}
                          </p>
                          <p className="text-sm text-gray-600 truncate">{message.content}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(message.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No recent messages</p>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-lg border border-orange-100">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                </div>
                <div className="p-6 space-y-3">
                  <button
                    onClick={() => setActiveTab('needs')}
                    className="w-full text-left px-4 py-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
                  >
                    <span className="text-orange-600 font-medium">📋 Manage Needs</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('profile')}
                    className="w-full text-left px-4 py-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
                  >
                    <span className="text-orange-600 font-medium">👤 Edit Profile</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('messages')}
                    className="w-full text-left px-4 py-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
                  >
                    <span className="text-orange-600 font-medium">💬 View Messages</span>
                  </button>
                </div>
              </div>

              {/* Contact Admin */}
              <div className="bg-white rounded-xl shadow-lg border border-orange-100">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Need Help?</h3>
                </div>
                <div className="p-6">
                  <ContactAdminLink />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Management Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-xl shadow-lg border border-orange-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Management</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Orphanage Name
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={profile.description}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={profile.address}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    readOnly
                  />
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Director Name
                  </label>
                  <input
                    type="text"
                    value={profile.directorName || 'Not provided'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={profile.phone || 'Not provided'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Registration Number
                  </label>
                  <input
                    type="text"
                    value={profile.registrationNumber || 'Not provided'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    readOnly
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-700 text-sm">
                <strong>Note:</strong> To edit your profile information, please contact our support team.
                Profile changes require verification to maintain platform integrity.
              </p>
            </div>
          </div>
        )}

        {/* Needs Management Tab */}
        {activeTab === 'needs' && (
          <div className="bg-white rounded-xl shadow-lg border border-orange-100 p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Needs Management</h2>
              <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                Add New Need
              </button>
            </div>

            {profile.needs.length > 0 ? (
              <div className="space-y-4">
                {profile.needs.map((need) => (
                  <div key={need.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{need.description}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Added: {new Date(need.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          need.status === 'ACTIVE'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {need.status}
                        </span>
                        <button className="text-blue-600 hover:text-blue-800 text-sm">
                          Edit
                        </button>
                        <button className="text-red-600 hover:text-red-800 text-sm">
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No needs listed</h3>
                <p className="text-gray-600 mb-4">
                  Start by adding your current needs to help organizations understand how they can support you.
                </p>
                <button className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                  Add Your First Need
                </button>
              </div>
            )}
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="bg-white rounded-xl shadow-lg border border-orange-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Events Management</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Pending Events */}
              <div className="bg-yellow-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-800 mb-4">
                  Pending Approval ({pendingEvents.length})
                </h3>
                {pendingEvents.length > 0 ? (
                  <div className="space-y-3">
                    {pendingEvents.map((event) => (
                      <div key={event.id} className="bg-white rounded-lg p-3">
                        <p className="font-medium text-gray-900 text-sm">{event.title}</p>
                        <p className="text-xs text-gray-600">{event.organization.name}</p>
                        <div className="flex space-x-2 mt-2">
                          <button
                            onClick={() => handleEventAction(event.id, 'APPROVED')}
                            className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleEventAction(event.id, 'DECLINED')}
                            className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-yellow-700 text-sm">No pending events</p>
                )}
              </div>

              {/* Upcoming Events */}
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-800 mb-4">
                  Upcoming Events
                </h3>
                <p className="text-green-700 text-sm">No upcoming events scheduled</p>
              </div>

              {/* Past Events */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">
                  Past Events
                </h3>
                <p className="text-blue-700 text-sm">No past events recorded</p>
              </div>
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="bg-white rounded-xl shadow-lg border border-orange-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Messages</h2>

            {recentMessages.length > 0 ? (
              <div className="space-y-4">
                {recentMessages.map((message) => (
                  <div key={message.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          From: {message.sender.organization?.name || 'Unknown Organization'}
                        </p>
                        <p className="text-gray-600 mt-2">{message.content}</p>
                        <p className="text-sm text-gray-500 mt-2">
                          {new Date(message.createdAt).toLocaleDateString()} at{' '}
                          {new Date(message.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                          Reply
                        </button>
                        {!message.isRead && (
                          <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">
                            New
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">💬</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No messages yet</h3>
                <p className="text-gray-600">
                  Messages from organizations will appear here when they contact you.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="bg-white rounded-xl shadow-lg border border-orange-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Analytics & Insights</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Visit Purpose Breakdown */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Visit Purpose Breakdown
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Donations</span>
                    <span className="font-semibold">40%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Teaching</span>
                    <span className="font-semibold">30%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Workshops</span>
                    <span className="font-semibold">20%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Other</span>
                    <span className="font-semibold">10%</span>
                  </div>
                </div>
              </div>

              {/* Monthly Trends */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Monthly Visit Trends
                </h3>
                <p className="text-gray-600 text-sm">
                  Detailed analytics will be available once you have more visit data.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
