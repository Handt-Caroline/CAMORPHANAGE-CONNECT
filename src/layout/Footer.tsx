// Comprehensive Footer Component
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">C&C</span>
              </div>
              <span className="text-2xl font-bold">Connect & Care</span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Building bridges between orphanages in need and organizations ready to help. 
              Together, we create lasting impact in children's lives.
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

        {/* Support Section */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-3 text-orange-400">Support</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">
                    Community Guidelines
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-3 text-orange-400">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">
                    Data Protection
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-3 text-orange-400">Newsletter</h4>
              <p className="text-gray-300 text-sm mb-4">
                Stay updated with our latest news and success stories.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-400"
                />
                <button className="px-6 py-2 bg-orange-600 hover:bg-orange-700 rounded-r-lg transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-300 text-sm">
              © {currentYear} Connect & Care. All rights reserved. Made with ❤️ for children in need.
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
