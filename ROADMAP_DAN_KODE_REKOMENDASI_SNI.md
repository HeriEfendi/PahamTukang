# Cetak Biru Rekomendasi Fitur & Kode Implementasi Standar SNI (PahamTukang)

Dokumen ini memuat **arsitektur fitur, dokumentasi standar Standar Nasional Indonesia (SNI)**, dan **kode sumber lengkap** siap pakai untuk meningkatkan aplikasi PahamTukang.

> **Cara Menjalankan Perintah:**  
> Anda cukup memberikan perintah seperti:  
> **"Eksekusi KODE-01"** atau **"Eksekusi KODE-01 sampai KODE-04"**, maka seluruh kode pada bagian tersebut akan diterapkan langsung ke dalam proyek.

---

## Daftar Kode Perintah Eksekusi

| Kode Perintah | File Sasaran | Ringkasan Modul & Fitur |
| :--- | :--- | :--- |
| **`KODE-01`** | `src/types/index.ts` | Penambahan kategori Konstruksi Sipil (`KNS`), metadata rujukan standar SNI, dan tipe formula kalkulator AHSP. |
| **`KODE-02`** | `src/data/projectsData.ts` | 4 Proyek Master Konstruksi Sipil SNI (Retak Dinding/Plester, Dinding Hebel/Thinbed, Cor Beton K-175, Waterproofing Dak). |
| **`KODE-03`** | `src/components/SchematicViewer.vue` | 4 Skema Vektor SVG Teknis Konstruksi SNI (V-Groove Retak, Pemasangan Hebel, Takaran Cor Beton 1:2:3, Chamfer Waterproofing). |
| **`KODE-04`** | `src/components/MaterialCalculator.vue` | Mesin Hitung Material SNI AHSP (Plesteran Dinding, Bata Ringan Hebel, Cor Beton K-175, PUIL 2020 Beban Kabel). |
| **`KODE-05`** | `src/components/HandymanToolsModal.vue` | Kotak Perkakas Digital (Waterpass Giroskop / Spirit Bubble Level & Penggaris Kalibrasi Layar). |
| **`KODE-06`** | `src/views/ExecutionView.vue` | Mode Bebas Genggam (Hands-Free Voice / Audio Reader TTS) saat tangan pengguna kotor di lapangan. |
| **`KODE-07`** | `src/components/AppHeader.vue` | Dark Mode Toggle (Gelap/Terang persistent) & Pintasan Toolkit Tukang di Header. |
| **`KODE-08`** | `src/views/ProjectDetailView.vue` | Ekspor Lembar Belanja Bahan Material (BOM) ke Format Toko Bangunan / WhatsApp Toko. |

---

## Rujukan Dokumentasi Standar Nasional Indonesia (SNI) yang Digunakan

1. **SNI 03-2835-2002 & Permen PUPR No. 1/2022 (AHSP - Analisis Harga Satuan Pekerjaan)**
   - Takaran plesteran kedap air: 1 Semen : 3 Pasir Pasang.
   - Takaran plesteran dinding bata/hebel standar: 1 Semen : 4 Pasir Pasang (tebal 15 mm).
   - Takaran acian halus: 3.25 kg semen PC per $m^2$ (tebal 1.5 – 2.0 mm).
   - Waktu curing plesteran sebelum diaci: minimal 48 – 72 jam agar tidak terjadi retak rambut akibat penyusutan termal.
2. **SNI 2847:2019 & SNI 6880:2016 (Tata Cara Perhitungan Struktur Beton untuk Bangunan Gedung)**
   - Campuran beton praktis kolom/sloof setara Mutu K-175: Perbandingan volume lapangan **1 Semen : 2 Pasir Cor : 3 Kerikil/Split**, Faktor Air-Semen (FAS) 0.50 – 0.60.
   - Selimut beton (*concrete cover*) minimum: 20 mm untuk melindungi tulangan behel dari korosi udara lembap.
3. **SNI 03-6882-2014 & SNI 8640:2018 (Spesifikasi Mortar & Bata Ringan Autoclaved Aerated Concrete - AAC)**
   - Kebutuhan bata ringan hebel $60 \times 20 \times 7.5\text{ cm}$: $8.33\text{ keping}/m^2$ luas dinding (1 $m^3 \approx 111\text{ keping}$).
   - Mortar instan perekat hebel (*thinbed*): $4.0 - 4.5\text{ kg}/m^2$ dengan ketebalan adukan tipis 3 mm memakai roskam bergigi (*notch trowel* 6 mm).
4. **SNI 0225:2020 (PUIL 2020 - Persyaratan Umum Instalasi Listrik)**
   - Penampang kawat tembaga fasa/netral minimum sirkit penerangan: **$1.5\text{ mm}^2$ (NYM/NYA)**.
   - Penampang kawat stop kontak daya: **$2.5\text{ mm}^2$**.
   - Resistansi elektroda pembumian (grounding/arde): **$< 5\text{ Ohm}$**.
   - Kode warna wajib: Hitam/Cokelat/Abu-abu (Fasa), Biru (Netral), Kuning-Hijau loreng (Arde).
5. **SNI 8153:2015 & SNI 03-6481-2000 (Sistem Plambing Indonesia)**
   - Kemiringan pipa buangan air kotor gravitasi ($\varnothing < 75\text{ mm}$): **minimal 2%** ($2\text{ cm}$ penurunan per 1 meter panjang).
   - Sekat air (*water seal trap*): kedalaman $50 - 100\text{ mm}$ untuk menahan bau got.

---

## `KODE-01`: Pembaruan Model TypeScript & Standar SNI
**File sasaran:** `src/types/index.ts`

```typescript
// Tambahkan 'KNS' (Konstruksi & Sipil Dinding/Beton SNI)
export type ProjectCategory = 'LST' | 'SAN' | 'KAY' | 'KNS';

export type DifficultyLevel = 'Pemula' | 'Menengah' | 'Mahir';

export interface SNIStandardReference {
  code: string;       // Contoh: "SNI 03-2835-2002" atau "PUIL 2020"
  title: string;      // Contoh: "Tata Cara Pengerjaan Plesteran & Acian Dinding"
  clause?: string;    // Contoh: "Pasal 4.2 Rasio 1:4"
  summary: string;    // Keterangan praktis untuk tukang
}

export interface MandatorySafetyCheckItem {
  id: string;
  text: string;
  detail: string;
  critical: boolean;
}

export interface ToolItem {
  id: string;
  name: string;
  required: boolean;
  specification?: string;
  note?: string;
}

export interface MaterialItem {
  id: string;
  name: string;
  defaultQty: number;
  unit: string;
  estimatedPriceUnit: number; // IDR
  note?: string;
  sniStandard?: string;       // Contoh: "SNI 03-6882 Mortar Siap Pakai"
}

export interface CalculatorParam {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  unit: string;
  tooltip?: string;
}

export interface CalculatorConfig {
  formulaType: 
    | 'electrical_cable' 
    | 'plumbing_pipe' 
    | 'floating_shelf' 
    | 'door_repair'
    | 'wall_plaster_ahsp'
    | 'hebel_aac_block'
    | 'concrete_k175_mix'
    | 'electrical_load_puil';
  title: string;
  description: string;
  parameters: CalculatorParam[];
  sniReference?: SNIStandardReference;
}

export interface ProjectStep {
  stepNumber: number;
  title: string;
  description: string;
  schematicId?: string;
  proTip?: string;
  dangerWarning?: string;
  sniNote?: string;          // Ketentuan SNI yang harus dipatuhi di langkah ini
  checkItems: string[];
}

export interface ProjectDiagram {
  id: string;
  title: string;
  description: string;
  type: 'svg_schematic';
}

export interface DIYProject {
  id: string;
  slug: string;
  title: string;
  category: ProjectCategory;
  categoryName: string;
  difficulty: DifficultyLevel;
  durationMinutes: number;
  overview: string;
  tags: string[];
  sniStandards?: SNIStandardReference[]; // Rujukan standar resmi
  safetyHazards: string[];
  mandatorySafetyChecklist: MandatorySafetyCheckItem[];
  tools: ToolItem[];
  materials: MaterialItem[];
  calculatorConfig?: CalculatorConfig;
  steps: ProjectStep[];
  diagrams: ProjectDiagram[];
}

export interface MyProjectLog {
  id: string;
  projectId: string;
  projectTitle: string;
  category: ProjectCategory;
  status: 'in_progress' | 'completed' | 'need_repair';
  startDate: string;
  completedDate?: string;
  spentMinutes: number;
  totalCost: number;
  userNotes: string;
  photoData?: string;
  beforePhotoData?: string; // Foto kondisi awal sebelum diperbaiki
  rating?: number;
  completedSteps: number[];
}

export interface UserChecklistState {
  projectId: string;
  checkedTools: string[];
  checkedMaterials: string[];
  safetyCompleted: boolean;
  currentStep: number;
  updatedAt: string;
}

export interface TroubleshooterResult {
  cause: string;
  dangerLevel: 'AMAN' | 'WASPADA' | 'BAHAYA';
  recommendations: string[];
  safetyInstruction: string;
  suggestedProjectSlug?: string;
}

export interface TroubleshooterNode {
  id: string;
  question?: string;
  options?: {
    text: string;
    nextNodeId: string;
  }[];
  result?: TroubleshooterResult;
}

export interface TroubleshooterTree {
  id: string;
  category: ProjectCategory;
  title: string;
  symptom: string;
  initialNodeId: string;
  nodes: Record<string, TroubleshooterNode>;
}
```

