// FILE: src/components/dashboard/NeedsManager.tsx

'use client';

import { useState, useEffect, FormEvent } from 'react';

type Need = {
  id: string;
  description: string;
  createdAt: string;
};

export default function NeedsManager() {
  const [needs, setNeeds] = useState<Need[]>([]);
  const [newNeed, setNewNeed] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch existing needs on component mount
  useEffect(() => {
    const fetchNeeds = async () => {
      try {
        const res = await fetch('/api/needs');
        if (!res.ok) throw new Error('Failed to fetch needs');
        const data = await res.json();
        setNeeds(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    fetchNeeds();
  }, []);

  const handleAddNeed = async (e: FormEvent) => {
    e.preventDefault();
    if (!newNeed.trim()) return;

    const res = await fetch('/api/needs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description: newNeed }),
    });

    if (res.ok) {
      const addedNeed = await res.json();
      setNeeds([addedNeed, ...needs]);
      setNewNeed('');
    } else {
      setError('Failed to add need. Please try again.');
    }
  };

  const handleDeleteNeed = async (id: string) => {
    if (!confirm('Are you sure you want to delete this need?')) return;

    const res = await fetch(`/api/needs?id=${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      setNeeds(needs.filter((need) => need.id !== id));
    } else {
      setError('Failed to delete need. Please try again.');
    }
  };

  if (isLoading) return <p>Loading needs...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="mt-10 bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Manage Your Needs List</h2>
      <form onSubmit={handleAddNeed} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newNeed}
          onChange={(e) => setNewNeed(e.target.value)}
          placeholder="e.g., Winter coats for ages 5-10"
          className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
        />
        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
          Add Need
        </button>
      </form>

      <div className="space-y-3">
        {needs.length > 0 ? (
          needs.map((need) => (
            <div key={need.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md border">
              <p className="text-gray-800">{need.description}</p>
              <button
                onClick={() => handleDeleteNeed(need.id)}
                className="text-red-500 hover:text-red-700 font-semibold"
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">You have not listed any needs yet.</p>
        )}
      </div>
    </div>
  );
}