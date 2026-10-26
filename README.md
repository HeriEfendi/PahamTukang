# PahamTukang

PahamTukang adalah aplikasi panduan **DIY pertukangan dan konstruksi rumah tangga** berbasis **offline-first** (100% tanpa server atau internet) yang mengintegrasikan dokumentasi **Standar Nasional Indonesia (SNI)** dan Analisis Harga Satuan Pekerjaan (AHSP). Aplikasi ini dirancang untuk membantu pemilik rumah, penghobi DIY, dan mandor pemula merencanakan pekerjaan secara aman, menghitung kebutuhan material secara presisi, melakukan eksekusi langkah demi langkah dengan panduan suara bebas genggam, serta mendiagnosis masalah rumah tangga secara mandiri.

Satu codebase terpadu menargetkan **Android** (Capacitor 6), **Desktop** (Tauri 2 untuk Windows, Linux, macOS), dan **Web Modern** (Vue 3 + Vite).

---

## Fitur Utama

### 1. Katalog Proyek & Standar Nasional Indonesia (SNI)
- **4 Kategori Proyek Terstruktur:**
  - 🧱 **KNS (Konstruksi Sipil & Bangunan SNI)**: Perbaikan retak dinding & plesteran (SNI 03-2835), pasang bata ringan hebel (SNI 8640), pengecoran sloof/kolom mutu K-175 (SNI 2847), waterproofing dak beton & nok genteng (SNI 03-6861.1).
  - ⚡ **LST (Kelistrikan Dasar)**: Instalasi stop kontak, saklar, dan fitting lampu sesuai kaidah keselamatan **SNI 0225:2020 (PUIL 2020)**.
  - 🚰 **SAN (Sanitasi & Perpipaan)**: Perbaikan kran, perangkap bau P-trap, dan instalasi pipa PVC sesuai **SNI 8153:2015**.
  - 🪵 **KAY (Perkayuan & Mebel)**: Pemotongan, penyambungan dowel/pocket hole, dan perakitan rak dinding kayu.
- **Kartu Verifikasi SNI Resmi**: Menampilkan klausul standar, ringkasan pasal teknis, dan rasio campuran spesifik pada setiap proyek konstruksi sipil.
- **Skema Diagram Vektor SVG**: Gambar teknis penampang alur huruf V untuk retak dinding, sambungan bata hebel, proporsi cor beton 1:2:3, dan sudut chamfer plint 45°.

### 2. Kalkulator Material SNI & AHSP (Analisis Harga Satuan Pekerjaan)
- **Mesin Hitung Kebutuhan Bahan Dinamis**:
  - Plesteran dinding kedap air (1:3) dan dinding bata/hebel standar (1:4 tebal 15 mm) dengan output jumlah sak semen 40/50 kg dan pasir pasang ($m^3$).
  - Dinding bata ringan Hebel AAC (tebal 7.5 cm dan 10 cm) dengan output jumlah balok hebel dan sak semen instan (mortar thinbed).
  - Pengecoran beton mutu K-175 dengan takaran 1 Semen : 2 Pasir Beton : 3 Kerikil/Split serta faktor air semen (w/c).
  - Estimasi penampang kabel listrik rumah tangga berbasis arus nominal Ampere (PUIL 2020).
- **Lencana Standar SNI pada Item Material**: Setiap baris bahan bangunan dilengkapi label standar resmi terkait.

### 3. Ekspor Lembar Belanja (BOM) Toko Material & WhatsApp
- **Salin Lembar Belanja**: Menyalin daftar kebutuhan alat wajib/opsional, kuantitas material, referensi SNI, dan estimasi total anggaran biaya ke clipboard.
- **Kirim ke WhatsApp Toko**: Membuka WhatsApp secara instan dengan format pesan teks rapi untuk dikirimkan ke kontak toko bangunan langganan.

### 4. Kotak Perkakas Digital (Digital Handyman Toolkit)
Diakses melalui tombol **`🛠️ Toolkit`** pada bilah navigasi atas (*header*):
- **Waterpass Giroskop (3D Spirit Level)**: Pendeteksi kemiringan sudut Pitch ($\beta$) dan Roll ($\gamma$) presisi dengan tabung gelembung virtual, sudut numerik real-time, nada peringatan audio (*tone alert*), tombol kalibrasi nol (*zero-calibration*), serta slider simulasi peramban desktop.
- **Penggaris Kalibrasi Layar**: Penggaris fisik berbasis skala piksel presisi (cm & mm) untuk mengukur sekrup, paku, atau tebal kayu langsung di atas layar ponsel.
- **Lampu Senter Kerja (Torch/Flashlight)**: Lampu penerangan untuk inspeksi sudut gelap atau instalasi di bawah plafon.