---

## `KODE-02`: Data Proyek Konstruksi Sipil SNI
**File sasaran:** `src/data/projectsData.ts` (ditambahkan ke array `INITIAL_PROJECTS`)

```typescript
// ==========================================
// 4 PROYEK MASTER KONSTRUKSI SIPIL (KNS) SNI
// ==========================================

export const KNS_PROJECTS: DIYProject[] = [
  {
    id: 'kns-01',
    slug: 'perbaikan-dinding-retak-plester-aci',
    title: 'Perbaikan Retak Dinding & Plesteran Ulang Standar SNI',
    category: 'KNS',
    categoryName: 'Konstruksi & Dinding',
    difficulty: 'Pemula',
    durationMinutes: 90,
    overview: 'Panduan standar PU-SDA dan SNI 03-2835 untuk mengatasi retak rambut dan retak plesteran dinding tembok. Meliputi pembukaan celah alur V, aplikasi bonding agent perekat, serta adukan plester 1:4 dan acian halus anti-retak.',
    tags: ['Dinding Retak', 'Plesteran Dinding', 'Acian Semen', 'SNI 03-2835', 'Semen Instan'],
    sniStandards: [
      {
        code: 'SNI 03-2835-2002',
        title: 'Tata Cara Perhitungan Harga Satuan Pekerjaan Tanah, Pasangan dan Plesteran',
        clause: 'Pasal 6.4 Plesteran 1 PC : 4 PP tebal 15mm',
        summary: 'Adukan plesteran dinding batu bata/hebel standar menggunakan perbandingan 1 volume semen PC berbanding 4 pasir pasang ayak halus.'
      },
      {
        code: 'SNI 03-6882-2014',
        title: 'Spesifikasi Mortar untuk Pekerjaan Unit Pasangan',
        summary: 'Adukan acian wajib dirawat lembap (curing) selama 24 jam untuk menghindari dehidrasi cepat penyebab retak rambut.'
      }
    ],
    safetyHazards: [
      'Debu partikel silika semen dan serpihan tembok dapat melukai kornea mata saat memahat.',
      'Sifat semen yang alkalis tinggi (pH 12-13) menyebabkan iritasi kulit tangan dan luka bakar kimia jika kontak lama.'
    ],
    mandatorySafetyChecklist: [
      {
        id: 'safe-eye-respirator',
        text: 'Kenakan Kacamata Pelindung (Safety Goggles) & Masker Partikel',
        detail: 'Wajib melindungi mata dari serpihan pahat plesteran dan paru-paru dari debu silika semen.',
        critical: true
      },
      {
        id: 'safe-rubber-gloves',
        text: 'Gunakan Sarung Tangan Karet Nitril / Tahan Bahan Kimia',
        detail: 'Cegah kontak langsung kulit dengan pasta semen basah yang bersifat korosif.',
        critical: true
      }
    ],
    tools: [
      { id: 't-roskam', name: 'Roskam Besi & Roskam Busa/Karet', required: true, specification: 'Bilah baja anti karat untuk meratakan acian' },
      { id: 't-cetok', name: 'Cetok / Sendok Semen Oval 6-7 Inch', required: true },
      { id: 't-pahat-palu', name: 'Pahat Beton & Palu 0.5 kg', required: true, specification: 'Untuk membuka alur retak' },
      { id: 't-kuas-air', name: 'Kuas Cat 3 Inch & Ember Cor', required: true, specification: 'Untuk membasahi alur retak dinding' },
      { id: 't-jidar', name: 'Jidar Aluminium / Kasur Perata 1.5 - 2 Meter', required: false, specification: 'Pemeriksa kedataran bidang' }
    ],
    materials: [
      { id: 'm-semen-pc', name: 'Semen Portland Komposit (PCC) 40/50 kg', defaultQty: 1, unit: 'sak', estimatedPriceUnit: 58000, sniStandard: 'SNI 2049:2015' },
      { id: 'm-pasir-pasang', name: 'Pasir Pasang Ayak Halus (Bebas Lumpur)', defaultQty: 2, unit: 'karung', estimatedPriceUnit: 18000, sniStandard: 'SNI 03-4142' },
      { id: 'm-semen-instan-aci', name: 'Semen Instan Acian Siap Pakai (Mortar)', defaultQty: 1, unit: 'sak 40kg', estimatedPriceUnit: 75000, sniStandard: 'SNI 8640' },
      { id: 'm-bonding-agent', name: 'Cairan Perekat Beton (Bonding Agent / Lem Calbond)', defaultQty: 1, unit: 'liter', estimatedPriceUnit: 48000 },
      { id: 'm-amplas-halus', name: 'Kertas Amplas Dinding No. 180 & 240', defaultQty: 3, unit: 'lembar', estimatedPriceUnit: 5000 }
    ],
    calculatorConfig: {
      formulaType: 'wall_plaster_ahsp',
      title: 'Kalkulator Kebutuhan Plester & Aci Dinding (SNI AHSP)',
      description: 'Menghitung volume kebutuhan zak semen, pasir pasang, dan semen acian berdasarkan luas dinding ($m^2$) dan tebal adukan standar SNI.',
      parameters: [
        { id: 'wall_area', label: 'Luas Dinding yang Diplester / Diaci ($m^2$)', min: 1, max: 100, step: 1, defaultValue: 12, unit: 'm²' },
        { id: 'plaster_thickness', label: 'Tebal Plesteran Standar SNI (mm)', min: 10, max: 25, step: 1, defaultValue: 15, unit: 'mm', tooltip: 'SNI 03-2835 menetapkan tebal standar 15 mm' },
        { id: 'mortar_ratio', label: 'Rasio Adukan (1=Kedap Air 1:3, 2=Standar 1:4, 3=Partisi 1:5)', min: 1, max: 3, step: 1, defaultValue: 2, unit: 'mode', tooltip: 'Pilih 2 untuk rasio standar 1 Semen : 4 Pasir' }
      ]
    },
    steps: [
      {
        stepNumber: 1,
        title: 'Identifikasi Retak & Pembukaan Celah Alur Huruf "V"',
        description: 'Periksa arah retak. Jika retak selebar > 1 mm, gunakan pahat pelat dan palu untuk memperlebar jalur retakan membentuk alur huruf "V" sedalam 1 - 1.5 cm. Trik ini memberi ruang cengkeraman mekanik bagi pasta tambalan baru.',
        schematicId: 'schematic-wall-crack-v',
        proTip: 'Jangan menambal langsung di atas retak tipis dengan semen atau dempul tanpa membuka alur V; tambalan akan terlepas kembali dalam hitungan minggu.',
        dangerWarning: 'Waspadai retak tembus diagonal yang lebar (> 5 mm) dari sudut kusen ke plafon; ini tanda penurunan pondasi struktur yang membutuhkan evaluasi arsitek/teknisi sipil.',
        checkItems: ['Alur retak dipahat berbentuk parit huruf V', 'Debu dan serpihan rontokan disikat bersih']
      },
      {
        stepNumber: 2,
        title: 'Pembersihan & Pembasahan Jenuh (Curing Awal)',
        description: 'Bersihkan semua debu dan butiran lepas menggunakan kuas basah. Semprotkan air bersih ke alur retak hingga dinding berada pada kondisi SSD (Saturated Surface Dry / jenuh air permukaan kering). Kuaskan larutan bonding agent perekat semen tipis-tipis.',
        sniNote: 'SNI Mensyaratkan bata/tembok wajib disiram jenuh sebelum diplester agar air adukan semen tidak diserap paksa oleh dinding bata kering.',
        checkItems: ['Permukaan lembap merata tanpa genangan air menetes', 'Bonding agent dioleskan merata']
      },
      {
        stepNumber: 3,
        title: 'Pengisian Plesteran Rasio SNI 1 PC : 4 PP',
        description: 'Campurkan 1 bagian semen Portland dengan 4 bagian pasir pasang halus yang sudah diayak. Tambahkan air secukupnya hingga pulen (slump kental). Masukkan adukan ke alur V menggunakan cetok sambil ditekan padat agar tidak berongga. Ratakan permukaan 1-2 mm di bawah level cat dinding lama.',
        schematicId: 'schematic-wall-crack-v',
        checkItems: ['Adukan padat tanpa rongga udara di dalam celah', 'Permukaan digores sedikit agar acian merekat kuat']
      },
      {
        stepNumber: 4,
        title: 'Aplikasi Acian Halus & Perataan Roskam Baja',
        description: 'Setelah plesteran mengeras (24-48 jam), basahi kembali permukaan. Gunakan semen instan acian yang diaduk rata tanpa gumpalan. Oleskan memakai roskam besi dari arah bawah ke atas dengan ketebalan 1.5 - 2 mm. Haluskan permukaan dengan gerakan memutar menggunakan roskam busa setengah lembap.',
        sniNote: 'Tebal acian standar SNI adalah 1.5 - 2 mm. Acian yang terlalu tebal (> 3 mm) rentan pecah seribu/retak susut.',
        checkItems: ['Acian merata rata dengan permukaan sekitarnya', 'Tidak ada gelombang saat dicek dengan jidar']
      },
      {
        stepNumber: 5,
        title: 'Perawatan (Curing) & Pengecatan Akhir',
        description: 'Percikkan air halus ke acian minimal sekali sehari selama 2-3 hari pertama agar proses hidrasi semen sempurna dan permukaan tidak berdebu. Tunggu dinding benar-benar kering (kadar air < 12% dan pH < 9, biasanya 7-14 hari) sebelum mengaplikasikan wall sealer / primer anti-alkali dan cat akhir.',
        checkItems: ['Acian keras, padat, dan tidak berbubuk saat diusap tangan', 'Siap dicat dasar primer anti-alkali']
      }
    ],
    diagrams: [
      {
        id: 'schematic-wall-crack-v',
        title: 'Diagram Penampang Pembukaan Alur V & Lapisan Plester Aci',
        description: 'Visualisasi sudut buka celah 45 derajat alur V, penetrasi bonding agent, dan lapisan plesteran semen SNI 1:4.',
        type: 'svg_schematic'
      }
    ]
  },

  {
    id: 'kns-02',
    slug: 'pemasangan-dinding-bata-ringan-hebel',
    title: 'Pemasangan Dinding Bata Ringan (Hebel) Presisi SNI',
    category: 'KNS',
    categoryName: 'Konstruksi & Dinding',
    difficulty: 'Menengah',
    durationMinutes: 120,
    overview: 'Teknik memasang bata ringan aerasi (AAC / Hebel) untuk partisi ruangan rumah. Menguasai pembuatan lapisan dasar adukan semen, penggunaan perekat mortar instan thinbed dengan roskam gerigi 6mm, dan pemasangan angkur dinding standar SNI 03-6882.',
    tags: ['Bata Ringan', 'Hebel', 'Mortar Thinbed', 'Roskam Gerigi', 'Dinding Partisi', 'SNI 8640'],
    sniStandards: [
      {
        code: 'SNI 03-6882-2014 & SNI 8640:2018',
        title: 'Spesifikasi Mortar Siap Pakai untuk Unit Pasangan Bata Ringan',
        summary: 'Ketebalan spesi mortar tipis (thinbed) pada sambungan hebel wajib berukuran 2 mm - 3 mm. Penggunaan roskam bergigi wajib untuk menjamin ketebalan merata.'
      }
    ],
    safetyHazards: [
      'Bata hebel yang jatuh dapat mencederai jari kaki.',
      'Debu pemotongan hebel dengan gergaji manual/mesin sangat halus dan berbahaya bagi sistem pernapasan.'
    ],
    mandatorySafetyChecklist: [
      {
        id: 'safe-hebel-ppe',
        text: 'Pakai Sepatu Safety / Tertutup & Masker Debu Respirator',
        detail: 'Lindungi kaki dari runtuhan blok bata dan paru-paru dari debu silica hebel.',
        critical: true
      }
    ],
    tools: [
      { id: 't-roskam-gerigi', name: 'Roskam Bergigi (Notched Trowel) 6mm', required: true, specification: 'Untuk meratakan ketebalan mortar thinbed 3mm' },
      { id: 't-waterpass-panjang', name: 'Waterpass Magnetik 60-100 cm', required: true, specification: 'Wajib untuk memastikan tegak vertikal & datar horizontal' },
      { id: 't-palu-karet', name: 'Palu Karet (Rubber Mallet)', required: true, specification: 'Untuk mengetok hebel tanpa memecahkan pori-pori' },
      { id: 't-gergaji-hebel', name: 'Gergaji Bata Ringan (Mata Baja Widia)', required: true },
      { id: 't-benang-lot', name: 'Benang Tukang & Unting-unting (Plumb Bob)', required: true }
    ],
    materials: [
      { id: 'm-hebel-75', name: 'Bata Ringan AAC Tebal 7.5 cm (60 x 20 x 7.5 cm)', defaultQty: 25, unit: 'buah', estimatedPriceUnit: 9000, sniStandard: 'SNI 03-6882' },
      { id: 'm-mortar-thinbed', name: 'Semen Mortar Instan Perekat Bata Ringan 40 kg', defaultQty: 1, unit: 'sak', estimatedPriceUnit: 72000, sniStandard: 'SNI 8640' },
      { id: 'm-plat-angkur', name: 'Plat Besi Strip / Angkur Dinding Hebel L-Bracket', defaultQty: 6, unit: 'buah', estimatedPriceUnit: 3500 },
      { id: 'm-paku-beton', name: 'Paku Beton 5 cm & Sekrup Fischer', defaultQty: 12, unit: 'buah', estimatedPriceUnit: 800 }
    ],
    calculatorConfig: {
      formulaType: 'hebel_aac_block',
      title: 'Kalkulator Bata Ringan (Hebel) & Semen Instan',
      description: 'Menghitung jumlah hebel yang dibutuhkan serta sak semen perekat thinbed sesuai luas ruangan.',
      parameters: [
        { id: 'wall_length', label: 'Panjang Dinding Partisi ($m$)', min: 1, max: 20, step: 0.5, defaultValue: 3.5, unit: 'm' },
        { id: 'wall_height', label: 'Tinggi Dinding ($m$)', min: 1, max: 5, step: 0.1, defaultValue: 2.8, unit: 'm' },
        { id: 'block_thickness', label: 'Ketebalan Bata Hebel (1=7.5 cm, 2=10 cm)', min: 1, max: 2, step: 1, defaultValue: 1, unit: 'tipe', tooltip: 'Pilih 1 untuk 7.5 cm (standar interior) atau 2 untuk 10 cm' }
      ]
    },
    steps: [
      {
        stepNumber: 1,
        title: 'Penentuan As Benang & Pasangan Lapisan Pertama (Kunci Utama)',
        description: 'Tarik benang lurus penanda garis dinding. Bersihkan lantai kerja. PERHATIAN: Baris bata pertama TIDAK menggunakan mortar thinbed, melainkan adukan semen pasir konvensional tebal 2-3 cm (rasio 1:3). Ini berfungsi meratakan ketidakrataan lantai dasar.',
        schematicId: 'schematic-hebel-mortar',
        proTip: 'Kunci kesuksesan dinding hebel ada pada baris pertama! Jika baris pertama miring 2 mm, baris ke-10 di atas akan miring hingga 3 cm. Luangkan waktu untuk menyetel waterpass baris pertama sesempurna mungkin.',
        checkItems: ['Garis benang siku terhadap dinding eksisting', 'Baris bata pertama rata air total diuji dengan waterpass']
      },
      {
        stepNumber: 2,
        title: 'Aplikasi Mortar Thinbed dengan Roskam Bergigi',
        description: 'Aduk semen mortar instan dengan air bersih sesuai rasio kemasan (kurang lebih 10 liter air per sak 40 kg). Gunakan roskam bergigi untuk menyapukan mortar secara horizontal sepanjang permukaan atas dan sambungan vertikal bata hebel dengan ketebalan 3 mm.',
        sniNote: 'SNI melarang adukan thinbed hebel dipasang bertumpuk tebal seperti pasir konvensional karena akan menyusut dan membuat dinding goyang.',
        checkItems: ['Adukan membentuk alur gerigi teratur', 'Sambungan vertikal antar bata terisi mortar penuh']
      },
      {
        stepNumber: 3,
        title: 'Pemasangan Bata Blok & Ketukan Palu Karet',
        description: 'Letakkan blok bata hebel di atas alur mortar. Ketok perlahan dengan palu karet hingga sejajar dengan tarikan benang panduan. Bersihkan lelehan mortar yang meluap ke samping sebelum mengeras. Pasang susunan bata berselang-seling (pola bata ikat / overlapping minimal 15-20 cm antar sambungan vertikal).',
        schematicId: 'schematic-hebel-mortar',
        checkItems: ['Bata diketok rapat dengan palu karet', 'Pola sambungan vertikal selang-seling (overlap > 15 cm)']
      },
      {
        stepNumber: 4,
        title: 'Pemasangan Angkur Pengikat ke Kolom Dinding',
        description: 'Setiap ketinggian 3 lapis bata (sekitar 60 cm), pasang plat besi angkur strip (L-bracket) yang dipaku beton ke kolom praktis/tembok lama dan disekrup ke bata hebel baru. Angkur ini mencegah dinding roboh akibat getaran gempa bumi.',
        sniNote: 'Standar Konstruksi Tahan Gempa PUPR mensyaratkan ikatan mekanik angkur besi minimal setiap 60 cm tinggi dinding bata.',
        checkItems: ['Plat angkur terpasang kencang ke dinding kolom', 'Tertanam rapi dalam alur mortar hebel']
      }
    ],
    diagrams: [
      {
        id: 'schematic-hebel-mortar',
        title: 'Diagram Pemasangan Hebel, Roskam Gerigi & Plat Angkur',
        description: 'Visualisasi pola susunan bata selang-seling, celah mortar 3mm, dan dudukan angkur penahan gempa.',
        type: 'svg_schematic'
      }
    ]
  },

  {
    id: 'kns-03',
    slug: 'pengecoran-kolom-praktis-beton-k175',
    title: 'Pengecoran Kolom Praktis & Sloof Beton Mutu K-175',
    category: 'KNS',
    categoryName: 'Konstruksi & Dinding',
    difficulty: 'Mahir',
    durationMinutes: 150,
    overview: 'Standar SNI 2847:2019 untuk membuat campuran adukan beton struktural rumah sederhana (sloof, kolom praktis $11 \times 11\text{ cm}$, dan balok latai). Menghitung rasio takaran ember 1:2:3, pembuatan selimut beton pelindung behel, serta teknik pemadatan anti-keropos.',
    tags: ['Cor Beton', 'Kolom Praktis', 'Beton K-175', 'Pembesian Behel', 'SNI 2847'],
    sniStandards: [
      {
        code: 'SNI 2847:2019 & SNI 6880:2016',
        title: 'Persyaratan Beton Struktural untuk Bangunan Gedung',
        clause: 'Mutu Beton K-175 / fc 14.5 MPa',
        summary: 'Perbandingan volume takaran lapangan setara K-175 adalah 1 Semen : 2 Pasir Cor : 3 Kerikil/Split pecah mesin. Selimut beton minimum 20 mm.'
      }
    ],
    safetyHazards: [
      'Besi beton tajam dapat menusuk kulit tangan atau robek terkena kawat bendrat.',
      'Semen cair basah bersifat kaustik menyebabkan luka bakar semen (cement burn) bila menembus sepatu.'
    ],
    mandatorySafetyChecklist: [
      {
        id: 'safe-concrete-boots',
        text: 'Wajib Memakai Sepatu Boots Karet & Sarung Tangan Kulit/Karet',
        detail: 'Cegah cipratan adukan semen masuk ke dalam sepatu dan luka tusuk kawat bendrat.',
        critical: true
      }
    ],
    tools: [
      { id: 't-cangkul-sekop', name: 'Cangkul & Sekop Baja', required: true },
      { id: 't-ember-cor', name: 'Ember Cor Standar (Volume 10 Liter)', required: true, specification: 'Sebagai takaran takar rasio 1:2:3' },
      { id: 't-tongkat-pemadat', name: 'Besi Pemadat / Tongkat Kayu Pengetuk', required: true, specification: 'Untuk memadatkan coran dalam bekisting agar tidak keropos' },
      { id: 't-tang-gegep', name: 'Tang Kakatua (Gegep Potong Kawat)', required: true }
    ],
    materials: [
      { id: 'm-semen-pcc-cor', name: 'Semen Portland PCC 50 kg', defaultQty: 2, unit: 'sak', estimatedPriceUnit: 68000, sniStandard: 'SNI 2049' },
      { id: 'm-pasir-beton', name: 'Pasir Cor Kasar Hitam (Bebas Lumpur/Organik)', defaultQty: 4, unit: 'karung', estimatedPriceUnit: 22000, sniStandard: 'SNI 03-4142' },
      { id: 'm-split-batu', name: 'Batu Split / Kerikil Pecah Mesin Ukuran 1-2 cm', defaultQty: 6, unit: 'karung', estimatedPriceUnit: 25000, sniStandard: 'SNI 03-2461' },
      { id: 'm-besi-tulangan', name: 'Besi Beton Polos dia. 8mm / 10mm SNI', defaultQty: 2, unit: 'batang', estimatedPriceUnit: 52000, sniStandard: 'SNI 2052' },
      { id: 'm-kawat-bendrat', name: 'Kawat Bendrat Pengikat Behel', defaultQty: 1, unit: 'kg', estimatedPriceUnit: 25000 },
      { id: 'm-tahu-beton', name: 'Tahu Beton (Spacer Selimut Beton 2 cm)', defaultQty: 10, unit: 'buah', estimatedPriceUnit: 1000 }
    ],
    calculatorConfig: {
      formulaType: 'concrete_k175_mix',
      title: 'Kalkulator Campuran Beton K-175 (SNI 2847)',
      description: 'Menghitung volume bahan adukan cor semen, pasir, dan kerikil berdasarkan dimensi panjang, lebar, dan tebal pengecoran.',
      parameters: [
        { id: 'concrete_length', label: 'Panjang Kolom / Balok ($m$)', min: 0.5, max: 20, step: 0.5, defaultValue: 3.0, unit: 'm' },
        { id: 'concrete_width', label: 'Lebar Kolom / Balok ($cm$)', min: 10, max: 40, step: 1, defaultValue: 15, unit: 'cm' },
        { id: 'concrete_thickness', label: 'Tebal / Tinggi Kolom ($cm$)', min: 10, max: 40, step: 1, defaultValue: 15, unit: 'cm' }
      ]
    },
    steps: [
      {
        stepNumber: 1,
        title: 'Pemasangan Tahu Beton (Spacer) untuk Selimut Beton 20 mm',
        description: 'Sebelum bekisting ditutup rapat, pasang "tahu beton" (ganjal mortar setebal 2 cm) di sekeliling rangka besi tulangan. Tahu beton menjaga agar besi behel tepat berada di tengah dan terlindungi selimut cor setebal 2 cm dari udara luar.',
        schematicId: 'schematic-concrete-mix',
        dangerWarning: 'JANGAN biarkan besi tulangan menempel langsung ke papan bekisting! Besi yang menempel ke permukaan luar akan berkarat dan merusak struktur dalam beberapa tahun.',
        checkItems: ['Tahu beton terpasang di 4 sisi behel', 'Jarak antar tahu beton maksimal 1 meter']
      },
      {
        stepNumber: 2,
        title: 'Pencampuran Kering Takaran SNI (1 Semen : 2 Pasir : 3 Split)',
        description: 'Gunakan ember cor yang sama sebagai acuan volume: Tuangkan 1 ember semen, 2 ember pasir cor kasar, dan 3 ember batu split. Aduk material kering tersebut dengan cangkul/sekop hingga warnanya homogen merata sebelum diberi air.',
        sniNote: 'Rasio 1:2:3 adalah standar perbandingan volume lapangan SNI untuk menghasilkan beton mutu K-175 (~14.5 MPa).',
        checkItems: ['Takaran diukur dengan ember cor seragam', 'Campuran kering tercampur rata tanpa kantong pasir terpisah']
      },
      {
        stepNumber: 3,
        title: 'Penambahan Air Terkontrol (Faktor Air Semen / FAS)',
        description: 'Buat cekungan di tengah tumpukan. Tuangkan air secara bertahap (kurang lebih 0.5 - 0.6 volume semen). Aduk cepat hingga menjadi pasta adukan beton yang kental. Jangan membuat adukan terlalu encer (banjir air) karena akan menurunkan kuat tekan beton hingga 40%.',
        checkItems: ['Adukan kental elastis (tidak cair seperti sup)', 'Batu split terlapisi pasta semen secara merata']
      },
      {
        stepNumber: 4,
        title: 'Pengecoran & Pemadatan Manual Anti Keropos (Sarang Tawon)',
        description: 'Tuangkan adukan beton ke dalam bekisting secara bertahap (setiap layer 30-40 cm). Tusuk-tusuk adukan dengan tongkat besi/kayu dan ketuk dinding luar bekisting dengan palu kayu agar udara terjebak keluar dan tidak terbentuk rongga keropos ("sarang tawon").',
        schematicId: 'schematic-concrete-mix',
        checkItems: ['Coran dipadatkan per lapisan', 'Dinding luar papan bekisting diketok merata']
      },
      {
        stepNumber: 5,
        title: 'Pembongkaran Bekisting & Perawatan Basah (Curing)',
        description: 'Bekisting samping dapat dilepas setelah minimal 24 - 48 jam. Segera lakukan curing dengan membasahi beton atau membungkusnya dengan karung goni basah selama 3-7 hari pertama agar hidrasi semen tuntas dan beton mencapai kekuatan maksimal.',
        checkItems: ['Beton mulus tanpa sarung tawon keropos', 'Beton disiram air minimal 2x sehari selama 3 hari']
      }
    ],
    diagrams: [
      {
        id: 'schematic-concrete-mix',
        title: 'Diagram Rasio Campuran 1:2:3 & Penampang Selimut Beton SNI',
        description: 'Visualisasi takaran ember proporsional semen:pasir:split serta posisi tahu beton spacer 20mm.',
        type: 'svg_schematic'
      }
    ]
  },

  {
    id: 'kns-04',
    slug: 'waterproofing-dak-beton-nok-genteng',
    title: 'Waterproofing Dak Beton & Nok Genteng Anti Rembes (SNI)',
    category: 'KNS',
    categoryName: 'Konstruksi & Dinding',
    difficulty: 'Menengah',
    durationMinutes: 100,
    overview: 'Metode teknis mengatasi rembesan dak beton talang air dan pertemuan wuwungan nok genteng saat musim hujan. Menerapkan pembuatan sudut lengkung chamfer 45°, penguatan serat kasa polyester mesh, dan pelapisan membran elastomerik 3 lapis silang.',
    tags: ['Waterproofing', 'Dak Bocor', 'Talang Beton', 'Nok Genteng', 'Kasa Fiber', 'SNI 03-6861'],
    sniStandards: [
      {
        code: 'SNI 03-6861.1-2002',
        title: 'Spesifikasi Bahan Bangunan Bagian A (Bahan Bangunan Bukan Logam)',
        summary: 'Aplikasi pelapis anti-bocor dak beton wajib diterapkan minimal 3 lapis sistem silang (cross-directional) dengan penguat serat kain polyester pada pertemuan sudut bidang 90 derajat.'
      }
    ],
    safetyHazards: [
      'Bekerja di area atap dak tinggi berisiko jatuh terpeleset bila permukaan berlumut dan licin.',
      'Paparan terik matahari langsung menyebabkan dehidrasi.'
    ],
    mandatorySafetyChecklist: [
      {
        id: 'safe-roof-harness',
        text: 'Pastikan Alas Sepatu Karet Tidak Licin & Siapkan Tangga Kokoh',
        detail: 'Cek kondisi pijakan atap dak, jangan bekerja saat kondisi mendung petir atau hujan.',
        critical: true
      }
    ],
    tools: [
      { id: 't-sikat-kawat', name: 'Sikat Kawat Baja & Kape Skrap', required: true, specification: 'Untuk mengelupas jamur & lumut kerak dak' },
      { id: 't-roll-kuas', name: 'Roll Cat Bulu Pendek & Kuas 3 Inch', required: true },
      { id: 't-gunting-kasa', name: 'Gunting Kasa Fiber', required: true }
    ],
    materials: [
      { id: 'm-waterproofing-liquid', name: 'Cairan Waterproofing Pelapis Elastomerik (Aquaproof / No Drop / Sika) 4 kg', defaultQty: 1, unit: 'pel', estimatedPriceUnit: 195000 },
      { id: 'm-polyester-mesh', name: 'Serat Kasa Penguat (Polyester Fiber Mesh) Lebar 10-15 cm', defaultQty: 1, unit: 'roll 10m', estimatedPriceUnit: 25000 },
      { id: 'm-semen-chamfer', name: 'Semen Pasir Instan Pembuat Sudut Fillet Chamfer', defaultQty: 1, unit: 'karung kecil', estimatedPriceUnit: 30000 }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Pembersihan Total Permukaan & Pengupasan Lumut',
        description: 'Kerok semua lapisan cat lama yang terkelupas, lumut, dan jamur memakai kape besi dan sikat kawat. Siram bersih dengan air dan tunggu hingga permukaan dak beton benar-benar kering. Cat anti-bocor tidak akan menempel pada beton yang berlumut atau berminyak.',
        checkItems: ['Beton bersih hingga pori-pori dasarnya terbuka', 'Permukaan bebas debu dan lumut hitam']
      },
      {
        stepNumber: 2,
        title: 'Pembuatan Sudut Lengkung Chamfer 45 Derajat pada Sudut 90°',
        description: 'Pertemuan sudut tajam 90° antara lantai dak dan dinding plint adalah titik nomor 1 penyebab sobeknya lapisan waterproofing! Buat adukan semen melengkung (chamfer / fillet 45 derajat selebar 3-5 cm) di sepanjang sudut tersebut sebelum pengecatan.',
        schematicId: 'schematic-waterproofing-plint',
        proTip: 'Sudut tumpul 45° mendistribusikan pergerakan muai-susut bangunan sehingga membran pelapis tidak pecah.',
        checkItems: ['Sudut mati 90 derajat sudah ditumpulkan dengan plesteran chamfer 45°']
      },
      {
        stepNumber: 3,
        title: 'Pelapisan Pertama (Primer) & Penempelan Serat Kasa Fiber Mesh',
        description: 'Aplikasikan lapisan pertama cairan waterproofing tanpa campuran air secara tebal pada area sudut dan retakan. Dalam kondisi cat masih basah, bentangkan serat kasa fiber mesh di atasnya dan tekan dengan kuas hingga serat tenggelam menyatu ke dalam cairan cat.',
        schematicId: 'schematic-waterproofing-plint',
        checkItems: ['Kasa fiber menempel rata tanpa gelembung udara atau kerutan']
      },
      {
        stepNumber: 4,
        title: 'Pelapisan Lapis 2 & Lapis 3 Pola Silang (Cross-Coat)',
        description: 'Tunggu lapis pertama mengering (sekitar 2-3 jam). Kuaskan lapisan kedua dengan arah melintang tegak lurus (90 derajat) terhadap arah lapisan pertama. Setelah kering, ulangi lapisan ketiga. Sistem silang ini menutup mikropori beton secara kedap air 100%.',
        sniNote: 'Standar pelapisan membran kedap air mensyaratkan ketebalan kering minimum 1 mm dengan pola silang.',
        checkItems: ['Ketiga lapisan diaplikasikan bersilang arah', 'Serat kasa tertutup sempurna tanpa bayangan putih terlihat']
      }
    ],
    diagrams: [
      {
        id: 'schematic-waterproofing-plint',
        title: 'Diagram Penampang Sudut Chamfer 45° & Lapisan Serat Fiber Mesh',
        description: 'Visualisasi fillet lengkung sudut dak dinding, lapisan primer basah, penanaman kasa polyester, dan lapisan topcoat.',
        type: 'svg_schematic'
      }
    ]
  }
];
```

