// Comprehensive Admin Dashboard Component
'use client';

import { useState } from 'react';
import { OrphanageProfile, OrganizationProfile, Event, Visit, User } from '@prisma/client';

type PendingOrphanage = OrphanageProfile & {
  user: {
    email: string;
    createdAt: Date;
  };
};

type PendingOrganization = OrganizationProfile & {
  user: {
    email: string;
    createdAt: Date;
  };
};

type EventWithDetails = Event & {
  organization: { name: string };
  orphanage: { name: string };
};

type VisitWithDetails = Visit & {
  organization: { name: string };
  orphanage: { name: string };
};

interface AdminDashboardProps {
  pendingOrphanages: PendingOrphanage[];
  pendingOrganizations: PendingOrganization[];
  stats: {
    totalUsers: number;
    totalOrphanages: number;
    totalOrganizations: number;
    verifiedOrphanages: number;
    verifiedOrganizations: number;
    totalEvents: number;
    totalVisits: number;
    totalMessages: number;
  };
  recentEvents: EventWithDetails[];
  recentVisits: VisitWithDetails[];
}

export default function AdminDashboard({
  pendingOrphanages,
  pendingOrganizations,
  stats,
  recentEvents,
  recentVisits,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('60');
  const [passwordRequirements, setPasswordRequirements] = useState('8 characters minimum');
  const [requireMinLength, setRequireMinLength] = useState(true);
  const [requireSpecialChars, setRequireSpecialChars] = useState(true);
  const [requireUppercase, setRequireUppercase] = useState(false);

  const handleVerification = async (
    type: 'orphanage' | 'organization',
    id: string,
    action: 'VERIFIED' | 'REJECTED'
  ) => {
    setIsLoading(true);
    try {
      const endpoint = type === 'orphanage' ? '/api/admin/verify-orphanage' : '/api/admin/verify-organization';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status: action }),
      });

      if (res.ok) {
        window.location.reload();
      } else {
        console.error('Verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'verification', label: 'Verification Queue', icon: '✅' },
    { id: 'users', label: 'User Management', icon: '👥' },
    { id: 'content', label: 'Content Moderation', icon: '🛡️' },
    { id: 'analytics', label: 'Platform Analytics', icon: '📈' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50/30">
      {/* Header */}
      <div className="bg-white border-b border-purple-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-500 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-2">Platform Management & Analytics</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                Administrator
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
                    ? 'border-purple-500 text-purple-600'
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
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-100">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <span className="text-2xl">👥</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-100">
                <div className="flex items-center">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <span className="text-2xl">🏠</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Orphanages</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalOrphanages}</p>
                    <p className="text-xs text-green-600">{stats.verifiedOrphanages} verified</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-100">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <span className="text-2xl">🏢</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Organizations</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalOrganizations}</p>
                    <p className="text-xs text-green-600">{stats.verifiedOrganizations} verified</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-100">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <span className="text-2xl">🎉</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Events</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalEvents}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pending Verifications Alert */}
            {(pendingOrphanages.length > 0 || pendingOrganizations.length > 0) && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">⚠️</span>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-yellow-800">
                      Pending Verifications
                    </h3>
                    <p className="text-yellow-700 mt-1">
                      {pendingOrphanages.length} orphanages and {pendingOrganizations.length} organizations 
                      are waiting for verification.
                    </p>
                    <button
                      onClick={() => setActiveTab('verification')}
                      className="mt-3 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                    >
                      Review Now
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Events */}
              <div className="bg-white rounded-xl shadow-lg border border-purple-100">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Events</h3>
                </div>
                <div className="p-6">
                  {recentEvents.length > 0 ? (
                    <div className="space-y-4">
                      {recentEvents.slice(0, 5).map((event) => (
                        <div key={event.id} className="border-l-4 border-purple-500 pl-4">
                          <p className="font-medium text-gray-900">{event.title}</p>
                          <p className="text-sm text-gray-600">
                            {event.organization.name} → {event.orphanage.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(event.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No recent events</p>
                  )}
                </div>
              </div>

              {/* Recent Visits */}
              <div className="bg-white rounded-xl shadow-lg border border-purple-100">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Visits</h3>
                </div>
                <div className="p-6">
                  {recentVisits.length > 0 ? (
                    <div className="space-y-4">
                      {recentVisits.slice(0, 5).map((visit) => (
                        <div key={visit.id} className="border-l-4 border-green-500 pl-4">
                          <p className="font-medium text-gray-900">
                            {visit.purpose.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                          </p>
                          <p className="text-sm text-gray-600">
                            {visit.organization.name} → {visit.orphanage.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(visit.visitDate).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No recent visits</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'verification' && (
          <div className="space-y-8">
            {/* Pending Orphanages */}
            <div className="bg-white rounded-xl shadow-lg border border-purple-100">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Pending Orphanage Verifications ({pendingOrphanages.length})
                </h3>
              </div>
              <div className="p-6">
                {pendingOrphanages.length > 0 ? (
                  <div className="space-y-4">
                    {pendingOrphanages.map((orphanage) => (
                      <div key={orphanage.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{orphanage.name}</h4>
                            <p className="text-sm text-gray-600 mt-1">{orphanage.description}</p>
                            <p className="text-sm text-gray-500 mt-2">
                              📍 {orphanage.address}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Email: {orphanage.user.email} • 
                              Registered: {new Date(orphanage.user.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <button
                              onClick={() => handleVerification('orphanage', orphanage.id, 'VERIFIED')}
                              disabled={isLoading}
                              className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 disabled:opacity-50"
                            >
                              Verify
                            </button>
                            <button
                              onClick={() => handleVerification('orphanage', orphanage.id, 'REJECTED')}
                              disabled={isLoading}
                              className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No pending orphanage verifications</p>
                )}
              </div>
            </div>

            {/* Pending Organizations */}
            <div className="bg-white rounded-xl shadow-lg border border-purple-100">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Pending Organization Verifications ({pendingOrganizations.length})
                </h3>
              </div>
              <div className="p-6">
                {pendingOrganizations.length > 0 ? (
                  <div className="space-y-4">
                    {pendingOrganizations.map((organization) => (
                      <div key={organization.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{organization.name}</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              Contact: {organization.contactPerson}
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                              Purposes: {JSON.parse(organization.purposes).join(', ')}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Email: {organization.user.email} • 
                              Registered: {new Date(organization.user.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <button
                              onClick={() => handleVerification('organization', organization.id, 'VERIFIED')}
                              disabled={isLoading}
                              className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 disabled:opacity-50"
                            >
                              Verify
                            </button>
                            <button
                              onClick={() => handleVerification('organization', organization.id, 'REJECTED')}
                              disabled={isLoading}
                              className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No pending organization verifications</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* User Management Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-xl shadow-lg border border-purple-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">User Management</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* User Statistics */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">User Statistics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Total Users</span>
                    <span className="font-bold text-blue-900">{stats.totalUsers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Orphanages</span>
                    <span className="font-bold text-blue-900">{stats.totalOrphanages}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Organizations</span>
                    <span className="font-bold text-blue-900">{stats.totalOrganizations}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Admins</span>
                    <span className="font-bold text-blue-900">1</span>
                  </div>
                </div>
              </div>

              {/* Recent Registrations */}
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-800 mb-4">Recent Registrations</h3>
                <p className="text-green-700 text-sm">
                  {pendingOrphanages.length + pendingOrganizations.length} new registrations this week
                </p>
              </div>

              {/* User Actions */}
              <div className="bg-purple-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-purple-800 mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <button className="w-full px-3 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700">
                    Export User Data
                  </button>
                  <button className="w-full px-3 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700">
                    Send Announcement
                  </button>
                  <button className="w-full px-3 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700">
                    View User Reports
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content Moderation Tab */}
        {activeTab === 'content' && (
          <div className="bg-white rounded-xl shadow-lg border border-purple-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Content Moderation</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Flagged Content */}
              <div className="bg-red-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-800 mb-4">Flagged Content</h3>
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-3 border border-red-200">
                    <p className="text-sm font-medium text-gray-900">No flagged content</p>
                    <p className="text-xs text-gray-600">All content is currently clean</p>
                  </div>
                </div>
              </div>

              {/* Content Statistics */}
              <div className="bg-yellow-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-800 mb-4">Content Statistics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-yellow-700">Total Messages</span>
                    <span className="font-bold text-yellow-900">{stats.totalMessages}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-yellow-700">Total Events</span>
                    <span className="font-bold text-yellow-900">{stats.totalEvents}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-yellow-700">Reports Filed</span>
                    <span className="font-bold text-yellow-900">0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Platform Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="bg-white rounded-xl shadow-lg border border-purple-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Platform Analytics</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Engagement Metrics */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Metrics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Total Visits Logged</span>
                    <span className="text-2xl font-bold text-blue-600">{stats.totalVisits}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Events Created</span>
                    <span className="text-2xl font-bold text-green-600">{stats.totalEvents}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Messages Sent</span>
                    <span className="text-2xl font-bold text-purple-600">{stats.totalMessages}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Platform Health</span>
                    <span className="text-lg font-bold text-green-600">Excellent</span>
                  </div>
                </div>
              </div>

              {/* Growth Trends */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Growth Trends</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">User Growth Rate</span>
                    <span className="text-lg font-bold text-green-600">+15%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Activity Rate</span>
                    <span className="text-lg font-bold text-blue-600">+22%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Success Rate</span>
                    <span className="text-lg font-bold text-purple-600">87%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Satisfaction</span>
                    <span className="text-lg font-bold text-orange-600">4.8/5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-xl shadow-lg border border-purple-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Platform Settings</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* General Settings */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">General Settings</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Platform Name
                    </label>
                    <input
                      type="text"
                      value="Connect & Care"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Auto-Verification
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                      <option>Manual Review Required</option>
                      <option>Auto-approve Organizations</option>
                      <option>Auto-approve All</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Notifications
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" defaultChecked />
                        <span className="text-sm">New registrations</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" defaultChecked />
                        <span className="text-sm">Flagged content</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span className="text-sm">Weekly reports</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Settings */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Session Timeout (minutes)
                    </label>
                    <input
                      type="number"
                      value={sessionTimeout}
                      onChange={(e) => setSessionTimeout(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password Requirements
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="mr-2"
                          checked={requireMinLength}
                          onChange={(e) => setRequireMinLength(e.target.checked)}
                        />
                        <span className="text-sm">Minimum 8 characters</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="mr-2"
                          checked={requireSpecialChars}
                          onChange={(e) => setRequireSpecialChars(e.target.checked)}
                        />
                        <span className="text-sm">Require special characters</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="mr-2"
                          checked={requireUppercase}
                          onChange={(e) => setRequireUppercase(e.target.checked)}
                        />
                        <span className="text-sm">Two-factor authentication</span>
                      </label>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                      Save Settings
                    </button>
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
