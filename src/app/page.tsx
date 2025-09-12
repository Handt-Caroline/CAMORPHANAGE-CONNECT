// FILE: src/app/page.tsx

import Link from 'next/link';
import TopPartnersShowcase from '@/components/partners/TopPartnersShowcase';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-400/30 to-orange-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-orange-300/20 to-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-gradient-to-br from-orange-400/10 to-orange-600/5 rounded-full blur-2xl animate-bounce delay-500"></div>
          <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-gradient-to-bl from-orange-500/15 to-orange-700/5 rounded-full blur-xl animate-bounce delay-700"></div>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/5 w-2 h-2 bg-orange-400/40 rounded-full animate-ping delay-300"></div>
          <div className="absolute top-2/3 left-2/3 w-1 h-1 bg-orange-500/50 rounded-full animate-ping delay-700"></div>
          <div className="absolute top-1/2 right-1/5 w-3 h-3 bg-orange-300/30 rounded-full animate-ping delay-1000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center space-y-8">
            {/* Main Heading with Gradient Animation */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight">
                <span className="block bg-gradient-to-r from-gray-800 via-gray-900 to-black bg-clip-text text-transparent animate-fadeIn">
                  Connecting Hearts,
                </span>
                <span className="block bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 bg-clip-text text-transparent animate-slideInUp delay-300 bg-size-200 animate-gradient-shift">
                  Building Futures.
                </span>
              </h1>
            </div>

            {/* Subtitle with Stagger Animation */}
            <p className="mt-8 max-w-4xl mx-auto text-xl md:text-2xl text-gray-600 leading-relaxed animate-fadeInUp delay-500">
              The trusted bridge between support organizations and orphanages in Cameroon.
              <span className="block mt-2 bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent font-semibold">
                Discover, connect, and make a tangible impact where it matters most.
              </span>
            </p>

            {/* CTA Buttons with Hover Animations */}
            <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center items-center animate-fadeInUp delay-700">
              <Link 
                href="/orphanages" 
                className="group relative px-10 py-5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-orange-500/25 transform hover:scale-110 transition-all duration-500 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center space-x-3">
                  <span>🏠</span>
                  <span>Find an Orphanage</span>
                  <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                </div>
              </Link>
              
              <Link 
                href="/register" 
                className="group relative px-10 py-5 bg-white border-3 border-orange-500 text-orange-600 font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:bg-orange-50 transform hover:scale-110 transition-all duration-500 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <div className="relative flex items-center space-x-3">
                  <span>✨</span>
                  <span>Register Your Home</span>
                  <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                </div>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-16 animate-fadeInUp delay-1000">
              <p className="text-sm text-gray-500 mb-6">Trusted by organizations worldwide</p>
              <div className="flex justify-center items-center space-x-8 opacity-60">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">🤝</div>
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">❤️</div>
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">🌟</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-orange-500 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-orange-500 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-32 bg-gradient-to-br from-orange-50 via-white to-orange-50/30 overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-br from-orange-200/20 to-orange-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-gradient-to-tr from-orange-300/15 to-orange-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6">
              Simple, Transparent, and 
              <span className="block bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                Effective
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A clear path to making a difference in the lives of children who need it most.
            </p>
          </div>

          <div className="grid gap-12 md:grid-cols-3">
            {/* Step 1 - Enhanced Card */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-3xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-orange-100">
                <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl text-white mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-orange-600 transition-colors duration-300">
                  Discover Needs
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Browse a directory of verified orphanages and see their real-time, specific needs. Every request is authenticated and urgent.
                </p>
                <div className="mt-6 flex items-center text-orange-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                  <span>Explore Now</span>
                  <span className="ml-2">→</span>
                </div>
              </div>
            </div>

            {/* Step 2 - Enhanced Card */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-3xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-orange-100">
                <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl text-white mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V7a2 2 0 012-2h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V8z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-orange-600 transition-colors duration-300">
                  Connect & Propose
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Directly contact homes or propose events like donation drives or workshops through our secure platform. Build meaningful relationships.
                </p>
                <div className="mt-6 flex items-center text-orange-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                  <span>Start Connecting</span>
                  <span className="ml-2">→</span>
                </div>
              </div>
            </div>

            {/* Step 3 - Enhanced Card */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-3xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-orange-100">
                <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl text-white mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-orange-600 transition-colors duration-300">
                  Track Your Impact
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Both parties can view visit history and engagement analytics, ensuring transparency and celebrating every moment of collaboration.
                </p>
                <div className="mt-6 flex items-center text-orange-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                  <span>See Impact</span>
                  <span className="ml-2">→</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Partners Showcase */}
      <TopPartnersShowcase limit={6} />

      {/* Final CTA Section */}
      <section className="relative py-32 bg-gradient-to-br from-white via-orange-50/30 to-white overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-orange-400/10 to-orange-600/5 rounded-full blur-3xl animate-pulse delay-300"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-tr from-orange-500/10 to-orange-700/5 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center px-4">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-6xl font-black text-gray-900">
              Ready to Make a 
              <span className="block bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                Difference?
              </span>
            </h2>
            
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Join our community of caring organizations and dedicated homes today. 
              <span className="block mt-2 font-semibold text-orange-600">
                Registration is simple, free, and life-changing.
              </span>
            </p>

            <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link 
                href="/register" 
                className="group relative px-12 py-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-xl rounded-2xl shadow-2xl hover:shadow-orange-500/30 transform hover:scale-110 transition-all duration-500 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center space-x-4">
                  <span className="text-2xl">🚀</span>
                  <span>Get Started Now</span>
                  <span className="group-hover:translate-x-3 transition-transform duration-300 text-2xl">→</span>
                </div>
                
                {/* Shine Effect */}
                <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
              </Link>
            </div>

            {/* Stats or Trust Elements */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-orange-100">
                <div className="text-3xl font-black text-orange-600 mb-2">500+</div>
                <div className="text-gray-600 font-medium">Verified Orphanages</div>
              </div>
              <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-orange-100">
                <div className="text-3xl font-black text-orange-600 mb-2">1000+</div>
                <div className="text-gray-600 font-medium">Support Organizations</div>
              </div>
              <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-orange-100">
                <div className="text-3xl font-black text-orange-600 mb-2">10k+</div>
                <div className="text-gray-600 font-medium">Children Helped</div>
              </div>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
}