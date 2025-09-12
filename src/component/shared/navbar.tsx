// FILE: src/components/shared/Navbar.tsx

"use client"; // Required for the mobile menu state (useState)

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react'; // Using lucide-react for icons
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  const navLinks = session ? [
    { href: "/orphanages", label: "Find an Orphanage" },
    { href: "/about", label: "About Us" },
    { href: "/dashboard", label: "Dashboard" },
  ] : [
    { href: "/orphanages", label: "Find an Orphanage" },
    { href: "/about", label: "About Us" },
    { href: "/login", label: "Login" },
  ];

  return (
    <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-50 border-b border-orange-100/80">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-3xl font-black tracking-tight" onClick={() => setIsOpen(false)}>
              <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                CamOrphanage
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-orange-600 transition-colors duration-300 font-medium text-lg"
              >
                {link.label}
              </Link>
            ))}

            {session ? (
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">
                  <div>{session.user?.email}</div>
                  <div className="text-xs text-blue-600 font-medium">
                    Logged in as {session.user?.role}
                  </div>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/register"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-bold rounded-full text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                Register
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-orange-600 hover:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-xl">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 px-3">
              {session ? (
                <div className="space-y-2">
                  <div className="text-sm text-gray-600 px-3 py-2">
                    <div>{session.user?.email}</div>
                    <div className="text-xs text-blue-600 font-medium">
                      Logged in as {session.user?.role}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      signOut({ callbackUrl: '/login' });
                    }}
                    className="block w-full text-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center px-6 py-3 border border-transparent text-base font-bold rounded-full text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-md"
                >
                  Register
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}