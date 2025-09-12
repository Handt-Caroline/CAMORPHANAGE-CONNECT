'use client';

import { useState } from 'react';
import { Need } from '@prisma/client';

interface NeedsManagerProps {
  needs: Need[];
  onNeedsChange: (needs: Need[]) => void;
  editable?: boolean;
  verificationStatus?: string;
}

export default function NeedsManager({ needs, onNeedsChange, editable = false, verificationStatus }: NeedsManagerProps) {
  const [isAddingNeed, setIsAddingNeed] = useState(false);
  const [newNeedDescription, setNewNeedDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAddNeed = async () => {
    if (!newNeedDescription.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/needs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: newNeedDescription.trim(),
        }),
      });

      if (res.ok) {
        const newNeed = await res.json();
        onNeedsChange([...needs, newNeed]);
        setNewNeedDescription('');
        setIsAddingNeed(false);
      }
    } catch (error) {
      console.error('Failed to add need:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateNeed = async (needId: string, status: 'ACTIVE' | 'FULFILLED') => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/needs/${needId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        const updatedNeed = await res.json();
        onNeedsChange(needs.map(need => 
          need.id === needId ? updatedNeed : need
        ));
      }
    } catch (error) {
      console.error('Failed to update need:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteNeed = async (needId: string) => {
    if (!confirm('Are you sure you want to delete this need?')) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/needs/${needId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        onNeedsChange(needs.filter(need => need.id !== needId));
      }
    } catch (error) {
      console.error('Failed to delete need:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const activeNeeds = needs.filter(need => need.status === 'ACTIVE');
  const fulfilledNeeds = needs.filter(need => need.status === 'FULFILLED');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900">Current Needs</h3>
        {editable && verificationStatus === 'VERIFIED' && (
          <button
            onClick={() => setIsAddingNeed(true)}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Add Need
          </button>
        )}
        {editable && verificationStatus !== 'VERIFIED' && (
          <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 font-medium">
              ⚠️ Verification Required
            </p>
            <p className="text-yellow-700 text-sm mt-1">
              You must be verified by an admin before you can add needs.
            </p>
          </div>
        )}
      </div>

      {/* Add Need Form */}
      {isAddingNeed && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Describe what you need
              </label>
              <textarea
                value={newNeedDescription}
                onChange={(e) => setNewNeedDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="e.g., School supplies for 50 children, Winter clothing for ages 5-12, Educational books..."
              />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleAddNeed}
                disabled={isLoading || !newNeedDescription.trim()}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Adding...' : 'Add Need'}
              </button>
              <button
                onClick={() => {
                  setIsAddingNeed(false);
                  setNewNeedDescription('');
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Needs */}
      <div>
        <h4 className="text-lg font-medium text-gray-900 mb-4">
          Active Needs ({activeNeeds.length})
        </h4>
        {activeNeeds.length > 0 ? (
          <div className="space-y-3">
            {activeNeeds.map((need) => (
              <div key={need.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-gray-900">{need.description}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Added: {new Date(need.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {editable && (
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleUpdateNeed(need.id, 'FULFILLED')}
                        disabled={isLoading}
                        className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50"
                      >
                        Mark Fulfilled
                      </button>
                      <button
                        onClick={() => handleDeleteNeed(need.id)}
                        disabled={isLoading}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <div className="text-4xl mb-2">📋</div>
            <p className="text-gray-600">No active needs listed</p>
            {editable && (
              <p className="text-sm text-gray-500 mt-1">
                Add your first need to help organizations understand how they can support you.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Fulfilled Needs */}
      {fulfilledNeeds.length > 0 && (
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-4">
            Recently Fulfilled ({fulfilledNeeds.length})
          </h4>
          <div className="space-y-3">
            {fulfilledNeeds.slice(0, 3).map((need) => (
              <div key={need.id} className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-gray-900">{need.description}</p>
                    <p className="text-sm text-green-600 mt-1">
                      ✓ Fulfilled on {new Date(need.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {editable && (
                    <button
                      onClick={() => handleUpdateNeed(need.id, 'ACTIVE')}
                      disabled={isLoading}
                      className="px-3 py-1 bg-orange-600 text-white text-sm rounded hover:bg-orange-700 disabled:opacity-50"
                    >
                      Mark Active
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
