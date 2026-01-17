import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Map from './components/Map';
import MatrixBackground from './components/MatrixBackground';

function App() {
  const [stage, setStage] = useState('input');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [logs, setLogs] = useState([]);
  const [progress, setProgress] = useState(0);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [trackingComplete, setTrackingComplete] = useState(false);
  const [finalLocation, setFinalLocation] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [signalStrength, setSignalStrength] = useState(0);
  const [battery, setBattery] = useState(100);
  const [ipAddress, setIpAddress] = useState('');
  const [deviceInfo, setDeviceInfo] = useState(null);
  const logContainerRef = useRef(null);

  // Lokasi simulasi - iPhone terakhir terlihat di SEPAK AKMIL Magelang
  const locations = [
    { name: "Sedang mencari sinyal...", lat: -7.489, lng: 110.219, city: "Mencari..." },
    { name: "Terhubung ke tower Jakarta Selatan", lat: -6.261, lng: 106.808, city: "Jakarta Selatan" },
    { name: "Pindah ke tower Semarang", lat: -6.966, lng: 110.420, city: "Semarang" },
    { name: "Sinyal terdeteksi di area Magelang", lat: -7.480, lng: 110.218, city: "Magelang" },
    { name: "Lokasi semakin dekat - Area Akademi Militer", lat: -7.489, lng: 110.219, city: "AKMIL Area" },
    { name: "TERDETEKSI: SEPAK AKMIL Magelang", lat: -7.4915, lng: 110.2198, city: "SEPAK AKMIL" }
  ];

  const targetLocation = {
    name: "SEPAK AKMIL Magelang - Final Location",
    lat: -7.4915,
    lng: 110.2198,
    address: "SEPAK (Sekolah Pertolongan Pertama Kesehatan) AKMIL, Magelang, Jawa Tengah",
    accuracy: "±5 meter",
    lastSeen: new Date().toLocaleString('id-ID')
  };

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString('id-ID');
    setLogs(prev => [...prev, { timestamp, message, type }]);
  };

  const startTracking = async () => {
    setStage('tracking');
    setLogs([]);
    setProgress(0);
    setSignalStrength(0);
    
    // Validasi input
    if (!email || !password || !phone) {
      addLog('⚠️ ERROR: Semua data harus diisi!', 'error');
      setTimeout(() => setStage('input'), 2000);
      return;
    }

    addLog('🔐 Memulai sesi pelacakan...', 'success');
    addLog(`📧 Email: ${email}`, 'info');
    addLog(`📱 Nomor HP: ${phone}`, 'info');

    // Simulasi proses autentikasi
    await delay(1500);
    addLog('🔑 Menghubungkan ke server Apple...', 'info');
    setProgress(15);

    await delay(1000);
    addLog('🌐 Terhubung ke iCloud...', 'success');
    setProgress(25);

    await delay(1200);
    addLog('📡 Memverifikasi kredensial...', 'info');
    setProgress(35);

    await delay(1500);
    addLog('✅ Autentikasi berhasil!', 'success');
    addLog('🔍 Mencari perangkat terdaftar...', 'info');
    setProgress(45);

    await delay(1000);
    addLog('📱 Perangkat ditemukan: iPhone 16 Pro Max', 'success');
    addLog('🆔 Serial Number: DNPXK3XXXXXX', 'info');
    addLog('📋 IMEI: 3548990809XXXXX', 'info');
    setDeviceInfo({
      model: 'iPhone 16 Pro Max',
      serial: 'DNPXK3XXXXXX',
      imei: '3548990809XXXXX',
      os: 'iOS 18.1.1'
    });
    setProgress(55);

    await delay(1200);
    addLog('📍 Mengaktifkan GPS tracking...', 'info');
    addLog('📡 Memulai triangulasi sinyal...', 'info');
    setProgress(60);
    setSignalStrength(30);

    // Simulasi pelacakan lokasi
    for (let i = 0; i < locations.length; i++) {
      await delay(2000);
      const loc = locations[i];
      setCurrentLocation(loc);
      addLog(`📡 ${loc.name}`, 'info');
      addLog(`📍 Koordinat: ${loc.lat.toFixed(6)}, ${loc.lng.toFixed(6)}`, 'info');
      addLog(`🏙️ Area: ${loc.city}`, 'info');
      setProgress(60 + (i * 6));
      setSignalStrength(30 + (i * 12));
      setBattery(100 - (i * 8));
      
      if (i < locations.length - 1) {
        addLog('⏳ Mencari sinyal lebih kuat...', 'warning');
      }
    }

    await delay(2000);
    addLog('🎯 LOKASI DITEMUKAN!', 'success');
    addLog('🔴 Signal Maximum: 100%', 'success');
    addLog('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'divider');
    
    setProgress(100);
    setSignalStrength(100);
    setTrackingComplete(true);
    setFinalLocation(targetLocation);
    setShowMap(true);

    addLog(`📍 LOKASI AKHIR: ${targetLocation.name}`, 'success');
    addLog(`🏠 Alamat: ${targetLocation.address}`, 'info');
    addLog(`🎯 Akurasi: ${targetLocation.accuracy}`, 'info');
    addLog(`⏰ Terakhir terlihat: ${targetLocation.lastSeen}`, 'info');
    addLog('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'divider');
    addLog('✅ Pelacakan selesai!', 'success');
    addLog('💡 Silakan hubungi pihak berwenang untuk penemuan perangkat', 'warning');
  };

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const resetTracking = () => {
    setStage('input');
    setLogs([]);
    setProgress(0);
    setCurrentLocation(null);
    setTrackingComplete(false);
    setFinalLocation(null);
    setShowMap(false);
    setSignalStrength(0);
    setBattery(100);
    setDeviceInfo(null);
  };

  return (
    <div className="App">
      <MatrixBackground />
      <div className="container">
        <div className="header">
          <h1 className="title">
            <span className="icon">📱</span> IPHONE TRACKER
          </h1>
          <p className="subtitle">Sistem Pelacakan Perangkat - Military Grade</p>
        </div>

        {stage === 'input' && (
          <div className="input-section">
            <div className="input-card">
              <h2>🔐 Masukkan Data Perangkat</h2>
              <div className="input-group">
                <label>📧 Email iCloud</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="chrisdiegoc@icloud.com"
                />
              </div>
              <div className="input-group">
                <label>🔑 Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                />
              </div>
              <div className="input-group">
                <label>📱 Nomor HP Terdaftar</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="088219903238"
                />
              </div>
              <button className="track-button" onClick={startTracking}>
                🚀 MULAI PELACAKAN
              </button>
            </div>
          </div>
        )}

        {stage === 'tracking' && (
          <div className="tracking-section">
            {showMap && (
              <Map 
                currentLocation={currentLocation}
                finalLocation={finalLocation}
                isComplete={trackingComplete}
              />
            )}
            
            <div className="progress-container">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <span className="progress-text">{progress}%</span>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">📡 Signal</div>
                <div className="stat-value signal">{signalStrength}%</div>
                <div className="stat-bar">
                  <div 
                    className="stat-bar-fill" 
                    style={{ width: `${signalStrength}%` }}
                  ></div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-label">🔋 Battery</div>
                <div className="stat-value battery">{battery}%</div>
                <div className="stat-bar">
                  <div 
                    className="stat-bar-fill battery-fill" 
                    style={{ width: `${battery}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {deviceInfo && (
              <div className="device-info">
                <h3>📱 Informasi Perangkat</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Model:</span>
                    <span className="info-value">{deviceInfo.model}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Serial:</span>
                    <span className="info-value">{deviceInfo.serial}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">IMEI:</span>
                    <span className="info-value">{deviceInfo.imei}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">OS:</span>
                    <span className="info-value">{deviceInfo.os}</span>
                  </div>
                </div>
              </div>
            )}

            {currentLocation && (
              <div className="location-card">
                <h3>📍 Lokasi Terdeteksi</h3>
                <div className="location-info">
                  <div className="location-name">{currentLocation.name}</div>
                  <div className="location-coords">
                    Lat: {currentLocation.lat.toFixed(6)}, Lng: {currentLocation.lng.toFixed(6)}
                  </div>
                  <div className="location-city">{currentLocation.city}</div>
                </div>
              </div>
            )}

            {trackingComplete && finalLocation && (
              <div className="final-location pulse-animation">
                <div className="final-badge">🎯 LOKASI DITEMUKAN</div>
                <h2>{finalLocation.name}</h2>
                <p className="address">{finalLocation.address}</p>
                <div className="location-details">
                  <div className="detail-item">
                    <span className="detail-icon">🎯</span>
                    <span>Akurasi: {finalLocation.accuracy}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">⏰</span>
                    <span>Terakhir: {finalLocation.lastSeen}</span>
                  </div>
                </div>
                <button className="reset-button" onClick={resetTracking}>
                  🔄 Lacak Ulang
                </button>
              </div>
            )}

            <div className="logs-container" ref={logContainerRef}>
              <h3>📋 Log Pelacakan</h3>
              <div className="logs">
                {logs.map((log, index) => (
                  <div key={index} className={`log-entry log-${log.type}`}>
                    <span className="log-time">[{log.timestamp}]</span>
                    <span className="log-message">{log.message}</span>
                  </div>
                ))}
                {logs.length > 0 && (
                  <div className="log-entry log-info">
                    <span className="log-time">[System]</span>
                    <span className="log-message">⏳ Sedang memproses...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="footer">
          <p>⚠️ Ini adalah simulasi untuk tujuan demonstrasi</p>
          <p>Gunakan "Find My iPhone" resmi dari Apple untuk pelacakan asli</p>
        </div>
      </div>

      <style jsx>{`
        .pulse-animation {
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.4); }
          50% { box-shadow: 0 0 0 20px rgba(255, 0, 0, 0); }
        }
      `}</style>
    </div>
  );
}

export default App;
