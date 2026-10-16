"use client";

import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useState } from "react";
import { parseGPXFromXML, GPXData } from "@/lib/parseGPX";

// Fix for default marker icons in React-Leaflet
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function circleIcon(from: string, to: string, letter: string, size = 40) {
  return new L.Icon({
    iconUrl:
      "data:image/svg+xml," +
      encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 40 40">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${from};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${to};stop-opacity:1" />
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="18" fill="url(#g)" stroke="white" stroke-width="3"/>
      <text x="20" y="27" text-anchor="middle" font-size="19" fill="white" font-weight="bold" font-family="Arial">${letter}</text>
    </svg>
  `),
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}

const startSemiIcon = circleIcon("#10B981", "#059669", "D");
const start10Icon = circleIcon("#3498db", "#2874a6", "10", 36);
const finishIcon = circleIcon("#EF4444", "#DC2626", "A");

type RaceKey = "semi" | "10km";

const RACES: Record<
  RaceKey,
  { label: string; official: string; file: string; color: string; start: string; startDetail: string }
> = {
  semi: {
    label: "Semi-marathon",
    official: "21,1 km",
    file: "/parcours-semi.gpx",
    color: "#0A2540",
    start: "Gare de Houilles – Carrières-sur-Seine",
    startDetail: "RER A, Transilien J et L",
  },
  "10km": {
    label: "10 km",
    official: "10 km",
    file: "/parcours-10km.gpx",
    color: "#2874a6",
    start: "Le Pecq – stade, base nautique du Yacht Club",
    startDetail: "Bords de Seine, Le Pecq",
  },
};

function FitBounds({ bounds }: { bounds: GPXData["bounds"] }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(
        [
          [bounds.minLat, bounds.minLon],
          [bounds.maxLat, bounds.maxLon],
        ],
        { padding: [40, 40] },
      );
    }
  }, [bounds, map]);
  return null;
}

export default function MapComponent() {
  const [data, setData] = useState<Partial<Record<RaceKey, GPXData>>>({});
  const [loading, setLoading] = useState(true);
  const [race, setRace] = useState<RaceKey>("semi");

  useEffect(() => {
    Promise.all(
      (Object.keys(RACES) as RaceKey[]).map((key) =>
        fetch(RACES[key].file)
          .then((r) => r.text())
          .then((xml) => [key, parseGPXFromXML(xml)] as const),
      ),
    )
      .then((entries) => {
        setData(Object.fromEntries(entries));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur de chargement du parcours :", error);
        setLoading(false);
      });
  }, []);

  const semi = data.semi;
  const tenK = data["10km"];
  const current = data[race];

  const coords = useMemo(
    () => ({
      semi: semi?.points.map((p) => [p.lat, p.lon] as [number, number]) ?? [],
      "10km": tenK?.points.map((p) => [p.lat, p.lon] as [number, number]) ?? [],
    }),
    [semi, tenK],
  );

  if (loading) {
    return (
      <div className="h-[500px] w-full relative z-0 flex items-center justify-center bg-gray-100 rounded-2xl">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-navy-dark border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Chargement du parcours...</p>
        </div>
      </div>
    );
  }

  if (!semi || !tenK || !current) {
    return (
      <div className="h-[500px] w-full relative z-0 flex items-center justify-center bg-gray-100 rounded-2xl">
        <p className="text-gray-600">Impossible de charger le parcours</p>
      </div>
    );
  }

  const semiStart: [number, number] = [semi.points[0].lat, semi.points[0].lon];
  const tenKStart: [number, number] = [tenK.points[0].lat, tenK.points[0].lon];
  const finish: [number, number] = [semi.points[semi.points.length - 1].lat, semi.points[semi.points.length - 1].lon];
  const minEle = Math.min(...current.points.map((p) => p.ele));
  const maxEle = Math.max(...current.points.map((p) => p.ele));

  return (
    <div className="space-y-3 md:space-y-4">
      {/* Sélecteur de course */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-full bg-gray-100 p-1">
          {(Object.keys(RACES) as RaceKey[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setRace(key)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition md:px-5 ${
                race === key ? "bg-navy-dark text-white shadow" : "text-navy-dark hover:bg-white"
              }`}
              aria-pressed={race === key}
            >
              {RACES[key].label}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500">Tracé indicatif — mesurage officiel à venir</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 md:gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg md:rounded-xl p-3 md:p-4 shadow-lg">
          <div className="text-xs md:text-sm opacity-90">Distance</div>
          <div className="text-xl md:text-3xl font-bold">{RACES[race].official}</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg md:rounded-xl p-3 md:p-4 shadow-lg">
          <div className="text-xs md:text-sm opacity-90">Dénivelé +</div>
          <div className="text-xl md:text-3xl font-bold">+{current.elevationGain.toFixed(0)} m</div>
        </div>
        <div className="bg-gradient-to-br from-gold to-gold-dark text-white rounded-lg md:rounded-xl p-3 md:p-4 shadow-lg">
          <div className="text-xs md:text-sm opacity-90">Départ</div>
          <div className="text-sm md:text-lg font-bold leading-tight">{RACES[race].start}</div>
        </div>
      </div>

      {/* Carte */}
      <div className="h-[320px] md:h-[460px] lg:h-[520px] w-full relative z-0 rounded-xl md:rounded-2xl overflow-hidden shadow-2xl">
        <MapContainer center={semiStart} zoom={12} scrollWheelZoom={false} className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FitBounds bounds={current.bounds} />

          {/* L'autre course en filigrane */}
          <Polyline
            positions={race === "semi" ? coords["10km"] : coords.semi}
            pathOptions={{ color: race === "semi" ? "#2874a6" : "#0A2540", weight: 3, opacity: 0.25, dashArray: "6 8" }}
          />
          {/* Course sélectionnée */}
          <Polyline
            positions={coords[race]}
            pathOptions={{ color: RACES[race].color, weight: 5, opacity: 0.95, lineJoin: "round", lineCap: "round" }}
          />

          <Marker position={semiStart} icon={startSemiIcon}>
            <Popup>
              <div className="text-center font-sans">
                <div className="font-bold text-lg text-green-600">🏁 Départ semi-marathon</div>
                <div className="text-gray-700 mt-1">Gare de Houilles – Carrières-sur-Seine</div>
                <div className="text-sm text-gray-500 mt-1">RER A · Transilien J et L</div>
              </div>
            </Popup>
          </Marker>
          <Marker position={tenKStart} icon={start10Icon}>
            <Popup>
              <div className="text-center font-sans">
                <div className="font-bold text-lg text-seine-dark">🏁 Départ 10 km</div>
                <div className="text-gray-700 mt-1">Le Pecq, bords de Seine</div>
                <div className="text-sm text-gray-500 mt-1">Stade – base nautique du Yacht Club du Pecq</div>
              </div>
            </Popup>
          </Marker>
          <Marker position={finish} icon={finishIcon}>
            <Popup>
              <div className="text-center font-sans">
                <div className="font-bold text-lg text-red-600">🏆 Arrivée</div>
                <div className="text-gray-700 mt-1">Port de plaisance Seine Parisii</div>
                <div className="text-sm text-gray-500 mt-1">Cormeilles-en-Parisis</div>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* Profil */}
      <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg">
        <div className="flex items-baseline justify-between">
          <h3 className="text-lg md:text-xl font-bold text-navy-dark mb-3 md:mb-4">Profil d&apos;élévation</h3>
          <span className="text-xs text-gray-500">
            {minEle.toFixed(0)} m → {maxEle.toFixed(0)} m · parcours plat
          </span>
        </div>
        <div className="h-24 md:h-32 relative">
          <svg className="w-full h-full" viewBox="0 0 1000 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="elevationGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: "#3B82F6", stopOpacity: 0.6 }} />
                <stop offset="100%" style={{ stopColor: "#3B82F6", stopOpacity: 0.1 }} />
              </linearGradient>
            </defs>
            <polyline
              fill="url(#elevationGradient)"
              stroke="#3B82F6"
              strokeWidth="2"
              points={[
                "0,100",
                ...current.points.map((p, i) => {
                  const x = (i / (current.points.length - 1)) * 1000;
                  const y = 100 - ((p.ele - minEle) / Math.max(1, maxEle - minEle)) * 80;
                  return `${x.toFixed(1)},${y.toFixed(1)}`;
                }),
                "1000,100",
              ].join(" ")}
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
