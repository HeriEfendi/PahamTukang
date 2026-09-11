import { DIYProject } from '../types';

export const INITIAL_PROJECTS: DIYProject[] = [
  {
    id: 'lst-01',
    slug: 'instalasi-saklar-tunggal',
    title: 'Instalasi Saklar Tunggal & Fitting Lampu',
    category: 'LST',
    categoryName: 'Kelistrikan',
    difficulty: 'Pemula',
    durationMinutes: 45,
    overview: 'Panduan lengkap memasang saklar tunggal untuk mengontrol 1 titik lampu. Membahas jalur fasa (hitam/cokelat), netral (biru), inbow doos, dan standar keselamatan pemutusan arus MCB.',
    tags: ['Saklar', 'Lampu', 'Kabel NYM', 'Kelistrikan Dasar', 'MCB'],
    safetyHazards: [
      'Bahaya sengatan listrik bertegangan 220V AC jika MCB tidak dimatikan.',
      'Risiko korsleting / hubung singkat jika kabel fasa bersentuhan langsung dengan netral.',
      'Percikan api pada terminal kendor saat saklar diberi beban listrik.'
    ],
    mandatorySafetyChecklist: [
      {
        id: 'safe-mcb-off',
        text: 'Matikan MCB Utama di kWh Meter / Box Panel',
        detail: 'Turunkan tuas MCB ke posisi OFF (0). Jangan hanya mematikan saklar lama, tetapi MCB sumber.',
        critical: true
      },
      {
        id: 'safe-tespen-check',
        text: 'Uji Semua Kabel dengan Tespen Indikator',
        detail: 'Sentuhkan ujung tespen ke ujung tembaga kawat fasa dan netral. Pastikan lampu tespen SAMA SEKALI TIDAK MENYALA.',
        critical: true
      },
      {
        id: 'safe-insulated-shoes',
        text: 'Gunakan Sandal/Sepatu Karet & Alas Kering',
        detail: 'Hindari bekerja di lantai basah. Pastikan tubuh terisolasi dari grounding lantai.',
        critical: false
      }
    ],
    tools: [
      { id: 't-tespen', name: 'Tespen AC 220V', required: true, specification: '100V - 500V indikator neon/digital' },
      { id: 't-obeng-plus', name: 'Obeng Plus (+) & Minus (-) Terisolasi', required: true, specification: 'Pegangan karet isolasi 1000V' },
      { id: 't-tang-kupas', name: 'Tang Pengupas & Pemotong Kabel', required: true, specification: 'Ukuran 1.5mm - 2.5mm' },
      { id: 't-tang-kombinasi', name: 'Tang Kombinasi Karet', required: false, specification: 'Untuk memilin kawat tembaga' },
      { id: 't-tangga', name: 'Tangga Lipat Aluminium / Kayu', required: true, specification: 'Kering dan stabil' }
    ],
    materials: [
      { id: 'm-saklar', name: 'Saklar Tunggal (Inbow)', defaultQty: 1, unit: 'buah', estimatedPriceUnit: 18000, note: 'SNI (Broco/Panasonic/Schneider)' },
      { id: 'm-inbow', name: 'Inbow Doos (Mangkok Saklar)', defaultQty: 1, unit: 'buah', estimatedPriceUnit: 4000, note: 'Tanam di dinding bata' },
      { id: 'm-fitting', name: 'Fitting Lampu Tempel Plafon', defaultQty: 1, unit: 'buah', estimatedPriceUnit: 15000, note: 'Tipe E27 standar' },
      { id: 'm-kabel', name: 'Kabel NYM 2 x 1.5 mm²', defaultQty: 5, unit: 'meter', estimatedPriceUnit: 9000, note: 'Tembaga tunggal isi 2 kawat' },
      { id: 'm-isolasi', name: 'Isolasi Listrik Vinyl (Unibel/Nitto)', defaultQty: 1, unit: 'roll', estimatedPriceUnit: 8000, note: 'Tahan panas SNI' },
      { id: 'm-lampu', name: 'Lampu LED Bulbs E27 9W-12W', defaultQty: 1, unit: 'buah', estimatedPriceUnit: 25000, note: 'Cahaya warm / cool white' }
    ],
    calculatorConfig: {
      formulaType: 'electrical_cable',
      title: 'Kalkulator Jalur Kabel & Konduit',
      description: 'Hitung kebutuhan panjang kabel tembaga, pipa konduit pelindung, dan klem berdasarkan jarak titik saklar ke plafon dan lampu.',
      parameters: [
        { id: 'distance_switch_ceiling', label: 'Tinggi Saklar ke Plafon', min: 1, max: 4, step: 0.5, defaultValue: 1.5, unit: 'meter', tooltip: 'Jarak vertikal dari posisi saklar dinding ke atas plafon' },
        { id: 'distance_ceiling_lamp', label: 'Jarak Plafon ke Titik Lampu', min: 1, max: 15, step: 0.5, defaultValue: 3.0, unit: 'meter', tooltip: 'Jarak horizontal di atas plafon ke titik tengah lampu' },
        { id: 'extra_allowance_percent', label: 'Toleransi Lekukan & Kupasan', min: 10, max: 25, step: 5, defaultValue: 15, unit: '%', tooltip: 'Cadangan kawat untuk sambungan tee-dos dan inbow' }
      ]
    },
    steps: [
      {
        stepNumber: 1,
        title: 'Pemutusan Arus & Konfirmasi Nol Tegangan',
        description: 'Turunkan tuas MCB di box sekring utama ke posisi 0/OFF. Buka penutup saklar lama (jika ada) atau tes kabel instalasi menggunakan tespen. Tempelkan ujung jari pada tutup logam tespen dan sentuhkan ke tembaga kabel. Pastikan lampu tespen mati total.',
        schematicId: 'schematic-switch-single',
        proTip: 'Jika Anda tinggal di rumah kontrakan tanpa denah panel yang jelas, nyalakan lampu utama terlebih dahulu sebelum mematikan MCB, lalu pastikan lampu tersebut mati saat tuas diturunkan.',
        dangerWarning: 'JANGAN PERNAH menyentuh kawat tembaga dengan jari kosong sebelum tespen mengonfirmasi tidak ada arus mengalir!',
        checkItems: ['MCB dalam posisi OFF', 'Tespen sudah diuji pada stop kontak aktif lalu diuji ke kabel target (nol volt)', 'Lingkungan kerja kering']
      },
      {
        stepNumber: 2,
        title: 'Penarikan & Pengupasan Kabel NYM',
        description: 'Tarik kabel NYM 2 x 1.5 mm² dari jalur sumber (T-Dos plafon) turun ke mangkok saklar (inbow doos). Kupas kulit luar putih kabel sepanjang 7 cm, lalu kupas isolasi kawat hitam (fasa) dan kawat biru (netral) sepanjang 1.2 cm menggunakan tang pengupas.',
        schematicId: 'schematic-switch-single',
        proTip: 'Jangan melukai tembaga saat mengupas isolasi karena tembaga yang tergores rentan patah saat ditekuk ke dalam mangkok saklar.',
        checkItems: ['Kabel masuk ke dalam inbow doos dengan sisa cadangan 8-10 cm', 'Kupasan tembaga bersih tanpa goresan dalam']
      },
      {
        stepNumber: 3,
        title: 'Penyambungan Jalur Saklar (Hanya Putus Fasa)',
        description: 'PERHATIAN ATURAN SNI: Saklar hanya boleh memutus kawat FASA (berarus). Masukkan kawat fasa dari sumber utama (biasanya hitam/cokelat) ke terminal INPUT saklar (biasanya bertanda merah/angka 1). Masukkan kawat fasa keluaran menuju lampu ke terminal OUTPUT saklar. Kencangkan baut terminal atau tekan pengunci Quick-Connect hingga kawat terkunci kuat.',
        schematicId: 'schematic-switch-single',
        proTip: 'Kawat Netral (biru) dari sumber TIDAK MASUK ke saklar! Netral langsung disambung di T-dos atas plafon menuju fitting lampu.',
        dangerWarning: 'Jika Anda memasang kawat netral ke saklar dan kawat fasa langsung ke lampu, fitting lampu akan tetap bertegangan 220V meskipun saklar posisi mati! Ini penyebab fatal tersetrum saat ganti bohlam.',
        checkItems: ['Terminal saklar hanya menerima kawat fasa', 'Baut terminal terkunci kencang dan tidak goyang saat ditarik perlahan']
      },
      {
        stepNumber: 4,
        title: 'Pemasangan Fitting Lampu Plafon',
        description: 'Di titik plafon, sambungkan kawat fasa keluaran saklar ke terminal lidah tengah fitting (center contact). Sambungkan kawat netral (biru) dari T-dos sumber ke terminal ulir (drat samping) fitting. Pasang tutup fitting dengan sekrup plafon.',
        schematicId: 'schematic-switch-single',
        proTip: 'Memasang fasa ke lidah tengah memastikan bagian drat ulir fitting aman dari sengatan saat Anda memutar bohlam.',
        checkItems: ['Lidah tengah terhubung ke kabel saklar', 'Bagian ulir luar terhubung ke netral sumber', 'Fitting menempel kokoh pada plafon']
      },
      {
        stepNumber: 5,
        title: 'Pemasangan Frame Saklar & Pengujian Akhir',
        description: 'Rapikan tekukan kabel ke dalam inbow doos secara perlahan berbentuk zigzag. Kencangkan 2 cakar baut samping saklar hingga menjepit dinding inbow dengan rata dan tegak. Pasang cover plate saklar hingga berbunyi klik. Pasang bohlam LED pada fitting.',
        schematicId: 'schematic-switch-single',
        proTip: 'Nyalakan kembali MCB utama. Tekan saklar ke posisi ON. Lampu harus menyala terang tanpa kedip ataupun bunyi mendesis pada saklar.',
        checkItems: ['Frame saklar rata dengan permukaan dinding', 'MCB dinaikkan ke posisi ON', 'Lampu menyala dengan normal saat saklar ditekan']
      }
    ],
    diagrams: [
      {
        id: 'schematic-switch-single',
        title: 'Skema Pengkabelan Saklar Tunggal Standar PUIL',
        description: 'Jalur kabel fasa (merah/hitam) melewati saklar, sedangkan jalur netral (biru) langsung ke lampu.',
        type: 'svg_schematic'
      }
    ]
  },
  {
    id: 'lst-02',
    slug: 'pasang-stop-kontak-arde',
    title: 'Pemasangan Stop Kontak Baru dengan Jalur Arde (Grounding)',
    category: 'LST',
    categoryName: 'Kelistrikan',
    difficulty: 'Menengah',
    durationMinutes: 60,
    overview: 'Instalasi stop kontak dinding 3 kutub standar PLN (Fasa, Netral, dan Arde/Ground). Sangat penting untuk peralatan bermotor/logam seperti kulkas, mesin cuci, dan PC agar tidak menyengat.',
    tags: ['Stop Kontak', 'Grounding', 'Arde', 'Kabel NYM 3 Kawat', 'Anti Nyetrum'],
    safetyHazards: [
      'Bodi kulkas/PC dapat menyengat jika arde tidak tersambung ke grounding tanah.',
      'Sengatan 220V jika salah mengenali fasa dan netral tanpa tespen.',
      'Terminal kendor dapat memicu panas tinggi dan melelehkan stop kontak.'
    ],
    mandatorySafetyChecklist: [
      {
        id: 'safe-mcb-power',
        text: 'Matikan MCB Khusus Jalur Stop Kontak (atau MCB Pusat)',
        detail: 'Pastikan jalur stop kontak padam total sebelum membuka instalasi.',
        critical: true
      },
      {
        id: 'safe-tespen-3-wire',
        text: 'Periksa Ketiga Kawat (Hitam, Biru, Kuning-Hijau) Bebas Tegangan',
        detail: 'Gunakan tespen untuk memvalidasi tidak ada arus bocor pada kabel target.',
        critical: true
      }
    ],
    tools: [
      { id: 't-tespen', name: 'Tespen AC 220V', required: true },
      { id: 't-obeng-plus', name: 'Obeng Plus & Minus Terisolasi', required: true },
      { id: 't-tang-kupas', name: 'Tang Kupas Kabel 2.5mm²', required: true },
      { id: 't-waterpass', name: 'Waterpass Saku (Level)', required: false, specification: 'Agar stop kontak terpasang lurus presisi' }
    ],
    materials: [
      { id: 'm-sk-arde', name: 'Stop Kontak Arde Inbow (3 Pin Schuko)', defaultQty: 1, unit: 'buah', estimatedPriceUnit: 22000, note: 'Standar SNI berkuping arde samping' },
      { id: 'm-inbow', name: 'Inbow Doos', defaultQty: 1, unit: 'buah', estimatedPriceUnit: 4000 },
      { id: 'm-kabel-3', name: 'Kabel NYM 3 x 2.5 mm²', defaultQty: 4, unit: 'meter', estimatedPriceUnit: 16000, note: 'Wajib minimal 2.5mm² untuk stop kontak sesuai PUIL' }
    ],
    calculatorConfig: {
      formulaType: 'electrical_cable',
      title: 'Kalkulator Kabel Stop Kontak (3 Kawat)',
      description: 'Menghitung panjang kabel NYM 3x2.5mm² dari jalur utama ke titik stop kontak.',
      parameters: [
        { id: 'distance_switch_ceiling', label: 'Tinggi Stop Kontak ke Plafon', min: 1.5, max: 4.5, step: 0.5, defaultValue: 2.5, unit: 'meter', tooltip: 'Tinggi stop kontak dari lantai biasanya 30-150 cm' },
        { id: 'distance_ceiling_lamp', label: 'Jarak ke T-Dos Induk', min: 1, max: 20, step: 1, defaultValue: 4, unit: 'meter' },
        { id: 'extra_allowance_percent', label: 'Toleransi Sambungan', min: 10, max: 25, step: 5, defaultValue: 15, unit: '%' }
      ]
    },
    steps: [
      {
        stepNumber: 1,
        title: 'Pastikan MCB Padam & Persiapan Jalur',
        description: 'Turunkan tuas MCB. Siapkan lubang inbow doos pada dinding bata atau gypsum. Masukkan kabel NYM 3x2.5mm² ke dalam pipa pelindung konduit menuju inbow doos.',
        checkItems: ['MCB posisi OFF', 'Kabel NYM 3 kawat sudah ditarik ke inbow doos']
      },
      {
        stepNumber: 2,
        title: 'Mengenali Kode Warna Kawat Sesuai Standar PUIL',
        description: 'Kupas selubung putih kabel sepanjang 6 cm. Anda akan melihat 3 kawat: Cokelat/Hitam (Fasa aktif 220V), Biru (Netral nol), dan Kuning-Hijau bergaris (Arde / Grounding pengaman). Kupas ujung kawat tembaga 1 cm.',
        schematicId: 'schematic-socket-ground',
        proTip: 'Jangan pernah menukar kawat kuning-hijau dengan kawat fasa! Kawat kuning-hijau WAJIB tersambung ke terminal penjepit arde.',
        checkItems: ['3 kawat diidentifikasi dengan benar', 'Kupasan tembaga lurus dan bersih']
      },
      {
        stepNumber: 3,
        title: 'Penyambungan Terminal Stop Kontak',
        description: 'Sambungkan kawat Kuning-Hijau (Arde) ke terminal TENGAH yang memiliki lambang Ground (⏚) atau terhubung ke lidah logam Schuko samping. Sambungkan kawat Cokelat (Fasa) ke terminal kiri/kanan, dan kawat Biru (Netral) ke terminal seberangnya. Kencangkan baut pengunci sekencang mungkin.',
        schematicId: 'schematic-socket-ground',
        dangerWarning: 'Kekendoran baut terminal pada stop kontak adalah penyebab no. 1 stop kontak hangus terbakar saat dipasangi beban tinggi seperti setrika atau microwave.',
        checkItems: ['Arde terpasang pada terminal tengah berlambang ground', 'Fasa dan netral terpasang pada kutub soket utama', 'Semua baut dikencangkan maksimal']
      },
      {
        stepNumber: 4,
        title: 'Pemasangan Cover & Verifikasi Voltase',
        description: 'Tekuk kabel ke dalam inbow doos, pasang cakar stop kontak, cek kelurusan dengan waterpass, dan kencangkan baut pengikat. Pasang cover luar. Nyalakan MCB, lalu uji dengan tespen: hanya satu lubang yang menyalakan tespen (lubang fasa), lubang netral dan lidah arde harus MATI total.',
        checkItems: ['Posisi stop kontak tegak lurus', 'Uji tespen menunjukkan hanya fasa yang menyala', 'Lidah arde samping bebas arus bocor']
      }
    ],
    diagrams: [
      {
        id: 'schematic-socket-ground',
        title: 'Skema Stop Kontak 3 Kutub Berarde',
        description: 'Koneksi fasa, netral, dan pengaman arde grounding sesuai standar SNI / PUIL.',
        type: 'svg_schematic'
      }
    ]
  },
  {
    id: 'lst-03',
    slug: 'saklar-ganda-seri-2-lampu',
    title: 'Instalasi Saklar Ganda / Seri (2 Titik Lampu)',
    category: 'LST',
    categoryName: 'Kelistrikan',
    difficulty: 'Menengah',
    durationMinutes: 50,
    overview: 'Cara memasang saklar ganda (2 tombol) untuk mengontrol 2 buah lampu terpisah dari satu titik dinding, lengkap dengan teknik jumper kabel fasa.',
    tags: ['Saklar Seri', 'Saklar Ganda', '2 Titik Lampu', 'Jumper Fasa'],
    safetyHazards: [
      'Tersengat 220V saat menyambung jumper fasa jika MCB belum mati.',
      'Lampu tidak menyala jika salah memasukkan jumper ke terminal beban.'
    ],
    mandatorySafetyChecklist: [
      {
        id: 'safe-mcb-double',
        text: 'Matikan Sumber Listrik dari MCB Utama',
        detail: 'Pastikan tidak ada arus yang masuk ke box saklar dinding.',
        critical: true
      },
      {
        id: 'safe-tespen-double',
        text: 'Cek Jalur Input Fasa Bebas Tegangan',
        detail: 'Uji kabel sumber dengan tespen sebelum memulai.',
        critical: true
      }
    ],
    tools: [
      { id: 't-tespen', name: 'Tespen AC 220V', required: true },
      { id: 't-obeng-plus', name: 'Obeng Plus & Minus', required: true },
      { id: 't-tang-kupas', name: 'Tang Kupas & Potong', required: true }
    ],
    materials: [
      { id: 'm-saklar-ganda', name: 'Saklar Ganda / Seri Inbow', defaultQty: 1, unit: 'buah', estimatedPriceUnit: 28000 },
      { id: 'm-inbow', name: 'Inbow Doos', defaultQty: 1, unit: 'buah', estimatedPriceUnit: 4000 },
      { id: 'm-kabel-jumper', name: 'Kawat Jumper Fasa 1.5mm²', defaultQty: 1, unit: 'potong (8cm)', estimatedPriceUnit: 1000 },
      { id: 'm-kabel', name: 'Kabel NYM 3 x 1.5 mm²', defaultQty: 6, unit: 'meter', estimatedPriceUnit: 12000 }
    ],
    calculatorConfig: {
      formulaType: 'electrical_cable',
      title: 'Kalkulator Kabel Saklar Ganda',
      description: 'Menghitung total kabel dari saklar seri menuju 2 titik lampu.',
      parameters: [
        { id: 'distance_switch_ceiling', label: 'Tinggi Saklar ke Plafon', min: 1, max: 4, step: 0.5, defaultValue: 1.5, unit: 'meter' },
        { id: 'distance_ceiling_lamp', label: 'Total Jarak ke Kedua Titik Lampu', min: 2, max: 20, step: 1, defaultValue: 6, unit: 'meter' },
        { id: 'extra_allowance_percent', label: 'Toleransi Lekukan & Cabang', min: 10, max: 25, step: 5, defaultValue: 15, unit: '%' }
      ]
    },
    steps: [
      {
        stepNumber: 1,
        title: 'Pahami Konsep Jumper Fasa Saklar Seri',
        description: 'Saklar seri memiliki 2 pasang terminal: Tombol A dan Tombol B. Kedua tombol memerlukan arus masukan fasa dari sumber yang sama. Oleh karena itu, kita membuat sepotong kawat pendek (jumper) untuk menghubungkan terminal Input A ke Input B.',
        schematicId: 'schematic-switch-double',
        proTip: 'Banyak saklar modern (seperti Panasonic Wide Series) sudah memiliki plat jumper internal terintegrasi, periksa diagram di bagian belakang body saklar.',
        checkItems: ['MCB padam', 'Kawat jumper 1.5mm² disiapkan']
      },
      {
        stepNumber: 2,
        title: 'Pemasangan Fasa Sumber & Jumper',
        description: 'Masukkan kawat fasa dari MCB ke terminal Input 1 (tanda merah). Pasang kawat jumper dari Input 1 menuju Input 2. Pastikan kedua input kini dialiri fasa yang sama.',
        schematicId: 'schematic-switch-double',
        checkItems: ['Fasa sumber terhubung ke Input 1', 'Jumper menghubungkan Input 1 dan Input 2']
      },
      {
        stepNumber: 3,
        title: 'Penyambungan Kabel Output ke Lampu 1 & Lampu 2',
        description: 'Kawat keluaran dari Output 1 dihubungkan ke kabel yang menuju Lampu 1. Kawat keluaran dari Output 2 dihubungkan ke kabel yang menuju Lampu 2. Netral dari kedua lampu disatukan di T-dos atas plafon.',
        schematicId: 'schematic-switch-double',
        checkItems: ['Output 1 ke Lampu 1', 'Output 2 ke Lampu 2', 'Baut pengunci dikencangkan']
      },
      {
        stepNumber: 4,
        title: 'Pengujian Tombol Independen',
        description: 'Rapikan saklar ke dinding dan nyalakan MCB. Uji saklar: Tombol 1 harus menyalakan Lampu 1 saja, dan Tombol 2 harus menyalakan Lampu 2 saja tanpa saling mempengaruhi.',
        checkItems: ['Lampu 1 menyala terpisah', 'Lampu 2 menyala terpisah', 'Tidak ada korsleting']
      }
    ],
    diagrams: [
      {
        id: 'schematic-switch-double',
        title: 'Skema Jumper Saklar Ganda / Seri',
        description: 'Jalur jumper fasa ke 2 terminal input dan 2 jalur output terpisah.',
        type: 'svg_schematic'
      }
    ]
  },
  {
    id: 'san-01',
    slug: 'ganti-kran-bocor',
    title: 'Mengatasi & Mengganti Kran Wastafel/Dapur Bocor',
    category: 'SAN',
    categoryName: 'Sanitasi & Pipa',
    difficulty: 'Pemula',
    durationMinutes: 30,
    overview: 'Solusi mengatasi kran menetes atau drat rembes air. Panduan lengkap teknik lilitan seal tape PTFE yang benar (searah jarum jam) agar sambungan kedap air 100% tanpa bocor.',
    tags: ['Kran Air', 'Seal Tape', 'Wastafel', 'Pipa Air', 'Plumbing'],
    safetyHazards: [
      'Banjir dalam rumah jika stop kran / kran induk tidak ditutup sebelum melepas kran lama.',
      'Drat pipa di dalam dinding patah jika diputar terlalu dipaksa dengan kunci yang salah.'
    ],
    mandatorySafetyChecklist: [
      {
        id: 'safe-water-main-off',
        text: 'Tutup Stop Kran Induk / Matikan Pompa Air',
        detail: 'Putar katup stop kran utama rumah atau matikan saklar pompa air toren.',
        critical: true
      },
      {
        id: 'safe-drain-residual',
        text: 'Buka Kran Terendah untuk Buang Sisa Air Jalur Pipa',
        detail: 'Buka kran lama untuk menguras sisa tekanan air di dalam pipa sebelum dicopot.',
        critical: true
      }
    ],
    tools: [
      { id: 't-kunci-inggris', name: 'Kunci Inggris / Kunci Pipa 8-10 inch', required: true },
      { id: 't-lap-kain', name: 'Lap Kain Kering & Ember Kecil', required: true, specification: 'Untuk menampung tetesan sisa' },
      { id: 't-sikat-kawat', name: 'Sikat Gigi Bekas / Sikat Kawat Halus', required: false, specification: 'Untuk membersihkan sisa seal tape lama di drat soket dinding' }
    ],
    materials: [
      { id: 'm-kran', name: 'Kran Air Baru (Drat 1/2 Inch)', defaultQty: 1, unit: 'buah', estimatedPriceUnit: 45000, note: 'Bahan Kuningan / SUS 304 lebih awet dibanding babet' },
      { id: 'm-sealtape', name: 'Seal Tape PTFE (Tebal 0.075mm)', defaultQty: 1, unit: 'roll', estimatedPriceUnit: 5000, note: 'Merk Onda / Kitz' }
    ],
    calculatorConfig: {
      formulaType: 'plumbing_pipe',
      title: 'Kalkulator Lilitan Seal Tape & Estimasi Biaya',
      description: 'Menghitung jumlah putaran lilitan seal tape optimal berdasarkan jenis material drat kran (Kuningan, Stainless, atau PVC plastik).',
      parameters: [
        { id: 'pipe_diameter', label: 'Ukuran Drat Kran (Inch)', min: 0.5, max: 1.0, step: 0.25, defaultValue: 0.5, unit: 'inch' },
        { id: 'thread_material', label: 'Tipe Drat (1=Plastik, 2=Kuningan/Logam)', min: 1, max: 2, step: 1, defaultValue: 2, unit: 'level', tooltip: 'Drat logam butuh lilitan lebih banyak (14-18 lilitan), drat plastik butuh 8-12 lilitan agar soket dinding tidak retak.' },
        { id: 'faucet_count', label: 'Jumlah Titik Kran yang Diganti', min: 1, max: 6, step: 1, defaultValue: 1, unit: 'titik' }
      ]
    },
    steps: [
      {
        stepNumber: 1,
        title: 'Tutup Aliran Air Utama & Buang Tekanan',
        description: 'Tutup stop kran induk dari PDAM atau matikan pompa air toren. Letakkan ember di bawah kran. Buka kran lama penuh untuk membuang sisa air bertekanan di dalam pipa hingga aliran terhenti total.',
        checkItems: ['Stop kran tertutup rapat', 'Air sudah tidak lagi mengucur dari kran']
      },
      {
        stepNumber: 2,
        title: 'Pelepasan Kran Lama & Pembersihan Drat Dinding',
        description: 'Jepit leher segi enam kran lama dengan kunci inggris. Putar berlawanan arah jarum jam (ke kiri) secara perlahan dan mantap. Bersihkan sisa-sisa seal tape putih lama yang membatu di dalam drat pipa dinding menggunakan sikat gigi/obeng kecil.',
        proTip: 'Jangan memaksakan putaran dengan menyentak kunci pipa jika terasa macet. Semprotkan sedikit cairan pelumas penembus karat (seperti WD-40) dan diamkan 3 menit sebelum memutar kembali.',
        dangerWarning: 'Pegang soket drat pipa dinding agar tidak ikut terpuntir atau retak di dalam plesteran semen!',
        checkItems: ['Kran lama berhasil terlepas utuh', 'Drat dalam pipa dinding bersih dari kotoran dan lumut']
      },
      {
        stepNumber: 3,
        title: 'Teknik Melilit Seal Tape PTFE (Searah Jarum Jam)',
        description: 'Pegang badan kran dengan drat menghadap ke arah Anda. Lilitkan seal tape SEARAH JARUM JAM sebanyak 12-16 putaran dengan tarikan yang sedikit tegang agar pita masuk ke sela-sela ulir drat. Ratakan permukaan tape dengan ibu jari.',
        schematicId: 'schematic-faucet-tape',
        proTip: 'KUNCI SUKSES: Melilit searah jarum jam memastikan saat kran diputar masuk ke drat dinding, seal tape akan semakin mengencang dan TIDAK terurai menggumpal!',
        checkItems: ['Seal tape dililit searah jarum jam', 'Ketebalan 12-16 lilitan merata di seluruh alur ulir drat']
      },
      {
        stepNumber: 4,
        title: 'Pemasangan Kran Baru & Penyetelan Posisi Tegak',
        description: 'Masukkan kran baru ke drat dinding dengan tangan terlebih dahulu agar alur drat tidak miring (cross-thread). Setelah masuk 2-3 putaran tangan, gunakan kunci inggris berlapis lap kain (agar bodi kran tidak baret) untuk memutar hingga kencang dan posisi moncong kran tegak lurus ke bawah.',
        checkItems: ['Kran masuk dengan alur lurus', 'Moncong kran menghadap tepat ke bawah', 'Bodi kran mulus tanpa lecet']
      },
      {
        stepNumber: 5,
        title: 'Pengujian Tekanan Air & Inspeksi Rembesan',
        description: 'Buka kembali stop kran induk utama. Keringkan sambungan drat kran dengan lap kering. Buka kran air beberapa detik, lalu tutup kembali. Periksa bagian celah sambungan dinding dengan tisu kering. Jika tisu tetap kering, sambungan Anda 100% sempurna!',
        checkItems: ['Stop kran induk dibuka', 'Tisu kering tidak mendeteksi rembesan air pada pangkal drat']
      }
    ],
    diagrams: [
      {
        id: 'schematic-faucet-tape',
        title: 'Arah Lilitan Seal Tape pada Ulir Kran',
        description: 'Visualisasi lilitan searah jarum jam menghadap penampang drat agar tidak melipat.',
        type: 'svg_schematic'
      }
    ]
  },
  {
    id: 'san-02',
    slug: 'pipa-pvc-ptrap-wastafel',
    title: 'Instalasi Pipa Pembuangan PVC & Siphon P-Trap Wastafel',
    category: 'SAN',
    categoryName: 'Sanitasi & Pipa',
    difficulty: 'Menengah',
    durationMinutes: 60,
    overview: 'Pemasangan pipa pembuangan air kotor wastafel menggunakan leher angsa (P-Trap) untuk mencegah bau got/selokan naik ke dalam rumah. Menggunakan sambungan pipa PVC 1-1/4" dan lem solvent cement.',
    tags: ['P-Trap', 'Wastafel', 'Pipa PVC', 'Anti Bau Got', 'Lem PVC'],
    safetyHazards: [
      'Uap lem PVC menyengat mata dan saluran nafas jika bekerja di ruang tertutup tanpa ventilasi.',
      'Tangan terkena gergaji pipa PVC saat memotong.',
      'Kebocoran air kotor ke lantai kabinet dapur/wastafel.'
    ],
    mandatorySafetyChecklist: [
      {
        id: 'safe-ventilation',
        text: 'Buka Jendela / Ventilasi saat Menggunakan Lem PVC',
        detail: 'Solvent cement PVC mengandung senyawa volatil yang kuat.',
        critical: false
      },
      {
        id: 'safe-sink-bucket',
        text: 'Siapkan Ember Penampung di Bawah Siphon',
        detail: 'Tampung sisa endapan kotoran pipa lama sebelum dibongkar.',
        critical: true
      }
    ],
    tools: [
      { id: 't-gergaji-pipa', name: 'Gergaji Besi Mini / Pemotong Pipa PVC', required: true },
      { id: 't-amplas', name: 'Amplas Kasar No. 120-180', required: true, specification: 'Untuk menghaluskan tepi potongan pipa dan membuat pori rekat' },
      { id: 't-meteran', name: 'Meteran Pita 3M', required: true },
      { id: 't-kunci-inggris', name: 'Kunci Pipa / Tang Buaya', required: false }
    ],
    materials: [
      { id: 'm-ptrap', name: 'Set Siphon Leher Angsa (P-Trap) Wastafel 1-1/4"', defaultQty: 1, unit: 'set', estimatedPriceUnit: 55000, note: 'Lengkap dengan seal karet dan afur' },
      { id: 'm-pipa-pvc', name: 'Pipa PVC D 1-1/4 Inch (Panjang 2m)', defaultQty: 1, unit: 'batang', estimatedPriceUnit: 28000 },
      { id: 'm-lem-pvc', name: 'Lem Pipa PVC Tube (Isarplas/Rucika)', defaultQty: 1, unit: 'tube', estimatedPriceUnit: 9000 },
      { id: 'm-elbow', name: 'Knee / Elbow PVC 1-1/4" 90° & 45°', defaultQty: 2, unit: 'buah', estimatedPriceUnit: 5000 }
    ],
    calculatorConfig: {
      formulaType: 'plumbing_pipe',
      title: 'Kalkulator Potongan Jalur Pipa PVC',
      description: 'Menghitung panjang pipa PVC dan jumlah sambungan fitting (knee/elbow) dari dasar wastafel ke pipa buangan lantai/dinding.',
      parameters: [
        { id: 'drop_height', label: 'Tinggi Drop Wastafel ke Pipa Dinding', min: 20, max: 80, step: 5, defaultValue: 45, unit: 'cm' },
        { id: 'horizontal_distance', label: 'Jarak Horizontal ke Lubang Pembuangan', min: 10, max: 150, step: 5, defaultValue: 40, unit: 'cm' },
        { id: 'elbow_count', label: 'Perkiraan Jumlah Belokan (Knee)', min: 1, max: 4, step: 1, defaultValue: 2, unit: 'buah' }
      ]
    },
    steps: [
      {
        stepNumber: 1,
        title: 'Mengenal Fungsi Jebakan Air (Water Seal) Siphon P-Trap',
        description: 'Bentuk lekukan huruf "U" pada leher angsa sengaja menahan genangan air bersih sekitar 5 cm di dasarnya. Genangan air ini berfungsi sebagai "pintu air" alami yang menyekat bau busuk dan gas selokan agar tidak masuk ke kamar mandi Anda.',
        schematicId: 'schematic-ptrap-diagram',
        checkItems: ['P-trap set tersedia lengkap dengan cincin seal karet']
      },
      {
        stepNumber: 2,
        title: 'Pengukuran & Pemotongan Pipa PVC Tegak Lurus',
        description: 'Ukur jarak dari ujung afur wastafel ke pipa leher angsa dan pipa dinding. Potong pipa PVC menggunakan gergaji besi dengan sudut 90 derajat siku. Bersihkan serpihan sisa plastik (burr) dengan amplas halus agar tidak menyumbat rambut/kotoran.',
        checkItems: ['Potongan pipa siku 90 derajat', 'Tepi potongan diamplas halus tanpa gerigi']
      },
      {
        stepNumber: 3,
        title: 'Pemasangan Seal Karet Konis (Tanpa Lem pada Bagian Servis)',
        description: 'PENTING: Bagian sambungan leher angsa yang memiliki mur ulir plastik TIDAK BOLEH dilem! Pasang cincin karet berbentuk kerucut (konis) dengan ujung runcing menghadap ke dalam pipa lawan, lalu putar mur ulir cukup dengan kekuatan tangan kencang.',
        schematicId: 'schematic-ptrap-diagram',
        proTip: 'Jangan memakai kunci pipa untuk mur leher angsa plastik karena bisa membuat mur pecah dan karet terjepit miring.',
        checkItems: ['Seal karet terpasang dengan posisi runcing benar', 'Mur ulir dikencangkan dengan tangan']
      },
      {
        stepNumber: 4,
        title: 'Pengeleman Sambungan PVC Permanen Menuju Dinding',
        description: 'Oleskan lem pipa PVC tipis dan merata pada bagian dalam soket knee dan permukaan luar pipa PVC. Dorong pipa masuk ke soket dengan memutar seperempat putaran, lalu tahan selama 15 detik agar pipa tidak terdorong keluar oleh tekanan udara.',
        checkItems: ['Lem PVC dioleskan merata', 'Ditahan 15 detik hingga lem mengikat']
      },
      {
        stepNumber: 5,
        title: 'Uji Aliran Air Penuh & Cek Kebocoran Kolom',
        description: 'Tutup afur wastafel, isi wastafel hingga separuh penuh, lalu buka sumbat sekaligus untuk menghasilkan aliran air deras bertekanan. Raba seluruh sambungan leher angsa dengan jari kering untuk memastikan tidak ada rembesan.',
        checkItems: ['Wastafel dikuras dengan debit maksimal', 'Tidak ada tetesan di bawah kolong wastafel']
      }
    ],
    diagrams: [
      {
        id: 'schematic-ptrap-diagram',
        title: 'Skema Anatomi Siphon P-Trap & Water Seal',
        description: 'Diagram kerja jebakan air penahan bau dan letak mur seal gasket karet.',
        type: 'svg_schematic'
      }
    ]
  },
  {
    id: 'san-03',
    slug: 'pelampung-otomatis-toren-air',
    title: 'Pemasangan Pelampung Otomatis Toren Air (Radar / Floating Valve)',
    category: 'SAN',
    categoryName: 'Sanitasi & Pipa',
    difficulty: 'Menengah',
    durationMinutes: 75,
    overview: 'Panduan memasang pelampung otomatis saklar radar (level switch) untuk toren penampungan air. Pompa menyala saat air toren hampir habis dan mati otomatis saat toren penuh, menghentikan air tumpah sia-sia.',
    tags: ['Toren Air', 'Radar Otomatis', 'Pompa Air', 'Pelampung', 'Hemat Listrik'],
    safetyHazards: [
      'Bekerja di ketinggian (atap/menara toren) berisiko jatuh jika tidak berhati-hati.',
      'Kabel pompa air membawa tegangan 220V yang rawan korslet di lingkungan basah toren.'
    ],
    mandatorySafetyChecklist: [
      {
        id: 'safe-pump-power-off',
        text: 'Cabut Steker Pompa Air & Matikan Sekring',
        detail: 'Kabel yang ditarik ke toren akan membawa arus 220V dari pompa.',
        critical: true
      },
      {
        id: 'safe-ladder-secure',
        text: 'Pastikan Tangga Menara Toren Terikat Kuat & Tidak Licin',
        detail: 'Gunakan sepatu dengan sol karet anti slip saat naik ke dak toren.',
        critical: true
      }
    ],
    tools: [
      { id: 't-obeng-plus', name: 'Obeng Plus & Minus', required: true },
      { id: 't-tang-kupas', name: 'Tang Kupas & Potong', required: true },
      { id: 't-tespen', name: 'Tespen AC 220V', required: true },
      { id: 't-kunci-inggris', name: 'Kunci Inggris 10 inch', required: true }
    ],
    materials: [
      { id: 'm-radar', name: 'Set Saklar Pelampung Otomatis Radar (ST-70AB)', defaultQty: 1, unit: 'set', estimatedPriceUnit: 55000, note: 'Lengkap dengan 2 bandul pelampung oranye' },
      { id: 'm-kabel-outdoor', name: 'Kabel Listrik Tembaga 2x1.5mm² Outdoor', defaultQty: 15, unit: 'meter', estimatedPriceUnit: 8000 },
      { id: 'm-isolasi', name: 'Isolasi Kedap Air / Heatshrink Tube', defaultQty: 1, unit: 'roll', estimatedPriceUnit: 8000 }
    ],
    calculatorConfig: {
      formulaType: 'electrical_cable',
      title: 'Kalkulator Kabel Jalur Pompa ke Toren',
      description: 'Menghitung panjang kabel listrik luar ruangan dari posisi pompa air ke puncak menara toren.',
      parameters: [
        { id: 'distance_switch_ceiling', label: 'Tinggi Menara / Posisi Toren', min: 2, max: 12, step: 1, defaultValue: 4, unit: 'meter' },
        { id: 'distance_ceiling_lamp', label: 'Jarak Horizontal Pompa ke Kaki Menara', min: 1, max: 25, step: 1, defaultValue: 6, unit: 'meter' },
        { id: 'extra_allowance_percent', label: 'Toleransi Belokan & Klem', min: 10, max: 30, step: 5, defaultValue: 20, unit: '%' }
      ]
    },
    steps: [
      {
        stepNumber: 1,
        title: 'Prinsip Kerja Bandul Pelampung Radar (A1 dan A2)',
        description: 'Saklar radar memiliki 2 buah bandul yang digantung dengan tali nilon di dalam toren. Bandul atas (A1) menentukan batas air penuh (OFF). Bandul bawah (A2) menentukan batas air minimum (ON pompa). Saat air surut di bawah A2, beban kedua bandul menarik tuas microswitch sehingga pompa menyala.',
        schematicId: 'schematic-radar-toren',
        checkItems: ['Kedua bandul pelampung diisi air setengah (jika tipe isi) atau digantung seimbang']
      },
      {
        stepNumber: 2,
        title: 'Pemasangan Dudukan Radar pada Lubang Toren',
        description: 'Pasang drat 3/4" atau 1" bodi radar pada lubang atas tutup toren. Kencangkan mur plastik penahan. Pastikan tuas saklar bergerak bebas tanpa bergesekan dengan dinding toren.',
        checkItems: ['Bodi radar terpasang tegak lurus', 'Tali pelampung menggantung bebas di tengah toren']
      },
      {
        stepNumber: 3,
        title: 'Penyambungan Terminal Saklar (A1 dan A2 untuk Pengisian)',
        description: 'Buka penutup saklar radar. Terdapat 2 pasang terminal: A1-A2 (Normally Closed saat bandul menggantung = untuk pengisian air) dan B1-B2 (untuk pengurasan). Sambungkan kawat fasa pompa ke terminal A1 dan A2.',
        schematicId: 'schematic-radar-toren',
        dangerWarning: 'Jangan menghubungkan fasa dan netral sekaligus ke radar! Radar hanya berfungsi sebagai pemutus satu kawat (saklar seri). Menghubungkan fasa dan netral ke saklar akan memicu LEDAKAN KORSLETING!',
        checkItems: ['Kabel hanya memutus jalur fasa pompa', 'Terminal tertutup rapat dari percikan air hujan']
      },
      {
        stepNumber: 4,
        title: 'Uji Mekanik & Uji Kelistrikan',
        description: 'Tarik tali pelampung dengan tangan: dengarkan bunyi "klik" saklar. Nyalakan sumber listrik pompa. Saat bandul ditarik ke bawah (mensimulasikan air kosong), pompa harus berputar. Saat bandul diangkat (mensimulasikan air penuh terapung), pompa harus mati seketika.',
        checkItems: ['Respon mekanis microswitch normal', 'Pompa mati saat bandul terapung']
      }
    ],
    diagrams: [
      {
        id: 'schematic-radar-toren',
        title: 'Skema Instalasi Radar Pelampung Otomatis Toren',
        description: 'Diagram penyambungan kabel seri pompa ke terminal A1-A2 dan posisi bandul.',
        type: 'svg_schematic'
      }
    ]
  },
  {
    id: 'kay-01',
    slug: 'pasang-ambalan-melayang-floating-shelf',
    title: 'Pemasangan Ambalan Dinding Melayang (Floating Shelf) Kokoh',
    category: 'KAY',
    categoryName: 'Perkayuan & Mebel',
    difficulty: 'Pemula',
    durationMinutes: 40,
    overview: 'Teknik memasang rak ambalan melayang tanpa terlihat siku penyangga. Pembahasan pemilihan fischer & sekrup dinding bata/hebel, penggunaan waterpass agar tidak miring, dan kalkulasi kapasitas beban buku/pajangan.',
    tags: ['Ambalan', 'Floating Shelf', 'Bor Dinding', 'Fischer', 'Waterpass'],
    safetyHazards: [
      'Ambalan ambruk menimpa barang jika fischer yang digunakan terlalu kecil untuk dinding hebel.',
      'Mata bor mengenai pipa air atau kabel listrik tersembunyi di dalam dinding.',
      'Debu pengeboran mengenai mata.'
    ],
    mandatorySafetyChecklist: [
      {
        id: 'safe-eye-protection',
        text: 'Gunakan Kacamata Pelindung & Masker Debu',
        detail: 'Debu bata/hebel saat pengeboran sangat berbahaya jika terhirup atau masuk ke mata.',
        critical: false
      },
      {
        id: 'safe-wall-scanner',
        text: 'Pastikan Jalur Bor Bebas Kabel & Pipa Dinding',
        detail: 'Jangan mengebor sejajar lurus vertikal/horizontal dengan stop kontak atau kran terdekat.',
        critical: true
      }
    ],
    tools: [
      { id: 't-bor-impact', name: 'Mesin Bor Tembok (Impact Drill)', required: true, specification: 'Dengan mata bor beton 6mm / 8mm' },
      { id: 't-waterpass', name: 'Waterpass Magnetik 30-40 cm', required: true, specification: 'Untuk menjamin kerataan bidang horizontal' },
      { id: 't-meteran', name: 'Meteran & Pensil Tukang', required: true },
      { id: 't-palu', name: 'Palu Besi Ringan', required: true, specification: 'Untuk mengetuk fischer ke dalam lubang' },
      { id: 't-obeng-plus', name: 'Obeng Plus (+)', required: true }
    ],
    materials: [
      { id: 'm-papan-ambalan', name: 'Papan Ambalan Kayu Solid / MDF HPL (60-80 cm)', defaultQty: 1, unit: 'buah', estimatedPriceUnit: 65000 },
      { id: 'm-bracket-besi', name: 'Braket Besi Tanam (Rod Bracket Pin)', defaultQty: 1, unit: 'set', estimatedPriceUnit: 35000 },
      { id: 'm-fischer', name: 'Fischer Plastik S6/S8 & Sekrup Baja 5cm', defaultQty: 4, unit: 'pasang', estimatedPriceUnit: 1500, note: 'Gunakan fischer hebel jika dinding bata ringan' }
    ],
    calculatorConfig: {
      formulaType: 'floating_shelf',
      title: 'Kalkulator Bracket & Beban Ambalan',
      description: 'Menghitung rekomendasi jumlah titik fischer dan batas aman beban pajangan berdasarkan panjang papan ambalan.',
      parameters: [
        { id: 'shelf_length', label: 'Panjang Ambalan Kayu (cm)', min: 40, max: 200, step: 10, defaultValue: 80, unit: 'cm' },
        { id: 'shelf_depth', label: 'Lebar / Kedalaman Ambalan (cm)', min: 15, max: 40, step: 5, defaultValue: 20, unit: 'cm' },
        { id: 'target_load', label: 'Target Beban Barang di Atas Rak (kg)', min: 3, max: 30, step: 2, defaultValue: 10, unit: 'kg' }
      ]
    },
    steps: [
      {
        stepNumber: 1,
        title: 'Penentuan Posisi & Penandaan Level dengan Waterpass',
        description: 'Tempelkan plat bracket besi pada dinding pada ketinggian yang diinginkan. Letakkan waterpass di atas plat bracket hingga gelembung udara berada tepat di tengah-tengah dua garis indikator. Tandai titik lubang sekrup dengan pensil.',
        proTip: 'Jangan mengandalkan patokan garis lantai atau kusen plafon karena sering kali tidak rata. Selalu gunakan waterpass!',
        checkItems: ['Gelembung waterpass tepat di tengah', 'Titik bor ditandai jelas']
      },
      {
        stepNumber: 2,
        title: 'Pengeboran Dinding dengan Kedalaman Terkontrol',
        description: 'Pasang pembatas kedalaman (depth stop) pada mesin bor atau lilitkan isolasi pada mata bor sepanjang panjang fischer + 5 mm. Bor tegak lurus 90 derajat ke dinding menggunakan mode impact.',
        checkItems: ['Mata bor beton ukuran pas dengan fischer (misal mata 8mm untuk fischer S8)', 'Kedalaman bor cukup']
      },
      {
        stepNumber: 3,
        title: 'Pemasangan Fischer & Pengencangan Sekrup Bracket',
        description: 'Tiup atau bersihkan debu di dalam lubang bor. Masukkan fischer plastik dan ketuk perlahan dengan palu hingga bibir fischer rata dengan permukaan plesteran dinding. Tempelkan bracket besi dan kencangkan sekrup baja menggunakan obeng plus.',
        dangerWarning: 'Jika fischer longgar dan berputar di dalam dinding hebel, ganti dengan fischer khusus bata ringan (fischer bersirip spiral) agar tidak mudah copot saat dibebani.',
        checkItems: ['Fischer duduk rata dengan dinding', 'Bracket besi kokoh tidak goyang saat diguncang tangan']
      },
      {
        stepNumber: 4,
        title: 'Penyelipan Papan Kayu & Uji Kekuatan',
        description: 'Dorong lubang belakang papan ambalan ke besi pin bracket hingga rapat ke dinding. Kencangkan baut pengunci kecil di bawah ambalan (jika tersedia). Beri beban bertahap (misal beberapa buku) dan pastikan papan tidak condong miring ke depan.',
        checkItems: ['Papan terdorong mentok ke dinding', 'Uji beban awal berhasil stabil']
      }
    ],
    diagrams: [
      {
        id: 'schematic-shelf-bracket',
        title: 'Skema Pemasangan Fischer & Pin Ambalan',
        description: 'Diagram penampang dinding, kedalaman sekrup fischer, dan selongsong pin tanam ambalan.',
        type: 'svg_schematic'
      }
    ]
  },
  {
    id: 'kay-02',
    slug: 'setel-engsel-sendok-lemari',
    title: 'Pemasangan & Penyetelan Engsel Sendok Pintu Lemari',
    category: 'KAY',
    categoryName: 'Perkayuan & Mebel',
    difficulty: 'Menengah',
    durationMinutes: 45,
    overview: 'Solusi pintu lemari pakaian atau kitchen set yang miring, bergesekan, atau celah antar pintunya tidak rata. Menguasai fungsi 3 baut setelan engsel sendok (naik-turun, maju-mundur, geser kiri-kanan).',
    tags: ['Engsel Sendok', 'Pintu Lemari', 'Kitchen Set', 'Setel Pintu Miring', 'Mebel'],
    safetyHazards: [
      'Pintu lemari terlepas dan jatuh menimpa kaki jika sekrup dudukan dilepas sembarangan.',
      'Kayu partikel/MDF jebol jika sekrup dipaksa kencang saat lubang sudah aus.'
    ],
    mandatorySafetyChecklist: [
      {
        id: 'safe-hold-door',
        text: 'Siapkan Ganjal di Bawah Pintu Lemari',
        detail: 'Ganjal bagian bawah pintu dengan tumpukan kardus/buku agar daun pintu tidak anjlok saat baut disetel.',
        critical: true
      }
    ],
    tools: [
      { id: 't-obeng-plus', name: 'Obeng Plus (+) PH2 Presisi', required: true, specification: 'Ujung magnetik agar sekrup tidak jatuh ke celah lemari' },
      { id: 't-penggaris-siku', name: 'Penggaris Siku / Meteran', required: false },
      { id: 't-lem-putih', name: 'Lem Kayu PVAc & Tusuk Gigi', required: false, specification: 'Trik tukang untuk memperbaiki lubang sekrup kayu yang sudah dol/dolok' }
    ],
    materials: [
      { id: 'm-engsel-sendok', name: 'Engsel Sendok Soft Close (Lurus/Bengkok 35mm)', defaultQty: 2, unit: 'buah', estimatedPriceUnit: 18000, note: 'Pilih tipe lurus (Full Overlay) atau setengah bengkok sesuai bibir lemari' },
      { id: 'm-sekrup-kayu', name: 'Sekrup Kayu Kepala Bulat 3.5 x 16mm', defaultQty: 8, unit: 'buah', estimatedPriceUnit: 500 }
    ],
    calculatorConfig: {
      formulaType: 'door_repair',
      title: 'Kalkulator Kebutuhan Engsel Berdasarkan Tinggi Pintu',
      description: 'Menghitung jumlah engsel sendok yang dibutuhkan agar daun pintu lemari tidak cepat melengkung.',
      parameters: [
        { id: 'door_height', label: 'Tinggi Daun Pintu Lemari (cm)', min: 60, max: 240, step: 10, defaultValue: 120, unit: 'cm' },
        { id: 'door_weight', label: 'Estimasi Berat Pintu (kg)', min: 3, max: 25, step: 1, defaultValue: 6, unit: 'kg' }
      ]
    },
    steps: [
      {
        stepNumber: 1,
        title: 'Mengenal 3 Baut Penyetelan pada Engsel Sendok',
        description: 'Setiap lengan engsel sendok memiliki 3 sekrup ajaib: Baut Depan (menyetel geser ke kiri atau kanan), Baut Belakang/Tengah (menyetel maju-mundur celah kedalaman pintu terhadap bodi lemari), dan Baut Plat Penyangga (menyetel naik-turun tinggi pintu).',
        schematicId: 'schematic-hinge-adjust',
        checkItems: ['Fungsi ketiga baut dipahami', 'Pintu disangga ganjal']
      },
      {
        stepNumber: 2,
        title: 'Menyetel Kemiringan (Pintu Saling Bertabrakan di Tengah)',
        description: 'Jika pintu lemari bertabrakan dengan pintu sebelahnya saat ditutup, putar Baut Depan searah jarum jam pada engsel atas. Ini akan menarik daun pintu menjauh dari bagian tengah dan meratakan celah vertikal.',
        schematicId: 'schematic-hinge-adjust',
        proTip: 'Putar baut perlahan setengah putaran (180°), lalu tutup pintu untuk melihat perubahan celah sebelum memutar lebih jauh.',
        checkItems: ['Celah pintu bagian tengah menjadi rata 2-3 mm']
      },
      {
        stepNumber: 3,
        title: 'Menyetel Ketinggian (Pintu Gesek Ambalan Bawah)',
        description: 'Jika pintu menggesek lantai kabinet, kendorkan sedikit baut pada plat dasar dinding lemari (lubang oval), naikkan daun pintu 2-3 mm ke atas, lalu kencangkan kembali baut plat.',
        checkItems: ['Daun pintu tidak lagi menyentuh lantai kabinet']
      },
      {
        stepNumber: 4,
        title: 'Trik Mengatasi Sekrup Lubang Kayu Partikel yang Dol',
        description: 'Jika sekrup engsel terus berputar lepas (dol), lepas sekrup. Masukkan 3-4 batang tusuk gigi yang sudah diolesi lem kayu PVAc ke dalam lubang kayu hingga padat. Patahkan sisa tusuk gigi rata dengan kayu. Pasang dan kencangkan kembali sekrupnya—sekrup akan mencengkeram sangat kuat seperti kayu baru!',
        checkItems: ['Sekrup mencengkeram kuat tanpa dol']
      }
    ],
    diagrams: [
      {
        id: 'schematic-hinge-adjust',
        title: 'Diagram 3 Baut Penyetel Engsel Sendok',
        description: 'Arah putaran baut untuk setelan kiri-kanan, maju-mundur, dan atas-bawah.',
        type: 'svg_schematic'
      }
    ]
  },
  {
    id: 'kay-03',
    slug: 'perbaikan-daun-pintu-seret',
    title: 'Mengatasi Daun Pintu Rumah Seret & Macet Gesek Lantai',
    category: 'KAY',
    categoryName: 'Perkayuan & Mebel',
    difficulty: 'Menengah',
    durationMinutes: 50,
    overview: 'Solusi pintu kayu utama atau kamar tidur yang seret, susah dikunci, atau berderit menggores keramik akibat pemuaian cuaca lembab atau engsel kendur.',
    tags: ['Pintu Seret', 'Engsel Pintu', 'Serut Kayu', 'Amplas', 'Kusen'],
    safetyHazards: [
      'Jari terjepit daun pintu yang berat saat mengangkat engsel.',
      'Lantai keramik tergores jika daun pintu tidak dialasi lap/kardus.'
    ],
    mandatorySafetyChecklist: [
      {
        id: 'safe-cushion-floor',
        text: 'Letakkan Kain Tebal / Kardus di Bawah Pintu',
        detail: 'Cegah ujung bawah daun pintu menghantam dan memecahkan keramik lantai.',
        critical: false
      }
    ],
    tools: [
      { id: 't-obeng-panjang', name: 'Obeng Plus (+) Panjang / Impact Driver', required: true },
      { id: 't-serut-kayu', name: 'Ketam / Serut Kayu Manual atau Amplas Kasar No. 60-80', required: true },
      { id: 't-pelumas', name: 'Minyak Pelumas Mesin / WD-40', required: true },
      { id: 't-pensil', name: 'Pensil / Selotip Kertas', required: true, specification: 'Untuk menandai titik kayu yang bergesekan' }
    ],
    materials: [
      { id: 'm-sekrup-panjang', name: 'Sekrup Kayu Baja Panjang 7 cm (3 Inch)', defaultQty: 2, unit: 'buah', estimatedPriceUnit: 1000, note: 'Untuk menembus kusen hingga mencengkeram dinding bata di balik kusen' },
      { id: 'm-ganjal-kardus', name: 'Karton Pembungkus Tipis / Shim Plat', defaultQty: 1, unit: 'lembar', estimatedPriceUnit: 500 }
    ],
    calculatorConfig: {
      formulaType: 'door_repair',
      title: 'Kalkulator Celah Pintu Ideal',
      description: 'Menghitung celah ekspansi pintu kayu ideal berdasarkan iklim kering/hujan.',
      parameters: [
        { id: 'clearance_bottom', label: 'Celah Bawah Pintu ke Keramik (mm)', min: 3, max: 15, step: 1, defaultValue: 5, unit: 'mm' },
        { id: 'clearance_side', label: 'Celah Samping Pintu ke Kusen (mm)', min: 2, max: 6, step: 0.5, defaultValue: 3, unit: 'mm' }
      ]
    },
    steps: [
      {
        stepNumber: 1,
        title: 'Deteksi Titik Gesek dengan Selembar Kertas',
        description: 'Tutup pintu perlahan. Masukkan selembar kertas HVS ke celah kusen dari atas ke bawah. Titik di mana kertas terjepit kencang dan tidak bisa ditarik adalah titik kayu yang membengkak atau seret. Tandai bagian tersebut dengan pensil.',
        checkItems: ['Titik seret ditemukan dan ditandai pensil']
      },
      {
        stepNumber: 2,
        title: 'Trik Ajaib Sekrup Panjang pada Engsel Atas (Solusi Tanpa Serut)',
        description: 'Dalam 80% kasus, pintu anjlok karena sekrup engsel atas yang menahan beban kusen mulai kendur. Ganti sekrup pendek engsel atas nomor 2 dengan sekrup baja panjang 7-8 cm. Sekrup panjang ini akan menembus kusen kayu hingga mencengkeram dinding bata di belakangnya, menarik daun pintu kembali tegak ke atas seketika!',
        proTip: 'Coba langkah sekrup panjang ini terlebih dahulu sebelum memutuskan menyekop atau menyerut kayu pintu.',
        checkItems: ['Sekrup panjang terpasang pada engsel paling atas', 'Pintu diuji buka-tutup apakah gesekan hilang']
      },
      {
        stepNumber: 3,
        title: 'Menyerut Bagian Kayu yang Membengkak (Jika Diperlukan)',
        description: 'Jika pintu masih seret akibat pemuaian kayu lembab di musim hujan, gunakan ketam serut manual atau balok amplas kasar No. 60 untuk mengikis titik pensil tipis-tipis (sekitar 1-2 mm). Selalu serut searah serat kayu.',
        checkItems: ['Pengikisan kayu dilakukan merata', 'Tepi dihaluskan kembali dengan amplas halus']
      },
      {
        stepNumber: 4,
        title: 'Pelumasan Pin Engsel & Finishing',
        description: 'Teteskan minyak pelumas atau semprotkan sedikit pelumas silikon pada sela-sela pin engsel pintu. Ayunkan pintu bolak-balik agar minyak meresap dan suara derit hilang total.',
        checkItems: ['Pintu mengayun lancar dengan dorongan satu jari', 'Kunci pintu mengait dengan presisi ke lubang kusen']
      }
    ],
    diagrams: [
      {
        id: 'schematic-door-clearance',
        title: 'Diagram Penyetelan Celah Daun Pintu & Solusi Sekrup Kusen',
        description: 'Visualisasi gaya tarik engsel atas dan titik celah clearance kusen.',
        type: 'svg_schematic'
      }
    ]
  }
];
