'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { OrphanageProfile } from '@prisma/client';

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

interface OrphanageMapProps {
  orphanages: (OrphanageProfile & {
    needs?: { id: string; description: string }[];
  })[];
  onOrphanageSelect?: (orphanage: OrphanageProfile) => void;
  height?: string;
  center?: [number, number];
  zoom?: number;
}

export default function OrphanageMap({
  orphanages,
  onOrphanageSelect,
  height = '400px',
  center = [0, 0], // Default center
  zoom = 2,
}: OrphanageMapProps) {
  const [isClient, setIsClient] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>(center);

  useEffect(() => {
    setIsClient(true);
    
    // If orphanages have coordinates, calculate center
    const orphanagesWithCoords = orphanages.filter(
      (org) => org.latitude && org.longitude
    );
    
    if (orphanagesWithCoords.length > 0) {
      const avgLat = orphanagesWithCoords.reduce(
        (sum, org) => sum + (org.latitude || 0),
        0
      ) / orphanagesWithCoords.length;
      
      const avgLng = orphanagesWithCoords.reduce(
        (sum, org) => sum + (org.longitude || 0),
        0
      ) / orphanagesWithCoords.length;
      
      setMapCenter([avgLat, avgLng]);
    }
  }, [orphanages]);

  // Don't render on server side
  if (!isClient) {
    return (
      <div 
        className="bg-gray-100 rounded-lg flex items-center justify-center"
        style={{ height }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <style jsx global>{`
        .leaflet-container {
          height: ${height};
          width: 100%;
          border-radius: 0.5rem;
        }
      `}</style>
      
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        style={{ height, width: '100%' }}
        className="rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {orphanages
          .filter((orphanage) => orphanage.latitude && orphanage.longitude)
          .map((orphanage) => (
            <Marker
              key={orphanage.id}
              position={[orphanage.latitude!, orphanage.longitude!]}
              eventHandlers={{
                click: () => onOrphanageSelect?.(orphanage),
              }}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {orphanage.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {orphanage.address}
                  </p>
                  
                  {orphanage.needs && orphanage.needs.length > 0 && (
                    <div className="mb-2">
                      <p className="text-xs font-medium text-gray-700 mb-1">
                        Current Needs:
                      </p>
                      <ul className="text-xs text-gray-600">
                        {orphanage.needs.slice(0, 2).map((need) => (
                          <li key={need.id} className="truncate">
                            • {need.description}
                          </li>
                        ))}
                        {orphanage.needs.length > 2 && (
                          <li className="text-gray-500">
                            +{orphanage.needs.length - 2} more
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                  
                  <button
                    onClick={() => onOrphanageSelect?.(orphanage)}
                    className="w-full px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
      
      {/* Map Legend */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 z-[1000]">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
          <span className="text-xs text-gray-700">Orphanages</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Click markers for details
        </p>
      </div>
    </div>
  );
}