---

## `KODE-03`: Skema Vektor SVG Konstruksi SNI
**File sasaran:** `src/components/SchematicViewer.vue` (tambahkan template SVG di dalam container `.svg-canvas-wrapper`)

```html
<!-- ======================================================== -->
<!-- SKEMA SVG 1: Buka Celah Alur V & Plester Aci (SNI 03-2835) -->
<!-- ======================================================== -->
<svg v-if="schematicId === 'schematic-wall-crack-v'" viewBox="0 0 700 360" class="diagram-svg">
  <defs>
    <linearGradient id="grad-brick" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#b45309" />
      <stop offset="100%" stop-color="#78350f" />
    </linearGradient>
    <linearGradient id="grad-plaster" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#94a3b8" />
      <stop offset="100%" stop-color="#64748b" />
    </linearGradient>
  </defs>

  <rect width="700" height="360" rx="12" fill="#0d1424" />

  <!-- Dinding Bata Eksisting -->
  <rect x="50" y="70" width="600" height="220" rx="6" fill="url(#grad-brick)" stroke="#d97706" stroke-width="2" />
  
  <!-- Lapisan Plesteran Lama -->
  <rect x="50" y="70" width="600" height="30" fill="url(#grad-plaster)" />
  <text x="70" y="90" fill="#f8fafc" font-size="12" font-weight="bold">Plesteran Lama</text>
  <text x="70" y="160" fill="#fed7aa" font-size="14" font-weight="bold">Dinding Bata / Hebel</text>

  <!-- Pola Celah V-Groove -->
  <polygon points="350,70 310,180 390,180" fill="#1e293b" stroke="#f59e0b" stroke-width="3" stroke-dasharray="4,4" />
  <polygon points="350,70 325,160 375,160" fill="#38bdf8" opacity="0.85" />

  <!-- Anotasi Panah & Teks -->
  <line x1="220" y1="120" x2="320" y2="120" stroke="#f8fafc" stroke-width="2" marker-end="url(#arrow)" />
  <text x="140" y="115" fill="#f8fafc" font-size="13" font-weight="bold">Alur Pahat "V" (45°)</text>
  <text x="140" y="132" fill="#94a3b8" font-size="11">Lebar 1.5 cm, Dalam 1.5 cm</text>

  <line x1="480" y1="120" x2="365" y2="120" stroke="#f59e0b" stroke-width="2" />
  <text x="490" y="115" fill="#f59e0b" font-size="13" font-weight="bold">Isian Plester SNI 1:4</text>
  <text x="490" y="132" fill="#94a3b8" font-size="11">+ Lem Bonding Agent Perekat</text>

  <!-- Lapisan Acian Luar -->
  <rect x="290" y="66" width="120" height="8" rx="2" fill="#34d399" />
  <text x="350" y="55" fill="#34d399" font-size="12" font-weight="bold" text-anchor="middle">Acian Tebal 1.5 - 2 mm</text>
</svg>

<!-- ======================================================== -->
<!-- SKEMA SVG 2: Pemasangan Hebel & Roskam Gerigi (SNI 03-6882)-->
<!-- ======================================================== -->
<svg v-if="schematicId === 'schematic-hebel-mortar'" viewBox="0 0 700 360" class="diagram-svg">
  <rect width="700" height="360" rx="12" fill="#0d1424" />

  <!-- Blok Bata Hebel Baris 1 -->
  <rect x="60" y="210" width="280" height="85" rx="4" fill="#334155" stroke="#94a3b8" stroke-width="2" />
  <rect x="350" y="210" width="290" height="85" rx="4" fill="#334155" stroke="#94a3b8" stroke-width="2" />
  <text x="200" y="260" fill="#f8fafc" font-size="14" font-weight="bold">Hebel Blok A</text>
  <text x="490" y="260" fill="#f8fafc" font-size="14" font-weight="bold">Hebel Blok B</text>

  <!-- Lapisan Mortar Thinbed Bergelombang Gerigi -->
  <path d="M 60 205 Q 80 198 100 205 T 140 205 T 180 205 T 220 205 T 260 205 T 300 205 T 340 205 T 380 205 T 420 205 T 460 205 T 500 205 T 540 205 T 580 205 T 620 205 T 640 205" fill="none" stroke="#f59e0b" stroke-width="6" stroke-linecap="round" />
  <text x="350" y="195" fill="#f59e0b" font-size="12" font-weight="bold" text-anchor="middle">Alur Mortar Thinbed 3 mm (Roskam Gerigi 6 mm)</text>

  <!-- Blok Bata Hebel Baris 2 (Pola Selang Seling / Overlap) -->
  <rect x="200" y="105" width="300" height="85" rx="4" fill="#475569" stroke="#cbd5e1" stroke-width="2" />
  <text x="350" y="155" fill="#f8fafc" font-size="14" font-weight="bold" text-anchor="middle">Hebel Blok C (Overlap min 15 cm)</text>

  <!-- Plat Angkur Dinding Besi -->
  <rect x="40" y="140" width="90" height="15" rx="2" fill="#ef4444" stroke="#f8fafc" stroke-width="1.5" />
  <circle cx="55" cy="147" r="4" fill="#f8fafc" />
  <text x="85" y="130" fill="#f87171" font-size="11" font-weight="bold">Plat Angkur L</text>
  <text x="85" y="170" fill="#94a3b8" font-size="10">Paku ke Kolom tiap 60 cm</text>
</svg>

<!-- ======================================================== -->
<!-- SKEMA SVG 3: Rasio Cor Beton K-175 & Selimut Beton SNI    -->
<!-- ======================================================== -->
<svg v-if="schematicId === 'schematic-concrete-mix'" viewBox="0 0 700 360" class="diagram-svg">
  <rect width="700" height="360" rx="12" fill="#0d1424" />

  <!-- Visual Proporsi 1 : 2 : 3 -->
  <g transform="translate(40, 50)">
    <!-- 1 Semen -->
    <rect x="10" y="40" width="60" height="80" rx="6" fill="#64748b" stroke="#f8fafc" stroke-width="1.5" />
    <text x="40" y="145" fill="#f8fafc" font-size="12" font-weight="bold" text-anchor="middle">1 Ember</text>
    <text x="40" y="160" fill="#cbd5e1" font-size="11" text-anchor="middle">Semen PC</text>

    <!-- Simbol Plus -->
    <text x="90" y="90" fill="#f59e0b" font-size="24" font-weight="bold">+</text>

    <!-- 2 Pasir -->
    <rect x="115" y="40" width="60" height="80" rx="6" fill="#d97706" />
    <rect x="185" y="40" width="60" height="80" rx="6" fill="#d97706" />
    <text x="180" y="145" fill="#f59e0b" font-size="12" font-weight="bold" text-anchor="middle">2 Ember</text>
    <text x="180" y="160" fill="#fed7aa" font-size="11" text-anchor="middle">Pasir Cor Kasar</text>

    <!-- Simbol Plus -->
    <text x="265" y="90" fill="#f59e0b" font-size="24" font-weight="bold">+</text>

    <!-- 3 Split -->
    <rect x="290" y="40" width="55" height="80" rx="6" fill="#475569" />
    <rect x="355" y="40" width="55" height="80" rx="6" fill="#475569" />
    <rect x="420" y="40" width="55" height="80" rx="6" fill="#475569" />
    <text x="382" y="145" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">3 Ember</text>
    <text x="382" y="160" fill="#bae6fd" font-size="11" text-anchor="middle">Batu Split 1-2 cm</text>
  </g>

  <!-- Penampang Kolom & Selimut Beton Tahu Beton (Kanan) -->
  <g transform="translate(520, 70)">
    <!-- Bekisting Luar -->
    <rect x="0" y="0" width="140" height="140" fill="#1e293b" stroke="#e2e8f0" stroke-width="3" />
    <text x="70" y="-10" fill="#94a3b8" font-size="11" text-anchor="middle">Papan Bekisting</text>

    <!-- Coran Beton Abu-abu -->
    <rect x="5" y="5" width="130" height="130" fill="#334155" />

    <!-- Sengkang Behel Tulangan -->
    <rect x="25" y="25" width="90" height="90" fill="none" stroke="#ef4444" stroke-width="4" rx="4" />
    <circle cx="25" cy="25" r="7" fill="#ef4444" />
    <circle cx="115" cy="25" r="7" fill="#ef4444" />
    <circle cx="25" cy="115" r="7" fill="#ef4444" />
    <circle cx="115" cy="115" r="7" fill="#ef4444" />

    <!-- Tahu Beton Spacer -->
    <rect x="5" y="60" width="20" height="20" fill="#34d399" />
    <text x="70" y="170" fill="#34d399" font-size="12" font-weight="bold" text-anchor="middle">Selimut Beton 20 mm</text>
    <text x="70" y="188" fill="#94a3b8" font-size="10" text-anchor="middle">(Ganjal Tahu Beton SNI)</text>
  </g>
</svg>

<!-- ======================================================== -->
<!-- SKEMA SVG 4: Sudut Chamfer 45° & Kasa Fiber Waterproofing  -->
<!-- ======================================================== -->
<svg v-if="schematicId === 'schematic-waterproofing-plint'" viewBox="0 0 700 360" class="diagram-svg">
  <rect width="700" height="360" rx="12" fill="#0d1424" />

  <!-- Dinding Tegak Vertikal & Lantai Dak Horizontal -->
  <polygon points="120,50 200,50 200,220 580,220 580,290 120,290" fill="#1e293b" stroke="#475569" stroke-width="3" />
  <text x="160" y="120" fill="#f8fafc" font-size="13" font-weight="bold">Dinding Plint</text>
  <text x="380" y="260" fill="#f8fafc" font-size="14" font-weight="bold">Lantai Plat Dak Beton</text>

  <!-- Chamfer / Fillet 45 Derajat (Plesteran Segitiga) -->
  <polygon points="200,170 200,220 250,220" fill="#f59e0b" stroke="#d97706" stroke-width="2" />
  <text x="260" y="185" fill="#f59e0b" font-size="12" font-weight="bold">Sudut Chamfer 45°</text>
  <text x="260" y="202" fill="#fed7aa" font-size="10">(Cegah Membran Pecah di Sudut 90°)</text>

  <!-- Serat Kasa Polyester Mesh (Garis Putus-Putus) -->
  <path d="M 195 120 L 195 170 L 250 225 L 360 225" fill="none" stroke="#38bdf8" stroke-width="4" stroke-dasharray="6,4" />
  <text x="365" y="150" fill="#38bdf8" font-size="12" font-weight="bold">Serat Kasa Polyester Mesh</text>
  <text x="365" y="167" fill="#94a3b8" font-size="10">Ditanam di antara lapis 1 & 2</text>

  <!-- Lapisan Topcoat Silang (Garis Biru Solid) -->
  <path d="M 190 90 L 190 170 L 255 230 L 440 230" fill="none" stroke="#059669" stroke-width="5" stroke-linecap="round" />
  <text x="445" y="210" fill="#34d399" font-size="12" font-weight="bold">Waterproofing 3 Lapis Silang</text>
</svg>
```

