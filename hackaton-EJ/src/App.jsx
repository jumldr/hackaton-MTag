import React, { useState } from "react";
import MapView from "./MapView";

function App() {
  // Etats pour les adresses, itinéraire et suggestions
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [route, setRoute] = useState(null);
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);

  // Fonction pour récupérer les suggestions de lieux
  const fetchSuggestions = async (query, type) => {
    try {
      const response = await fetch('https://data.mobilites-m.fr/api/routers/default/plan', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Paramètres de l'API pour rechercher les lieux
        params: {
          query, // La saisie de l'utilisateur pour filtrer
          type,  // 'from' ou 'to' pour indiquer quel champ est en cours de saisie
        }
      });

      // Si la réponse n'est pas OK, on lance une erreur
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des suggestions');
      }

      const data = await response.json();
      return data; // Retourner les suggestions
    } catch (error) {
      console.error('Erreur API:', error);
      return [];
    }
  };

  // Fonction pour gérer les changements dans le champ "from"
  const handleFromChange = async (e) => {
    const value = e.target.value;
    setFrom(value); // Mettre à jour l'adresse de départ
    if (value.length > 2) {  // Commence à chercher après 3 caractères
      const suggestions = await fetchSuggestions(value, 'from');
      setFromSuggestions(suggestions);
    } else {
      setFromSuggestions([]);
    }
  };

  // Fonction pour gérer les changements dans le champ "to"
  const handleToChange = async (e) => {
    const value = e.target.value;
    setTo(value); // Mettre à jour l'adresse d'arrivée
    if (value.length > 2) {  // Commence à chercher après 3 caractères
      const suggestions = await fetchSuggestions(value, 'to');
      setToSuggestions(suggestions);
    } else {
      setToSuggestions([]);
    }
  };

  // Fonction pour récupérer l'itinéraire
  const fetchRoute = async (from, to) => {
    try {
      const response = await fetch('https://data.mobilites-m.fr/api/routers/default/plan', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          fromPlace: from,
          toPlace: to,
          mode: 'TRANSIT,WALK', // Utiliser les transports en commun et la marche
          numItineraries: 1, // Limiter à un seul itinéraire
        }
      });

      // Si la réponse n'est pas OK, on lance une erreur
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération de l\'itinéraire');
      }

      const data = await response.json();
      return data; // Retourner les données de l'itinéraire
    } catch (error) {
      console.error('Erreur API:', error);
      return null;
    }
  };

  // Fonction pour traiter la recherche de l'itinéraire
  const handleSearch = async () => {
    const routeData = await fetchRoute(from, to);
    setRoute(routeData); // Mettre à jour l'état avec les résultats de l'itinéraire
  };

  return (
    <div>
      <h1>Carte des Transports à Grenoble</h1>
      <h4>Où voulez-vous aller ?</h4>

      {/* Champ de saisie pour l'adresse de départ */}
      <input
        type="text"
        placeholder="Adresse de départ"
        value={from}
        onChange={handleFromChange} // Mettre à jour l'adresse de départ et rechercher les suggestions
      />
      {fromSuggestions.length > 0 && (
        <ul>
          {fromSuggestions.map((suggestion, index) => (
            <li key={index} onClick={() => setFrom(suggestion)}>
              {suggestion}
            </li>
          ))}
        </ul>
      )}

      {/* Champ de saisie pour l'adresse d'arrivée */}
      <input
        type="text"
        placeholder="Adresse d'arrivée"
        value={to}
        onChange={handleToChange} // Mettre à jour l'adresse d'arrivée et rechercher les suggestions
      />
      {toSuggestions.length > 0 && (
        <ul>
          {toSuggestions.map((suggestion, index) => (
            <li key={index} onClick={() => setTo(suggestion)}>
              {suggestion}
            </li>
          ))}
        </ul>
      )}

      {/* Bouton pour calculer l'itinéraire */}
      <button onClick={handleSearch}>Calculer l'itinéraire</button>

      {/* Affichage des résultats de l'itinéraire */}
      {route ? (
        <div>
          <h4>Itinéraire trouvé :</h4>
          <pre>{JSON.stringify(route, null, 2)}</pre> {/* Affichage des résultats sous forme JSON */}
        </div>
      ) : (
        <p>Aucun itinéraire trouvé.</p>
      )}

      {/* Affichage de la carte */}
      <MapView />
    </div>
  );
}

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