### 5. Eksekusi Langkah Kerja & Mode Bebas Genggam (Hands-Free TTS)
- **Safety Gate Wizard**: Checklist keselamatan dan APD wajib sebelum pekerjaan dapat dimulai.
- **Voice Reader Narator Suara (TTS)**: Membacakan instruksi kerja secara otomatis saat tangan kotor atau sedang memegang alat kerja (memanfaatkan *Web Speech Synthesis API* offline tanpa dependensi server).
- **Auto-Speak Next Step**: Fitur otomatis membacakan langkah berikutnya saat tombol *Langkah Selesai* ditekan.
- **Indikator Equalizer Gelombang Suara**: Visualisasi animasi mikro saat suara narasi aktif.

### 6. Diagnosa Kendala Rumah Tangga (Troubleshooter)
- **Rule-Based Decision Tree Lokal**: Diagnosa interaktif bercabang tanpa internet untuk membedakan retak rambut vs retak struktural, dak beton rembes, saluran air mampet, listrik trip, dan kayu berderit.

### 7. Catatan Proyek Pengguna & Komparasi Foto Before & After
- **Before & After Photo Comparison**: Unggah foto kondisi awal sebelum perbaikan dan hasil akhir sesudah pengerjaan dengan tampilan komparasi berdampingan.
- **Penyimpanan Log Lengkap**: Status pengerjaan, durasi, total biaya aktual, rating kepuasan, dan catatan teknis lapangan.
- **Cadangan Data Offline (JSON Backup)**: Fitur ekspor dan impor seluruh catatan serta status checklist pengguna.

### 8. Desain & Aksesibilitas Modern
- **Mode Gelap / Terang (Dark Mode Persistent)**: Menggunakan token warna bengkel yang ramah mata untuk pengerjaan malam hari, tersimpan di `localStorage`.
- **Indikator Offline SNI**: Penanda status offline dengan animasi titik denyut hijau.
- **Umpan Balik Haptik**: Respons getaran fisik saat memilih item dan menekan tombol pada perangkat seluler.

---

## Platform & Teknologi

| Target | Runtime | Kapabilitas Utama |
| --- | --- | --- |
| **Android** | Capacitor 6 | Kamera bawaan, Filesystem, Haptic Vibration API, Hardware Orientation Sensor |
| **Desktop** | Tauri 2 | Paket desktop ringan multiplatform (Windows, Linux, macOS) |
| **Web** | Vite + Browser Modern | Offline PWA ready, IndexedDB Dexie, Web Speech Synthesis, Web Audio API |

### Tech Stack
- **Frontend Core**: Vue 3 (Composition API, `<script setup>`), TypeScript, Ionic Vue Web Components
- **Styling**: Standardized Global Design System (Vanilla CSS & Ionic Theme Tokens)
- **Database Lokal**: Dexie.js (IndexedDB wrapper)
- **Suara & Sensor**: Web Speech Synthesis API, Web Audio API (`AudioContext`), `DeviceOrientationEvent`
- **Build Tool**: Vite 5, Vue-TSC

---

## Standar Nasional Indonesia (SNI) yang Menjadi Rujukan

1. **SNI 03-2835-2002 & Permen PUPR No. 1/2022 (AHSP)**
   - Tata cara perhitungan harga satuan pekerjaan plesteran dinding kedap air (1 PC : 3 PP) dan standar (1 PC : 4 PP) tebal 15 mm.
2. **SNI 03-6882-2002 & SNI 8640:2018**
   - Spesifikasi mortar untuk pekerjaan pasangan dinding bata dan spesifikasi bata ringan (AAC) tipe presisi tebal spesi 3 mm.
3. **SNI 2847:2019 & SNI 6880:2016**
   - Persyaratan beton struktural untuk bangunan gedung dan spesifikasi beton mutu K-175 / $f'_c\ 14.5\text{ MPa}$ takaran 1:2:3.
4. **SNI 03-6861.1-2002**
   - Spesifikasi bahan kedap air / waterproofing membrane dan semen polimer pada dak beton dengan chamfer sudut 45°.
5. **SNI 0225:2020 (PUIL 2020 - Persyaratan Umum Instalasi Listrik)**
   - Ketentuan pemilihan luas penampang kabel tembaga (NYM/NYA) dan pembebanan sirkuit cabang proteksi MCB.
