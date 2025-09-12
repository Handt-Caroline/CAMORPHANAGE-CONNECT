// FILE: src/components/dashboard/OrganizationDashboard.tsx

'use client';

import { useState, useEffect } from 'react';

type ProposedEvent = {
  id: string;
  title: string;
  status: 'PENDING' | 'APPROVED' | 'DECLINED' | 'COMPLETED';
  proposedDate: string;
  orphanage: {
    name: string;
  };
};

// A helper function to get a color based on status
const getStatusChipColor = (status: ProposedEvent['status']) => {
  switch (status) {
    case 'APPROVED':
      return 'bg-green-100 text-green-800';
    case 'DECLINED':
      return 'bg-red-100 text-red-800';
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function OrganizationDashboard() {
  const [proposals, setProposals] = useState<ProposedEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        setError(null);
        const res = await fetch('/api/events/my-proposals');
        if (!res.ok) {
          const errorText = await res.text();
          console.error('API Error:', res.status, errorText);

          if (res.status === 401) {
            setError('Please log in as an organization to view proposals.');
          } else if (res.status === 404) {
            setError('Organization profile not found. Please complete your organization registration.');
          } else {
            setError(`Failed to fetch proposals: ${errorText}`);
          }
          return;
        }
        const data = await res.json();
        setProposals(data);
      } catch (error) {
        console.error('Failed to fetch proposals:', error);
        setError('Network error. Please check your connection and try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProposals();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Your Proposed Events</h1>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Submission Status</h2>
        {isLoading ? (
          <p>Loading your proposals...</p>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error Loading Proposals</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded text-sm font-medium"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {proposals.length > 0 ? (
              proposals.map((event) => (
                <div key={event.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-lg">
                  <div>
                    <h3 className="font-bold text-lg">{event.title}</h3>
                    <p className="text-sm text-gray-600">
                      For: <span className="font-medium">{event.orphanage.name}</span>
                    </p>
                    <p className="text-sm text-gray-500">
                      Proposed Date: {new Date(event.proposedDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div 
                    className={`mt-2 sm:mt-0 px-3 py-1 text-sm font-medium rounded-full ${getStatusChipColor(event.status)}`}
                  >
                    {event.status}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">You have not proposed any events yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}