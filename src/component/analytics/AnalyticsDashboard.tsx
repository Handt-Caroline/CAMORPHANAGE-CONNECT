'use client';

import { useState } from 'react';

interface AnalyticsData {
  totalVisits: number;
  totalOrphanages: number;
  totalEvents: number;
  visitsByPurpose: Record<string, number>;
  visitsByMonth: Record<string, number>;
  impactMetrics: {
    childrenHelped: number;
    donationsDelivered: number;
    hoursVolunteered: number;
    eventsCompleted: number;
  };
}

interface AnalyticsDashboardProps {
  data: AnalyticsData;
  userRole: 'ORGANIZATION' | 'ORPHANAGE' | 'ADMIN';
}

export default function AnalyticsDashboard({ data, userRole }: AnalyticsDashboardProps) {
  const [timeRange, setTimeRange] = useState('6months');

  const purposeLabels: Record<string, string> = {
    DONATION: 'Donations',
    TEACHING: 'Teaching',
    WORKSHOP: 'Workshops',
    ENTERTAINMENT: 'Entertainment',
    HEALTH: 'Health Services',
    MENTORING: 'Mentoring',
    CELEBRATION: 'Celebrations',
    MAINTENANCE: 'Maintenance',
    OTHER: 'Other',
  };

  const purposeIcons: Record<string, string> = {
    DONATION: '🎁',
    TEACHING: '📚',
    WORKSHOP: '🛠️',
    ENTERTAINMENT: '🎭',
    HEALTH: '🏥',
    MENTORING: '👥',
    CELEBRATION: '🎉',
    MAINTENANCE: '🔧',
    OTHER: '📝',
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-blue-500';
    if (percentage >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const totalPurposeVisits = Object.values(data.visitsByPurpose).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="1month">Last Month</option>
          <option value="3months">Last 3 Months</option>
          <option value="6months">Last 6 Months</option>
          <option value="1year">Last Year</option>
          <option value="all">All Time</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Visits</p>
              <p className="text-3xl font-bold">{data.totalVisits}</p>
            </div>
            <div className="text-4xl opacity-80">📊</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">
                {userRole === 'ORGANIZATION' ? 'Orphanages Helped' : 'Partner Organizations'}
              </p>
              <p className="text-3xl font-bold">{data.totalOrphanages}</p>
            </div>
            <div className="text-4xl opacity-80">🏠</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Events</p>
              <p className="text-3xl font-bold">{data.totalEvents}</p>
            </div>
            <div className="text-4xl opacity-80">🎉</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Children Helped</p>
              <p className="text-3xl font-bold">{data.impactMetrics.childrenHelped}</p>
            </div>
            <div className="text-4xl opacity-80">👶</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Visit Purpose Breakdown */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Visit Purpose Breakdown</h3>
          
          {totalPurposeVisits > 0 ? (
            <div className="space-y-4">
              {Object.entries(data.visitsByPurpose)
                .sort(([,a], [,b]) => b - a)
                .map(([purpose, count]) => {
                  const percentage = Math.round((count / totalPurposeVisits) * 100);
                  return (
                    <div key={purpose} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{purposeIcons[purpose]}</span>
                          <span className="font-medium text-gray-700">
                            {purposeLabels[purpose] || purpose}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-medium text-gray-900">{count} visits</span>
                          <span className="text-xs text-gray-500 ml-2">({percentage}%)</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(percentage)}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📊</div>
              <p className="text-gray-500">No visit data available</p>
            </div>
          )}
        </div>

        {/* Impact Metrics */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Impact Metrics</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {data.impactMetrics.childrenHelped}
              </div>
              <div className="text-sm text-blue-700">Children Helped</div>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {data.impactMetrics.donationsDelivered}
              </div>
              <div className="text-sm text-green-700">Donations Delivered</div>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {data.impactMetrics.hoursVolunteered}
              </div>
              <div className="text-sm text-purple-700">Hours Volunteered</div>
            </div>

            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600 mb-1">
                {data.impactMetrics.eventsCompleted}
              </div>
              <div className="text-sm text-orange-700">Events Completed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Monthly Activity Trends</h3>
        
        {Object.keys(data.visitsByMonth).length > 0 ? (
          <div className="space-y-4">
            {Object.entries(data.visitsByMonth)
              .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
              .map(([month, count]) => {
                const maxCount = Math.max(...Object.values(data.visitsByMonth));
                const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
                
                return (
                  <div key={month} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700">
                        {new Date(month).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long' 
                        })}
                      </span>
                      <span className="text-sm font-medium text-gray-900">{count} visits</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">📈</div>
            <p className="text-gray-500">No monthly data available</p>
          </div>
        )}
      </div>

      {/* Export Options */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Export Data</h3>
        <div className="flex space-x-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            📊 Export as PDF
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            📈 Export as Excel
          </button>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            📋 Generate Report
          </button>
        </div>
      </div>
    </div>
  );
}
