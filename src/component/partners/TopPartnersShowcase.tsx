'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface OrphanagePartner {
  id: string;
  name: string;
  description: string;
  address: string;
  profileImageUrl?: string;
  verificationStatus: string;
  score: number;
  visitCount: number;
  needs: Array<{
    id: string;
    description: string;
  }>;
  visits: Array<{
    id: string;
    visitDate: string;
  }>;
}

interface TopPartnersShowcaseProps {
  limit?: number;
  showTitle?: boolean;
}

export default function TopPartnersShowcase({ 
  limit = 6, 
  showTitle = true 
}: TopPartnersShowcaseProps) {
  const [partners, setPartners] = useState<OrphanagePartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTopPartners() {
      try {
        const response = await fetch(`/api/orphanages/top-scored?limit=${limit}`);
        if (!response.ok) {
          throw new Error('Failed to fetch top partners');
        }
        const data = await response.json();
        setPartners(data.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchTopPartners();
  }, [limit]);

  if (loading) {
    return (
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {showTitle && (
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Top Partners</h2>
              <p className="text-xl text-gray-600">Most visited and engaged orphanages</p>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(limit)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg border border-orange-100 overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-16 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-red-600 mb-4">⚠️ Error loading partners</div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (partners.length === 0) {
    return (
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-gray-600">No partners found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-gradient-to-br from-orange-50 via-white to-orange-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {showTitle && (
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Top Partners
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Meet our most visited and engaged orphanages - these partners have built strong 
              connections with organizations and consistently provide excellent care.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {partners.map((partner, index) => (
            <Link
              key={partner.id}
              href={`/orphanages/${partner.id}`}
              className="group relative overflow-hidden"
            >
              {/* Ranking Badge */}
              <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                #{index + 1}
              </div>

              {/* Card Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-3xl blur opacity-0 group-hover:opacity-25 transition duration-1000 group-hover:duration-200"></div>
              
              {/* Main Card */}
              <div className="relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform group-hover:-translate-y-2 border border-orange-100 overflow-hidden">
                {/* Image Section */}
                <div className="relative h-48 bg-gradient-to-br from-orange-100 to-orange-200 overflow-hidden">
                  {partner.profileImageUrl ? (
                    <img
                      src={partner.profileImageUrl}
                      alt={partner.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                        🏠
                      </div>
                    </div>
                  )}
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Score Badge */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-orange-600 shadow-lg">
                    ⭐ {Math.round(partner.score)}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-300 line-clamp-2">
                      {partner.name}
                    </h3>
                    
                    <div className="flex items-center mt-2 text-gray-500 text-sm">
                      <svg className="w-4 h-4 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      <span className="line-clamp-1">{partner.address}</span>
                    </div>
                  </div>

                  <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                    {partner.description}
                  </p>

                  {/* Stats Row */}
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
                    <div className="flex items-center space-x-3">
                      <span>👁️ {partner.visitCount} views</span>
                      <span>📋 {partner.needs.length} needs</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span>Verified</span>
                    </div>
                  </div>

                  {/* Action Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center text-orange-600 font-semibold text-sm group-hover:translate-x-2 transition-transform duration-300">
                      <span>Visit Partner</span>
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-12">
          <Link
            href="/orphanages"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            View All Partners
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
