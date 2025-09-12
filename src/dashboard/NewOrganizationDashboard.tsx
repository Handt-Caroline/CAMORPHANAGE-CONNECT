// Enhanced Organization Dashboard Component
'use client';

import { useState } from 'react';
import ContactAdminLink from '@/components/shared/ContactAdminLink';
import { OrganizationProfile, Event, Visit, Message, User, OrphanageProfile, Need } from '@prisma/client';
import Link from 'next/link';

type EventWithOrphanage = Event & {
  orphanage: {
    name: string;
    address: string;
  };
};

type VisitWithOrphanage = Visit & {
  orphanage: {
    name: string;
  };
};

type MessageWithRecipient = Message & {
  recipient: User & {
    orphanage: {
      name: string;
    } | null;
  };
};

type OrphanageWithNeeds = OrphanageProfile & {
  needs: Need[];
};

interface OrganizationDashboardProps {
  profile: OrganizationProfile;
  proposedEvents: EventWithOrphanage[];
  visits: VisitWithOrphanage[];
  recentMessages: MessageWithRecipient[];
  orphanages: OrphanageWithNeeds[];
  visitStats: Record<string, number>;
}

export default function OrganizationDashboard({ 
  profile, 
  proposedEvents, 
  visits, 
  recentMessages, 
  orphanages,
  visitStats
}: OrganizationDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  const purposes = JSON.parse(profile.purposes) as string[];
  
  const filteredOrphanages = orphanages.filter(orphanage =>
    orphanage.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    orphanage.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'DECLINED': return 'bg-red-100 text-red-800';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'orphanages', label: 'Browse Orphanages', icon: '🏠' },
    { id: 'events', label: 'My Events', icon: '🎉' },
    { id: 'visits', label: 'Visit History', icon: '📝' },
    { id: 'messages', label: 'Messages', icon: '💬' },
    { id: 'analytics', label: 'Impact Analytics', icon: '📈' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50/30">
      {/* Header */}
      <div className="bg-white border-b border-blue-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                {profile.name}
              </h1>
              <p className="text-gray-600 mt-2">Organization Dashboard</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Purposes:</span> {purposes.join(', ')}
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
                    ? 'border-blue-500 text-blue-600'
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
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <span className="text-2xl">🎉</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Events</p>
                      <p className="text-2xl font-bold text-gray-900">{proposedEvents.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
                  <div className="flex items-center">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <span className="text-2xl">📝</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Visits</p>
                      <p className="text-2xl font-bold text-gray-900">{visits.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
                  <div className="flex items-center">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <span className="text-2xl">🏠</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Orphanages Helped</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {new Set(visits.map(v => v.orphanageId)).size}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Events */}
              <div className="bg-white rounded-xl shadow-lg border border-blue-100">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Event Proposals</h3>
                </div>
                <div className="p-6">
                  {proposedEvents.length > 0 ? (
                    <div className="space-y-4">
                      {proposedEvents.slice(0, 3).map((event) => (
                        <div key={event.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{event.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                              <p className="text-sm text-gray-500 mt-2">
                                To: {event.orphanage.name} • 
                                Date: {new Date(event.proposedDate).toLocaleDateString()}
                              </p>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(event.status)}`}>
                              {event.status}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No events proposed yet</p>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-lg border border-blue-100">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                </div>
                <div className="p-6 space-y-3">
                  <button
                    onClick={() => setActiveTab('orphanages')}
                    className="w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <span className="text-blue-600 font-medium">🏠 Browse Orphanages</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('visits')}
                    className="w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <span className="text-blue-600 font-medium">📝 Log New Visit</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('analytics')}
                    className="w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <span className="text-blue-600 font-medium">📈 View Impact</span>
                  </button>
                </div>
              </div>

              {/* Visit Purpose Breakdown */}
              {Object.keys(visitStats).length > 0 && (
                <div className="bg-white rounded-xl shadow-lg border border-blue-100">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Visit Breakdown</h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-3">
                      {Object.entries(visitStats).map(([purpose, count]) => (
                        <div key={purpose} className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">
                            {purpose.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                          <span className="text-sm font-semibold text-gray-900">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Admin */}
              <div className="bg-white rounded-xl shadow-lg border border-blue-100">
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

        {activeTab === 'orphanages' && (
          <div className="space-y-6">
            {/* Search Bar */}
            <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-6">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search orphanages by name or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                  Search
                </button>
              </div>
            </div>

            {/* Orphanages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOrphanages.map((orphanage) => (
                <div key={orphanage.id} className="bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{orphanage.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{orphanage.address}</p>
                    
                    {orphanage.needs.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Current Needs:</p>
                        <div className="space-y-1">
                          {orphanage.needs.slice(0, 2).map((need) => (
                            <p key={need.id} className="text-xs text-gray-600 truncate">
                              • {need.description}
                            </p>
                          ))}
                          {orphanage.needs.length > 2 && (
                            <p className="text-xs text-gray-500">
                              +{orphanage.needs.length - 2} more needs
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <Link
                        href={`/orphanages/${orphanage.id}`}
                        className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors text-center"
                      >
                        View Profile
                      </Link>
                      <Link
                        href={`/propose-event/${orphanage.id}`}
                        className="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors text-center"
                      >
                        Propose Event
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">My Events</h2>
              <button
                onClick={() => window.location.href = '/orphanages'}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Propose New Event
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Pending Events */}
              <div className="bg-yellow-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-800 mb-4">
                  Pending ({proposedEvents.filter(e => e.status === 'PENDING').length})
                </h3>
                <div className="space-y-3">
                  {proposedEvents.filter(e => e.status === 'PENDING').map((event) => (
                    <div key={event.id} className="bg-white rounded-lg p-3">
                      <p className="font-medium text-gray-900 text-sm">{event.title}</p>
                      <p className="text-xs text-gray-600">{event.orphanage.name}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(event.proposedDate).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Approved Events */}
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-800 mb-4">
                  Approved ({proposedEvents.filter(e => e.status === 'APPROVED').length})
                </h3>
                <div className="space-y-3">
                  {proposedEvents.filter(e => e.status === 'APPROVED').map((event) => (
                    <div key={event.id} className="bg-white rounded-lg p-3">
                      <p className="font-medium text-gray-900 text-sm">{event.title}</p>
                      <p className="text-xs text-gray-600">{event.orphanage.name}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(event.proposedDate).toLocaleDateString()}
                      </p>
                      <button className="mt-2 px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700">
                        Mark Complete
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Completed Events */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">
                  Completed ({proposedEvents.filter(e => e.status === 'COMPLETED').length})
                </h3>
                <div className="space-y-3">
                  {proposedEvents.filter(e => e.status === 'COMPLETED').map((event) => (
                    <div key={event.id} className="bg-white rounded-lg p-3">
                      <p className="font-medium text-gray-900 text-sm">{event.title}</p>
                      <p className="text-xs text-gray-600">{event.orphanage.name}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(event.proposedDate).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Visits Tab */}
        {activeTab === 'visits' && (
          <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Visit History</h2>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Log New Visit
              </button>
            </div>

            {visits.length > 0 ? (
              <div className="space-y-4">
                {visits.map((visit) => (
                  <div key={visit.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {visit.purpose.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Visited: {visit.orphanage.name}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Date: {new Date(visit.visitDate).toLocaleDateString()}
                        </p>
                        {visit.notes && (
                          <p className="text-sm text-gray-600 mt-2">
                            Notes: {visit.notes}
                          </p>
                        )}
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        visit.purpose === 'DONATION' ? 'bg-green-100 text-green-800' :
                        visit.purpose === 'TEACHING' ? 'bg-blue-100 text-blue-800' :
                        visit.purpose === 'WORKSHOP' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {visit.purpose.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No visits logged yet</h3>
                <p className="text-gray-600 mb-4">
                  Start logging your visits to track your organization's impact.
                </p>
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Log Your First Visit
                </button>
              </div>
            )}
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Messages</h2>

            {recentMessages.length > 0 ? (
              <div className="space-y-4">
                {recentMessages.map((message) => (
                  <div key={message.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          To: {message.recipient.orphanage?.name || 'Unknown Orphanage'}
                        </p>
                        <p className="text-gray-600 mt-2">{message.content}</p>
                        <p className="text-sm text-gray-500 mt-2">
                          Sent: {new Date(message.createdAt).toLocaleDateString()} at{' '}
                          {new Date(message.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        message.isRead ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {message.isRead ? 'Read' : 'Sent'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">💬</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No messages sent yet</h3>
                <p className="text-gray-600">
                  Start connecting with orphanages by browsing their profiles and sending messages.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Impact Analytics</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Visit Purpose Breakdown */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Your Visit Breakdown
                </h3>
                {Object.keys(visitStats).length > 0 ? (
                  <div className="space-y-3">
                    {Object.entries(visitStats).map(([purpose, count]) => {
                      const total = Object.values(visitStats).reduce((a, b) => a + b, 0);
                      const percentage = Math.round((count / total) * 100);
                      return (
                        <div key={purpose} className="flex justify-between items-center">
                          <span className="text-gray-600">
                            {purpose.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">{count} visits</span>
                            <span className="font-semibold">{percentage}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-600 text-sm">
                    Visit breakdown will appear here once you log your first visit.
                  </p>
                )}
              </div>

              {/* Impact Summary */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Impact Summary
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Visits</span>
                    <span className="text-2xl font-bold text-blue-600">{visits.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Orphanages Helped</span>
                    <span className="text-2xl font-bold text-green-600">
                      {new Set(visits.map(v => v.orphanageId)).size}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Events Proposed</span>
                    <span className="text-2xl font-bold text-purple-600">{proposedEvents.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Success Rate</span>
                    <span className="text-2xl font-bold text-orange-600">
                      {proposedEvents.length > 0
                        ? Math.round((proposedEvents.filter(e => e.status === 'APPROVED').length / proposedEvents.length) * 100)
                        : 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
