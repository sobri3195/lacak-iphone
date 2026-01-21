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
  const [btsInfo, setBtsInfo] = useState(null);
  const [playSound, setPlaySound] = useState(false);
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
    lastSeen: new Date().toLocaleString('id-ID'),
    lastSeenToday: new Date().toLocaleDateString('id-ID') + ' ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  };

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // Sound notification when tracking is complete
  useEffect(() => {
    if (playSound) {
      // Create audio notification
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 1);
      
      // Repeat the sound 3 times
      setTimeout(() => {
        const oscillator2 = audioContext.createOscillator();
        const gainNode2 = audioContext.createGain();
        
        oscillator2.connect(gainNode2);
        gainNode2.connect(audioContext.destination);
        
        oscillator2.frequency.setValueAtTime(1000, audioContext.currentTime);
        gainNode2.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator2.start(audioContext.currentTime);
        oscillator2.stop(audioContext.currentTime + 0.5);
      }, 500);
    }
  }, [playSound]);

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
    addLog('🏢 BTS Tower: INDOSAT OOREDOO Magelang', 'info');
    addLog('📡 Frekuensi: 1800 MHz', 'info');
    addLog('🔊 MAC Address: 5c:96:9d:2a:b1:c8', 'info');
    setDeviceInfo({
      model: 'iPhone 16 Pro Max',
      serial: 'DNPXK3XXXXXX',
      imei: '3548990809XXXXX',
      os: 'iOS 18.1.1',
      macAddress: '5c:96:9d:2a:b1:c8',
      carrier: 'INDOSAT OOREDOO',
      frequency: '1800 MHz'
    });
    setBtsInfo({
      tower: 'INDOSAT OOREDOO Magelang',
      frequency: '1800 MHz',
      signal: '4G LTE',
      coverage: 'Excellent'
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
    
    // Play sound notification
    setPlaySound(true);
    setTimeout(() => setPlaySound(false), 2000);
    
    setProgress(100);
    setSignalStrength(100);
    setTrackingComplete(true);
    setFinalLocation(targetLocation);
    setShowMap(true);

    addLog(`📍 LOKASI AKHIR: ${targetLocation.name}`, 'success');
    addLog(`🏠 Alamat: ${targetLocation.address}`, 'info');
    addLog(`🎯 Akurasi: ${targetLocation.accuracy}`, 'info');
    addLog(`⏰ Terakhir terlihat HARI INI: ${targetLocation.lastSeenToday}`, 'success');
    addLog('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'divider');
    addLog('✅ Pelacakan selesai!', 'success');
    addLog('🔊 Peringatan: iPhone akan berbunyi selama 2 menit', 'warning');
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
                <h3>📱 Informasi Perangkat iPhone</h3>
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
                    <span className="info-label">MAC Address:</span>
                    <span className="info-value">{deviceInfo.macAddress}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">OS:</span>
                    <span className="info-value">{deviceInfo.os}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Carrier:</span>
                    <span className="info-value">{deviceInfo.carrier}</span>
                  </div>
                </div>
              </div>
            )}

            {btsInfo && (
              <div className="device-info">
                <h3>📡 Informasi BTS Tower</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Tower:</span>
                    <span className="info-value">{btsInfo.tower}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Frekuensi:</span>
                    <span className="info-value">{btsInfo.frequency}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Signal:</span>
                    <span className="info-value">{btsInfo.signal}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Coverage:</span>
                    <span className="info-value">{btsInfo.coverage}</span>
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
                    <span>Terakhir HARI INI: {finalLocation.lastSeenToday}</span>
                  </div>
                </div>
                
                <div className="urgent-notice">
                  <h4>🚨 PERINGATAN KRITIS</h4>
                  <p>📱 iPhone dalam status "Hilang"</p>
                  <p>🔊 Sound alert aktif selama 2 menit</p>
                  <p>📞 Silakan hubungi owner: {phone || 'Nomor tidak tersedia'}</p>
                  <p>🚔 Atau hubungi Pihak Berwenang</p>
                </div>
                
                <button className="reset-button" onClick={resetTracking}>
                  🔄 Lacak Ulang
                </button>
              </div>
            )}

            {trackingComplete && (
              <div className="explanation-section">
                <h3>📋 Keterangan Teknis</h3>
                <div className="explanation-grid">
                  <div className="explanation-card">
                    <h4>📱 iPhone (International Mobile Equipment Identity)</h4>
                    <p><strong>Definisi:</strong> Nomor identifikasi unik 15 digit yang diberikan untuk setiap perangkat seluler.</p>
                    <p><strong>Kegunaan:</strong> Identifikasi perangkat, pelacakan lokasi, pemblokiran perangkat hilang.</p>
                    <p><strong>Contoh IMEI:</strong> 3548990809XXXXX (sudah disembunyikan untuk keamanan)</p>
                  </div>
                  <div className="explanation-card">
                    <h4>📡 BTS (Base Transceiver Station)</h4>
                    <p><strong>Definisi:</strong> Menara/tower seluler yang menerima dan mentransmisikan sinyal radio.</p>
                    <p><strong>Kegunaan:</strong> Memberikan jangkauan sinyal, triangulasi lokasi, komunikasi perangkat.</p>
                    <p><strong>Frekuensi:</strong> 1800 MHz (4G LTE) untuk数据传输 cepat</p>
                  </div>
                  <div className="explanation-card">
                    <h4>🔍 Cara Kerja Pelacakan</h4>
                    <p><strong>GPS:</strong> Satellite positioning system untuk koordinat presisi</p>
                    <p><strong>Cell Tower:</strong> Triangulasi dari beberapa BTS tower</p>
                    <p><strong>WiFi:</strong> Mac Address dari hotspot yang terdeteksi</p>
                    <p><strong>Accuracy:</strong> ±5 meter untuk hasil terbaik</p>
                  </div>
                </div>
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
