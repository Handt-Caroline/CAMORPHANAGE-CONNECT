// FILE: src/app/orphanages/[id]/page.tsx
import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import { auth } from '@/auth';
import Link from 'next/link';
import VisitTracker from '@/components/orphanages/VisitTracker';
import OrphanageActions from '@/components/orphanages/OrphanageActions';

const prisma = new PrismaClient();

async function getOrphanageById(id: string) {
  const orphanage = await prisma.orphanageProfile.findUnique({
    where: { id },
    include: {
      needs: {
        where: { status: 'ACTIVE' },
        orderBy: { createdAt: 'desc' },
      },
    },
  });
  return orphanage;
}

export default async function OrphanageProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id } = await params;
  const orphanage = await getOrphanageById(id);

  if (!orphanage) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50/30">
      {/* Track visit */}
      <VisitTracker orphanageId={orphanage.id} />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-orange-50/50 to-white">
        {/* Background Decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-10 w-80 h-80 bg-gradient-to-br from-orange-400/20 to-orange-600/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-tr from-orange-300/15 to-orange-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/3 left-1/2 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-orange-700/5 rounded-full blur-xl animate-bounce delay-500"></div>
        </div>

        {/* Navigation Breadcrumb */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-orange-600 transition-colors duration-200">
              Home
            </Link>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
            <Link href="/orphanages" className="text-gray-500 hover:text-orange-600 transition-colors duration-200">
              Orphanages
            </Link>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
            <span className="text-orange-600 font-semibold">{orphanage.name}</span>
          </nav>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-6xl mx-auto py-16 md:py-24 px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            {/* Profile Image */}
            <div className="relative inline-block">
              {orphanage.profileImageUrl ? (
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full blur opacity-25 animate-pulse"></div>
                  <img
                    src={orphanage.profileImageUrl}
                    alt={`${orphanage.name} profile image`}
                    className="relative w-56 h-56 rounded-full object-cover shadow-2xl border-4 border-white mx-auto"
                  />
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full blur opacity-25 animate-pulse"></div>
                  <div className="relative w-56 h-56 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-2xl border-4 border-white mx-auto">
                    <span className="text-6xl text-white">🏠</span>
                  </div>
                </div>
              )}
              
              {/* Verified Badge */}
              <div className="absolute bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                ✓ Verified
              </div>
            </div>

            {/* Title and Location */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-black text-gray-900">
                {orphanage.name}
              </h1>
              
              <div className="flex items-center justify-center text-lg text-gray-600">
                <svg className="w-6 h-6 mr-3 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span className="font-medium">{orphanage.address}</span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex justify-center space-x-6 pt-8">
              <div className="text-center">
                <div className="text-3xl font-black text-orange-600">{orphanage.needs.length}</div>
                <div className="text-sm text-gray-600 font-medium">Active Needs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-orange-600">{orphanage.visitCount || 0}</div>
                <div className="text-sm text-gray-600 font-medium">Profile Views</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-orange-600">{Math.round(orphanage.score || 0)}</div>
                <div className="text-sm text-gray-600 font-medium">Partner Score</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${
                    orphanage.verificationStatus === 'VERIFIED'
                      ? 'bg-green-400 animate-pulse'
                      : 'bg-yellow-400'
                  }`}></div>
                  <span className="text-sm text-gray-600 font-medium">
                    {orphanage.verificationStatus === 'VERIFIED' ? 'Verified' : 'Unverified'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* About Section */}
            <section className="bg-white rounded-3xl shadow-xl border border-orange-100 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-6">
                <h2 className="text-3xl font-bold text-white flex items-center">
                  <span className="mr-3">📖</span>
                  About Us
                </h2>
              </div>
              <div className="p-8">
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
                    {orphanage.description}
                  </p>
                </div>
              </div>
            </section>

            {/* Current Needs Section */}
            <section className="bg-white rounded-3xl shadow-xl border border-orange-100 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-6">
                <h2 className="text-3xl font-bold text-white flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="mr-3">📋</span>
                    Current Needs
                  </div>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">
                    {orphanage.needs.length} Active
                  </span>
                </h2>
              </div>
              <div className="p-8">
                {orphanage.needs.length > 0 ? (
                  <div className="space-y-4">
                    {orphanage.needs.map((need, index) => (
                      <div
                        key={need.id}
                        className="group relative overflow-hidden"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        {/* Card Glow Effect */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-2xl blur opacity-0 group-hover:opacity-25 transition duration-300"></div>
                        
                        {/* Main Card */}
                        <div className="relative bg-gradient-to-r from-orange-50 to-orange-100/50 border-l-4 border-orange-500 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
                                📌
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="text-gray-800 text-lg leading-relaxed">
                                {need.description}
                              </p>
                              <div className="mt-3 flex items-center text-sm text-gray-500">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span>Posted {new Date(need.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div className="flex-shrink-0">
                              <div className="px-3 py-1 bg-orange-200 text-orange-800 rounded-full text-xs font-semibold uppercase tracking-wide">
                                Urgent
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-3xl">📋</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Current Needs</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      This orphanage hasn't listed any specific needs at the moment. Check back later or contact them directly.
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            {/* Contact Information Card */}
            <div className="bg-white rounded-3xl shadow-xl border border-orange-100 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-600 to-gray-700 px-6 py-4">
                <h3 className="text-xl font-bold text-white flex items-center">
                  <span className="mr-2">📞</span>
                  Contact Information
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <span className="text-gray-700">{orphanage.address}</span>
                </div>
                {orphanage.phone && (
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                    <span className="text-gray-700">{orphanage.phone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Support Statistics */}
            <div className="bg-white rounded-3xl shadow-xl border border-orange-100 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
                <h3 className="text-xl font-bold text-white flex items-center">
                  <span className="mr-2">📊</span>
                  Impact Statistics
                </h3>
              </div>
              <div className="p-6 space-y-6">
                <div className="text-center">
                  <div className="text-2xl font-black text-orange-600 mb-1">Active</div>
                  <div className="text-sm text-gray-600">Current Status</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-black text-orange-600 mb-1">Verified</div>
                  <div className="text-sm text-gray-600">Trust Level</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-black text-orange-600 mb-1">24/7</div>
                  <div className="text-sm text-gray-600">Support Available</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-3xl shadow-xl border border-orange-100 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
                <h3 className="text-xl font-bold text-white flex items-center">
                  <span className="mr-2">⚡</span>
                  Quick Actions
                </h3>
              </div>
              <div className="p-6 space-y-3">
                <OrphanageActions
                  orphanageId={orphanage.id}
                  orphanageUserId={orphanage.userId}
                  userRole={session?.user?.role}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Section */}
        <section className="mt-16">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl shadow-2xl text-white text-center relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-2xl"></div>
              <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
            </div>
            
            <div className="relative z-10 px-8 py-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Make a Difference?
              </h2>
              
              {session?.user.role === 'ORGANIZATION' ? (
                <div className="space-y-6">
                  <p className="text-xl text-orange-100 max-w-2xl mx-auto">
                    You're logged in as an organization. You can propose events and activities to help this orphanage.
                  </p>
                  <Link
                    href={`/propose-event/${orphanage.id}`}
                    className="inline-flex items-center px-10 py-5 bg-white text-orange-600 font-bold text-xl rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300"
                  >
                    <span className="mr-3 text-2xl">🎉</span>
                    Propose an Event to Help
                    <span className="ml-3 text-2xl">→</span>
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  <p className="text-xl text-orange-100 max-w-2xl mx-auto">
                    To propose events and collaborate with this orphanage, please log in as an organization.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      href="/login"
                      className="inline-flex items-center px-8 py-4 bg-white text-orange-600 font-bold text-lg rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300"
                    >
                      <span className="mr-2">🔑</span>
                      Login as Organization
                    </Link>
                    <Link
                      href="/register"
                      className="inline-flex items-center px-8 py-4 bg-orange-700 text-white font-bold text-lg rounded-xl shadow-xl hover:bg-orange-800 transform hover:scale-110 transition-all duration-300"
                    >
                      <span className="mr-2">✨</span>
                      Register Organization
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}