---

## `KODE-04`: Kalkulator Material SNI AHSP Terintegrasi
**File sasaran:** `src/components/MaterialCalculator.vue` (tambahkan blok logika komputasi pada `computed`)

```typescript
// Di dalam computed calculatedResults di MaterialCalculator.vue:

// ========================================================
// 1. FORMULA: PLES & ACI DINDING (SNI 03-2835 / AHSP PUPR)
// ========================================================
if (props.config.formulaType === 'wall_plaster_ahsp') {
  const area = Number(paramValues.wall_area || 12);
  const thickMm = Number(paramValues.plaster_thickness || 15);
  const thickM = thickMm / 1000;
  const ratioMode = Number(paramValues.mortar_ratio || 2); // 1=1:3, 2=1:4, 3=1:5

  // Koefisien SNI AHSP per m3 adukan plester:
  // Rasio 1:4 butuh ~6.24 sak semen (50kg) dan ~0.83 m3 pasir pasang
  const volumeM3 = area * thickM * 1.1; // 10% toleransi waste jatuh ke lantai
  let cementBags50kg = volumeM3 * 6.24;
  let sandM3 = volumeM3 * 0.83;

  if (ratioMode === 1) { // 1:3 (Kedap air)
    cementBags50kg = volumeM3 * 7.8;
    sandM3 = volumeM3 * 0.78;
  } else if (ratioMode === 3) { // 1:5
    cementBags50kg = volumeM3 * 5.1;
    sandM3 = volumeM3 * 0.88;
  }

  // Acian SNI: 3.25 kg semen / m2
  const acianSemenKg = area * 3.25;
  const acianBags40kg = Math.ceil(acianSemenKg / 40);

  const finalCementBags = Math.max(1, Math.ceil(cementBags50kg));
  const finalSandKarung = Math.max(2, Math.ceil(sandM3 * 25)); // 1 m3 ~ 25 karung

  const costCement = finalCementBags * 58000;
  const costSand = finalSandKarung * 18000;
  const costAcian = acianBags40kg * 75000;
  const totalCost = costCement + costSand + costAcian;

  return {
    items: [
      {
        name: 'Semen PC Plesteran (50 kg)',
        quantity: `${finalCementBags} Sak`,
        subtext: `Standar SNI Rasio 1:${ratioMode === 1 ? '3' : ratioMode === 3 ? '5' : '4'} tebal ${thickMm}mm`,
        estimatedCost: costCement
      },
      {
        name: 'Pasir Pasang Ayak Halus',
        quantity: `${finalSandKarung} Karung (${sandM3.toFixed(2)} m³)`,
        subtext: 'Bebas kandungan lumpur organik',
        estimatedCost: costSand
      },
      {
        name: 'Semen Instan Acian Siap Pakai (40 kg)',
        quantity: `${acianBags40kg} Sak`,
        subtext: `Menutup ${area} m² acian tebal 1.5-2 mm`,
        estimatedCost: costAcian
      }
    ],
    totalCost
  };
}

// ========================================================
// 2. FORMULA: BATA RINGAN HEBEL & THINBED (SNI 03-6882)
// ========================================================
if (props.config.formulaType === 'hebel_aac_block') {
  const length = Number(paramValues.wall_length || 3.5);
  const height = Number(paramValues.wall_height || 2.8);
  const thicknessType = Number(paramValues.block_thickness || 1); // 1=7.5cm, 2=10cm

  const areaM2 = length * height;
  // 1 m2 dinding bata hebel standar 60x20 cm butuh 8.33 keping
  const blocksNeeded = Math.ceil(areaM2 * 8.33 * 1.05); // + 5% toleransi potongan siku
  
  // Mortar thinbed butuh 4 kg / m2 (tebal 3 mm)
  const mortarKg = areaM2 * (thicknessType === 1 ? 4.0 : 4.8);
  const mortarBags40kg = Math.max(1, Math.ceil(mortarKg / 40));

  const pricePerBlock = thicknessType === 1 ? 9000 : 11500;
  const costBlocks = blocksNeeded * pricePerBlock;
  const costMortar = mortarBags40kg * 72000;
  const totalCost = costBlocks + costMortar;

  return {
    items: [
      {
        name: `Bata Ringan Hebel AAC (Tebal ${thicknessType === 1 ? '7.5' : '10'} cm)`,
        quantity: `${blocksNeeded} Keping (${(blocksNeeded / 111).toFixed(2)} m³)`,
        subtext: `Luas dinding ${areaM2.toFixed(1)} m² (termasuk toleransi 5%)`,
        estimatedCost: costBlocks
      },
      {
        name: 'Semen Mortar Thinbed Perekat (40 kg)',
        quantity: `${mortarBags40kg} Sak`,
        subtext: 'Aplikasi roskam bergigi ketebalan spesi 3 mm',
        estimatedCost: costMortar
      }
    ],
    totalCost
  };
}

// ========================================================
// 3. FORMULA: COR BETON MUTU K-175 (SNI 2847)
// ========================================================
if (props.config.formulaType === 'concrete_k175_mix') {
  const lenM = Number(paramValues.concrete_length || 3.0);
  const widthM = Number(paramValues.concrete_width || 15) / 100;
  const thickM = Number(paramValues.concrete_thickness || 15) / 100;

  const volumeM3 = lenM * widthM * thickM * 1.1; // + 10% susut bekisting

  // SNI K-175 per m3: Semen ~326 kg (~6.5 sak 50kg), Pasir ~760 kg (~0.54 m3), Split ~1029 kg (~0.76 m3)
  const cementBags50kg = Math.max(1, Math.ceil(volumeM3 * 6.5));
  const sandKarung = Math.max(2, Math.ceil(volumeM3 * 0.54 * 25));
  const splitKarung = Math.max(3, Math.ceil(volumeM3 * 0.76 * 25));

  const costCement = cementBags50kg * 68000;
  const costSand = sandKarung * 22000;
  const costSplit = splitKarung * 25000;
  const totalCost = costCement + costSand + costSplit;

  return {
    items: [
      {
        name: 'Semen Portland PCC 50 kg',
        quantity: `${cementBags50kg} Sak`,
        subtext: 'Takaran lapangan: 1 Bagian Ember',
        estimatedCost: costCement
      },
      {
        name: 'Pasir Cor Kasar Hitam',
        quantity: `${sandKarung} Karung`,
        subtext: 'Takaran lapangan: 2 Bagian Ember',
        estimatedCost: costSand
      },
      {
        name: 'Batu Split / Kerikil 1-2 cm',
        quantity: `${splitKarung} Karung`,
        subtext: 'Takaran lapangan: 3 Bagian Ember',
        estimatedCost: costSplit
      }
    ],
    totalCost
  };
}
```

