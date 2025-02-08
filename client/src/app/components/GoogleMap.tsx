'use client';
import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const defaultCenter = {
  lat: 28.6139,
  lng: 77.2090,
};

const GoogleMapComponent = () => {
  const [center, setCenter] = useState(defaultCenter);

  useEffect(() => {
    function getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    }
  
    function showPosition(position) {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      if (typeof lat === 'number' && typeof lng === 'number') {
        const location = { lat, lng };
        localStorage.setItem('location', JSON.stringify(location));
        setCenter(location);
      } else {
        console.error('Invalid coordinates received from geolocation.');
      }
    }
  
    function showError(error) {
      console.error(`Geolocation error: ${error.message}`);
      alert("Unable to fetch location. Using default location.");
      setCenter(defaultCenter);
    }
  
    const storedLocation = localStorage.getItem('location');
    if (storedLocation) {
      try {
        const parsedLocation = JSON.parse(storedLocation);
        if (
          parsedLocation &&
          typeof parsedLocation.lat === 'number' &&
          typeof parsedLocation.lng === 'number'
        ) {
          setCenter(parsedLocation);
        } else {
          console.error('Stored location is not valid. Using default location.');
          localStorage.removeItem('location'); // Clear invalid data
          getLocation(); // Attempt to fetch again
        }
      } catch (e) {
        console.error('Error parsing stored location. Using default location.', e);
        localStorage.removeItem('location'); // Clear corrupted data
        getLocation(); // Attempt to fetch again
      }
    } else {
      getLocation();
    }
  }, []);
  

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center && typeof center.lat === 'number' && typeof center.lng === 'number' ? center : defaultCenter}
      zoom={10}
    >
      {center && typeof center.lat === 'number' && typeof center.lng === 'number' && (
        <Marker position={center} />
      )}
    </GoogleMap>
  );
};

const MyApp = () => (
  <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
    <GoogleMapComponent />
  </LoadScript>
);

export default MyApp;
