// FILE: src/app/orphanages/OrphanageSearch.tsx
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

interface Orphanage {
  id: string;
  name: string;
  description: string;
  address: string;
  profileImageUrl?: string | null;
}

interface OrphanageSearchProps {
  orphanages: Orphanage[];
}

export default function OrphanageSearch({ orphanages }: OrphanageSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Filter orphanages based on search term
  const filteredOrphanages = useMemo(() => {
    if (!searchTerm.trim()) return [];
    
    const term = searchTerm.toLowerCase();
    return orphanages.filter(orphanage =>
      orphanage.name.toLowerCase().includes(term) ||
      orphanage.description.toLowerCase().includes(term) ||
      orphanage.address.toLowerCase().includes(term)
    ).slice(0, 6); // Limit to 6 results for better UX
  }, [searchTerm, orphanages]);

  const showResults = searchTerm.trim() && isSearchFocused;

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
          <svg className="h-6 w-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
          placeholder="Search by name, location, or description..."
          className="w-full pl-16 pr-6 py-4 text-lg bg-white/90 backdrop-blur-sm border-2 border-orange-200 rounded-2xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-200/50 transition-all duration-300 shadow-xl"
        />

        {/* Search Button */}
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <button className="p-2 text-orange-500 hover:text-orange-600 transition-colors duration-200">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Search Results Dropdown */}
      {showResults && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-orange-100 overflow-hidden animate-fade-in">
          {filteredOrphanages.length > 0 ? (
            <>
              <div className="px-6 py-3 bg-orange-50 border-b border-orange-100">
                <p className="text-sm text-orange-700 font-semibold">
                  Found {filteredOrphanages.length} result{filteredOrphanages.length !== 1 ? 's' : ''}
                </p>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {filteredOrphanages.map((orphanage) => (
                  <Link
                    key={orphanage.id}
                    href={`/orphanages/${orphanage.id}`}
                    className="block px-6 py-4 hover:bg-orange-50 transition-colors duration-200 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-start space-x-4">
                      {/* Orphanage Image/Icon */}
                      <div className="flex-shrink-0">
                        {orphanage.profileImageUrl ? (
                          <img
                            src={orphanage.profileImageUrl}
                            alt={orphanage.name}
                            className="w-12 h-12 rounded-xl object-cover border-2 border-orange-200"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-white text-lg font-bold">
                            🏠
                          </div>
                        )}
                      </div>

                      {/* Orphanage Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-semibold text-gray-900 truncate group-hover:text-orange-600 transition-colors duration-200">
                          {orphanage.name}
                        </h4>
                        
                        <div className="flex items-center mt-1 text-sm text-gray-500">
                          <svg className="w-4 h-4 mr-1 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          </svg>
                          <span className="truncate">{orphanage.address}</span>
                        </div>
                        
                        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                          {orphanage.description}
                        </p>
                      </div>

                      {/* Arrow Icon */}
                      <div className="flex-shrink-0 text-orange-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* View All Results Footer */}
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
                <button
                  onClick={() => {
                    setIsSearchFocused(false);
                    // Scroll to results section
                    const resultsSection = document.querySelector('main');
                    resultsSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-sm text-orange-600 hover:text-orange-700 font-semibold transition-colors duration-200"
                >
                  View all results →
                </button>
              </div>
            </>
          ) : (
            /* No Results */
            <div className="px-6 py-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">No Results Found</h4>
              <p className="text-sm text-gray-600">
                Try adjusting your search terms or browse all orphanages below.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Search Suggestions */}
      {!searchTerm && (
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <span className="text-sm text-gray-500">Popular searches:</span>
          {['Children\'s Home', 'School', 'Healthcare', 'Education'].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setSearchTerm(suggestion)}
              className="px-3 py-1 text-xs bg-orange-100 text-orange-700 rounded-full hover:bg-orange-200 transition-colors duration-200"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}