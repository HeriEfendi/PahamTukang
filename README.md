# PahamTukang

PahamTukang adalah aplikasi panduan **DIY pertukangan rumah tangga** yang berjalan **offline-first**, tanpa backend atau server remote. Aplikasi membantu pengguna merencanakan pekerjaan kelistrikan dasar, sanitasi, dan perkayuan: menyiapkan kebutuhan, mengikuti prosedur aman, menghitung bahan, hingga mendiagnosa kendala umum.

Satu codebase ditargetkan untuk Android melalui Capacitor, desktop melalui Tauri, dan web modern melalui Vite.

## Fitur

### Katalog dan persiapan proyek

- Panduan terstruktur untuk kategori **LST** (kelistrikan), **SAN** (sanitasi/pipa), dan **KAY** (perkayuan/mebel).
- Pencarian cepat dan detail proyek berisi tingkat kesulitan, estimasi durasi, risiko, serta tag.
- Interactive BOM: daftar alat dan bahan yang dapat dicentang, lengkap dengan kebutuhan dan estimasi biaya.
- Kalkulator material per proyek, misalnya kebutuhan kabel, pipa, atau bahan perkayuan.

### Eksekusi aman

- Safety wizard dengan checklist keselamatan wajib sebelum pekerjaan dimulai.
- Panduan langkah demi langkah, checklist progres, tips, peringatan bahaya, dan skema teknis.
- Respons haptic saat perangkat mendukungnya.

### Diagnosa dan catatan pribadi

- Troubleshooter lokal berbasis decision tree untuk gejala masalah rumah tangga umum.
- Catatan proyek pribadi: status, durasi, biaya, rating, catatan, langkah selesai, dan foto hasil kerja.
- Foto dari kamera atau galeri pada Android; pemilih berkas pada web.

### Data dan backup

- Penyimpanan offline lewat IndexedDB (Dexie), tanpa akun dan tanpa server.
- Ekspor/impor backup JSON untuk checklist serta catatan proyek.
- Ekspor memakai Filesystem pada Android dan unduhan browser sebagai fallback web.

> [!WARNING]
> Panduan kelistrikan memuat risiko sengatan dan kebakaran. Matikan MCB, verifikasi nol tegangan memakai alat uji yang sesuai, dan hubungi teknisi berlisensi bila ragu.

## Platform dan Stack

| Target | Runtime | Kapabilitas utama |
| --- | --- | --- |
| Android | Capacitor 6 | Kamera, filesystem, haptic |
| Desktop | Tauri 2 | Container desktop Windows, Linux, macOS |
| Web | Browser modern + Vite | IndexedDB, pemilih berkas, Web Vibration API bila tersedia |

| Bagian | Teknologi |
| --- | --- |
| UI | Vue 3, Composition API, Ionic Vue |
| Bahasa dan build | TypeScript, Vite |
| Data lokal | Dexie / IndexedDB |
| Troubleshooter | Rule-based decision tree lokal |
| Gaya | Vanilla CSS dan token tema Ionic |

## Prasyarat

- Node.js 18 atau lebih baru
- npm
- Android Studio dan Android SDK, hanya untuk build Android
- Rust toolchain dan dependensi sistem Tauri, hanya untuk build desktop

## Mulai Lokal

```bash
npm install
npm run dev
```

Buka URL yang ditampilkan Vite, biasanya `http://localhost:5173`.

## Perintah

```bash
# Jalankan server pengembangan
npm run dev

# Cek tipe TypeScript dan buat bundle web
npm run build

# Pratinjau bundle produksi
npm run preview
```

## Android (Capacitor)

Build web dulu, lalu sinkronkan aset ke proyek Android.

```bash
npm run build
npx cap sync android
npx cap open android
```

Lanjutkan build atau jalankan dari Android Studio.

## Desktop (Tauri)

Konfigurasi desktop ada di [`src-tauri/tauri.conf.json`](src-tauri/tauri.conf.json). Setelah dependensi Tauri tersedia pada mesin:

```bash
npx tauri dev
```

## Alur Pengguna

1. Pilih kategori atau cari panduan dari beranda.
2. Buka detail proyek, tinjau risiko, alat, bahan, dan kalkulator.
3. Selesaikan checklist keselamatan wajib.
4. Ikuti langkah kerja pada mode eksekusi dan tandai progres.
5. Gunakan troubleshooter bila hasil kerja bermasalah.
6. Simpan catatan, biaya, status, dan foto ke **My Projects**.
7. Ekspor backup JSON sebelum pindah perangkat atau browser.

## Data Lokal dan Backup

Saat bootstrap, aplikasi membuat database `PahamTukangDB` lalu seed katalog proyek dari [`src/data/projectsData.ts`](src/data/projectsData.ts) jika database masih kosong. Katalog tetap tersedia tanpa koneksi.

Data pengguna yang tersimpan:

- State checklist alat, bahan, keamanan, dan langkah aktif per proyek.
- Catatan proyek: status, durasi, biaya, rating, foto, catatan, dan langkah selesai.

Backup JSON hanya memuat data pengguna (checklist dan catatan proyek), bukan katalog proyek bawaan. Impor menggabungkan data backup ke data lokal saat ini.

## Arsitektur dan Struktur Proyek

```text
src/
├── data/        # Katalog proyek dan decision tree troubleshooting lokal
├── services/    # Dexie database dan NativeService lintas platform
├── views/       # Home, detail, eksekusi, troubleshooting, My Projects
├── components/  # Komponen UI yang dapat digunakan ulang
├── router/      # Rute aplikasi Ionic / Vue Router
├── theme/       # Token dan gaya global
└── types/       # Model TypeScript
android/         # Proyek Android Capacitor
src-tauri/       # Konfigurasi dan backend desktop Tauri
```

`NativeService` membungkus perbedaan platform. Android memakai plugin Capacitor; web memakai File Input, browser download, dan Web Vibration API sebagai fallback. Data dan aturan troubleshooting tetap berada di sisi klien.

## Rute Aplikasi

| Rute | Halaman | Peran |
| --- | --- | --- |
| `/home` | `HomeView` | Dashboard kategori dan pencarian |
| `/project/:slug` | `ProjectDetailView` | Detail, BOM, dan kalkulator |
| `/project/:slug/execute` | `ExecutionView` | Safety wizard dan langkah kerja |
| `/troubleshoot` | `TroubleshooterView` | Diagnosa berbasis aturan lokal |
| `/my-projects` | `MyProjectsView` | Galeri dan catatan proyek pengguna |

## Catatan Pengembangan

- Aplikasi memakai `createWebHistory`; server produksi perlu fallback ke `index.html` untuk semua rute aplikasi.
- Tidak ada autentikasi, API remote, atau sinkronisasi cloud. Hapus data browser berarti menghapus data lokal bila belum dibackup.
- Konten panduan adalah edukasi umum, bukan pengganti inspeksi atau pekerjaan profesional.
- Diagram pada data proyek saat ini berupa skema SVG. Aset lokal lain dapat ditambahkan ke bundel bila konten visual diperluas.
