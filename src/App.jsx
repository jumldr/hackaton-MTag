import React, { useState } from 'react';
import MapView from './MapView';
import { fetchRoute, getCoordinatesFromAddress } from './api';
import './App.css';

const getTransportIcon = (routeType) => {
  switch (routeType) {
    case 0: return "🚋 Tram";
    case 3: return "🚌 Bus";
    default: return "🚍 Transport"; 
  }
};

export default function App() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState(null);
  const [route, setRoute] = useState(null);
  const [mode, setMode] = useState('WALK');
  const [selectedItineraryIndex, setSelectedItineraryIndex] = useState(0);
  const [searchPerformed, setSearchPerformed] = useState(false);

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
      setSearchPerformed(true);
    } catch (error) {
      console.error("Erreur lors de la recherche de l'itinéraire :", error);
      setSearchPerformed(true);
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

          <div >
            <p className="destination-text"> Cliquez sur la carte pour définir l'adresse d'arrivée</p>
          </div>

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

          <button className="all-button" onClick={handleSearch}>Calculer l'itinéraire</button>
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
          searchPerformed && <p>Aucun itinéraire trouvé.</p>
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

      {/* Affichage du premier itinéraire uniquement au début */}
      <div>
        <h3>
          Itinéraire 1 - Durée : {Math.round(sortedItineraries[0].duration / 60)} min
          {selectedItineraryIndex === 0 && " ✅ (Sélectionné)"}
        </h3>
        <div>
          {sortedItineraries[0].legs.map((leg, legIndex) => (
            <div key={legIndex} style={{ marginBottom: "10px" }}>
              {leg.mode === "WALK" ? (
                <p>🚶‍♂️ Marcher {Math.round(leg.distance)} mètres jusqu'à <strong>{leg.to.name.replace(/^.*, /, '')}</strong></p>
              ) : (
                <>
                  <p>
                    {getTransportIcon(leg.routeType)} <strong>{leg.routeShortName || leg.route}</strong> {" "}
                    de <strong>{leg.from.name.replace(/^.*, /, '')}</strong> à <strong>{leg.to.name.replace(/^.*, /, '')}</strong>
                  </p>
                  {leg.intermediateStops && leg.intermediateStops.length > 0 && (
                    <p>🔹 Arrêts intermédiaires : {leg.intermediateStops.map(stop => stop.name.replace(/^.*, /, '')).join(" ➝ ")}</p>
                  )}
                </>
              )}
            </div>
          ))}
        </div>

        {selectedItineraryIndex !== 0 && (
          <button className="all-button" onClick={() => setSelectedItineraryIndex(0)}>
            Sélectionner cet itinéraire
          </button>
        )}
      </div>

      {/* Affichage des autres itinéraires si "showAllRoutes" est vrai */}
      {showAllRoutes && sortedItineraries.slice(1).map((itinerary, index) => (
        <div key={index + 1} className="itinerary">
          <h3>
            Itinéraire {index + 2} - Durée : {Math.round(itinerary.duration / 60)} min
            {selectedItineraryIndex === index + 1 && " ✅ (Sélectionné)"}
          </h3>
          <div>
            {itinerary.legs.map((leg, legIndex) => (
              <div key={legIndex} style={{ marginBottom: "10px" }}>
                {leg.mode === "WALK" ? (
                  <p>🚶‍♂️ Marcher {Math.round(leg.distance)} mètres jusqu'à <strong>{leg.to.name.replace(/^.*, /, '')}</strong></p>
                ) : (
                  <>
                    <p>
                      {getTransportIcon(leg.routeType)} <strong>{leg.routeShortName || leg.route}</strong> {" "}
                      de <strong>{leg.from.name.replace(/^.*, /, '')}</strong> à <strong>{leg.to.name.replace(/^.*, /, '')}</strong>
                    </p>
                    {leg.intermediateStops && leg.intermediateStops.length > 0 && (
                      <p>🔹 Arrêts intermédiaires : {leg.intermediateStops.map(stop => stop.name.replace(/^.*, /, '')).join(" ➝ ")}</p>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>

          {selectedItineraryIndex !== index + 1 && (
            <button className="all-button" onClick={() => setSelectedItineraryIndex(index + 1)}>
              Sélectionner cet itinéraire
            </button>
          )}
        </div>
      ))}

      {/* Bouton pour afficher ou masquer les autres itinéraires */}
      {!showAllRoutes && sortedItineraries.length > 1 && (
        <button className="all-button" onClick={() => setShowAllRoutes(true)}>
          Afficher d'autres itinéraires
        </button>
      )}
    </div>
  );
};
