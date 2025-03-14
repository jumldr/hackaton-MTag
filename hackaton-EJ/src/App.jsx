import React, { useState } from 'react';
import MapView from './MapView';
import { fetchRoute, getCoordinatesFromAddress } from './api';
import './App.css';

const App = () => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState(null);
  const [route, setRoute] = useState(null);
  const [mode, setMode] = useState('WALK');

  const handleSearch = async () => {
    try {
      const fromCoords = await getCoordinatesFromAddress(from);
      if (fromCoords && to) {
        const routeData = await fetchRoute(fromCoords.lat, fromCoords.lon, to[0], to[1], mode);
        setRoute(routeData);
      } else {
        console.error('Veuillez définir une adresse de départ et cliquer sur la carte pour choisir la destination.');
      }
    } catch (error) {
      console.error("Erreur lors de la recherche de l'itinéraire :", error);
    }
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1>Calcul d'itinéraire à Grenoble</h1>
      </div>

      <div className="content-container">
        <div className="controls">
          <input
            type="text"
            placeholder="Adresse de départ"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="input-field"
          />

          <p className="destination-text">
            Destination : {to ? `Lat: ${to[0]}, Lon: ${to[1]}` : "Cliquez sur la carte pour choisir la destination"}
          </p>

          <div className="mode-selector">
            <label>
              <input
                type="radio"
                value="WALK"
                checked={mode === 'WALK'}
                onChange={() => setMode('WALK')}
              />
              Trajet à pied uniquement
            </label>
            <label>
              <input
                type="radio"
                value="TRANSIT,WALK"
                checked={mode === 'TRANSIT,WALK'}
                onChange={() => setMode('TRANSIT,WALK')}
              />
              Transport en commun + marche
            </label>
          </div>

          <button className="search-button" onClick={handleSearch}>Calculer l'itinéraire</button>
        </div>

        <MapView setTo={setTo} route={route} className="map-container" />
      </div>

      <div className="route-details">
        {route ? (
          <RouteDetails route={route} mode={mode} />
        ) : (
          <p>Aucun itinéraire trouvé.</p>
        )}
      </div>
    </div>
  );
};

const RouteDetails = ({ route, mode }) => {
  if (!route || !route.plan || route.plan.itineraries.length === 0) {
    return <p>Aucun itinéraire trouvé.</p>;
  }

  const itinerary = mode === 'WALK' ? route.plan.itineraries[0] : route.plan.itineraries[1] || route.plan.itineraries[0];

  return (
    <div>
      <h2>{mode === 'WALK' ? "Trajet à pied" : "Trajet en transport en commun"}</h2>
      <p>Durée : {Math.round(itinerary.duration / 60)} min</p>
    </div>
  );
};

export default App;
