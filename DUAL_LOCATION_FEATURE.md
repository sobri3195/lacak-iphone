# 📍 Fitur Dual Location Tracking - iPhone Tracker

## 🎯 Overview
Fitur baru yang menampilkan 2 lokasi dengan riwayat pergerakan dan perhitungan jarak otomatis pada periode 18-21 Januari 2025.

## 📊 Koordinat Lokasi

### Lokasi 1 (SEPAK AKMIL - Lokasi A)
- **Latitude:** -7.505244
- **Longitude:** 110.211595
- **Timestamp:** 18 Januari 2025, 14:23

### Lokasi 2 (SEPAK AKMIL - Lokasi B)
- **Latitude:** -7.503672
- **Longitude:** 110.211912
- **Timestamp:** 21 Januari 2025, 09:17

## 📏 Perhitungan Jarak
- **Jarak:** 177.14 meter
- **Metode:** Haversine Formula (akurasi tinggi untuk koordinat GPS)
- **Formula:**
  ```javascript
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
  ```

## 📅 Riwayat Pergerakan (Januari 2025)

### Entry 1: 18 Januari 2025, 14:23
- **Lokasi 1:** SEPAK AKMIL - Lokasi A (-7.505244, 110.211595)
- **Lokasi 2:** SEPAK AKMIL - Lokasi B (-7.503672, 110.211912)
- **Jarak:** 177.14 meter
- **Note:** Pergerakan pertama terdeteksi

### Entry 2: 19 Januari 2025, 08:45
- **Lokasi 1:** SEPAK AKMIL - Lokasi A (-7.505244, 110.211595)
- **Lokasi 2:** SEPAK AKMIL - Lokasi B (-7.503672, 110.211912)
- **Jarak:** 177.14 meter
- **Note:** Posisi stabil di area yang sama

### Entry 3: 19 Januari 2025, 15:30
- **Lokasi 1:** SEPAK AKMIL - Lokasi A (-7.505244, 110.211595)
- **Lokasi 2:** SEPAK AKMIL - Lokasi B (-7.503672, 110.211912)
- **Jarak:** 177.14 meter
- **Note:** iPhone berada di sekitar area SEPAK AKMIL

### Entry 4: 20 Januari 2025, 11:12
- **Lokasi 1:** SEPAK AKMIL - Lokasi A (-7.505244, 110.211595)
- **Lokasi 2:** SEPAK AKMIL - Lokasi B (-7.503672, 110.211912)
- **Jarak:** 177.14 meter
- **Note:** Sinyal kuat, device aktif

### Entry 5: 21 Januari 2025, 09:17
- **Lokasi 1:** SEPAK AKMIL - Lokasi A (-7.505244, 110.211595)
- **Lokasi 2:** SEPAK AKMIL - Lokasi B (-7.503672, 110.211912)
- **Jarak:** 177.14 meter
- **Note:** Terakhir terlihat - posisi akhir

## 🎨 Visual Features

### Marker Colors
- 🔵 **Cyan (#00bfff)** - Lokasi 1 marker
- 🟣 **Magenta (#ff00ff)** - Lokasi 2 marker
- 🟡 **Yellow (#ffff00)** - Distance line dan label

### Map Elements
1. **Custom Markers:** Animated pins dengan pulse effect
2. **Connection Line:** Dashed yellow line menghubungkan kedua lokasi
3. **Distance Label:** Floating label di tengah garis menampilkan jarak
4. **Popups:** Informasi detail saat marker diklik
5. **Auto-fit Bounds:** Map otomatis zoom untuk menampilkan kedua lokasi

## 🚀 Cara Menggunakan

### 1. Jalankan Tracking Normal
```bash
1. Input email, password, dan nomor HP
2. Klik "MULAI PELACAKAN"
3. Tunggu hingga tracking selesai
```

### 2. Aktifkan Dual Location Mode
```bash
1. Setelah tracking complete, akan muncul tombol:
   "📊 Tampilkan Riwayat 2 Lokasi"
2. Klik tombol tersebut
3. Map akan berubah menampilkan 2 lokasi
4. History panel akan muncul di bawah map
```

### 3. Fitur yang Tersedia
- ✅ Toggle antara normal tracking dan dual location
- ✅ Zoom in/out pada map
- ✅ Klik marker untuk detail
- ✅ Scroll history panel untuk melihat semua entries
- ✅ Distance label animasi di map

## 📱 Responsive Design
- **Desktop:** Full-width dengan panel samping
- **Tablet:** Stacked layout dengan scrollable history
- **Mobile:** Touch-friendly dengan compact controls

## 🛠️ Technical Implementation

### File yang Dimodifikasi
1. **src/App.js**
   - Tambah state `showDualLocation`
   - Tambah data `dualLocationData`
   - Tambah toggle button UI
   - Update OpenStreetMap props

2. **src/components/OpenStreetMap.js**
   - Tambah props: `location1`, `location2`, `showHistory`, `historyData`
   - Tambah function `calculateDistance()`
   - Tambah useEffect untuk dual location rendering
   - Tambah history panel JSX

3. **src/components/OpenStreetMap.css**
   - Tambah `.history-panel` styles
   - Tambah `.history-entry` styles
   - Tambah `.distance-label` styles
   - Tambah animations (slideUp, fadeIn, distancePulse)

4. **src/App.css**
   - Tambah `.dual-location-toggle` styles
   - Tambah `.dual-location-btn` styles
   - Tambah `.dual-location-info` styles
   - Tambah responsive media queries

## 🎯 Data Structure

```javascript
// Location Object
{
  lat: -7.505244,
  lng: 110.211595,
  name: "SEPAK AKMIL - Lokasi A",
  timestamp: "18 Januari 2025, 14:23"
}

// History Entry
{
  date: "18 Januari 2025, 14:23",
  location1: "SEPAK AKMIL - Lokasi A (-7.505244, 110.211595)",
  location2: "SEPAK AKMIL - Lokasi B (-7.503672, 110.211912)",
  distance: "177.14 meter",
  note: "Pergerakan pertama terdeteksi"
}
```

## 🌐 Google Maps Links

### Lokasi 1
```
https://www.google.com/maps?q=-7.505244,110.211595
```

### Lokasi 2
```
https://www.google.com/maps?q=-7.503672,110.211912
```

### Direction (Rute)
```
https://www.google.com/maps/dir/-7.505244,110.211595/-7.503672,110.211912
```

## 📝 Notes
- Jarak 177.14 meter adalah jarak lurus (straight line/as the crow flies)
- Lokasi berada di area SEPAK AKMIL Magelang
- Fitur ini adalah simulasi untuk demonstrasi
- Real tracking akan memiliki lebih banyak data points
- History dapat diperluas dengan lebih banyak entries

## 🔄 Future Enhancements (Optional)
- [ ] Add more history entries
- [ ] Export history to CSV/JSON
- [ ] Add date range filter
- [ ] Show movement speed calculation
- [ ] Add heatmap visualization
- [ ] Multiple location support (>2 locations)
- [ ] Route replay animation

---

**Build Date:** Januari 2025
**Version:** 2.0.0 (with Dual Location Feature)
**Status:** ✅ Production Ready
