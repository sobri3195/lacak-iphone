# 🚀 Deployment Guide

Cara mendeploy website iPhone Tracker ke berbagai platform.

## 📦 Prerequisites

Pastikan sudah melakukan build:
```bash
npm install
npm run build
```

## 🌐 Deployment Options

### 1. Netlify (Rekomendasi - Paling Mudah)

#### Via Web Interface:
1. Login ke [netlify.com](https://app.netlify.com)
2. Drag & drop folder `build/` ke area deploy
3. Website langsung online dalam hitungan detik!

#### Via CLI:
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=build
```

**URL contoh**: `https://lacak-iphone.netlify.app`

### 2. Vercel

#### Via Web:
1. Login ke [vercel.com](https://vercel.com)
2. Import repository GitHub
3. Vercel akan otomatis detect React project
4. Deploy!

#### Via CLI:
```bash
npm install -g vercel
vercel deploy --prod
```

**URL contoh**: `https://lacak-iphone.vercel.app`

### 3. GitHub Pages

#### Automatic Deployment:
1. Push code ke GitHub
2. Go to repository Settings → Pages
3. Build and deployment → Source: GitHub Actions
4. Create file `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

permissions:
  contents: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./build
```

**URL contoh**: `https://sobri3195.github.io/lacak-iphone/`

### 4. Cloudflare Pages

1. Login ke [dash.cloudflare.com](https://dash.cloudflare.com)
2. Go to Workers & Pages
3. Create a project → Connect to Git
4. Set build command: `npm run build`
5. Set output directory: `build`

**URL contoh**: `https://lacak-iphone.pages.dev`

### 5. Shared Hosting (cPanel)

1. Build project:
```bash
npm run build
```

2. Upload semua isi folder `build/` ke `public_html` atau subfolder

3. Jika deploy di subfolder, edit `package.json`:
```json
{
  "homepage": "https://yourdomain.com/lacak-iphone"
}
```

### 6. Firebase Hosting

#### Setup:
```bash
npm install -g firebase-tools
firebase login
firebase init
```

Pilih:
- Hosting
- Use an existing project (buat dulu di console.firebase.google.com)
- What do you want to use as your public directory? → `build`
- Configure as a single-page app? → Yes
- Set up automatic builds with GitHub? → No

#### Deploy:
```bash
firebase deploy
```

**URL contoh**: `https://lacak-iphone.web.app`

## 🔧 Custom Domain

### Netlify:
1. Domain settings → Add custom domain
2. Follow DNS instructions

### Vercel:
1. Settings → Domains
2. Add custom domain

### GitHub Pages:
1. Settings → Pages → Custom domain
2. Add domain
3. Update DNS records

### Cloudflare Pages:
1. Custom domains → Add domain
2. Update DNS

## ⚡ Optimization Tips

### 1. Reduce Bundle Size:
```bash
# Check bundle size
npm run build

# Lihat output: File sizes after gzip
```

### 2. Enable Compression:
Tambahkan ini di `.htaccess` (Apache):
```apache
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css text/javascript application/javascript
</IfModule>
```

### 3. Cache Headers:
```apache
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
</IfModule>
```

## 🐛 Troubleshooting

### Build Errors:
```bash
rm -rf node_modules
rm package-lock.json
npm install
npm run build
```

### 404 Errors on Refresh:
Pastikan hosting support SPA (Single Page Application) routing.

### Blank Page:
1. Check browser console untuk errors
2. Pastikan semua file di-upload
3. Check file permissions

### Styling Not Loading:
1. Pastikan `index.html` meng-import CSS dengan benar
2. Check path di file `index.html`

### GitHub Pages Path Issues:
Edit `package.json`:
```json
{
  "homepage": "https://username.github.io/repo-name"
}
```

Then rebuild:
```bash
npm run build
```

## 📊 Monitoring & Analytics

### Add Google Analytics:
Create `src/analytics.js`:
```javascript
export const initGA = () => {
  // Add your Google Analytics code
};

export const trackPageView = (page) => {
  // Track page views
};
```

Import di `App.js`:
```javascript
import { initGA } from './analytics';

useEffect(() => {
  initGA();
}, []);
```

## 🔒 Security Tips

1. **Use HTTPS**: Semua platform di atas menyediakan gratis SSL
2. **Environment Variables**: Jangan hardcode sensitive data
3. **CSP Headers**: Configure Content Security Policy
4. **Regular Updates**: Keep dependencies updated

## 📈 Scaling

### For High Traffic:
1. Use CDN (Cloudflare, AWS CloudFront)
2. Enable caching
3. Use multiple deployment regions
4. Monitor performance dengan tools seperti:
   - Lighthouse
   - WebPageTest
   - GTmetrix

---

**Catatan**: Ini adalah simulasi untuk demonstrasi. Tidak perlu monitoring intensif karena bukan production app sungguhan.