---

## `KODE-05`: Kotak Perkakas Digital (Waterpass Giroskop & Ruler)
**File sasaran:** Komponen baru `src/components/HandymanToolsModal.vue`

```vue
<template>
  <div v-if="isOpen" class="pt-modal-overlay">
    <div class="pt-modal-card">
      <div class="modal-header">
        <div class="header-left">
          <span class="tool-badge">🛠️ Tooltukang Digital</span>
          <h3 class="modal-title">{{ activeTool === 'level' ? 'Waterpass Digital (Giroskop)' : 'Penggaris Kalibrasi Layar' }}</h3>
        </div>
        <button class="close-x-btn" @click="closeModal">✕</button>
      </div>

      <!-- Tab Switcher -->
      <div class="tool-tabs">
        <button :class="['tab-btn', { active: activeTool === 'level' }]" @click="activeTool = 'level'">
          ⚖️ Waterpass Digital
        </button>
        <button :class="['tab-btn', { active: activeTool === 'ruler' }]" @click="activeTool = 'ruler'">
          📏 Penggaris Layar (cm/mm)
        </button>
      </div>

      <div class="modal-body">
        <!-- 1. WATERPASS DIGITAL SPIRIT LEVEL -->
        <div v-if="activeTool === 'level'" class="level-tool-wrap">
          <div class="spirit-tube" :class="{ 'is-balanced': isBalanced }">
            <div class="center-target-zone"></div>
            <div class="spirit-bubble" :style="{ transform: `translate(${bubbleX}px, ${bubbleY}px)` }"></div>
          </div>

          <div class="level-readouts">
            <div class="readout-pill" :class="{ perfect: isBalanced }">
              <span class="readout-label">Kemiringan</span>
              <span class="readout-val">{{ currentPitch.toFixed(1) }}°</span>
            </div>
            <div class="readout-status">
              <span v-if="isBalanced" class="status-perfect">✓ Permukaan Rata Presisi (SNI)</span>
              <span v-else class="status-tilted">Kemiringan terdeteksi, sesuaikan bidang</span>
            </div>
          </div>
          <p class="tool-hint">Letakkan punggung ponsel Anda rata di atas permukaan balok, ambalan, atau pasangan bata.</p>
        </div>

        <!-- 2. PENGGARIS LAYAR (SCREEN RULER) -->
        <div v-else class="ruler-tool-wrap">
          <div class="screen-ruler">
            <div v-for="cm in 15" :key="cm" class="ruler-cm-mark">
              <span class="cm-label">{{ cm }}</span>
              <div class="mm-ticks">
                <span v-for="mm in 9" :key="mm" class="mm-tick" :class="{ 'half-cm': mm === 5 }"></span>
              </div>
            </div>
          </div>
          <p class="tool-hint">Tempelkan kepala baut, sekrup, atau mata bor pada skala di atas untuk mengukur diameter atau panjangnya secara langsung.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { NativeService } from '../services/native';

const props = defineProps<{ isOpen: boolean }>();
const emit = defineEmits<{ (e: 'close'): void }>();

const activeTool = ref<'level' | 'ruler'>('level');
const currentPitch = ref(0);
const bubbleX = ref(0);
const bubbleY = ref(0);

const isBalanced = computed(() => Math.abs(currentPitch.value) <= 0.8);

let hapticCooldown = false;

const handleOrientation = (event: DeviceOrientationEvent) => {
  const beta = event.beta || 0;   // Depan - Belakang (-180 to 180)
  const gamma = event.gamma || 0; // Kiri - Kanan (-90 to 90)

  currentPitch.value = gamma;
  bubbleX.value = Math.max(-110, Math.min(110, gamma * 2.5));
  bubbleY.value = Math.max(-25, Math.min(25, (beta - 45) * 1.5));

  if (isBalanced.value && !hapticCooldown) {
    NativeService.triggerHapticFeedback('success');
    hapticCooldown = true;
    setTimeout(() => { hapticCooldown = false; }, 1200);
  }
};

onMounted(() => {
  if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
    window.addEventListener('deviceorientation', handleOrientation);
  }
});

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('deviceorientation', handleOrientation);
  }
});

const closeModal = () => emit('close');
</script>

<style scoped>
.spirit-tube {
  width: 260px;
  height: 70px;
  background: #0f172a;
  border: 3px solid #334155;
  border-radius: 9999px;
  margin: 20px auto;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.spirit-tube.is-balanced {
  border-color: #059669;
  box-shadow: 0 0 15px rgba(5, 150, 105, 0.4);
}
.center-target-zone {
  width: 44px;
  height: 100%;
  border-left: 2px dashed #64748b;
  border-right: 2px dashed #64748b;
  position: absolute;
}
.spirit-bubble {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: radial-gradient(circle, #fde047 30%, #ca8a04 100%);
  box-shadow: inset 0 0 8px rgba(0,0,0,0.4);
  transition: transform 0.08s ease-out;
}
.is-balanced .spirit-bubble {
  background: radial-gradient(circle, #86efac 30%, #16a34a 100%);
}
.screen-ruler {
  display: flex;
  background: #fef08a;
  color: #713f12;
  border: 2px solid #ca8a04;
  border-radius: 8px;
  padding: 10px 4px;
  overflow-x: auto;
}
.ruler-cm-mark {
  flex: 0 0 38px; /* Kalibrasi ~1 cm pada layar rata-rata */
  border-left: 2px solid #713f12;
  height: 60px;
  position: relative;
  font-size: 11px;
  font-weight: bold;
  padding-left: 3px;
}
.mm-ticks {
  display: flex;
  justify-content: space-between;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}
.mm-tick {
  width: 1px;
  height: 8px;
  background: #a16207;
}
.mm-tick.half-cm {
  height: 16px;
  background: #713f12;
}
</style>
```

