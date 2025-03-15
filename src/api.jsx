export async function fetchRoute(fromLat, fromLon, toLat, toLon, mode) {
  const url = `https://data.mobilites-m.fr/api/routers/default/plan?fromPlace=${fromLat},${fromLon}&toPlace=${toLat},${toLon}&mode=${mode}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Erreur lors du calcul de l'itinéraire :", error);
    return null;
  }
}


export async function getCoordinatesFromAddress(address) {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&addressdetails=1`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
  
      if (data.length > 0) {
        return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon)};
      } else {
        console.error("Aucun résultat trouvé pour cette adresse.");
        return null;
      }
    } catch (error) {
      console.error("Erreur lors de la requête :", error);
      return null;
    }
}

export function getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => resolve({ lat: position.coords.latitude, lon: position.coords.longitude }),
          (error) => reject(error)
        );
      } else {
        reject(new Error('La géolocalisation n\'est pas supportée par ce navigateur.'));
      }
    });
}
