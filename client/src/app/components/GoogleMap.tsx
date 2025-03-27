'use client';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const defaultCenter = {
  lat: 28.690537992142215,
  lng: 77.29415115255327,
};

interface Location {
  lat: number;
  lng: number;
}

interface Community {
  _id: string;
  name: string;
  category: string;
  createdOn: string;
  description: string;
  group: string;
  isPrivate: boolean;
  members: string[];
  owner: {
    _id: string;
    username: string;
  };
  location?: {
    ipAddress: {
      lat: number;
      lng: number;
    };
    city: string;
    state: string;
    country: string;
  };
  __v: number;
  isFollowed?: boolean;
}

interface GoogleMapComponentProps {
  communities: Community[];
}

const isValidLocation = (location?: { lat: number; lng: number }): location is Location => {
  return !!location && 
         typeof location.lat === 'number' && 
         typeof location.lng === 'number' &&
         !isNaN(location.lat) &&
         !isNaN(location.lng);
};

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({ communities }) => {
  const [center, setCenter] = useState<Location>(defaultCenter);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);

  const getStoredLocation = useCallback((): Location | null => {
    const storedLocation = localStorage.getItem('location');
    if (storedLocation) {
      try {
        const parsedLocation = JSON.parse(storedLocation);
        return isValidLocation(parsedLocation) ? parsedLocation : null;
      } catch (e) {
        console.error('Error parsing stored location', e);
        localStorage.removeItem('location');
        return null;
      }
    }
    return null;
  }, []);

  const handleGeolocationSuccess = useCallback((position: GeolocationPosition) => {
    const location: Location = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
    
    if (isValidLocation(location)) {
      localStorage.setItem('location', JSON.stringify(location));
      setCenter(location);
    } else {
      console.error('Invalid coordinates received from geolocation');
      setCenter(defaultCenter);
    }
  }, []);

  const handleGeolocationError = useCallback((error: GeolocationPositionError) => {
    console.error(`Geolocation error: ${error.message}`);
    setCenter(defaultCenter);
  }, []);

  
  

  // Initial center determination
  useEffect(() => {
    setCenter(defaultCenter);
  }, []);

  // Determine map center based on communities
  useEffect(() => {
    if (communities?.length > 0) {
      const validCommunities = communities.filter(
        community => 
          community.location && 
          isValidLocation(community.location.ipAddress)
      );

      if (validCommunities.length > 0) {
        const firstCommunity = validCommunities[0];
        setCenter({
          lat: firstCommunity.location!.ipAddress.lat,
          lng: firstCommunity.location!.ipAddress.lng
        });
      }
    }
  }, [communities]);

  // Memoized communities with valid locations
  const validCommunitiesWithLocations = useMemo(() => 
    communities.filter(
      community => 
        community.location && 
        isValidLocation(community.location.ipAddress)
    ), 
    [communities]
  );

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={isValidLocation(center) ? center : defaultCenter}
      zoom={10}
    >
      {/* User's current location marker */}
      {isValidLocation(center) && (
        <Marker 
          position={center} 
          icon={{
            url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
          }}
        />
      )}

      {/* Community Markers */}
      {validCommunitiesWithLocations.map((community) => (
        <Marker
          key={community._id}
          position={{
            lat: community.location!.ipAddress.lat,
            lng: community.location!.ipAddress.lng
          }}
          onClick={() => setSelectedCommunity(community)}
          cursor="pointer"
        />
      ))}

      {/* Info Window for Selected Community */}
      {selectedCommunity && isValidLocation(selectedCommunity.location?.ipAddress) && (
        <InfoWindow
          position={{
            lat: selectedCommunity.location!.ipAddress.lat,
            lng: selectedCommunity.location!.ipAddress.lng
          }}
          onCloseClick={() => setSelectedCommunity(null)}
        >
          <div className="p-2">
            <h3 className="font-bold text-lg">{selectedCommunity.name}</h3>
            {selectedCommunity.location && (
              <p className="text-sm text-gray-600">
                {selectedCommunity.location.city}, 
                {selectedCommunity.location.state}, 
                {selectedCommunity.location.country}
              </p>
            )}
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

const MyApp = ({ communities }: { communities: Community[] }) =>
   (
  
  <div>
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
      <GoogleMapComponent communities={communities} />
    </LoadScript>
  </div>
  
);

export default MyApp;