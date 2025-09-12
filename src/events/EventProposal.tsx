'use client';

import { useState } from 'react';
import { OrphanageProfile } from '@prisma/client';

interface EventProposalProps {
  orphanage: OrphanageProfile;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function EventProposal({ orphanage, onSuccess, onCancel }: EventProposalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    proposedDate: '',
    eventType: '',
    expectedAttendees: '',
    duration: '',
    requirements: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const eventTypes = [
    { value: 'DONATION', label: 'Donation Drive', icon: '🎁' },
    { value: 'WORKSHOP', label: 'Educational Workshop', icon: '📚' },
    { value: 'ENTERTAINMENT', label: 'Entertainment Event', icon: '🎭' },
    { value: 'HEALTH', label: 'Health & Wellness', icon: '🏥' },
    { value: 'SPORTS', label: 'Sports Activity', icon: '⚽' },
    { value: 'ARTS', label: 'Arts & Crafts', icon: '🎨' },
    { value: 'CELEBRATION', label: 'Celebration/Party', icon: '🎉' },
    { value: 'OTHER', label: 'Other', icon: '📝' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          orphanageId: orphanage.id,
        }),
      });

      if (response.ok) {
        onSuccess?.();
      } else {
        const errorData = await response.text();
        setError(errorData || 'Failed to submit proposal');
      }
    } catch (error) {
      setError('An unexpected error occurred');
      console.error('Event proposal error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Propose Event for {orphanage.name}
        </h2>
        <p className="text-gray-600">
          Create a meaningful event proposal that will make a difference in children's lives.
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Event Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Event Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Annual Book Drive, Christmas Celebration"
            required
          />
        </div>

        {/* Event Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Event Type *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {eventTypes.map((type) => (
              <label
                key={type.value}
                className={`flex items-center p-3 border rounded-xl cursor-pointer transition-colors ${
                  formData.eventType === type.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-blue-300'
                }`}
              >
                <input
                  type="radio"
                  name="eventType"
                  value={type.value}
                  checked={formData.eventType === type.value}
                  onChange={handleInputChange}
                  className="sr-only"
                />
                <span className="text-lg mr-2">{type.icon}</span>
                <span className="text-sm font-medium text-gray-700">{type.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Event Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describe your event, its purpose, and what you hope to achieve..."
            required
          />
        </div>

        {/* Date and Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Proposed Date *
            </label>
            <input
              type="date"
              name="proposedDate"
              value={formData.proposedDate}
              onChange={handleInputChange}
              min={minDate}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expected Attendees
            </label>
            <input
              type="number"
              name="expectedAttendees"
              value={formData.expectedAttendees}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Number of children"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration (hours)
            </label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              step="0.5"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 2.5"
            />
          </div>
        </div>

        {/* Requirements */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Special Requirements or Notes
          </label>
          <textarea
            name="requirements"
            value={formData.requirements}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Any special requirements, equipment needed, or additional notes..."
          />
        </div>

        {/* Orphanage Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-2">Event Location</h3>
          <p className="text-sm text-gray-600">
            <strong>{orphanage.name}</strong><br />
            {orphanage.address}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 pt-6">
          <button
            type="submit"
            disabled={isSubmitting || !formData.title || !formData.description || !formData.proposedDate || !formData.eventType}
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-4 px-6 rounded-xl hover:from-blue-600 hover:to-blue-700 focus:ring-4 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Submitting...
              </div>
            ) : (
              'Submit Proposal'
            )}
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-4 bg-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
