# 🎮 Demo Quick Start

Untuk demo cepat dengan data yang sudah terisi:

## 📱 Data Demo

- **Email**: `chrisdiegoc@icloud.com`
- **Password**: `Diego2002!`
- **Nomor HP**: `088219903238`
- **Target Lokasi**: SEPAK AKMIL Magelang

## 🚀 Cara Menjalankan Demo

### Option 1: Development Mode

```bash
npm start
```

Lalu buka http://localhost:3000 dan gunakan data di atas.

### Option 2: Production Build

```bash
npm run build
```

Lalu deploy folder `build/` ke hosting favorit kamu:
- Netlify: Drag & drop folder `build/`
- Vercel: `vercel deploy build`
- GitHub Pages: Configure GitHub Pages to serve from `build/` folder
- Shared hosting: Upload semua isi folder `build/`

## 📦 Deployment Gratis Options

### 1. Netlify (Rekomendasi - Paling Mudah)
1. Buka [netlify.com](https://netlify.com)
2. Sign in dengan GitHub
3. Drag & drop folder `build/`
4. Website langsung online!

### 2. Vercel
```bash
npm install -g vercel
vercel deploy build
```

### 3. GitHub Pages
1. Push project ke GitHub
2. Go to Settings → Pages
3. Set source to `build/` folder
4. Deploy!

## 🔧 Troubleshooting

### Build Gagal?
```bash
rm -rf node_modules
npm install
npm run build
```

### Port 3000 sudah dipakai?
```bash
PORT=3001 npm start
```

### Styling tidak muncul?
Pastikan semua file CSS sudah diimport dengan benar di file yang sesuai.

---

**Catatan**: Ini adalah simulasi saja. Untuk pelacakan asli, gunakan icloud.com/find