---

## `KODE-06`: Mode Suara Bebas Genggam (Hands-Free Voice Reader)
**File sasaran:** `src/views/ExecutionView.vue`

```typescript
// Tambahkan fungsi pembacaan suara Web Speech API di <script setup> ExecutionView.vue:

const isReadingVoice = ref(false);

const speakCurrentStep = () => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    alert('Perangkat Anda tidak mendukung fitur sintesis suara offline.');
    return;
  }

  // Hentikan jika sedang membaca
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
    isReadingVoice.value = false;
    return;
  }

  if (!currentStep.value) return;

  const textToRead = `Langkah ${currentStep.value.stepNumber}. ${currentStep.value.title}. ${currentStep.value.description}. ${
    currentStep.value.dangerWarning ? 'Perhatian Bahaya: ' + currentStep.value.dangerWarning : ''
  } ${currentStep.value.proTip ? 'Tips Tukang: ' + currentStep.value.proTip : ''}`;

  const utterance = new SpeechSynthesisUtterance(textToRead);
  utterance.lang = 'id-ID'; // Bahasa Indonesia
  utterance.rate = 0.95;    // Kecepatan tenang dan jelas

  utterance.onstart = () => { isReadingVoice.value = true; };
  utterance.onend = () => { isReadingVoice.value = false; };
  utterance.onerror = () => { isReadingVoice.value = false; };

  window.speechSynthesis.speak(utterance);
};
```

