export interface GPXPoint {
  lat: number;
  lon: number;
  ele: number;
}

export interface GPXData {
  points: GPXPoint[];
  bounds: {
    minLat: number;
    maxLat: number;
    minLon: number;
    maxLon: number;
  };
  totalDistance: number;
  elevationGain: number;
  elevationLoss: number;
}

/**
 * Parse GPX XML content and extract track points with elevation data
 */
export function parseGPXFromXML(xmlString: string): GPXData {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");

  const trackPoints = xmlDoc.querySelectorAll("trkpt");
  const points: GPXPoint[] = [];

  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLon = Infinity;
  let maxLon = -Infinity;

  trackPoints.forEach((trkpt) => {
    const lat = parseFloat(trkpt.getAttribute("lat") || "0");
    const lon = parseFloat(trkpt.getAttribute("lon") || "0");
    const eleElement = trkpt.querySelector("ele");
    const ele = eleElement ? parseFloat(eleElement.textContent || "0") : 0;

    points.push({ lat, lon, ele });

    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);
    minLon = Math.min(minLon, lon);
    maxLon = Math.max(maxLon, lon);
  });

  // Calculate total distance using Haversine formula
  let totalDistance = 0;
  for (let i = 1; i < points.length; i++) {
    totalDistance += calculateDistance(
      points[i - 1].lat,
      points[i - 1].lon,
      points[i].lat,
      points[i].lon
    );
  }

  // Calculate elevation gain and loss
  let elevationGain = 0;
  let elevationLoss = 0;
  for (let i = 1; i < points.length; i++) {
    const diff = points[i].ele - points[i - 1].ele;
    if (diff > 0) {
      elevationGain += diff;
    } else {
      elevationLoss += Math.abs(diff);
    }
  }

  return {
    points,
    bounds: { minLat, maxLat, minLon, maxLon },
    totalDistance,
    elevationGain,
    elevationLoss,
  };
}

/**
 * Calculate distance between two points using Haversine formula
 * Returns distance in kilometers
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}
