async function fetchRoute(from, to) {
    const url = `https://data.mobilites-m.fr/api/routers/default/plan?fromPlace=${from[0]},${from[1]}&toPlace=${to[0]},${to[1]}&mode=TRANSIT,WALK`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors du calcul de l\'itinéraire :', error);
      return null;
    }
}

// Fonction pour récupérer les coordonnées à partir d'une adresse
const getCoordinatesFromAddress = async (address) => {
  const encodedAddress = encodeURIComponent(address); // Assurer que l'adresse est correctement encodée
  const url = `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&addressdetails=1`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.length > 0) {
      const { lat, lon } = data[0]; // Récupère la latitude et la longitude du premier résultat
      console.log(`Latitude: ${lat}, Longitude: ${lon}`);
      return { lat, lon }; // Retourne les coordonnées
    } else {
      console.error("Aucun résultat trouvé pour cette adresse.");
      return null;
    }
  } catch (error) {
    console.error("Erreur lors de la requête :", error);
  }
};


