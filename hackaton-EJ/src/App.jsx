import React, { useState } from 'react';
import MapView from './MapView';
import { fetchRoute, getCoordinatesFromAddress } from './api';
import './App.css';

export default function App() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState(null);
  const [route, setRoute] = useState(null);
  const [mode, setMode] = useState('WALK');
  const [selectedItineraryIndex, setSelectedItineraryIndex] = useState(0);


  const handleSearch = async () => {
    try {
      const fromCoords = await getCoordinatesFromAddress(from);
      if (fromCoords && to) {
        const routeData = await fetchRoute(fromCoords.lat, fromCoords.lon, to[0], to[1], mode);
        console.log("Itinéraires récupérés :", routeData.plan.itineraries);
        setRoute(routeData);
        setSelectedItineraryIndex(0);
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

        <MapView 
          setTo={setTo} 
          route={route} 
          selectedItineraryIndex={selectedItineraryIndex} 
          className="map-container" 
        />
      </div>

      <div className="route-details">
        {route ? (
          <RouteDetails 
            route={route} 
            mode={mode} 
            selectedItineraryIndex={selectedItineraryIndex} 
            setSelectedItineraryIndex={setSelectedItineraryIndex} 
          />
        ) : (
          <p>Aucun itinéraire trouvé.</p>
        )}
      </div>
    </div>
  );
};

const RouteDetails = ({ route, mode, selectedItineraryIndex, setSelectedItineraryIndex }) => {
  const [showAllRoutes, setShowAllRoutes] = useState(false);

  if (!route || !route.plan || route.plan.itineraries.length === 0) {
    return <p>Aucun itinéraire trouvé.</p>;
  }

  const sortedItineraries = [...route.plan.itineraries].sort((a, b) => a.duration - b.duration);

  return (
    <div>
      <h2>{mode === "WALK" ? "Trajet à pied" : "Transport en commun"}</h2>

      {sortedItineraries.map((itinerary, index) => (
        <div key={index} className="itinerary">
          <h3>
            Itinéraire {index + 1} - Durée : {Math.round(itinerary.duration / 60)} min
            {selectedItineraryIndex === index && " ✅ (Sélectionné)"}
          </h3>
          <ul>
            {itinerary.legs.map((leg, legIndex) => (
              <li key={legIndex}>
                {leg.mode === "WALK" ? (
                  `🚶‍♂️ Marcher ${Math.round(leg.distance)} mètres`
                ) : (
                  `🚌 Prendre ${leg.route} de ${leg.from.name} à ${leg.to.name}`
                )}
              </li>
            ))}
          </ul>

          {selectedItineraryIndex !== index && (
            <button onClick={() => setSelectedItineraryIndex(index)}>
              Sélectionner cet itinéraire
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
