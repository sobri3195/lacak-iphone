import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './OpenStreetMap.css';

// Fix for default markers in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const OpenStreetMap = ({ 
  currentLocation, 
  finalLocation, 
  isComplete, 
  liveUpdate = true,
  // New props for dual location tracking
  location1 = null,
  location2 = null,
  showHistory = false,
  historyData = []
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const currentMarkerRef = useRef(null);
  const targetMarkerRef = useRef(null);
  const pathLineRef = useRef(null);
  const location1MarkerRef = useRef(null);
  const location2MarkerRef = useRef(null);
  const historyLineRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);

  // Custom icons
  const createCustomIcon = (color, isAnimated = false) => {
    return L.divIcon({
      className: `custom-marker ${isAnimated ? 'animated-marker' : ''}`,
      html: `
        <div class="marker-pin" style="background-color: ${color};">
          <div class="marker-pulse"></div>
        </div>
      `,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });
  };

  const currentLocationIcon = createCustomIcon('#00ff00', true);
  const targetLocationIcon = createCustomIcon('#ff0000', true);
  const location1Icon = createCustomIcon('#00bfff', true); // Cyan for location 1
  const location2Icon = createCustomIcon('#ff00ff', true); // Magenta for location 2
  
  // Calculate distance between two points (Haversine formula)
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371e3; // Earth radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lng2 - lng1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    const distance = R * c; // Distance in meters
    return distance;
  };

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map
    mapInstanceRef.current = L.map(mapRef.current, {
      center: [-7.489, 110.219], // Default to Magelang area
      zoom: 10,
      zoomControl: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      touchZoom: true
    });

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
      tileSize: 256,
      zoomOffset: 0
    }).addTo(mapInstanceRef.current);

    // Add zoom control styling
    const zoomControl = mapInstanceRef.current.zoomControl;
    if (zoomControl) {
      zoomControl.setPosition('topright');
    }

    setMapReady(true);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update current location marker
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current || !currentLocation) return;

    const latlng = [currentLocation.lat, currentLocation.lng];

    // Remove existing current location marker
    if (currentMarkerRef.current) {
      mapInstanceRef.current.removeLayer(currentMarkerRef.current);
    }

    // Add new current location marker
    currentMarkerRef.current = L.marker(latlng, { icon: currentLocationIcon })
      .addTo(mapInstanceRef.current)
      .bindPopup(`
        <div class="popup-content">
          <h4>📍 Current Location</h4>
          <p><strong>${currentLocation.name}</strong></p>
          <p>📊 Coordinates: ${currentLocation.lat.toFixed(6)}, ${currentLocation.lng.toFixed(6)}</p>
          <p>🏙️ Area: ${currentLocation.city}</p>
          <p>🔍 Status: Tracking...</p>
        </div>
      `);

    // Pan and zoom to current location with smooth animation
    mapInstanceRef.current.flyTo(latlng, 13, {
      duration: 1.5,
      easeLinearity: 0.25
    });
  }, [currentLocation, mapReady]);

  // Update target location marker when tracking is complete
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current || !isComplete || !finalLocation) return;

    const latlng = [finalLocation.lat, finalLocation.lng];

    // Remove existing target marker
    if (targetMarkerRef.current) {
      mapInstanceRef.current.removeLayer(targetMarkerRef.current);
    }

    // Add target location marker
    targetMarkerRef.current = L.marker(latlng, { icon: targetLocationIcon })
      .addTo(mapInstanceRef.current)
      .bindPopup(`
        <div class="popup-content target-popup">
          <h4>🎯 TARGET FOUND!</h4>
          <p><strong>${finalLocation.name}</strong></p>
          <p>📊 Coordinates: ${finalLocation.lat.toFixed(6)}, ${finalLocation.lng.toFixed(6)}</p>
          <p>🏠 Address: ${finalLocation.address}</p>
          <p>🎯 Accuracy: ${finalLocation.accuracy}</p>
          <p>⏰ Last Seen: ${finalLocation.lastSeenToday}</p>
        </div>
      `);

    // Create search area circle
    const searchCircle = L.circle(latlng, {
      color: '#ff0000',
      fillColor: '#ff0000',
      fillOpacity: 0.2,
      radius: 100, // 100 meters radius
      weight: 2,
      dashArray: '5, 10'
    }).addTo(mapInstanceRef.current);

    // Fit map to show both markers with padding
    if (currentLocation) {
      const group = L.featureGroup([currentMarkerRef.current, targetMarkerRef.current, searchCircle]);
      mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
    } else {
      mapInstanceRef.current.setView(latlng, 16);
    }

    // Open target marker popup
    setTimeout(() => {
      if (targetMarkerRef.current) {
        targetMarkerRef.current.openPopup();
      }
    }, 1000);

  }, [isComplete, finalLocation, mapReady]);

  // Create tracking path line
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current || !currentLocation) return;

    // Remove existing path line
    if (pathLineRef.current) {
      mapInstanceRef.current.removeLayer(pathLineRef.current);
    }

    // Create animated path line (simplified - would need history in real app)
    const pathCoords = [
      [-6.261, 106.808], // Jakarta
      [-6.966, 110.420], // Semarang
      [currentLocation.lat, currentLocation.lng] // Current location
    ];

    pathLineRef.current = L.polyline(pathCoords, {
      color: '#00ff00',
      weight: 3,
      opacity: 0.8,
      dashArray: '10, 5'
    }).addTo(mapInstanceRef.current);
  }, [currentLocation, mapReady]);

  // Real-time location simulation (for demo purposes)
  useEffect(() => {
    if (!liveUpdate || !mapReady || !mapInstanceRef.current) return;

    let interval;
    if (!isComplete) {
      interval = setInterval(() => {
        // Simulate small location changes for "live" tracking effect
        if (currentLocation && currentMarkerRef.current) {
          const newLat = currentLocation.lat + (Math.random() - 0.5) * 0.001; // Small random change
          const newLng = currentLocation.lng + (Math.random() - 0.5) * 0.001;
          
          currentMarkerRef.current.setLatLng([newLat, newLng]);
          currentMarkerRef.current.bindPopup(`
            <div class="popup-content">
              <h4>📍 Live Tracking</h4>
              <p><strong>${currentLocation.name}</strong></p>
              <p>📊 Coordinates: ${newLat.toFixed(6)}, ${newLng.toFixed(6)}</p>
              <p>🏙️ Area: ${currentLocation.city}</p>
              <p>🔄 Status: Live Update...</p>
              <p>📡 Signal: Excellent</p>
            </div>
          `);
        }
      }, 3000); // Update every 3 seconds
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [liveUpdate, isComplete, currentLocation, mapReady]);

  // Dual location tracking with history
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current || !showHistory || !location1 || !location2) return;

    // Remove existing markers
    if (location1MarkerRef.current) {
      mapInstanceRef.current.removeLayer(location1MarkerRef.current);
    }
    if (location2MarkerRef.current) {
      mapInstanceRef.current.removeLayer(location2MarkerRef.current);
    }
    if (historyLineRef.current) {
      mapInstanceRef.current.removeLayer(historyLineRef.current);
    }

    const latlng1 = [location1.lat, location1.lng];
    const latlng2 = [location2.lat, location2.lng];

    // Calculate distance
    const distance = calculateDistance(location1.lat, location1.lng, location2.lat, location2.lng);
    const distanceKm = (distance / 1000).toFixed(2);
    const distanceM = distance.toFixed(1);

    // Add location 1 marker
    location1MarkerRef.current = L.marker(latlng1, { icon: location1Icon })
      .addTo(mapInstanceRef.current)
      .bindPopup(`
        <div class="popup-content">
          <h4>📍 LOKASI 1</h4>
          <p><strong>${location1.name || 'Lokasi Pertama'}</strong></p>
          <p>📊 Koordinat: ${location1.lat.toFixed(6)}, ${location1.lng.toFixed(6)}</p>
          <p>📏 Jarak ke Lokasi 2: ${distanceKm} km (${distanceM} m)</p>
          ${location1.timestamp ? `<p>⏰ ${location1.timestamp}</p>` : ''}
        </div>
      `);

    // Add location 2 marker
    location2MarkerRef.current = L.marker(latlng2, { icon: location2Icon })
      .addTo(mapInstanceRef.current)
      .bindPopup(`
        <div class="popup-content">
          <h4>📍 LOKASI 2</h4>
          <p><strong>${location2.name || 'Lokasi Kedua'}</strong></p>
          <p>📊 Koordinat: ${location2.lat.toFixed(6)}, ${location2.lng.toFixed(6)}</p>
          <p>📏 Jarak dari Lokasi 1: ${distanceKm} km (${distanceM} m)</p>
          ${location2.timestamp ? `<p>⏰ ${location2.timestamp}</p>` : ''}
        </div>
      `);

    // Draw line between locations
    historyLineRef.current = L.polyline([latlng1, latlng2], {
      color: '#ffff00',
      weight: 4,
      opacity: 0.8,
      dashArray: '10, 5'
    }).addTo(mapInstanceRef.current);

    // Add distance label in the middle of the line
    const midLat = (location1.lat + location2.lat) / 2;
    const midLng = (location1.lng + location2.lng) / 2;
    
    const distanceLabel = L.marker([midLat, midLng], {
      icon: L.divIcon({
        className: 'distance-label',
        html: `<div style="background: rgba(0,0,0,0.8); color: #ffff00; padding: 5px 10px; border-radius: 5px; font-weight: bold; white-space: nowrap; border: 2px solid #ffff00;">📏 ${distanceKm} km</div>`,
        iconSize: [100, 30],
        iconAnchor: [50, 15]
      })
    }).addTo(mapInstanceRef.current);

    // Fit map to show both markers
    const group = L.featureGroup([location1MarkerRef.current, location2MarkerRef.current]);
    mapInstanceRef.current.fitBounds(group.getBounds().pad(0.2));

    // Auto-open popups
    setTimeout(() => {
      location1MarkerRef.current.openPopup();
    }, 500);

    return () => {
      if (distanceLabel) {
        mapInstanceRef.current.removeLayer(distanceLabel);
      }
    };
  }, [location1, location2, showHistory, mapReady]);

  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  const centerOnTarget = () => {
    if (mapInstanceRef.current && finalLocation) {
      mapInstanceRef.current.setView([finalLocation.lat, finalLocation.lng], 18);
      if (targetMarkerRef.current) {
        targetMarkerRef.current.openPopup();
      }
    }
  };

  return (
    <div className="openstreetmap-container">
      <div className="map-header">
        <h3>🗺️ Live Tracking Map - OpenStreetMap</h3>
        <div className="map-controls">
          <button className="zoom-control-btn" onClick={handleZoomIn} title="Zoom In">
            ➕
          </button>
          <button className="zoom-control-btn" onClick={handleZoomOut} title="Zoom Out">
            ➖
          </button>
          {isComplete && (
            <button className="center-control-btn" onClick={centerOnTarget} title="Center on Target">
              🎯
            </button>
          )}
        </div>
      </div>
      
      <div className="map-wrapper">
        <div ref={mapRef} className="leaflet-map" />
        
        <div className="map-overlay">
          <div className="coordinates-display">
            <div className="coord-item">
              <span className="coord-label">📍 Current:</span>
              <span className="coord-value">
                {currentLocation ? 
                  `${currentLocation.lat.toFixed(6)}, ${currentLocation.lng.toFixed(6)}` : 
                  '---'
                }
              </span>
            </div>
            {isComplete && finalLocation && (
              <div className="coord-item">
                <span className="coord-label">🎯 Target:</span>
                <span className="coord-value">
                  {finalLocation.lat.toFixed(6)}, {finalLocation.lng.toFixed(6)}
                </span>
              </div>
            )}
          </div>
          
          <div className="map-status">
            <div className={`status-badge ${isComplete ? 'found' : 'searching'}`}>
              {isComplete ? '✅ TARGET FOUND' : '🔍 LIVE TRACKING...'}
            </div>
            {liveUpdate && !isComplete && (
              <div className="live-indicator">
                <span className="live-dot"></span>
                <span>LIVE</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="map-legend">
        {showHistory ? (
          <>
            <div className="legend-item">
              <span className="legend-marker" style={{background: '#00bfff'}}></span>
              <span>Lokasi 1</span>
            </div>
            <div className="legend-item">
              <span className="legend-marker" style={{background: '#ff00ff'}}></span>
              <span>Lokasi 2</span>
            </div>
            <div className="legend-item">
              <span className="legend-marker" style={{background: '#ffff00', width: '40px'}}></span>
              <span>Jarak</span>
            </div>
          </>
        ) : (
          <>
            <div className="legend-item">
              <span className="legend-marker current-marker"></span>
              <span>Current Location</span>
            </div>
            {isComplete && (
              <div className="legend-item">
                <span className="legend-marker target-marker"></span>
                <span>Target Location</span>
              </div>
            )}
            <div className="legend-item">
              <span className="legend-marker search-area"></span>
              <span>Search Area</span>
            </div>
          </>
        )}
      </div>
      
      {showHistory && historyData && historyData.length > 0 && (
        <div className="history-panel">
          <h3>📊 RIWAYAT PERGERAKAN - JANUARI 2025</h3>
          <div className="history-list">
            {historyData.map((entry, index) => (
              <div key={index} className="history-entry">
                <div className="history-date">📅 {entry.date}</div>
                <div className="history-details">
                  <div className="history-location">
                    <span style={{color: '#00bfff'}}>📍 Lokasi 1:</span> {entry.location1}
                  </div>
                  <div className="history-location">
                    <span style={{color: '#ff00ff'}}>📍 Lokasi 2:</span> {entry.location2}
                  </div>
                  <div className="history-distance">
                    <span style={{color: '#ffff00'}}>📏 Jarak:</span> {entry.distance}
                  </div>
                  {entry.note && (
                    <div className="history-note">📝 {entry.note}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OpenStreetMap;