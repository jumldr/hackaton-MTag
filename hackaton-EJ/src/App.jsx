import React, { useState } from 'react';
import axios from 'axios';
import MapView from './MapView';

const App = () => {
  // Etats pour les adresses et l'itinéraire
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [route, setRoute] = useState(null);

  // Fonction pour récupérer l'itinéraire
  const fetchRoute = async (from, to) => {
    try {
      const response = await axios.get('https://data.mobilites-m.fr/api/routers/default/plan', {
        params: {
          fromPlace: from,
          toPlace: to,
          mode: 'TRANSIT,WALK', // Utilise la marche et les transports en commun
          numItineraries: 1 // Limiter à un seul itinéraire
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'itinéraire:', error);
      return null;
    }
  };

  // Fonction appelée au clic sur le bouton pour rechercher l'itinéraire
  const handleSearch = async () => {
    const routeData = await fetchRoute(from, to);
    setRoute(routeData);
  };

  return (
    <div>
      <h1>Calcul d'itinéraire à Grenoble</h1>

      {/* Champ de saisie pour l'adresse de départ */}
      <input
        type="text"
        placeholder="Adresse de départ"
        value={from}
        onChange={(e) => setFrom(e.target.value)}
      />

      {/* Champ de saisie pour l'adresse d'arrivée */}
      <input
        type="text"
        placeholder="Adresse d'arrivée"
        value={to}
        onChange={(e) => setTo(e.target.value)}
      />

      {/* Bouton pour calculer l'itinéraire */}
      <button onClick={handleSearch}>Calculer l'itinéraire</button>

      <div>
        <MapView />
      </div>

      {/* Affichage des résultats de l'itinéraire */}
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

// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App
