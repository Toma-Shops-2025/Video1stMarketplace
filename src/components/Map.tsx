import { useCallback, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

interface MapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  markers?: Array<{ lat: number; lng: number; title?: string }>;
  height?: string;
  width?: string;
  onMapClick?: (location: { lat: number; lng: number }) => void;
}

const defaultCenter = { lat: 0, lng: 0 };

export default function Map({
  center = defaultCenter,
  zoom = 12,
  markers = [],
  height = '400px',
  width = '100%',
  onMapClick
}: MapProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null);

  // Defensive fallback for height/width
  const safeHeight = typeof height === 'string' && height.match(/^\d+(px|%)$/) ? height : '400px';
  const safeWidth = typeof width === 'string' && width.match(/^\d+(px|%)$/) ? width : '100%';

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (onMapClick && e.latLng) {
      onMapClick({
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      });
    }
  }, [onMapClick]);

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={{ height: safeHeight, width: safeWidth }}
        center={center}
        zoom={zoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={handleMapClick}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={{ lat: marker.lat, lng: marker.lng }}
            title={marker.title}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
} 