Pada template `ExecutionView.vue`, tambahkan tombol di samping judul langkah:
```html
<button class="voice-reader-btn" :class="{ 'is-active': isReadingVoice }" @click="speakCurrentStep">
  <span v-if="isReadingVoice">⏹️ Hentikan Suara</span>
  <span v-else>🔊 Bacakan Langkah (Tangan Kotor)</span>
</button>
```

---

## `KODE-07`: Dark Mode Toggle & UI Polish
**File sasaran:** `src/components/AppHeader.vue`

```vue
<template>
  <ion-header class="ion-no-border pt-app-header">
    <ion-toolbar>
      <div class="header-inner pt-container">
        <div class="brand-section" @click="goToHome">
          <div class="brand-icon">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
            </svg>
          </div>
          <div class="brand-text">
            <span class="brand-name">Paham<span class="brand-accent">Tukang</span></span>
            <span class="brand-sub">Standar SNI & DIY Offline</span>
          </div>
        </div>

        <div class="header-actions">
          <!-- Tombol Buka Toolkit Digital -->
          <button class="header-tool-btn" title="Buka Waterpass & Penggaris" @click="openToolsModal = true">
            🛠️ Toolkit
          </button>

          <!-- Toggle Dark / Light Theme -->
          <button class="theme-toggle-btn" :title="isDarkMode ? 'Beralih ke Tema Terang' : 'Beralih ke Tema Gelap'" @click="toggleTheme">
            {{ isDarkMode ? '☀️' : '🌙' }}
          </button>

          <div class="offline-badge" title="Aplikasi 100% berjalan tanpa koneksi internet">
            <span class="status-dot"></span>
            <span class="status-text">Offline SNI</span>
          </div>

          <slot name="actions"></slot>
        </div>
      </div>
    </ion-toolbar>

    <!-- Modal Tooltukang -->
    <HandymanToolsModal :is-open="openToolsModal" @close="openToolsModal = false" />
  </ion-header>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { IonHeader, IonToolbar } from '@ionic/vue';
import { useRouter } from 'vue-router';
import HandymanToolsModal from './HandymanToolsModal.vue';

const router = useRouter();
const isDarkMode = ref(false);
const openToolsModal = ref(false);

const goToHome = () => router.push('/home');

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  if (isDarkMode.value) {
    document.body.classList.add('dark-theme');
    localStorage.setItem('pt_theme', 'dark');
  } else {
    document.body.classList.remove('dark-theme');
    localStorage.setItem('pt_theme', 'light');
  }
};

onMounted(() => {
  const saved = localStorage.getItem('pt_theme');
  if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDarkMode.value = true;
    document.body.classList.add('dark-theme');
  }
});
</script>
```

