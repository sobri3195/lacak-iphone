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

const OpenStreetMap = ({ currentLocation, finalLocation, isComplete, liveUpdate = true }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const currentMarkerRef = useRef(null);
  const targetMarkerRef = useRef(null);
  const pathLineRef = useRef(null);
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
      mapInstanceRef.current.setView([finalLocation.lat, finalLocation.lng], 16);
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
      </div>
    </div>
  );
};

export default OpenStreetMap;