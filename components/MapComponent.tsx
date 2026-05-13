"use client";

import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { parseGPXFromXML, GPXData } from "@/lib/parseGPX";

// Fix for default marker icons in React-Leaflet
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom icons with beautiful gradients
const startIcon = new L.Icon({
  iconUrl: "data:image/svg+xml," + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
      <defs>
        <linearGradient id="startGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#10B981;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#059669;stop-opacity:1" />
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="18" fill="url(#startGradient)" stroke="white" stroke-width="3"/>
      <text x="20" y="27" text-anchor="middle" font-size="20" fill="white" font-weight="bold" font-family="Arial">D</text>
    </svg>
  `),
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20],
});

const finishIcon = new L.Icon({
  iconUrl: "data:image/svg+xml," + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
      <defs>
        <linearGradient id="finishGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#EF4444;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#DC2626;stop-opacity:1" />
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="18" fill="url(#finishGradient)" stroke="white" stroke-width="3"/>
      <text x="20" y="27" text-anchor="middle" font-size="20" fill="white" font-weight="bold" font-family="Arial">A</text>
    </svg>
  `),
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20],
});

// Component to fit map bounds to the GPX track
function FitBounds({ bounds }: { bounds: GPXData["bounds"] }) {
  const map = useMap();

  useEffect(() => {
    if (bounds) {
      map.fitBounds([
        [bounds.minLat, bounds.minLon],
        [bounds.maxLat, bounds.maxLon],
      ], { padding: [100, 100] });
    }
  }, [bounds, map]);

  return null;
}

export default function MapComponent() {
  const [gpxData, setGpxData] = useState<GPXData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load and parse GPX file
    fetch("/trace_mWXDR.gpx")
      .then((response) => response.text())
      .then((xmlString) => {
        const data = parseGPXFromXML(xmlString);
        setGpxData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading GPX file:", error);
        setLoading(false);
      });
  }, []);

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

  if (!gpxData) {
    return (
      <div className="h-[500px] w-full relative z-0 flex items-center justify-center bg-gray-100 rounded-2xl">
        <p className="text-gray-600">Impossible de charger le parcours</p>
      </div>
    );
  }

  const pathCoordinates: [number, number][] = gpxData.points.map((p) => [p.lat, p.lon]);
  const startPosition: [number, number] = [gpxData.points[0].lat, gpxData.points[0].lon];
  const finishPosition: [number, number] = [
    gpxData.points[gpxData.points.length - 1].lat,
    gpxData.points[gpxData.points.length - 1].lon,
  ];

  return (
    <div className="space-y-3 md:space-y-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-2 md:gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg md:rounded-xl p-3 md:p-4 shadow-lg">
          <div className="text-xs md:text-sm opacity-90">Distance</div>
          <div className="text-xl md:text-3xl font-bold">21.1 km</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg md:rounded-xl p-3 md:p-4 shadow-lg">
          <div className="text-xs md:text-sm opacity-90">Dénivelé +</div>
          <div className="text-xl md:text-3xl font-bold">+{gpxData.elevationGain.toFixed(0)} m</div>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg md:rounded-xl p-3 md:p-4 shadow-lg">
          <div className="text-xs md:text-sm opacity-90">Dénivelé -</div>
          <div className="text-xl md:text-3xl font-bold">-{gpxData.elevationLoss.toFixed(0)} m</div>
        </div>
      </div>

      {/* Map */}
      <div className="h-[300px] md:h-[450px] lg:h-[500px] w-full relative z-0 rounded-xl md:rounded-2xl overflow-hidden shadow-2xl">
        <MapContainer
          center={startPosition}
          zoom={13}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <FitBounds bounds={gpxData.bounds} />

          {/* Main path with gradient effect */}
          <Polyline
            positions={pathCoordinates}
            pathOptions={{
              color: "#0A2540",
              weight: 5,
              opacity: 0.9,
              lineJoin: "round",
              lineCap: "round",
            }}
          />

          {/* Start marker */}
          <Marker position={startPosition} icon={startIcon}>
            <Popup>
              <div className="text-center font-sans">
                <div className="font-bold text-lg text-green-600">🏁 Départ</div>
                <div className="text-gray-700 mt-1">Pont de Bezons</div>
                <div className="text-sm text-gray-500 mt-1">
                  Altitude: {gpxData.points[0].ele.toFixed(0)} m
                </div>
              </div>
            </Popup>
          </Marker>

          {/* Finish marker */}
          <Marker position={finishPosition} icon={finishIcon}>
            <Popup>
              <div className="text-center font-sans">
                <div className="font-bold text-lg text-red-600">🏆 Arrivée</div>
                <div className="text-gray-700 mt-1">La Frette-sur-Seine</div>
                <div className="text-sm text-gray-500 mt-1">
                  Altitude: {gpxData.points[gpxData.points.length - 1].ele.toFixed(0)} m
                </div>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* Elevation Profile */}
      <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg">
        <h3 className="text-lg md:text-xl font-bold text-navy-dark mb-3 md:mb-4">Profil d&apos;élévation</h3>
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
              points={gpxData.points
                .map((p, i) => {
                  const x = (i / (gpxData.points.length - 1)) * 1000;
                  const minEle = Math.min(...gpxData.points.map((p) => p.ele));
                  const maxEle = Math.max(...gpxData.points.map((p) => p.ele));
                  const y = 100 - ((p.ele - minEle) / (maxEle - minEle)) * 80;
                  return `${x},${y}`;
                })
                .join(" ")}
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