6. **SNI 8153:2015**
   - Sistem plambing pada bangunan gedung (kemiringan pipa pembuangan air kotor minimal 1-2%).

---

## Panduan Memulai Cepat (Local Development)

### Prasyarat
- **Node.js**: Versi 18 atau lebih baru
- **npm**: Versi 9 atau lebih baru

### 1. Kloning & Pemasangan Dependensi
```bash
git clone https://github.com/HeriEfendi/PahamTukang.git
cd PahamTukang
npm install
```

### 2. Jalankan Server Pengembangan
```bash
npm run dev
```
Akses aplikasi melalui peramban pada alamat `http://localhost:5173`.

### 3. Validasi Tipe & Build Produksi
```bash
# Validasi TypeScript dan kompilasi bundle Vite
npm run build

# Uji hasil build secara lokal
npm run preview
```

---

## Kompilasi Android (Capacitor)

```bash
# 1. Pastikan bundle produksi terbaru sudah dibuat
npm run build

# 2. Sinkronkan berkas web ke proyek Android
npx cap sync android

# 3. Buka proyek di Android Studio untuk menjalankan emulator / build APK
npx cap open android
```

---

## Kompilasi Desktop (Tauri)

Pastikan dependensi sistem Tauri dan Rust toolchain telah terpasang pada mesin pengembang:

```bash
# Menjalankan mode pengembangan desktop
npx tauri dev

# Membangun executable produksi (.deb, .msi, atau .dmg)
npx tauri build
```

---

## Struktur Direktori

```text
PahamTukang/
├── ROADMAP_DAN_KODE_REKOMENDASI_SNI.md  # Blueprint arsitektur & pasal SNI
├── src/
│   ├── components/                     # Komponen antarmuka mandiri
│   │   ├── AppHeader.vue               # Header, Dark Mode toggle & status offline
│   │   ├── HandymanToolsModal.vue      # Waterpass digital, penggaris & senter
│   │   ├── MaterialCalculator.vue      # Mesin hitung bahan standar AHSP SNI
│   │   ├── SchematicViewer.vue         # Penampil skema vektor SVG teknis
│   │   ├── SafetyGateModal.vue         # Modal wizard verifikasi keselamatan
│   │   ├── ProjectCard.vue             # Kartu proyek dengan lencana SNI
│   │   └── ProjectLogModal.vue         # Modal log proyek & foto Before-After
│   ├── data/
│   │   ├── projectsData.ts             # Katalog proyek (KNS, LST, SAN, KAY)
│   │   └── troubleshooterData.ts       # Decision tree kendala rumah tangga
│   ├── services/
│   │   ├── db.ts                       # Skema Dexie.js & seeder katalog offline
│   │   └── native.ts                   # Abstraksi haptik, kamera & berkas
│   ├── theme/
│   │   ├── main.css                    # Design system global & Dark Mode
│   │   └── variables.css               # Token warna Ionic & tema bengkel
│   ├── types/
│   │   └── index.ts                    # Definisi antarmuka TypeScript
│   └── views/
│       ├── HomeView.vue                # Beranda, pencarian & filter kategori
│       ├── ProjectDetailView.vue       # Detail, BOM, SNI standards & ekspor WA
│       ├── ExecutionView.vue           # Panduan pengerjaan & Voice Reader TTS
│       ├── TroubleshooterView.vue      # Diagnosa mandiri kerusakan rumah
│       └── MyProjectsView.vue          # Galeri proyek & komparasi Before-After
├── android/                            # Proyek native Android Capacitor
├── src-tauri/                          # Konfigurasi desktop Tauri
└── vite.config.ts                      # Konfigurasi bundler Vite
```

---

## Catatan Keselamatan Kerja

> [!CAUTION]
> Pekerjaan kelistrikan memuat bahaya sengatan listrik fatal dan risiko kebakaran. Pastikan aliran daya dari MCB telah dimatikan dan diverifikasi menggunakan tespen/multimeter sebelum menyentuh kabel telanjang. Pekerjaan struktur utama (pondasi, balok penopang lantai) wajib dikonsultasikan dengan ahli teknik sipil berlisensi.

---

## Lisensi & Kontribusi

Proyek ini dikembangkan secara terbuka untuk mendukung literasi pertukangan dan konstruksi mandiri berstandar nasional di Indonesia. Bebas dikembangkan lebih lanjut untuk penggunaan non-komersial maupun komersial sesuai kebutuhan.
