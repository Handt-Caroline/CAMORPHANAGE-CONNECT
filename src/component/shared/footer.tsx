// Enhanced Footer Component
import Link from 'next/link';
import { auth } from '@/auth';

export default async function Footer() {
  const session = await auth();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Main Footer Content - Only show navigation for non-authenticated users */}
      {!session?.user && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">CO</span>
              </div>
              <span className="text-2xl font-bold">CamOrphanage</span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Connecting orphanages in Cameroon with organizations ready to help.
              Together, we create lasting impact in children&apos;s lives.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-orange-600 rounded-lg flex items-center justify-center transition-colors">
                <span className="text-lg">📘</span>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-orange-600 rounded-lg flex items-center justify-center transition-colors">
                <span className="text-lg">🐦</span>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-orange-600 rounded-lg flex items-center justify-center transition-colors">
                <span className="text-lg">📷</span>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-orange-600 rounded-lg flex items-center justify-center transition-colors">
                <span className="text-lg">💼</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-orange-400">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-300 hover:text-orange-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/orphanages" className="text-gray-300 hover:text-orange-400 transition-colors">
                  Browse Orphanages
                </Link>
              </li>
              <li>
                <Link href="/orphanages/enhanced" className="text-gray-300 hover:text-orange-400 transition-colors">
                  Advanced Search
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-gray-300 hover:text-orange-400 transition-colors">
                  Register
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-gray-300 hover:text-orange-400 transition-colors">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* For Organizations */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-orange-400">For Organizations</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/dashboard/organization" className="text-gray-300 hover:text-orange-400 transition-colors">
                  Organization Dashboard
                </Link>
              </li>
              <li>
                <Link href="/orphanages" className="text-gray-300 hover:text-orange-400 transition-colors">
                  Find Orphanages
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">
                  Propose Events
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">
                  Track Impact
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">
                  Success Stories
                </a>
              </li>
            </ul>
          </div>

          {/* For Orphanages */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-orange-400">For Orphanages</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/dashboard/orphanage" className="text-gray-300 hover:text-orange-400 transition-colors">
                  Orphanage Dashboard
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">
                  Manage Needs
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">
                  Event Proposals
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">
                  Connect with Organizations
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">
                  Verification Process
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Stats Section */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-orange-400 mb-2">50+</div>
              <div className="text-gray-300 text-sm">Verified Orphanages</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-400 mb-2">100+</div>
              <div className="text-gray-300 text-sm">Partner Organizations</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-400 mb-2">1000+</div>
              <div className="text-gray-300 text-sm">Children Helped</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-400 mb-2">500+</div>
              <div className="text-gray-300 text-sm">Successful Events</div>
            </div>
          </div>
        </div>
        </div>
      )}

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-300 text-sm">
              © {currentYear} CamOrphanage. All rights reserved. Made with ❤️ for children in Cameroon.
            </div>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <span className="text-gray-300 text-sm">Powered by</span>
              <div className="flex items-center space-x-2">
                <span className="text-blue-400">Next.js</span>
                <span className="text-gray-500">•</span>
                <span className="text-purple-400">Prisma</span>
                <span className="text-gray-500">•</span>
                <span className="text-green-400">Vercel</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}