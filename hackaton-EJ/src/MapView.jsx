import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvent } from 'react-leaflet';

const MapView = ({ setTo }) => {
  const [markerPosition, setMarkerPosition] = useState([45.1885, 5.7245]);

  function MyMapEvent() {
    useMapEvent('click', (event) => {
      const { lat, lng } = event.latlng;
      setMarkerPosition([lat, lng]);
      setTo([lat, lng]);
    });
    return null;
  }

  return (
    <MapContainer center={markerPosition} zoom={13} style={{ height: '500px', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={markerPosition}>
        <Popup>
          Destination : <br />
          Latitude: {markerPosition[0]} <br />
          Longitude: {markerPosition[1]}
        </Popup>
      </Marker>
      <MyMapEvent />
    </MapContainer>
  );
};

export default MapView;
