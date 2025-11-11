import React, { useEffect, useRef, useState } from 'react';

// FIX: Declare google constant to fix TypeScript errors for the globally loaded Google Maps script.
declare const google: any;

interface MapProps {
  lat: number;
  lng: number;
  zoom?: number;
}

const Map: React.FC<MapProps> = ({ lat, lng, zoom = 15 }) => {
  const ref = useRef<HTMLDivElement>(null);
  // FIX: Use `any` for map state as Google Maps types are not available.
  const [map, setMap] = useState<any | null>(null);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    if (ref.current && typeof google !== 'undefined' && google.maps) {
      try {
        const newMap = new google.maps.Map(ref.current, {
          center: { lat, lng },
          zoom,
          disableDefaultUI: true,
        });
        new google.maps.Marker({
            position: { lat, lng },
            map: newMap,
        });
        setMap(newMap);
      } catch (e) {
        console.error("Error loading Google Maps:", e);
        setError(true);
      }
    } else if (typeof google === 'undefined' || !google.maps) {
        // If google object is not available after a short delay, assume it failed to load
        const timeout = setTimeout(() => {
            if(!ref.current?.hasChildNodes()){
                 setError(true);
            }
        }, 1000);
        return () => clearTimeout(timeout);
    }
  }, [lat, lng, zoom]);

  return (
    <div ref={ref} className="w-full h-64 md:h-80 rounded-lg bg-gray-200 flex items-center justify-center">
      {error && (
        <div className="text-center text-gray-600 p-4">
          <p className="font-semibold">Could not load map.</p>
          <p className="text-sm">Please ensure a valid Google Maps API key is configured in index.html.</p>
        </div>
      )}
    </div>
  );
};

export default Map;