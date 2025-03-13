import { MapContainer, TileLayer, Marker } from "react-leaflet";

const MapView = () => {
  return (
    <MapContainer center={[45.1885, 5.7245]} zoom={13} style={{ height: "500px", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    </MapContainer>
  );
};

export default MapView;
