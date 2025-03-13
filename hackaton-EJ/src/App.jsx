import React, { useState } from 'react';
import MapView from './MapView';
import { fetchRoute, getCoordinatesFromAddress } from './api';

const App = () => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState(null); // Stocke [lat, lng] directement
  const [route, setRoute] = useState(null);

  const handleSearch = async () => {
    try {
      const fromCoords = await getCoordinatesFromAddress(from);

      if (fromCoords && to) {
        const routeData = await fetchRoute(fromCoords.lat, fromCoords.lon, to[0], to[1]);
        setRoute(routeData);
        console.log(route)
      } else {
        console.error('Veuillez définir une adresse de départ et cliquer sur la carte pour choisir la destination.');
      }
    } catch (error) {
      console.error('Erreur lors de la recherche de l\'itinéraire :', error);
    }
  };

  return (
    <div>
      <h1>Calcul d'itinéraire à Grenoble</h1>

      <input
        type="text"
        placeholder="Adresse de départ"
        value={from}
        onChange={(e) => setFrom(e.target.value)}
      />

      <p>Destination : {to ? `Lat: ${to[0]}, Lon: ${to[1]}` : "Cliquez sur la carte pour choisir la destination"}</p>

      <button onClick={handleSearch}>Calculer l'itinéraire</button>

      <MapView setTo={setTo} route={route} />

      <div>
        {route ? (
          <pre>{JSON.stringify(route, null, 2)}</pre>
        ) : (
          <p>Aucun itinéraire trouvé.</p>
        )}
      </div>
    </div>
  );
};

export default App;
