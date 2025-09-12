'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function SessionWarning() {
  const { data: session } = useSession();
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    // Show warning when user first logs in
    if (session?.user && !localStorage.getItem('sessionWarningShown')) {
      setShowWarning(true);
    }
  }, [session]);

  const handleDismiss = () => {
    setShowWarning(false);
    localStorage.setItem('sessionWarningShown', 'true');
  };

  if (!showWarning) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-6">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Session Information</h3>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-3">
            You are now logged in as <strong>{session?.user?.role}</strong>.
          </p>
          <p className="text-gray-600 mb-3">
            <strong>Important:</strong> Your login session will be active across all browser tabs. 
            If you need to switch accounts, please use the logout button in the navigation bar.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-yellow-800 text-sm">
              💡 <strong>Tip:</strong> Use different browsers or incognito mode to test multiple accounts simultaneously.
            </p>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={handleDismiss}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}
