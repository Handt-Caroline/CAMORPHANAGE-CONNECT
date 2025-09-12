'use client';

import { useState, useEffect } from 'react';
import { OrphanageProfile, Need } from '@prisma/client';

type OrphanageWithNeeds = OrphanageProfile & {
  needs: Need[];
};

interface SearchFilters {
  search: string;
  location: string;
  needs: string;
  verified: string;
  hasEvents: string;
  sortBy: string;
  sortOrder: string;
}

interface AdvancedSearchProps {
  onResults: (results: {
    orphanages: OrphanageWithNeeds[];
    pagination: any;
    filters: SearchFilters;
  }) => void;
  onLoading: (loading: boolean) => void;
}

export default function AdvancedSearch({ onResults, onLoading }: AdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    search: '',
    location: '',
    needs: '',
    verified: '',
    hasEvents: '',
    sortBy: 'name',
    sortOrder: 'asc',
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    // Debounced search
    const timeoutId = setTimeout(() => {
      performSearch();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [filters]);

  const performSearch = async () => {
    setIsSearching(true);
    onLoading(true);

    try {
      const searchParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          searchParams.append(key, value);
        }
      });

      // Always include needs and coordinates for better display
      searchParams.append('includeNeeds', 'true');
      searchParams.append('includeCoordinates', 'true');

      const response = await fetch(`/api/orphanages?${searchParams.toString()}`);
      
      if (response.ok) {
        const data = await response.json();
        onResults(data);
      } else {
        console.error('Search failed:', response.statusText);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
      onLoading(false);
    }
  };

  const updateFilter = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      location: '',
      needs: '',
      verified: '',
      hasEvents: '',
      sortBy: 'name',
      sortOrder: 'asc',
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value && value !== 'name' && value !== 'asc'
  );

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      {/* Basic Search */}
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search orphanages by name or description..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`px-4 py-3 rounded-xl border transition-colors ${
              showAdvanced
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
            }`}
          >
            Advanced
          </button>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-4 py-3 bg-red-50 text-red-600 border border-red-200 rounded-xl hover:bg-red-100 transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                placeholder="City, state, or address"
                value={filters.location}
                onChange={(e) => updateFilter('location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specific Needs
              </label>
              <input
                type="text"
                placeholder="e.g., school supplies, food"
                value={filters.needs}
                onChange={(e) => updateFilter('needs', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verification Status
              </label>
              <select
                value={filters.verified}
                onChange={(e) => updateFilter('verified', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All</option>
                <option value="true">Verified Only</option>
                <option value="false">Unverified Only</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upcoming Events
              </label>
              <select
                value={filters.hasEvents}
                onChange={(e) => updateFilter('hasEvents', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All</option>
                <option value="true">Has Upcoming Events</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => updateFilter('sortBy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="name">Name</option>
                <option value="created">Date Added</option>
                <option value="location">Location</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort Order
              </label>
              <select
                value={filters.sortOrder}
                onChange={(e) => updateFilter('sortOrder', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
        )}

        {/* Search Status */}
        {isSearching && (
          <div className="flex items-center justify-center py-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mr-2"></div>
            <span className="text-sm text-gray-600">Searching...</span>
          </div>
        )}

        {/* Active Filters Summary */}
        {hasActiveFilters && !showAdvanced && (
          <div className="flex flex-wrap gap-2">
            {filters.search && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                Search: "{filters.search}"
              </span>
            )}
            {filters.location && (
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                Location: "{filters.location}"
              </span>
            )}
            {filters.needs && (
              <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                Needs: "{filters.needs}"
              </span>
            )}
            {filters.verified && (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                {filters.verified === 'true' ? 'Verified Only' : 'Unverified Only'}
              </span>
            )}
            {filters.hasEvents === 'true' && (
              <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                Has Events
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
