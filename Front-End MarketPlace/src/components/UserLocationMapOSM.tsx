import { useEffect, useState, useRef } from "react";
import L from "leaflet";
import { reverseGeocode, searchAddress } from "../services/nominatim";
import { Search, X, MapPin, Loader2 } from "lucide-react"; // Sugestão de ícones
import "leaflet/dist/leaflet.css";

type Coords = { lat: number; lng: number };

interface UserLocationMapOSMProps {
  onLocationSelect?: (addr: string[], coords: Coords) => void;
}

const customIcon = L.icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function UserLocationMapOSM({
  onLocationSelect,
}: UserLocationMapOSMProps) {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [address, setAddress] = useState<string[]>([]);
  const [error, setError] = useState<string>("");

  // Estados de Busca
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false); // Para controlar o "não encontrado"

  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  // Função Auxiliar para Atualizar Localização (Mapa + Marker + Texto)
  const updateLocation = async (lat: number, lng: number, moveMap = true) => {
    const newCoords = { lat, lng };
    setCoords(newCoords);

    if (moveMap && mapRef.current) {
      mapRef.current.flyTo([lat, lng], 16);
    }
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    }

    const addr = await reverseGeocode(lat, lng);
    setAddress(addr);
    onLocationSelect?.(addr, newCoords);
  };

  // 1. Obter localização inicial
  const handleMyLocation = () => {
    if (!navigator.geolocation)
      return setError("Geolocalização não suportada.");

    setIsSearching(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        updateLocation(pos.coords.latitude, pos.coords.longitude);
        setIsSearching(false);
      },
      () => {
        setError("Permissão de localização negada.");
        setIsSearching(false);
      },
      { enableHighAccuracy: true },
    );
  };

  useEffect(() => {
    handleMyLocation();
  }, []);

  // 2. Lógica de Busca com Debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length > 3) {
        setIsSearching(true);
        const results = await searchAddress(searchQuery);
        setSearchResults(results);
        setHasSearched(true);
        setIsSearching(false);
      } else {
        setSearchResults([]);
        setHasSearched(false);
      }
    }, 600);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // 3. Inicialização do Mapa (Apenas uma vez)
  useEffect(() => {
    if (!coords || mapRef.current) return;

    const map = L.map("map", { zoomControl: false }).setView(
      [coords.lat, coords.lng],
      15,
    );
    mapRef.current = map;

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      {
        attribution: "© CARTO",
      },
    ).addTo(map);

    const marker = L.marker([coords.lat, coords.lng], {
      icon: customIcon,
      draggable: true,
    }).addTo(map);

    markerRef.current = marker;

    marker.on("dragend", () => {
      const pos = marker.getLatLng();
      updateLocation(pos.lat, pos.lng, false);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [coords === null]);

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto p-4">
      {/* BARRA DE PESQUISA */}
      <div className="relative w-full mb-4 z-[1001]">
        <div className="flex items-center bg-white rounded-2xl shadow-xl border border-gray-100 p-2 transition-all focus-within:ring-2 focus-within:ring-purple-500">
          <Search className="ml-2 text-gray-400" size={20} />
          <input
            type="text"
            className="w-full p-2 outline-none text-gray-700 bg-transparent"
            placeholder="Buscar endereço..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* Botão Limpar (X) */}
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSearchResults([]);
              }}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors mr-1"
            >
              <X size={18} className="text-gray-500" />
            </button>
          )}

          <div className="h-6 w-[1px] bg-gray-200 mx-2" />

          {/* Botão Minha Localização */}
          <button
            onClick={handleMyLocation}
            title="Usar minha localização atual"
            className="p-2 text-purple-600 hover:bg-purple-50 rounded-xl transition-colors flex items-center gap-1"
          >
            {isSearching ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <MapPin size={20} />
            )}
            <span className="text-xs font-bold hidden sm:inline">GPS</span>
          </button>
        </div>

        {/* DROPDOWN DE RESULTADOS */}
        {searchQuery.length > 3 && (
          <ul className="absolute w-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            {isSearching && searchQuery.length > 3 && (
              <li className="p-4 text-center text-gray-500 text-sm animate-pulse">
                Buscando...
              </li>
            )}

            {!isSearching && hasSearched && searchResults.length === 0 && (
              <li className="p-4 text-center text-gray-500 text-sm">
                📌 Nenhum endereço encontrado.
              </li>
            )}

            {searchResults.map((result, idx) => (
              <li
                key={idx}
                onClick={() => {
                  updateLocation(
                    parseFloat(result.lat),
                    parseFloat(result.lon),
                  );
                  setSearchQuery("");
                  setSearchResults([]);
                }}
                className="p-3 hover:bg-purple-50 cursor-pointer text-sm border-b last:border-none flex flex-col"
              >
                <span className="font-bold text-gray-800">
                  {result.display_name.split(",")[0]}
                </span>
                <span className="text-gray-500 text-xs truncate">
                  {result.display_name}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* MAPA */}
      <div className="relative w-full">
        <div
          id="map"
          className="w-full h-80 rounded-3xl shadow-2xl border-4 border-white overflow-hidden z-0"
        />
        {error && (
          <div className="absolute top-2 left-2 right-2 bg-red-100 text-red-700 p-2 rounded-lg text-xs text-center z-[1000]">
            {error}
          </div>
        )}
      </div>

      {/* FOOTER - ENDEREÇO ATUAL */}
      <div className="mt-6 w-full p-5 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
            <MapPin size={24} />
          </div>
          <div className="flex-1">
            <h4 className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">
              Endereço Selecionado
            </h4>
            <p className="text-gray-800 font-semibold leading-tight">
              {address.length > 0 ? address.join(" ") : "Selecione no mapa..."}
            </p>
            <p className="text-[10px] text-gray-400 mt-2">
              Arraste o pin para ajustar o local exato
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
