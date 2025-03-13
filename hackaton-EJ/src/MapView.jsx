import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvent } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Importation des styles de Leaflet

const MapView = () => {
  const [markerPosition, setMarkerPosition] = useState([45.1885, 5.7245]);

  // Fonction pour gérer le clic sur la carte et obtenir les coordonnées
  function MyMapEvent() {
    const map = useMapEvent('click', (event) => {
      const { lat, lng } = event.latlng;
      setMarkerPosition([lat, lng]); // Met à jour la position du marqueur
      console.log('Latitude:', lat, 'Longitude:', lng); // Affiche les coordonnées dans la console
    });
    return null;
  }

  return (
    <MapContainer
      center={[45.1885, 5.7245]}
      zoom={13}
      style={{ height: '500px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" // Utilisation d'OpenStreetMap comme fond de carte
      />

      {/* Marqueur dynamique */}
      <Marker position={markerPosition}>
        <Popup>
          Latitude: {markerPosition[0]} <br />
          Longitude: {markerPosition[1]}
        </Popup>
      </Marker>

      {/* Utilisation de useMapEvent pour gérer les clics sur la carte */}
      <MyMapEvent />
    </MapContainer>
  );
};

export default MapView;
