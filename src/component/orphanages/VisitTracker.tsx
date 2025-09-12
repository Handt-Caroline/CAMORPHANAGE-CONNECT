'use client';

import { useEffect } from 'react';

interface VisitTrackerProps {
  orphanageId: string;
}

export default function VisitTracker({ orphanageId }: VisitTrackerProps) {
  useEffect(() => {
    // Track the visit when component mounts
    const trackVisit = async () => {
      try {
        await fetch(`/api/orphanages/${orphanageId}/visit`, {
          method: 'POST',
        });
      } catch (error) {
        console.error('Failed to track visit:', error);
      }
    };

    trackVisit();
  }, [orphanageId]);

  // This component doesn't render anything visible
  return null;
}
