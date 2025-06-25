import React, { useState, useCallback } from 'react';
import Map, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { MapPin } from 'lucide-react';

interface LocationPickerProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
}

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

export const LocationPicker: React.FC<LocationPickerProps> = ({ onLocationSelect }) => {
  const [viewState, setViewState] = useState({
    latitude: 40.7128,
    longitude: -74.0060,
    zoom: 11
  });
  const [marker, setMarker] = useState<{ latitude: number; longitude: number } | null>(null);
  const [address, setAddress] = useState('');

  const handleMapClick = useCallback((event: any) => {
    const { lat, lng } = event.lngLat;
    setMarker({ latitude: lat, longitude: lng });
    
    // Use Mapbox Geocoding API to get address
    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}`)
      .then(response => response.json())
      .then(data => {
        if (data.features && data.features.length > 0) {
          const newAddress = data.features[0].place_name;
          setAddress(newAddress);
          onLocationSelect({ lat, lng, address: newAddress });
        }
      });
  }, [onLocationSelect]);

  const handleAddressSearch = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event from bubbling up to parent form
    if (!address) return;

    // Use Mapbox Geocoding API to search for address
    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${MAPBOX_TOKEN}`)
      .then(response => response.json())
      .then(data => {
        if (data.features && data.features.length > 0) {
          const [longitude, latitude] = data.features[0].center;
          const newAddress = data.features[0].place_name;
          
          setViewState({
            ...viewState,
            latitude,
            longitude,
            zoom: 15
          });
          setMarker({ latitude, longitude });
          setAddress(newAddress);
          onLocationSelect({ lat: latitude, lng: longitude, address: newAddress });
        }
      });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Enter address to search"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="flex-1"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddressSearch(e);
            }
          }}
        />
        <Button type="button" onClick={handleAddressSearch}>Search</Button>
      </div>
      
      <div className="h-[400px] w-full rounded-lg overflow-hidden border" style={{ minHeight: 400 }}>
        <Map
          {...viewState}
          onMove={evt => setViewState(evt.viewState)}
          mapStyle="mapbox://styles/mapbox/streets-v12"
          mapboxAccessToken={MAPBOX_TOKEN}
          onClick={handleMapClick}
          style={{ width: '100%', height: '100%' }}
        >
          {marker && (
            <Marker
              latitude={marker.latitude}
              longitude={marker.longitude}
              anchor="bottom"
            >
              <MapPin className="w-6 h-6 text-primary" />
            </Marker>
          )}
        </Map>
      </div>
    </div>
  );
};

export default LocationPicker; 