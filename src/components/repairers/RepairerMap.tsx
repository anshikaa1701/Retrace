import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Repairer } from '../../types';

interface RepairerMapProps {
  repairers: Repairer[];
  selectedRepairerId?: string;
  onSelectRepairer?: (repairer: Repairer) => void;
  className?: string;
}

export const RepairerMap: React.FC<RepairerMapProps> = ({
  repairers,
  selectedRepairerId,
  onSelectRepairer,
  className = 'w-full h-[420px] rounded-2xl overflow-hidden'
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Default center (e.g. Bangalore / Tech hub coordinate or average of repairer coordinates)
    const defaultLat = 12.9716;
    const defaultLng = 77.5946;

    // Initialize Map instance
    const map = L.map(mapContainerRef.current, {
      center: [defaultLat, defaultLng],
      zoom: 12,
      zoomControl: true,
      attributionControl: false
    });

    mapInstanceRef.current = map;

    // Dark styled OpenStreetMap tiles (CartoDB Dark Matter)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd'
    }).addTo(map);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update markers when repairers list changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current.clear();

    const group = L.featureGroup();

    repairers.forEach((rep, index) => {
      // Mock or use repairer coordinates with offsets around center
      const lat = rep.latitude || 12.9716 + (index % 3 === 0 ? 0.025 : -0.018) * (index + 1) * 0.4;
      const lng = rep.longitude || 77.5946 + (index % 2 === 0 ? -0.022 : 0.031) * (index + 1) * 0.4;

      const isSelected = rep.id === selectedRepairerId;

      // Custom Dark Glass Marker Icon
      const customHtml = `
        <div style="
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: ${isSelected ? '#F59E0B' : '#12121A'};
          border: 2px solid ${rep.verified ? '#10B981' : '#F59E0B'};
          box-shadow: 0 0 15px ${isSelected ? 'rgba(245,158,11,0.6)' : 'rgba(0,0,0,0.8)'};
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${isSelected ? '#000000' : '#FFFFFF'};
          font-family: monospace;
          font-weight: bold;
          font-size: 11px;
          cursor: pointer;
        ">
          ★${rep.rating.toFixed(1)}
        </div>
      `;

      const icon = L.divIcon({
        html: customHtml,
        className: 'repath-custom-map-pin',
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      const marker = L.marker([lat, lng], { icon }).addTo(map);

      // Popup content
      const popupHtml = `
        <div style="font-family: sans-serif; padding: 4px; color: #111; min-width: 160px;">
          <div style="font-weight: bold; font-size: 13px;">${rep.name}</div>
          <div style="font-size: 11px; color: #555; margin-top: 2px;">${rep.specialty || 'Hardware Specialist'}</div>
          <div style="font-size: 11px; margin-top: 4px; display: flex; justify-content: space-between;">
            <span style="color: #059669; font-weight: 600;">★ ${rep.rating} (${rep.completedRepairs} repairs)</span>
            ${rep.verified ? '<span style="color: #0284c7; font-weight: 600;">✓ Verified</span>' : ''}
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('click', () => {
        if (onSelectRepairer) onSelectRepairer(rep);
      });

      markersRef.current.set(rep.id, marker);
      group.addLayer(marker);
    });

    if (repairers.length > 0 && mapInstanceRef.current) {
      try {
        mapInstanceRef.current.fitBounds(group.getBounds().pad(0.2));
      } catch {
        // Fallback zoom
      }
    }
  }, [repairers, selectedRepairerId, onSelectRepairer]);

  return (
    <div className={`relative ${className}`}>
      <div ref={mapContainerRef} className="w-full h-full" />
      {/* Map Overlay Badge */}
      <div className="absolute top-3 left-3 z-[400] px-3 py-1.5 rounded-xl bg-black/80 border border-white/10 backdrop-blur-md text-[11px] font-mono text-zinc-300 pointer-events-none flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>OpenStreetMap • ReTrace Certified Network</span>
      </div>
    </div>
  );
};