---

## `KODE-08`: Salin Lembar Belanja Bahan Material (BOM Toko Bangunan)
**File sasaran:** `src/views/ProjectDetailView.vue`

```typescript
// Fungsi salin daftar belanja material ke clipboard untuk WhatsApp / SMS Toko Bangunan:
const copyShoppingListToClipboard = async () => {
  if (!project.value) return;

  let text = `*DAFTAR BELANJA MATERIAL - PAHAMTUKANG (STANDAR SNI)*\n`;
  text += `Proyek: ${project.value.title}\n`;
  text += `Tanggal: ${new Date().toLocaleDateString('id-ID')}\n`;
  text += `-------------------------------------------\n`;
  
  project.value.materials.forEach((m, idx) => {
    text += `${idx + 1}. ${m.name} - ${m.defaultQty} ${m.unit} (Estimasi Rp ${(m.estimatedPriceUnit * m.defaultQty).toLocaleString('id-ID')})\n`;
    if (m.sniStandard) text += `   [Standar: ${m.sniStandard}]\n`;
  });

  const totalEst = project.value.materials.reduce((acc, cur) => acc + (cur.defaultQty * cur.estimatedPriceUnit), 0);
  text += `-------------------------------------------\n`;
  text += `*Total Estimasi Anggaran: Rp ${totalEst.toLocaleString('id-ID')}*\n`;
  text += `_Disusun otomatis melalui aplikasi PahamTukang Offline_\n`;

  try {
    await navigator.clipboard.writeText(text);
    alert('✓ Daftar belanja berhasil disalin! Anda bisa langsung menempelkannya (paste) ke WhatsApp toko bangunan.');
  } catch {
    // Fallback prompt
    prompt('Salin teks daftar belanja di bawah ini:', text);
  }
};
```

---

## Panduan Pengujian & Verifikasi

Setelah kode dieksekusi, verifikasi aplikasi dengan langkah berikut:
1. Jalankan `npm run build` untuk memastikan tipe data TypeScript dan template Vue tervalidasi bersih tanpa eror.
2. Buka browser pada `http://localhost:5173`.
3. Klik kategori baru **"🧱 Konstruksi (KNS)"** di beranda.
4. Buka panduan **"Perbaikan Retak Dinding"** atau **"Dinding Hebel"**, lalu uji:
   - Kalkulator SNI AHSP (geser luas $m^2$ untuk melihat kebutuhan sak semen dan hebel).
   - Skema SVG teknik alur huruf V dan penampang adukan thinbed.
   - Uji tombol **"Bacakan Langkah"** pada mode eksekusi.
   - Uji tombol **"Toolkit"** untuk memeriksa Waterpass Giroskop dan Penggaris Kalibrasi Layar.
