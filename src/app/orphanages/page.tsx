// FILE: src/app/orphanages/page.tsx
import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import OrphanageSearch from '@/components/OrphanageSearch';

const prisma = new PrismaClient();

// This function fetches data directly on the server
async function getOrphanages() {
  const orphanages = await prisma.orphanageProfile.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      address: true,
      profileImageUrl: true,
      verificationStatus: true,
      score: true,
      visitCount: true,
    },
    orderBy: [
      { score: 'desc' },
      { visitCount: 'desc' },
      { name: 'asc' },
    ],
  });
  return orphanages;
}

export default async function OrphanagesDirectoryPage() {
  const orphanages = await getOrphanages();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50/30">
      {/* Hero Header Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-orange-50/50 to-white">
        {/* Background Decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-br from-orange-400/20 to-orange-600/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-tr from-orange-300/15 to-orange-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-br from-orange-500/10 to-orange-700/5 rounded-full blur-xl animate-bounce delay-500"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto py-16 md:py-24 px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-black tracking-tight">
                <span className="block bg-gradient-to-r from-gray-800 via-gray-900 to-black bg-clip-text text-transparent">
                  Our Partner
                </span>
                <span className="block bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 bg-clip-text text-transparent">
                  Orphanages
                </span>
              </h1>
            </div>
            
            <p className="max-w-3xl mx-auto text-xl md:text-2xl text-gray-600 leading-relaxed">
              Browse our directory of verified homes and discover where you can make a 
              <span className="font-semibold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                {" "}real difference
              </span>
            </p>

            {/* Search Component */}
            <div className="mt-12 max-w-2xl mx-auto">
              <OrphanageSearch orphanages={orphanages} />
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-100">
                <div className="text-3xl font-black text-orange-600 mb-2">{orphanages.length}</div>
                <div className="text-gray-600 font-medium">Verified Orphanages</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-100">
                <div className="text-3xl font-black text-orange-600 mb-2">100%</div>
                <div className="text-gray-600 font-medium">Verified & Trusted</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-100">
                <div className="text-3xl font-black text-orange-600 mb-2">24/7</div>
                <div className="text-gray-600 font-medium">Support Available</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Find Your Perfect Match
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Each orphanage has been carefully verified and is ready to welcome your support
          </p>
        </div>

        {/* Orphanages Grid */}
        {orphanages.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {orphanages.map((orphanage, index) => (
              <Link
                href={`/orphanages/${orphanage.id}`}
                key={orphanage.id}
                className="group relative overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Card Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-3xl blur opacity-0 group-hover:opacity-25 transition duration-1000 group-hover:duration-200"></div>
                
                {/* Main Card */}
                <div className="relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform group-hover:-translate-y-2 border border-orange-100 overflow-hidden">
                  {/* Image Section */}
                  <div className="relative h-48 bg-gradient-to-br from-orange-100 to-orange-200 overflow-hidden">
                    {orphanage.profileImageUrl ? (
                      <img
                        src={orphanage.profileImageUrl}
                        alt={orphanage.name}
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
                    
                    {/* Verification Badge */}
                    <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold shadow-lg ${
                      orphanage.verificationStatus === 'VERIFIED'
                        ? 'bg-green-500 text-white'
                        : 'bg-yellow-500 text-white'
                    }`}>
                      {orphanage.verificationStatus === 'VERIFIED' ? '✓ Verified' : '⏳ Pending'}
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-300 line-clamp-2">
                        {orphanage.name}
                      </h3>
                      
                      <div className="flex items-center mt-2 text-gray-500 text-sm">
                        <svg className="w-4 h-4 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        <span className="line-clamp-1">{orphanage.address}</span>
                      </div>
                    </div>

                    <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                      {orphanage.description}
                    </p>

                    {/* Stats Row */}
                    <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
                      <div className="flex items-center space-x-3">
                        <span>👁️ {orphanage.visitCount || 0} views</span>
                        <span>⭐ {Math.round(orphanage.score || 0)} score</span>
                      </div>
                    </div>

                    {/* Action Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center text-orange-600 font-semibold text-sm group-hover:translate-x-2 transition-transform duration-300">
                        <span>Learn More</span>
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                      </div>

                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-xs text-gray-500">Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-4xl mx-auto mb-6 shadow-2xl">
                🏠
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                No Orphanages Yet
              </h3>
              <p className="text-gray-600 mb-8">
                We're working hard to bring verified orphanages to our platform. Please check back soon!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/register"
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Register Your Orphanage
                </Link>
                <Link
                  href="/"
                  className="px-6 py-3 bg-white text-orange-600 font-semibold rounded-xl shadow-lg border-2 border-orange-200 hover:bg-orange-50 transform hover:scale-105 transition-all duration-300"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Call to Action Section */}
        {orphanages.length > 0 && (
          <section className="mt-20 py-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-3x text-white text-center relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-2xl"></div>
              <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
            </div>
            
            <div className="relative z-10 max-w-3xl mx-auto px-6">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Make a Difference?
              </h3>
              <p className="text-xl text-orange-100 mb-8">
                Don't see what you're looking for? Register your organization to get started.
              </p>
              <Link
                href="/register"
                className="inline-flex items-center px-8 py-4 bg-white text-orange-600 font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300"
              >
                <span className="mr-3">🚀</span>
                Get Started Today
                <span className="ml-3">→</span>
              </Link>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}