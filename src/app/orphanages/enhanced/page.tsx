// Enhanced Orphanage Directory with Search, Map, and Filtering
'use client';

import { useState, useEffect } from 'react';
import { OrphanageProfile, Need } from '@prisma/client';
import Link from 'next/link';
import AdvancedSearch from '@/components/search/AdvancedSearch';
import OrphanageMap from '@/components/map/OrphanageMap';

type OrphanageWithNeeds = OrphanageProfile & {
  needs: Need[];
};

interface SearchResults {
  orphanages: OrphanageWithNeeds[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  filters: any;
}

export default function EnhancedOrphanagesPage() {
  const [results, setResults] = useState<SearchResults | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  useEffect(() => {
    // Initial load
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const response = await fetch('/api/orphanages?includeNeeds=true&includeCoordinates=true');
      if (response.ok) {
        const data = await response.json();
        setResults(data);
      }
    } catch (error) {
      console.error('Failed to fetch orphanages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchResults = (searchResults: SearchResults) => {
    setResults(searchResults);
  };

  const handleOrphanageSelect = (orphanage: OrphanageProfile) => {
    // Navigate to orphanage detail page
    window.location.href = `/orphanages/${orphanage.id}`;
  };

  const getVerificationBadge = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">✓ Verified</span>;
      case 'PENDING':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">⏳ Pending</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">Unverified</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orphanages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50/30">
      {/* Header */}
      <div className="bg-white border-b border-orange-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent mb-4">
              Enhanced Orphanage Directory
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover orphanages in need of support and make a difference in children's lives. 
              Use our advanced search and map features to find the perfect match for your organization's mission.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Component */}
        <div className="mb-8">
          <AdvancedSearch 
            onResults={handleSearchResults}
            onLoading={setIsLoading}
          />
        </div>

        {/* View Toggle */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {results?.orphanages.length || 0} Orphanages Found
            </h2>
            {results?.pagination && results.pagination.total > results.pagination.limit && (
              <span className="text-sm text-gray-600">
                Showing {((results.pagination.page - 1) * results.pagination.limit) + 1}-
                {Math.min(results.pagination.page * results.pagination.limit, results.pagination.total)} 
                of {results.pagination.total}
              </span>
            )}
          </div>
          
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📋 Grid View
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'map'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🗺️ Map View
            </button>
          </div>
        </div>

        {/* Content */}
        {viewMode === 'map' ? (
          <div className="mb-8">
            <OrphanageMap
              orphanages={results?.orphanages || []}
              onOrphanageSelect={handleOrphanageSelect}
              height="600px"
              zoom={6}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results?.orphanages.map((orphanage) => (
              <div
                key={orphanage.id}
                className="bg-white rounded-xl shadow-lg border border-orange-100 overflow-hidden hover:shadow-xl transition-all duration-200 hover:-translate-y-1"
              >
                {/* Profile Image Section */}
                <div className="relative h-48 bg-gradient-to-br from-orange-100 to-orange-200 overflow-hidden">
                  {orphanage.profileImageUrl ? (
                    <img
                      src={orphanage.profileImageUrl}
                      alt={orphanage.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                        🏠
                      </div>
                    </div>
                  )}

                  {/* Verification Badge */}
                  <div className="absolute top-4 right-4">
                    {getVerificationBadge(orphanage.verificationStatus)}
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-3">
                    <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
                      {orphanage.name}
                    </h3>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {orphanage.description}
                  </p>
                  
                  <p className="text-sm text-gray-500 mb-4 flex items-center">
                    <span className="mr-1">📍</span>
                    {orphanage.address}
                  </p>

                  {orphanage.needs && orphanage.needs.length > 0 && (
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
                      className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-center py-2 px-4 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 font-medium"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {results && results.orphanages.length === 0 && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No orphanages found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search criteria or clearing the filters to see more results.
              </p>
            </div>
          </div>
        )}

        {/* Pagination */}
        {results?.pagination && results.pagination.pages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
              {Array.from({ length: results.pagination.pages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`px-4 py-2 rounded-lg ${
                    page === results.pagination.page
                      ? 'bg-orange-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
