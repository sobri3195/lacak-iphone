# 📱 iPhone Tracker - Simulasi Pelacakan

Website React untuk simulasi pelacakan iPhone dengan efek hacker-style. Ini adalah project demonstrasi yang menampilkan simulasi pelacakan perangkat iPhone 16 Pro Max yang hilang.

## 🌟 Fitur

- **Tampilan Hacker-Style**: Desain dengan efek glow green ala terminal/command line
- **Simulasi Pelacakan Real-time**: Menampilkan proses pelacakan dengan log langkah demi langkah
- **Peta Visual**: Map interaktif yang menampilkan lokasi simulasi
- **Indikator Signal & Battery**: Menampilkan kekuatan sinyal dan level baterai perangkat
- **Informasi Perangkat**: Menampilkan detail perangkat yang dilacak
- **Lokasi Final**: iPhone 16 Pro Max terakhir terdeteksi di SEPAK AKMIL Magelang

## 🚀 Cara Menjalankan

### Prerequisites
- Node.js (v14 atau yang lebih baru)
- npm atau yarn

### Installation

1. Clone repository ini:
```bash
git clone https://github.com/sobri3195/lacak-iphone.git
cd lacak-iphone
```

2. Install dependencies:
```bash
npm install
```

3. Jalankan development server:
```bash
npm start
```

4. Buka browser dan kunjungi:
```
http://localhost:3000
```

### Build untuk Production

```bash
npm run build
```

## 📱 Cara Menggunakan

1. Masukkan email iCloud (contoh: `chrisdiegoc@icloud.com`)
2. Masukkan password
3. Masukkan nomor HP terdaftar (contoh: `088219903238`)
4. Klik tombol "🚀 MULAI PELACAKAN"
5. Tonton simulasi pelacakan berjalan
6. Lihat lokasi final di SEPAK AKMIL Magelang

## 🎯 Lokasi Simulasi

Perangkat iPhone 16 Pro Max dilaporkan terakhir terlihat di:
- **Lokasi**: SEPAK AKMIL (Sekolah Pertolongan Pertama Kesehatan AKMIL)
- **Kota**: Magelang, Jawa Tengah
- **Koordinat**: -7.4915, 110.2198

## ⚠️ Disclaimer

**PERHATIAN**: Ini adalah simulasi untuk tujuan demonstrasi dan hiburan saja. Website ini tidak benar-benar melacak perangkat apapun.

Untuk melacak iPhone yang hilang secara resmi, gunakan:
- **Find My iPhone** dari Apple (icloud.com/find)
- Hubungi pihak berwenang/polisi untuk bantuan

## 🛠️ Teknologi yang Digunakan

- **React 19.2.3**: Framework UI
- **React DOM**: Rendering ke browser
- **CSS3 Animations**: Efek visual dan animasi
- **SVG Graphics**: Peta interaktif
- **JavaScript ES6+**: Logika aplikasi

## 📁 Struktur Project

```
lacak-iphone/
├── public/
│   └── index.html          # HTML template
├── src/
│   ├── components/
│   │   ├── Map.js          # Component peta
│   │   └── Map.css         # Styles untuk peta
│   ├── App.js              # Main App Component
│   ├── App.css             # Global styles
│   ├── index.js            # Entry point
│   └── index.css           # Base styles
├── .gitignore              # Git ignore file
├── package.json            # Project dependencies
├── README.md               # Documentation
└── browserslist.json       # Browser configuration
```

## 🎨 Desain & Styling

- **Color Scheme**: Matrix-style green (#00ff00) pada background hitam
- **Font**: Courier New / Consolas (monospace) untuk kesan terminal
- **Effects**: Glow effects, pulse animations, dan smooth transitions
- **Responsive**: Berjalan baik di desktop dan mobile

## 📄 License

ISC License

## 👨‍💻 Developer

Project ini dibuat untuk demonstrasi simulasi pelacakan perangkat.

---

**PENTING**: Jangan gunakan data pribadi asli dalam simulasi ini. Gunakan data dummy untuk demonstrasi.
