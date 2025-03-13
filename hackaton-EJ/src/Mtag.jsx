async function fetchRoute(fromLat, fromLon, toLat, toLon) {
    const url = `https://data.mobilites-m.fr/api/routers/default/plan?fromPlace=${fromLat},${fromLon}&toPlace=${toLat},${toLon}&mode=TRANSIT,WALK`;

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
