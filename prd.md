Ini ide proyek yang sangat menarik dan solutif! Kombinasi _stack_ Vue, Ionic, Capacitor, dan Tauri adalah pilihan tepat untuk arsitektur _cross-platform_ yang ringan, 100% _offline-first_, dan hemat _resource_.

Berikut adalah Product Requirement Document (PRD) yang dirancang khusus sesuai dengan kebutuhan arsitektur kamu:

---

# PRD: Aplikasi DIY Pertukangan Rumah (Bapak-Bapak DIY)

## 1. Overview & Objective

Aplikasi panduan pertukangan dan perbaikan mandiri (DIY) rumah tangga berbasis _offline-first_. Aplikasi membantu pengguna merencanakan proyek DIY (seperti kelistrikan dasar, sanitasi, dan perkayuan) dengan menyediakan kalkulasi bahan, daftar alat, panduan _security-first_, serta _troubleshooting_ tanpa memerlukan koneksi internet maupun _backend server_.

Target platform utama adalah **Android** (via Capacitor), tetapi dibangun agar sepenuhnya _compatible_ untuk **Windows, Linux, macOS** (via Tauri) serta **Web (PWA)** dari satu basis kode (_single codebase_).

---

## 2. Technical Stack & Architecture

- **Frontend UI Framework:** Vue 3 (Composition API + TypeScript)
- **UI Components & Mobile UX:** Ionic Framework (`@ionic/vue`)
- **Mobile Runtime (Android):** Capacitor (Native bridge untuk Android & kamera/filesystem)
- **Desktop Runtime (Windows, Linux, macOS):** Tauri (Rust-based lightweight container)
- **Local Storage:** IndexedDB (via `Dexie.js` untuk kemudahan querying dan reactive live-query)
- **Local Assets & Media:** WebP local images / Vector SVG icons yang dibundel langsung di dalam aset aplikasi.

---

## 3. Core Features (Fitur Utama)

1. **Katalog Proyek DIY & Instalasi**

- Panduan terstruktur per kategori (LST: Kelistrikan, SAN: Sanitasi/Pipa, KAY: Perkayuan/Mebel).
- Fitur kalkulasi estimasi kebutuhan material (panjang kabel, jumlah saklar, dsb.).

2. **Interactive BOM (Bill of Materials) & Checklist**

- Daftar alat (tools) dan bahan (materials) yang bisa dicentang saat pengguna menyiapkan peralatan.

3. **Safety-First Guided Steps**

- Modul langkah kerja _step-by-step_ yang mewajibkan pengguna melewati _checklist_ prosedur keselamatan (misal: "Matikan MCB", "Cek Tespen").

4. **Local AI & Rule-Based Troubleshooter**

- Diagnosa kendala berbasis _decision tree_ lokal untuk menangani masalah umum setelah pengerjaan (contoh: lampu tidak menyala / saklar panas).

5. **My DIY Projects (Catatan Personal)**

- Menyimpan proyek DIY pribadi yang pernah dikerjakan lengkap dengan foto hasil pengerjaan (disimpan di IndexedDB/Local File System).

---

## 4. System Architecture & Flow Implementation

Urutan eksekusi pembangunan aplikasi dibagi menjadi 3 lapisan: Frontend (FE), Backend/Data Layer (BE), dan Integration Layer.

### Step 1: Frontend (FE) - UI Component & Layout Setup

- **Structure Project:** Vue 3 + Ionic Vue + Tailwind CSS (opsional untuk styling kustom).
- **View & Routing Structure:**
- `HomeView`: Dashboard kategori proyek & pencarian cepat.
- `ProjectDetailView`: Detail proyek, BOM (daftar alat & bahan), dan kalkulator material.
- `ExecutionView`: Panduan _step-by-step_ interaktif dengan _safety wizard_.
- `TroubleshooterView`: Diagnosa kendala perbaikan.
- `MyProjectsView`: Gallery & catatan proyek lokal pengguna.

- **Responsive Layout:**
- Layout Ionic (`IonPage`, `IonContent`, `IonHeader`) secara otomatis menyesuaikan tampilan seluler (Android) dan tampilan layar lebar (Desktop via Tauri).

### Step 2: Backend (BE) / Data & Storage Layer (Offline-First)

Karena aplikasi ini 100% _offline-first_ tanpa _remote server_, seluruh _business logic_ dan _database_ berada di sisi klien (_client-side_).

- **IndexedDB Setup (`Dexie.js`):**
- Schema `projects`: `id, title, category, difficulty, duration, steps, tools, materials`
- Schema `my_logs`: `id, project_id, status, user_notes, photo_blob, created_at`

- **Local Asset Management:**
- Gambar diagram (misal: Skema kabel saklar tunggal & ganda) disimpan di folder `src/assets/diagrams/` dengan format WebP terkompresi.
- _Asset Loader Service_: Mengambil gambar dari bundel lokal tanpa bergantung pada URL luar.

- **Local Decision Engine:**
- Memuat berkas JSON lokal yang berisi aturan _troubleshooting_ (input gejala $\rightarrow$ output kemungkinan penyebab & tindakan).

### Step 3: Integration Layer (Capacitor + Tauri + Web)

- **Cross-Platform Bridge Abstraction:**
  Membuat _wrapper class_ (`NativeService`) untuk menangani fungsionalitas spesifik per platform agar _codebase_ Vue tetap bersih.
- **Android (Capacitor Integration):**
- Menggunakan `@capacitor/camera` untuk mengambil foto hasil proyek.
- Menggunakan `@capacitor/filesystem` untuk menyimpan ekspor data/catatan.
- Menggunakan `@capacitor/haptics` untuk getaran respon tombol saat _step-by-step wizard_.

- **Desktop (Tauri Integration):**
- Konfigurasi `tauri.conf.json` untuk _window management_ di Windows, Linux, dan macOS.
- Menggunakan Tauri API (`@tauri-apps/api/fs` & `@tauri-apps/api/dialog`) untuk fungsi simpan/buka berkas lokal di desktop.

- **Web (Fallback PWA):**
- Menggunakan _Native Web API_ (`HTMLInputElement` untuk kamera/file, `localStorage/IndexedDB` murni).

---

## 5. Timeline Eksekusi Pengerjaan

1. **Fase FE:** Setup repositori Vue 3 + Ionic, buat UI Wireframe, sistem navigasi, dan komponen re-usable (Card, Stepper, Modal).
2. **Fase BE (Local Storage):** Inisialisasi Dexie.js, buat seeder data JSON untuk tutorial dasar (misal: Instalasi Saklar Lampu), buat service pengolahan gambar ke Base64/Blob IndexedDB.
3. **Fase Integrasi & Build Target:**

- Build & Test Web PWA.
- `npx cap add android` $\rightarrow$ Integrasi plugin Capacitor & pengujian di emulator/perangkat Android.
- `cargo tauri init` $\rightarrow$ Integrasi Tauri & kompilasi binary untuk Windows (.exe) dan Linux (.pkg.tar.zst,deb,rpm).
