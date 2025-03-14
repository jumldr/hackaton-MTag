import React, { useState } from 'react';
import MapView from './MapView';
import { fetchRoute, getCoordinatesFromAddress } from './api';
import './App.css';

export default function App() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState(null);
  const [route, setRoute] = useState(null);
  const [mode, setMode] = useState('WALK');

  const handleSearch = async () => {
    try {
      const fromCoords = await getCoordinatesFromAddress(from);
      if (fromCoords && to) {
        const routeData = await fetchRoute(fromCoords.lat, fromCoords.lon, to[0], to[1], mode);
        console.log("Itinéraires récupérés :", routeData.plan.itineraries);
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

  // Trier les itinéraires par durée (du plus court au plus long)
  const sortedItineraries = [...route.plan.itineraries].sort((a, b) => a.duration - b.duration);

  if (mode === 'WALK') {
    const itinerary = route.plan.itineraries[0]; // Prendre le premier itinéraire
    const totalWalkingTime = Math.round(itinerary.duration / 60); // Convertir en minutes
    return (
      <div>
        <h2>Trajet à pied</h2>
        <p>Temps de marche total : {totalWalkingTime} min</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Transport en commun</h2>

      {/* Affichage du trajet le plus rapide */}
      <div className="itinerary">
        <h3>Itinéraire le plus rapide - Durée : {Math.round(sortedItineraries[0].duration / 60)} min</h3>
        <ul>
          {sortedItineraries[0].legs.map((leg, legIndex) => {
            if (leg.mode === "WALK") {
              return (
                <li key={legIndex}>
                  🚶‍♂️ Marcher {Math.round(leg.distance)} mètres {legIndex === 0 ? `jusqu'à l'arrêt ${sortedItineraries[0].legs[legIndex + 1]?.from.name || "inconnu"}` : `jusqu'au point d'arrivée`}
                </li>
              );
            } else {
              return (
                <li key={legIndex}>
                  🚌 Prendre <strong>{leg.route}</strong> de <strong>{leg.from.name}</strong> à <strong>{leg.to.name}</strong> ({leg.intermediateStops?.length || 0} arrêt(s))
                </li>
              );
            }
          })}
        </ul>
      </div>

      {/* Bouton pour afficher les autres trajets */}
      {!showAllRoutes && (
        <button className="show-more-button" onClick={() => setShowAllRoutes(true)}>
          Afficher plus d'itinéraires
        </button>
      )}

      {/* Affichage des autres trajets si le bouton est cliqué */}
      {showAllRoutes && sortedItineraries.slice(1).map((itinerary, index) => (
        <div key={index} className="itinerary">
          <h3>Itinéraire {index + 2} - Durée totale : {Math.round(itinerary.duration / 60)} min</h3>
          <ul>
            {itinerary.legs.map((leg, legIndex) => {
              if (leg.mode === "WALK") {
                return (
                  <li key={legIndex}>
                    🚶‍♂️ Marcher {Math.round(leg.distance)} mètres {legIndex === 0 ? `jusqu'à l'arrêt ${itinerary.legs[legIndex + 1]?.from.name || "inconnu"}` : `jusqu'au point d'arrivée`}
                  </li>
                );
              } else {
                return (
                  <li key={legIndex}>
                    🚌 Prendre <strong>{leg.route}</strong> de <strong>{leg.from.name}</strong> à <strong>{leg.to.name}</strong> ({leg.intermediateStops?.length || 0} arrêt(s))
                  </li>
                );
              }
            })}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default App;
