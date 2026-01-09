# 🚀 Cara Menjalankan Frontend P2H

Panduan cepat untuk menjalankan frontend sistem P2H (Vue.js + Vite + Tailwind CSS).

---

## 📌 Setup Awal (Hanya Sekali)

### 1. Install Node.js
Pastikan Node.js sudah terinstall (minimal versi 16+)
```powershell
node --version
npm --version
```

Jika belum install, download dari: https://nodejs.org

### 2. Install Dependencies
```powershell
# Masuk ke folder frontend
cd frontend-p2h

# Install semua package
npm install
```

### 3. Konfigurasi API Endpoint (Optional)
Edit file `src/services/api.js` untuk mengatur base URL backend:
```javascript
const API_BASE_URL = 'http://localhost:8000'
```

---

## ▶️ Cara Jalankan Sehari-hari

### 1. Masuk ke Folder Frontend
```powershell
cd frontend-p2h
```

### 2. Jalankan Development Server
```powershell
npm run dev
```

### 3. Akses Aplikasi
Buka browser dan akses:
- **Frontend**: http://localhost:5173
- **Network Access**: http://192.168.x.x:5173 (untuk akses dari device lain)

### 4. Stop Server
Tekan `Ctrl + C` di terminal

---

## 🔧 Perintah Berguna

### Development

#### Jalankan Dev Server
```powershell
npm run dev
```
Server akan auto-reload saat ada perubahan file.

#### Build untuk Production
```powershell
npm run build
```
Hasil build akan ada di folder `dist/`

#### Preview Production Build
```powershell
npm run preview
```
Preview hasil build sebelum deploy.

### Package Management

#### Install Package Baru
```powershell
npm install nama-package
```

#### Install Dev Dependencies
```powershell
npm install --save-dev nama-package
```

#### Update Package
```powershell
npm update
```

#### Hapus node_modules dan Install Ulang
```powershell
Remove-Item -Recurse -Force node_modules
npm install
```

---

## 🐛 Troubleshooting

### Error: "npm: command not found"
**Solusi**: Install Node.js dari https://nodejs.org

### Error: Port 5173 sudah digunakan
**Solusi**: 
1. Tutup aplikasi yang menggunakan port tersebut
2. Atau ubah port di `vite.config.js`:
```javascript
export default defineConfig({
  server: {
    port: 3000
  }
})
```

### Error: "Cannot find module"
**Solusi**: Install ulang dependencies
```powershell
Remove-Item -Recurse -Force node_modules
npm install
```

### Error: CORS saat akses API
**Solusi**: 
1. Pastikan backend sudah jalan di `http://localhost:8000`
2. Cek konfigurasi CORS di backend (file `app/main.py`)
3. Cek URL API di `src/services/api.js`

### Error: Komponen tidak tampil
**Solusi**:
1. Clear browser cache (Ctrl + Shift + Delete)
2. Hard reload (Ctrl + Shift + R)
3. Restart dev server

---

## 👤 Default Login

Gunakan kredensial yang sama dengan backend:

**Superadmin**
- Email: `superadmin@imm.com`
- Password: `admin123`

**Admin Monitor**
- Email: `admin@imm.com`
- Password: `admin123`

**Karyawan**
- Email: `karyawan@imm.com`
- Password: `admin123`

---

## 📁 Struktur Project Penting

```
frontend-p2h/
├── src/
│   ├── App.vue              # Root component
│   ├── main.js              # Entry point
│   ├── style.css            # Global styles
│   ├── components/          # Vue components
│   │   ├── admin/           # Admin components
│   │   ├── user/            # User components
│   │   ├── viewer/          # Viewer components
│   │   └── login-page.vue   # Login page
│   ├── router/              # Vue Router
│   │   └── indext.js        # Routes config
│   ├── services/            # API services
│   │   └── api.js           # API client
│   ├── lang/                # Internationalization
│   │   ├── id.js            # Bahasa Indonesia
│   │   ├── en.js            # English
│   │   └── index.js         # i18n config
│   └── views/               # Page views
├── public/                  # Static assets
│   ├── font/                # Font files
│   └── image_asset/         # Images
├── package.json             # NPM dependencies
├── vite.config.js           # Vite configuration
└── index.html               # HTML template
```

---

## 🔄 Workflow Harian

1. **Buka Terminal** di folder `frontend-p2h/`
2. **Pastikan Backend Jalan** (http://localhost:8000)
3. **Jalankan Frontend**: `npm run dev`
4. **Develop**: Edit code di `src/`, browser auto-reload
5. **Test**: Buka http://localhost:5173
6. **Commit**: Git add, commit, push
7. **Selesai**: Ctrl+C untuk stop server

---

## 🎨 Tech Stack

- **Framework**: Vue.js 3 (Composition API)
- **Build Tool**: Vite
- **CSS Framework**: Tailwind CSS 4
- **Router**: Vue Router 4
- **Icons**: Heroicons
- **Internationalization**: Vue I18n
- **HTTP Client**: Fetch API (via `api.js`)

---

## 🚀 Tips Development

### Hot Module Replacement (HMR)
Vite otomatis reload saat ada perubahan. Tidak perlu refresh manual!

### Vue Devtools
Install Vue.js Devtools extension di browser untuk debugging:
- Chrome: https://chrome.google.com/webstore (search "Vue.js devtools")
- Firefox: https://addons.mozilla.org (search "Vue.js devtools")

### Tailwind IntelliSense
Install extension "Tailwind CSS IntelliSense" di VS Code untuk autocomplete class Tailwind.

### Multi-language Support
Website support Bahasa Indonesia dan English. Ubah di file `src/lang/`

---

## 📦 Build & Deploy

### Build Production
```powershell
npm run build
```

File hasil build ada di folder `dist/`. Upload folder ini ke hosting.

### Preview Build Local
```powershell
npm run preview
```

### Deploy ke Hosting
1. Build: `npm run build`
2. Upload folder `dist/` ke web server (Nginx, Apache, dll)
3. Setup routing untuk SPA (redirect semua request ke `index.html`)

#### Example Nginx Config
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

---

## 📞 Bantuan Lebih Lanjut

- Dokumentasi Vue.js: https://vuejs.org
- Dokumentasi Vite: https://vite.dev
- Dokumentasi Tailwind CSS: https://tailwindcss.com
- Dokumentasi Vue Router: https://router.vuejs.org
- Dokumentasi Vue I18n: https://vue-i18n.intlify.dev

---

## 🔗 Integrasi dengan Backend

Frontend berkomunikasi dengan backend melalui REST API.

### Base URL
Default: `http://localhost:8000`
Edit di: `src/services/api.js`

### Authentication
Menggunakan JWT Token yang disimpan di localStorage.

### API Endpoints
Lihat dokumentasi API di: http://localhost:8000/docs (Swagger)

---

**Terakhir diupdate**: 8 Januari 2026
