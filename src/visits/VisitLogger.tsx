'use client';

import { useState, useEffect } from 'react';

interface Orphanage {
  id: string;
  name: string;
  address: string;
}

interface VisitLoggerProps {
  onVisitLogged?: () => void;
}

const VISIT_PURPOSES = [
  { value: 'DONATION', label: 'Donation Support' },
  { value: 'TEACHING', label: 'Teaching / Tutoring' },
  { value: 'WORKSHOP', label: 'Workshops' },
  { value: 'ONLINE_CLASS', label: 'Online Classes' },
  { value: 'VOLUNTEERING', label: 'Volunteering' },
];

export default function VisitLogger({ onVisitLogged }: VisitLoggerProps) {
  const [orphanages, setOrphanages] = useState<Orphanage[]>([]);
  const [selectedOrphanage, setSelectedOrphanage] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [purpose, setPurpose] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchOrphanages();
  }, []);

  const fetchOrphanages = async () => {
    try {
      const res = await fetch('/api/orphanages');
      if (res.ok) {
        const data = await res.json();
        setOrphanages(data);
      }
    } catch (error) {
      console.error('Failed to fetch orphanages:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/visits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orphanageId: selectedOrphanage,
          visitDate,
          purpose,
          notes: notes.trim() || null,
        }),
      });

      if (res.ok) {
        setSuccess('Visit logged successfully!');
        setSelectedOrphanage('');
        setVisitDate('');
        setPurpose('');
        setNotes('');
        onVisitLogged?.();
      } else {
        const errorData = await res.text();
        setError(errorData || 'Failed to log visit');
      }
    } catch (error) {
      setError('An unexpected error occurred');
      console.error('Failed to log visit:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Log New Visit</h3>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-700">{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Orphanage *
          </label>
          <select
            value={selectedOrphanage}
            onChange={(e) => setSelectedOrphanage(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select an orphanage</option>
            {orphanages.map((orphanage) => (
              <option key={orphanage.id} value={orphanage.id}>
                {orphanage.name} - {orphanage.address}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Visit Date *
          </label>
          <input
            type="date"
            value={visitDate}
            onChange={(e) => setVisitDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]} // Can't log future visits
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Purpose of Visit *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {VISIT_PURPOSES.map((purposeOption) => (
              <label
                key={purposeOption.value}
                className={`flex items-center p-3 border rounded-xl cursor-pointer transition-colors ${
                  purpose === purposeOption.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-blue-300'
                }`}
              >
                <input
                  type="radio"
                  name="purpose"
                  value={purposeOption.value}
                  checked={purpose === purposeOption.value}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                  purpose === purposeOption.value
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                }`}>
                  {purpose === purposeOption.value && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {purposeOption.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Add any additional details about the visit..."
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading || !selectedOrphanage || !visitDate || !purpose}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-4 px-6 rounded-xl hover:from-blue-600 hover:to-blue-700 focus:ring-4 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isLoading ? 'Logging Visit...' : 'Log Visit'}
          </button>
        </div>
      </form>
    </div>
  );
}
