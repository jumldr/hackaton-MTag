//npm install @mapbox/polyline

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvent, Polyline } from 'react-leaflet';
import polyline from '@mapbox/polyline';

const MapView = ({ setTo, route, className }) => {
  const [markerPosition, setMarkerPosition] = useState([45.1885, 5.7245]);
  const [polylineCoords, setPolylineCoords] = useState([]);

  useEffect(() => {
    if (route && route.plan && route.plan.itineraries.length > 0) {
      const coordinates = route.plan.itineraries[0].legs.flatMap(leg => {
        if (leg.legGeometry && leg.legGeometry.points) {
          return polyline.decode(leg.legGeometry.points); // Décode la chaîne en un tableau de lat/lon
        }
        return [];
      });

      setPolylineCoords(coordinates);
    }
  }, [route]);

  function MyMapEvent() {
    useMapEvent('click', (event) => {
      const { lat, lng } = event.latlng;
      setMarkerPosition([lat, lng]);
      setTo([lat, lng]);
    });
    return null;
  }

  return (
    <div className={className}>
      <MapContainer
        center={markerPosition}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <Marker position={markerPosition}>
          <Popup>
            Destination : <br />
            Latitude: {markerPosition[0]} <br />
            Longitude: {markerPosition[1]}
          </Popup>
        </Marker>

        {polylineCoords.length > 0 && <Polyline positions={polylineCoords} color="blue" />}

        <MyMapEvent />
      </MapContainer>
    </div>
  );
}

export default MapView;
