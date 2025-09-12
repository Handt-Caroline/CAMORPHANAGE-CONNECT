// FILE: src/components/dashboard/EventManager.tsx

'use client';

import { useState, useEffect } from 'react';

// Define a more detailed type for our event object
type EventWithOrg = {
  id: string;
  title: string;
  description: string;
  status: 'PENDING' | 'APPROVED' | 'DECLINED' | 'COMPLETED';
  proposedDate: string;
  organization: {
    name: string;
  };
};

export default function EventManager() {
  const [events, setEvents] = useState<EventWithOrg[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/events/manage');
        if (!res.ok) throw new Error('Failed to fetch events');
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleUpdateStatus = async (eventId: string, status: EventWithOrg['status']) => {
    const res = await fetch('/api/events/manage', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventId, status }),
    });

    if (res.ok) {
      // Update the local state to reflect the change immediately
      setEvents(events.map(event => 
        event.id === eventId ? { ...event, status } : event
      ));
    } else {
      alert('Failed to update event status.');
    }
  };

  const renderEventCard = (event: EventWithOrg) => (
    <div key={event.id} className="p-4 bg-white border rounded-lg shadow-sm">
      <h3 className="font-bold text-lg">{event.title}</h3>
      <p className="text-sm text-gray-600">From: {event.organization.name}</p>
      <p className="text-sm text-gray-500">Proposed Date: {new Date(event.proposedDate).toLocaleDateString()}</p>
      {event.description && <p className="mt-2 text-gray-700">{event.description}</p>}
      
      {event.status === 'PENDING' && (
        <div className="mt-4 flex gap-2">
          <button onClick={() => handleUpdateStatus(event.id, 'APPROVED')} className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600">Approve</button>
          <button onClick={() => handleUpdateStatus(event.id, 'DECLINED')} className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600">Decline</button>
        </div>
      )}
    </div>
  );
  
  if (isLoading) return <p>Loading events...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4">Event Proposals</h2>
      {/* Pending Proposals */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-3 text-amber-600">Pending Review</h3>
        <div className="space-y-4">
          {events.filter(e => e.status === 'PENDING').length > 0
            ? events.filter(e => e.status === 'PENDING').map(renderEventCard)
            : <p className="text-gray-500">No pending proposals.</p>
          }
        </div>
      </div>
      {/* Approved Events */}
      <div>
        <h3 className="text-xl font-semibold mb-3 text-green-600">Approved & Upcoming</h3>
        <div className="space-y-4">
          {events.filter(e => e.status === 'APPROVED').length > 0
            ? events.filter(e => e.status === 'APPROVED').map(renderEventCard)
            : <p className="text-gray-500">No approved events.</p>
          }
        </div>
      </div>
    </div>
  );
}