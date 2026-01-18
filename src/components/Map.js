import React from 'react';
import './Map.css';

const Map = ({ currentLocation, finalLocation, isComplete }) => {
  const targetCoords = finalLocation || currentLocation;
  
  // Convert lat/lng to SVG coordinates (simplified mapping)
  const toSvgX = (lng) => 100 + ((lng - 106) * 150);
  const toSvgY = (lat) => 350 - ((lat + 7) * 60);
  
  const targetX = targetCoords ? toSvgX(targetCoords.lng) : 265;
  const targetY = targetCoords ? toSvgY(targetCoords.lat) : 258;
  
  return (
    <div className="map-container">
      <div className="map-header">
        <h3>🗺️ Peta Lokasi Interaktif</h3>
        <div className="map-status">
          <span className={`status-indicator ${isComplete ? 'complete' : 'active'}`}>
            {isComplete ? '✅ TARGET FOUND' : '🔍 SEARCHING...'}
          </span>
        </div>
      </div>
      
      <div className="map-grid">
        <div className="map-background">
          <svg viewBox="0 0 400 400" className="map-svg">
            {/* Definitions */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(0,255,0,0.1)" strokeWidth="0.5"/>
              </pattern>
              <radialGradient id="pulseGrad">
                <stop offset="0%" stopColor="#00ff00" stopOpacity="0.8"/>
                <stop offset="100%" stopColor="#00ff00" stopOpacity="0"/>
              </radialGradient>
              <radialGradient id="targetGrad">
                <stop offset="0%" stopColor="#ff0000" stopOpacity="0.8"/>
                <stop offset="100%" stopColor="#ff0000" stopOpacity="0"/>
              </radialGradient>
              <radialGradient id="soundGrad">
                <stop offset="0%" stopColor="#ffff00" stopOpacity="0.6"/>
                <stop offset="100%" stopColor="#ffff00" stopOpacity="0"/>
              </radialGradient>
            </defs>
            
            {/* Grid background */}
            <rect width="400" height="400" fill="url(#grid)"/>
            
            {/* Map outline - Indonesia simplified */}
            <path 
              d="M 50 350 L 80 320 L 120 340 L 160 310 L 200 330 L 250 290 L 300 310 L 350 270 L 340 250 L 300 220 L 260 240 L 220 210 L 180 230 L 140 200 L 100 220 L 60 180 L 40 200 L 50 350 Z" 
              fill="rgba(0,50,0,0.3)" 
              stroke="#00ff00" 
              strokeWidth="1"
            />
            
            {/* Java island outline */}
            <path 
              d="M 150 280 Q 200 270 250 290 Q 300 300 320 330 Q 280 340 250 330 Q 200 320 150 280" 
              fill="rgba(0,40,0,0.4)" 
              stroke="#00ff00" 
              strokeWidth="0.5"
            />
            
            {/* Major cities markers */}
            {/* Jakarta */}
            <circle cx="280" cy="285" r="3" fill="#00cc00" opacity="0.6"/>
            <text x="285" y="283" fill="#00ff00" fontSize="6" opacity="0.7">JKT</text>
            
            {/* Semarang */}
            <circle cx="270" cy="265" r="3" fill="#00cc00" opacity="0.6"/>
            <text x="275" y="263" fill="#00ff00" fontSize="6" opacity="0.7">SMG</text>
            
            {/* Magelang */}
            <circle cx="265" cy="258" r="4" fill="#00ff00" opacity="0.8"/>
            <text x="270" y="256" fill="#00ff00" fontSize="7" fontWeight="bold">MGL</text>
            
            {/* AKMIL area marker */}
            <circle cx="265" cy="258" r="8" fill="none" stroke="#ff0000" strokeWidth="1" strokeDasharray="3,3" opacity="0.6">
              <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite"/>
            </circle>
            
            {/* Location path line when tracking */}
            {!isComplete && currentLocation && (
              <g className="location-path">
                <line 
                  x1="280" y1="285" 
                  x2={targetX} 
                  y2={targetY} 
                  stroke="#00ff00" 
                  strokeWidth="1" 
                  strokeDasharray="5,5"
                  opacity="0.5"
                />
              </g>
            )}
            
            {/* Current location indicator */}
            {currentLocation && !isComplete && (
              <g className="location-indicator">
                <circle cx={targetX} cy={targetY} r="15" fill="url(#pulseGrad)" opacity="0.5">
                  <animate attributeName="r" values="10;20;10" dur="2s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite"/>
                </circle>
                <circle cx={targetX} cy={targetY} r="6" fill="#00ff00">
                  <animate attributeName="r" values="5;7;5" dur="1s" repeatCount="indefinite"/>
                </circle>
                {/* Location label */}
                <rect x={targetX - 30} y={targetY - 35} width="60" height="16" rx="3" fill="rgba(0,0,0,0.7)"/>
                <text x={targetX} y={targetY - 24} fill="#00ff00" fontSize="6" textAnchor="middle">
                  {currentLocation.city}
                </text>
              </g>
            )}
            
            {/* Target location when complete */}
            {isComplete && finalLocation && (
              <g className="target-indicator">
                {/* Sound wave effect when playing sound */}
                <circle cx={targetX} cy={targetY} r="25" fill="url(#soundGrad)" opacity="0.4">
                  <animate attributeName="r" values="15;35;15" dur="1s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" values="0.6;0.2;0.6" dur="1s" repeatCount="indefinite"/>
                </circle>
                <circle cx={targetX} cy={targetY} r="20" fill="url(#targetGrad)" opacity="0.6">
                  <animate attributeName="r" values="15;25;15" dur="1.5s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" values="0.9;0.4;0.9" dur="1.5s" repeatCount="indefinite"/>
                </circle>
                <circle cx={targetX} cy={targetY} r="8" fill="#ff0000" stroke="#fff" strokeWidth="2">
                  <animate attributeName="r" values="7;9;7" dur="0.75s" repeatCount="indefinite"/>
                </circle>
                {/* Target crosshair */}
                <line x1={targetX - 20} y1={targetY} x2={targetX + 20} y2={targetY} stroke="#ff0000" strokeWidth="1" opacity="0.8"/>
                <line x1={targetX} y1={targetY - 20} x2={targetX} y2={targetY + 20} stroke="#ff0000" strokeWidth="1" opacity="0.8"/>
                
                {/* Target label */}
                <rect x={targetX - 45} y={targetY - 45} width="90" height="20" rx="4" fill="rgba(255,0,0,0.3)" stroke="#ff0000"/>
                <text x={targetX} y={targetY - 32} fill="#fff" fontSize="7" textAnchor="middle" fontWeight="bold">
                  🎯 TARGET
                </text>
              </g>
            )}
            
            {/* Radar sweep effect */}
            <g className="radar-sweep" opacity="0.3">
              <circle cx="200" cy="200" r="180" fill="none" stroke="#00ff00" strokeWidth="0.5"/>
              <circle cx="200" cy="200" r="120" fill="none" stroke="#00ff00" strokeWidth="0.3"/>
              <circle cx="200" cy="200" r="60" fill="none" stroke="#00ff00" strokeWidth="0.2"/>
            </g>
          </svg>
        </div>
        
        <div className="map-info">
          <div className="info-section">
            <h4>📍 Koordinat</h4>
            <div className="info-row">
              <span className="info-label">Latitude:</span>
              <span className="info-value">
                {finalLocation?.lat.toFixed(6) || currentLocation?.lat.toFixed(6) || '---'}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">Longitude:</span>
              <span className="info-value">
                {finalLocation?.lng.toFixed(6) || currentLocation?.lng.toFixed(6) || '---'}
              </span>
            </div>
          </div>
          
          <div className="info-section">
            <h4>📋 Lokasi</h4>
            <div className="info-row">
              <span className="info-label">Area:</span>
              <span className="info-value">
                {finalLocation?.name || currentLocation?.name || '---'}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">Kota:</span>
              <span className="info-value">
                {finalLocation?.city || currentLocation?.city || '---'}
              </span>
            </div>
          </div>
          
          <div className="info-section">
            <h4>📊 Status</h4>
            <div className="info-row">
              <span className="info-label">Tracking:</span>
              <span className={`info-value ${isComplete ? 'status-found' : 'status-searching'}`}>
                {isComplete ? '✅ Ditemukan' : '🔍 Mencari'}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">Akurasi:</span>
              <span className="info-value">
                {isComplete ? '±5 meter' : 'Menunggu...'}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="map-legend">
        <div className="legend-item">
          <span className="legend-color green"></span>
          <span>Area Pencarian</span>
        </div>
        <div className="legend-item">
          <span className="legend-color red"></span>
          <span>Lokasi Target</span>
        </div>
        <div className="legend-item">
          <span className="legend-color yellow"></span>
          <span>Sinyal Suara</span>
        </div>
      </div>
    </div>
  );
};

export default Map;
