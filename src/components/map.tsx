import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export type MapPoint = { lat: number; lng: number };

const LOME_CENTER: [number, number] = [6.1725, 1.2314];

function pinIcon(kind: "start" | "end" | "driver") {
  return L.divIcon({
    className: "naka-divicon",
    html: `<div class="naka-pin ${kind}"></div>`,
    iconSize: [34, 34],
    iconAnchor: kind === "driver" ? [17, 17] : [17, 30],
  });
}

function distanceMeters(a: [number, number], b: [number, number]) {
  const rad = Math.PI / 180;
  const dLat = (b[0] - a[0]) * rad;
  const dLng = (b[1] - a[1]) * rad;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(a[0] * rad) * Math.cos(b[0] * rad) * Math.sin(dLng / 2) ** 2;
  return 6371000 * 2 * Math.asin(Math.sqrt(h));
}

function interpolate(
  coords: [number, number][],
  segments: number[],
  target: number,
): [number, number] {
  let i = segments.findIndex((s) => s >= target);
  if (i <= 0) return coords[0];
  const prev = segments[i - 1];
  const ratio = (target - prev) / Math.max(segments[i] - prev, 0.001);
  const a = coords[i - 1];
  const b = coords[i];
  return [a[0] + (b[0] - a[0]) * ratio, a[1] + (b[1] - a[1]) * ratio];
}

export interface NakaMapProps {
  pickup?: MapPoint | null;
  destination?: MapPoint | null;
  compact?: boolean;
  movingMarker?: boolean;
  onRouteInfo?: (distanceKm: number | null, durationMin: number | null) => void;
}

export function NakaMap({
  pickup,
  destination,
  compact = false,
  movingMarker = false,
  onRouteInfo,
}: NakaMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const animRef = useRef(0);
  const pickupLat = pickup?.lat;
  const pickupLng = pickup?.lng;
  const destLat = destination?.lat;
  const destLng = destination?.lng;

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, {
      zoomControl: false,
      scrollWheelZoom: false,
    }).setView(LOME_CENTER, 12);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>',
    }).addTo(map);
    mapRef.current = map;
    layerRef.current = L.layerGroup().addTo(map);
    const timer = window.setTimeout(() => map.invalidateSize(), 80);
    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(animRef.current);
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer) return;
    layer.clearLayers();
    cancelAnimationFrame(animRef.current);

    const p1: MapPoint | null =
      pickupLat != null && pickupLng != null ? { lat: pickupLat, lng: pickupLng } : null;
    const p2: MapPoint | null =
      destLat != null && destLng != null ? { lat: destLat, lng: destLng } : null;

    if (p1) L.marker([p1.lat, p1.lng], { icon: pinIcon("start") }).addTo(layer);
    if (p2) L.marker([p2.lat, p2.lng], { icon: pinIcon("end") }).addTo(layer);

    if (!p1 || !p2) {
      const pts = [p1, p2].filter(Boolean) as MapPoint[];
      if (pts.length) {
        map.fitBounds(
          L.latLngBounds(pts.map((p) => [p.lat, p.lng] as [number, number])).pad(0.3),
        );
      } else {
        map.setView(LOME_CENTER, 12);
      }
      onRouteInfo?.(null, null);
      return;
    }

    let cancelled = false;
    const url = `https://router.project-osrm.org/route/v1/driving/${p1.lng},${p1.lat};${p2.lng},${p2.lat}?overview=full&geometries=geojson`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (!data?.routes?.length) throw new Error("no route");
        const route = data.routes[0] as {
          distance: number;
          duration: number;
          geometry: { coordinates: [number, number][] };
        };
        const line: [number, number][] = route.geometry.coordinates.map(
          ([lng, lat]) => [lat, lng] as [number, number],
        );
        L.polyline(line, { color: "#10a96b", weight: 5, opacity: 0.8 }).addTo(layer);
        map.fitBounds(L.latLngBounds(line).pad(0.2));
        onRouteInfo?.(
          Math.round((route.distance / 1000) * 10) / 10,
          Math.max(1, Math.round(route.duration / 60)),
        );

        if (movingMarker && line.length > 1) {
          const segments = [0];
          for (let i = 1; i < line.length; i++) {
            segments.push(segments[i - 1] + distanceMeters(line[i - 1], line[i]));
          }
          const total = segments[segments.length - 1];
          const marker = L.marker(line[0], { icon: pinIcon("driver") }).addTo(layer);
          const durationMs = Math.min(30000, Math.max(9000, total / 0.6));
          const start = performance.now();
          const step = (now: number) => {
            const t = Math.min(1, (now - start) / durationMs);
            marker.setLatLng(interpolate(line, segments, t * total));
            if (t < 1) animRef.current = requestAnimationFrame(step);
          };
          animRef.current = requestAnimationFrame(step);
        }
      })
      .catch(() => {
        if (cancelled) return;
        const straight: [number, number][] = [
          [p1.lat, p1.lng],
          [p2.lat, p2.lng],
        ];
        L.polyline(straight, {
          color: "#10a96b",
          weight: 4,
          opacity: 0.6,
          dashArray: "8 8",
        }).addTo(layer);
        map.fitBounds(L.latLngBounds(straight).pad(0.3));
        onRouteInfo?.(null, null);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickupLat, pickupLng, destLat, destLng, movingMarker]);

  return (
    <div
      ref={containerRef}
      className={`naka-map ${compact ? "compact" : ""}`}
      aria-label="Carte interactive de démonstration"
    />
  );
}
