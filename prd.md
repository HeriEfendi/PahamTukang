
Ini ide proyek yang sangat menarik dan solutif! Kombinasi *stack* Vue, Ionic, Capacitor, dan Tauri adalah pilihan tepat untuk arsitektur *cross-platform* yang ringan, 100% *offline-first*, dan hemat *resource*.

Berikut adalah Product Requirement Document (PRD) yang dirancang khusus sesuai dengan kebutuhan arsitektur kamu:

---

# PRD: Aplikasi DIY Pertukangan Rumah (Bapak-Bapak DIY)

## 1. Overview & Objective

Aplikasi panduan pertukangan dan perbaikan mandiri (DIY) rumah tangga berbasis *offline-first*. Aplikasi membantu pengguna merencanakan proyek DIY (seperti kelistrikan dasar, sanitasi, dan perkayuan) dengan menyediakan kalkulasi bahan, daftar alat, panduan *security-first*, serta *troubleshooting* tanpa memerlukan koneksi internet maupun *backend server*.

Target platform utama adalah **Android** (via Capacitor), tetapi dibangun agar sepenuhnya *compatible* untuk **Windows, Linux, macOS** (via Tauri) serta **Web (PWA)** dari satu basis kode (*single codebase*).

---

## 2. Technical Stack & Architecture

* **Frontend UI Framework:** Vue 3 (Composition API + TypeScript)
* **UI Components & Mobile UX:** Ionic Framework (`@ionic/vue`)
* **Mobile Runtime (Android):** Capacitor (Native bridge untuk Android & kamera/filesystem)
* **Desktop Runtime (Windows, Linux, macOS):** Tauri (Rust-based lightweight container)
* **Local Storage:** IndexedDB (via `Dexie.js` untuk kemudahan querying dan reactive live-query)
* **Local Assets & Media:** WebP local images / Vector SVG icons yang dibundel langsung di dalam aset aplikasi.

---

## 3. Core Features (Fitur Utama)

1. **Katalog Proyek DIY & Instalasi**
* Panduan terstruktur per kategori (LST: Kelistrikan, SAN: Sanitasi/Pipa, KAY: Perkayuan/Mebel).
* Fitur kalkulasi estimasi kebutuhan material (panjang kabel, jumlah saklar, dsb.).


2. **Interactive BOM (Bill of Materials) & Checklist**
* Daftar alat (tools) dan bahan (materials) yang bisa dicentang saat pengguna menyiapkan peralatan.


3. **Safety-First Guided Steps**
* Modul langkah kerja *step-by-step* yang mewajibkan pengguna melewati *checklist* prosedur keselamatan (misal: "Matikan MCB", "Cek Tespen").


4. **Local AI & Rule-Based Troubleshooter**
* Diagnosa kendala berbasis *decision tree* lokal untuk menangani masalah umum setelah pengerjaan (contoh: lampu tidak menyala / saklar panas).


5. **My DIY Projects (Catatan Personal)**
* Menyimpan proyek DIY pribadi yang pernah dikerjakan lengkap dengan foto hasil pengerjaan (disimpan di IndexedDB/Local File System).



---

## 4. System Architecture & Flow Implementation

Urutan eksekusi pembangunan aplikasi dibagi menjadi 3 lapisan: Frontend (FE), Backend/Data Layer (BE), dan Integration Layer.

### Step 1: Frontend (FE) - UI Component & Layout Setup

* **Structure Project:** Vue 3 + Ionic Vue + Tailwind CSS (opsional untuk styling kustom).
* **View & Routing Structure:**
* `HomeView`: Dashboard kategori proyek & pencarian cepat.
* `ProjectDetailView`: Detail proyek, BOM (daftar alat & bahan), dan kalkulator material.
* `ExecutionView`: Panduan *step-by-step* interaktif dengan *safety wizard*.
* `TroubleshooterView`: Diagnosa kendala perbaikan.
* `MyProjectsView`: Gallery & catatan proyek lokal pengguna.


* **Responsive Layout:**
* Layout Ionic (`IonPage`, `IonContent`, `IonHeader`) secara otomatis menyesuaikan tampilan seluler (Android) dan tampilan layar lebar (Desktop via Tauri).



### Step 2: Backend (BE) / Data & Storage Layer (Offline-First)

Karena aplikasi ini 100% *offline-first* tanpa *remote server*, seluruh *business logic* dan *database* berada di sisi klien (*client-side*).

* **IndexedDB Setup (`Dexie.js`):**
* Schema `projects`: `id, title, category, difficulty, duration, steps, tools, materials`
* Schema `my_logs`: `id, project_id, status, user_notes, photo_blob, created_at`


* **Local Asset Management:**
* Gambar diagram (misal: Skema kabel saklar tunggal & ganda) disimpan di folder `src/assets/diagrams/` dengan format WebP terkompresi.
* *Asset Loader Service*: Mengambil gambar dari bundel lokal tanpa bergantung pada URL luar.


* **Local Decision Engine:**
* Memuat berkas JSON lokal yang berisi aturan *troubleshooting* (input gejala $\rightarrow$ output kemungkinan penyebab & tindakan).



### Step 3: Integration Layer (Capacitor + Tauri + Web)

* **Cross-Platform Bridge Abstraction:**
Membuat *wrapper class* (`NativeService`) untuk menangani fungsionalitas spesifik per platform agar *codebase* Vue tetap bersih.
* **Android (Capacitor Integration):**
* Menggunakan `@capacitor/camera` untuk mengambil foto hasil proyek.
* Menggunakan `@capacitor/filesystem` untuk menyimpan ekspor data/catatan.
* Menggunakan `@capacitor/haptics` untuk getaran respon tombol saat *step-by-step wizard*.


* **Desktop (Tauri Integration):**
* Konfigurasi `tauri.conf.json` untuk *window management* di Windows, Linux, dan macOS.
* Menggunakan Tauri API (`@tauri-apps/api/fs` & `@tauri-apps/api/dialog`) untuk fungsi simpan/buka berkas lokal di desktop.


* **Web (Fallback PWA):**
* Menggunakan *Native Web API* (`HTMLInputElement` untuk kamera/file, `localStorage/IndexedDB` murni).





---

## 5. Timeline Eksekusi Pengerjaan

1. **Fase FE:** Setup repositori Vue 3 + Ionic, buat UI Wireframe, sistem navigasi, dan komponen re-usable (Card, Stepper, Modal).
2. **Fase BE (Local Storage):** Inisialisasi Dexie.js, buat seeder data JSON untuk tutorial dasar (misal: Instalasi Saklar Lampu), buat service pengolahan gambar ke Base64/Blob IndexedDB.
3. **Fase Integrasi & Build Target:**
* Build & Test Web PWA.
* `npx cap add android` $\rightarrow$ Integrasi plugin Capacitor & pengujian di emulator/perangkat Android.
* `cargo tauri init` $\rightarrow$ Integrasi Tauri & kompilasi binary untuk Windows (.exe) dan Linux (.AppImage/deb).