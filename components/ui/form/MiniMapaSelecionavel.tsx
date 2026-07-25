"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Ícone padrão do Leaflet (sem isso, o pino aparece quebrado em Next.js)
const icone = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface Props {
  latitude: number | null;
  longitude: number | null;
  onChange: (lat: number, lng: number) => void;
}

function CliqueNoMapa({ onChange }: { onChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function MiniMapaSelecionavel({
  latitude,
  longitude,
  onChange,
}: Props) {
  // Centro padrão: Porto de Galinhas, caso ainda não tenha localização
  const centro: [number, number] =
    latitude && longitude ? [latitude, longitude] : [-8.5083, -35.0026];

  return (
    <div className="h-64 w-full overflow-hidden rounded-xl border border-slate-200">
      <MapContainer
        center={centro}
        zoom={latitude ? 15 : 12}
        style={{ height: "100%", width: "100%" }}
        key={`${latitude}-${longitude}`}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        <CliqueNoMapa onChange={onChange} />

        {latitude && longitude && (
          <Marker
            position={[latitude, longitude]}
            icon={icone}
            draggable
            eventHandlers={{
              dragend: (e) => {
                const posicao = e.target.getLatLng();
                onChange(posicao.lat, posicao.lng);
              },
            }}
          />
        )}

      </MapContainer>
    </div>
  );
}
