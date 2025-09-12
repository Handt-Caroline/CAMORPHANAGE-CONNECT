'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function ContactAdminLink() {
  const { data: session } = useSession();
  const [adminId, setAdminId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminId();
  }, []);

  // Don't show for admin users
  if (!session?.user || session.user.role === 'ADMIN') {
    return null;
  }

  const fetchAdminId = async () => {
    try {
      const response = await fetch('/api/admin/contact');
      if (response.ok) {
        const data = await response.json();
        setAdminId(data.adminId);
      }
    } catch (error) {
      console.error('Failed to fetch admin contact:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  if (!adminId) {
    return null;
  }

  return (
    <Link
      href={`/message/${adminId}`}
      className="w-full flex items-center px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
    >
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
          <span className="text-sm">👨‍💼</span>
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium">Contact Admin</div>
          <div className="text-xs text-purple-100">Get help & support</div>
        </div>
        <svg className="w-4 h-4 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </div>
    </Link>
  );
}
