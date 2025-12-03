import { useEffect, useState } from "react";
import L from "leaflet";
import { reverseGeocode } from "../services/nominatim";

type Coords = { lat: number; lng: number };

export interface UserLocationMapOSMProps {
  onLocationSelect?: (address: string[]) => void;
}

export default function UserLocationMapOSM({
  onLocationSelect,
}: UserLocationMapOSMProps) {
  const [coords, setCoords] = useState<Coords>({ lat: 0, lng: 0 });
  const [address, setAddress] = useState<string[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setError("Geolocalização não suportada neste navegador.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const addr = await reverseGeocode(latitude, longitude);
        setCoords({ lat: latitude, lng: longitude });
        setAddress(addr);
        onLocationSelect?.(addr);
      },
      () => setError("Erro ao obter localização ou permissão negada.")
    );
  }, []);

  useEffect(() => {
    if (!coords) return;

    const map = L.map("map").setView([coords.lat, coords.lng], 15);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    L.marker([coords.lat, coords.lng])
      .addTo(map)
      .bindPopup("Você está aqui!")
      .openPopup();

    return () => {
      map.remove();
    };
  }, [coords]);

  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="flex flex-col items-center mt-10">
      {coords ? (
        <>
          <div
            id="map"
            className="w-full max-w-2xl h-96 rounded-xl shadow-lg"
          ></div>

          <div className="mt-4 mb-4 text-center">
            <p className="text-gray-700 text-lg font-medium">
              {address.length > 0 ? address.join("") : "Carregando..."}
            </p>
            <p className="text-sm text-gray-500">
              ({coords.lat.toFixed(6)}, {coords.lng.toFixed(6)})
            </p>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-500 mt-10 animate-pulse">
          Carregando localização...
        </p>
      )}
    </div>
  );
}
