// FILE: src/app/propose-event/[orphanageId]/page.tsx
'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';

export default function ProposeEventPage({ params }: { params: Promise<{ orphanageId: string }> }) {
  const { orphanageId } = use(params);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [proposedDate, setProposedDate] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        description,
        proposedDate,
        orphanageId: orphanageId,
      }),
    });

    if (res.ok) {
      setSuccess(true);
      setTimeout(() => router.push('/dashboard'), 2000);
    } else {
      const data = await res.json();
      setError(data.message || 'Failed to propose event.');
    }
  };

  if (success) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="p-8 bg-white rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-green-600">Proposal Sent!</h2>
          <p className="mt-2">The orphanage has been notified. Redirecting you to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="p-8 bg-white rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Propose an Event</h2>
        {/* Form fields for title, description, proposedDate... */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="title">Event Title</label>
          <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-3 py-2 border rounded-lg" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="description">Description (Optional)</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2" htmlFor="date">Proposed Date</label>
          <input id="date" type="date" value={proposedDate} onChange={(e) => setProposedDate(e.target.value)} required className="w-full px-3 py-2 border rounded-lg" />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
          Send Proposal
        </button>
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </form>
    </div>
  );
}