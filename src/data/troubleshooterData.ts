import { TroubleshooterTree } from '../types';

export const TROUBLESHOOTER_TREES: TroubleshooterTree[] = [
  // --- KELISTRIKAN ---
  {
    id: 'tree-mcb-trip',
    category: 'LST',
    title: 'MCB Langsung Jeglek (Trip) Saat Saklar Ditekan',
    symptom: 'Begitu saklar dinyalakan, tuas MCB di panel sekring langsung jatuh ke posisi OFF dengan bunyi jeglek keras.',
    initialNodeId: 'q1',
    nodes: {
      q1: {
        id: 'q1',
        question: 'Apakah terjadi percikan api atau kepulan asap di sekitar saklar atau fitting lampu?',
        options: [
          { text: 'Ya, ada kilatan api / bau hangus', nextNodeId: 'res-dead-short' },
          { text: 'Tidak ada percikan, hanya MCB yang jatuh seketika', nextNodeId: 'q2' }
        ]
      },
      q2: {
        id: 'q2',
        question: 'Apakah Anda menghubungkan kawat Netral (biru) langsung ke salah satu terminal saklar?',
        options: [
          { text: 'Ya, saya masukkan fasa dan netral ke saklar', nextNodeId: 'res-switch-short' },
          { text: 'Tidak, saklar hanya memutus satu kabel fasa', nextNodeId: 'q3' }
        ]
      },
      q3: {
        id: 'q3',
        question: 'Apakah di dalam fitting lampu kawat tembaga fasa dan netral saling bersentuhan?',
        options: [
          { text: 'Mungkin saja, kupasan tembaga agak panjang', nextNodeId: 'res-fitting-short' },
          { text: 'Tidak, terminal fitting terpisah rapi', nextNodeId: 'res-mcb-overload' }
        ]
      },
      'res-switch-short': {
        id: 'res-switch-short',
        result: {
          cause: 'Korsleting Fatal: Saklar Menghubungkan Fasa Langsung ke Netral!',
          dangerLevel: 'BAHAYA',
          safetyInstruction: 'JANGAN MENYALAKAN MCB LAGI! Saklar bertindak sebagai pemutus arus SATU kawat fasa. Saklar BUKAN stop kontak.',
          recommendations: [
            'Segera lepaskan kabel netral (biru) dari terminal saklar.',
            'Sambungkan kabel netral tersebut langsung ke kabel netral lampu di atas plafon.',
            'Pastikan saklar HANYA menerima kabel Fasa Masuk dan Fasa Keluar.',
            'Periksa kontak saklar apakah gosong, ganti baru bila melepuh.'
          ],
          suggestedProjectSlug: 'instalasi-saklar-tunggal'
        }
      },
      'res-dead-short': {
        id: 'res-dead-short',
        result: {
          cause: 'Hubung Singkat Arus Penuh (Dead Short Circuit)',
          dangerLevel: 'BAHAYA',
          safetyInstruction: 'Matikan MCB induk meteran PLN, kenakan sarung tangan sebelum membongkar.',
          recommendations: [
            'Bongkar penutup saklar dan fitting dengan hati-hati.',
            'Cari isolasi kawat yang terbakar atau lelehan tembaga yang menempel pada bodi logam.',
            'Ganti kawat kabel yang hangus dengan kabel NYM baru.',
            'Gunakan isolasi vinyl berstandar SNI (tahan panas 600V).'
          ]
        }
      },
      'res-fitting-short': {
        id: 'res-fitting-short',
        result: {
          cause: 'Kawat Tembaga di Lidah Fitting Lampu Bersentuhan',
          dangerLevel: 'WASPADA',
          safetyInstruction: 'Pastikan saklar OFF dan MCB diturunkan sebelum membuka kap fitting lampu plafon.',
          recommendations: [
            'Buka penutup fitting plafon.',
            'Potong sisa tembaga yang terlalu panjang (cukup 8-10 mm yang masuk ke lubang baut).',
            'Pastikan serat tembaga tidak mekar keluar terminal.',
            'Kencangkan baut terminal fitting.'
          ]
        }
      },
      'res-mcb-overload': {
        id: 'res-mcb-overload',
        result: {
          cause: 'Kapasitas MCB Terlampaui atau Titik MCB Sudah Lemah (Fatigue)',
          dangerLevel: 'WASPADA',
          safetyInstruction: 'Hitung total daya peralatan yang sedang aktif saat saklar dinyalakan.',
          recommendations: [
            'Matikan sementara beban berat lain (seperti AC, pompa air, dispenser air panas).',
            'Coba nyalakan kembali saklar lampu.',
            'Jika MCB tetap jeglek tanpa beban lain, kemungkinan bimetal MCB sudah aus dan perlu diganti oleh teknisi/PLN.'
          ]
        }
      }
    }
  },
  {
    id: 'tree-led-flicker-off',
    category: 'LST',
    title: 'Lampu LED Kedap-Kedip atau Nyala Redup Saat Saklar OFF',
    symptom: 'Saat saklar dimatikan pada malam hari, bohlam LED masih memancarkan pendar redup atau berkedip-kedip tiap beberapa detik.',
    initialNodeId: 'q1',
    nodes: {
      q1: {
        id: 'q1',
        question: 'Apakah saklar yang Anda gunakan memiliki lampu indikator kecil (LED glow in the dark)?',
        options: [
          { text: 'Ya, saklar ada lampu indikator neon kecil', nextNodeId: 'res-neon-leak' },
          { text: 'Tidak, saklar biasa polos tanpa lampu', nextNodeId: 'q2' }
        ]
      },
      q2: {
        id: 'q2',
        question: 'Apakah kawat yang diputus oleh saklar adalah kabel FASA (menyala saat ditespen) atau kabel NETRAL?',
        options: [
          { text: 'Kabel yang diputus ternyata Netral (tegangan fasa terus mengalir ke fitting)', nextNodeId: 'res-neutral-cut' },
          { text: 'Kabel yang diputus sudah Fasa, tapi masih kedip', nextNodeId: 'res-induced-voltage' }
        ]
      },
      'res-neon-leak': {
        id: 'res-neon-leak',
        result: {
          cause: 'Arus Bocor Mikro dari Lampu Indikator Neon Saklar',
          dangerLevel: 'AMAN',
          safetyInstruction: 'Masalah ini tidak berbahaya, namun dapat memperpendek umur driver bohlam LED.',
          recommendations: [
            'Bohlam LED modern sangat efisien sehingga arus mikro miliampere dari lampu indikator saklar cukup mengisi kapasitor LED hingga berkedip.',
            'Solusi 1: Pasang resistor peredam (LED Snubber Capacitor 0.1uF 400V) paralel di terminal fitting lampu.',
            'Solusi 2: Ganti saklar dengan tipe polos tanpa lampu indikator neon.'
          ]
        }
      },
      'res-neutral-cut': {
        id: 'res-neutral-cut',
        result: {
          cause: 'Terbalik Jalur: Saklar Memutus Jalur Netral Bukan Fasa!',
          dangerLevel: 'WASPADA',
          safetyInstruction: 'Fitting lampu Anda tetap bertegangan 220V aktif meskipun saklar OFF! Sangat berbahaya saat Anda mengganti bohlam.',
          recommendations: [
            'Tukar kabel di T-Dos plafon agar yang turun ke saklar adalah kawat FASA aktif.',
            'Pastikan jalur netral mengalir langsung ke ulir fitting lampu tanpa saklar.',
            'Gunakan tespen untuk memvalidasi saklar berada di jalur fasa.'
          ],
          suggestedProjectSlug: 'instalasi-saklar-tunggal'
        }
      },
      'res-induced-voltage': {
        id: 'res-induced-voltage',
        result: {
          cause: 'Tegangan Induksi (Ghost Voltage) pada Jalur Kabel Panjang',
          dangerLevel: 'AMAN',
          safetyInstruction: 'Kabel NYM panjang yang berjalan paralel dalam pipa konduit menimbulkan medan induksi kapasitif.',
          recommendations: [
            'Gunakan bohlam LED bermerek yang memiliki filter IC driver berkualitas tinggi.',
            'Pasang kapasitor penekan interferensi (safety capacitor X2 275V) pada fitting plafon.'
          ]
        }
      }
    }
  },

  // --- SANITASI & PIPA ---
  {
    id: 'tree-faucet-leak',
    category: 'SAN',
    title: 'Kran Baru Masih Menetes / Rembes Setelah Dipasang',
    symptom: 'Air masih menetes perlahan dari moncong kran atau rembes membasahi dinding di sekeliling drat soket.',
    initialNodeId: 'q1',
    nodes: {
      q1: {
        id: 'q1',
        question: 'Di mana lokasi tepat tetesan air muncul?',
        options: [
          { text: 'Di pangkal ulir drat yang masuk ke dinding bata', nextNodeId: 'res-thread-leak' },
          { text: 'Dari ujung moncong kran (meskipun putaran kran sudah ditutup)', nextNodeId: 'res-cartridge-leak' },
          { text: 'Dari leher sambungan putar kran fleksibel', nextNodeId: 'res-oring-leak' }
        ]
      },
      'res-thread-leak': {
        id: 'res-thread-leak',
        result: {
          cause: 'Lilitan Seal Tape Kurang Tebal atau Arah Lilitan Terbalik',
          dangerLevel: 'AMAN',
          safetyInstruction: 'Tutup stop kran induk sebelum membuka kembali kran.',
          recommendations: [
            'Bongkar kran kembali dengan memutar berlawanan jarum jam.',
            'Bersihkan sisa seal tape lama hingga bersih.',
            'Lilitkan kembali seal tape SEARAH JARUM JAM sebanyak 14-18 putaran penuh dengan tarikan kencang.',
            'Putar kran masuk ke soket dinding tanpa diputar mundur (jika diputar mundur walau sedikit, seal tape akan sobek dan bocor).'
          ],
          suggestedProjectSlug: 'ganti-kran-bocor'
        }
      },
      'res-cartridge-leak': {
        id: 'res-cartridge-leak',
        result: {
          cause: 'Jantung Kran (Cartridge Keramik / Karet Washer) Terganjal Pasir Pipa',
          dangerLevel: 'AMAN',
          safetyInstruction: 'Sisa pasir atau serbuk semen dari pipa baru sering mengganjal katup keramik.',
          recommendations: [
            'Buka tuas handle kran menggunakan kunci L atau obeng kecil.',
            'Keluarkan cartridge kran dan bilas di bawah air mengalir untuk membuang butiran pasir.',
            'Jika kran lama, ganti seal karet washer atau beli cartridge pengganti ukuran 35mm/40mm.'
          ]
        }
      },
      'res-oring-leak': {
        id: 'res-oring-leak',
        result: {
          cause: 'O-Ring Karet Leher Fleksibel Melipat atau Kering',
          dangerLevel: 'AMAN',
          safetyInstruction: 'Hindari mengencangkan mur leher kran secara berlebihan hingga meremukkan karet.',
          recommendations: [
            'Lepas sambungan leher kran.',
            'Periksa apakah cincin karet O-ring hitam putus atau gepeng.',
            'Oleskan sedikit pelumas silikon (food grade) pada karet O-ring sebelum dipasang kembali.'
          ]
        }
      }
    }
  },
  {
    id: 'tree-toren-overflow',
    category: 'SAN',
    title: 'Air Toren Penampungan Meluap Terus (Pompa Tidak Mau Mati)',
    symptom: 'Air di toren atas meluber ke talang atap rumah karena pompa air sumur/jet pump terus berputar tanpa henti.',
    initialNodeId: 'q1',
    nodes: {
      q1: {
        id: 'q1',
        question: 'Apakah bandul oranye pelampung radar di dalam toren sudah terapung di permukaan air?',
        options: [
          { text: 'Ya, kedua bandul sudah mengapung bebas tapi saklar tidak "klik"', nextNodeId: 'q2' },
          { text: 'Tidak, bandul tersangkut di dinding toren atau talinya putus', nextNodeId: 'res-string-stuck' }
        ]
      },
      q2: {
        id: 'q2',
        question: 'Apakah kabel listrik dipasang pada terminal A1-A2 atau B1-B2?',
        options: [
          { text: 'Dipasang pada B1-B2 (kebalikan fungsi pengisian)', nextNodeId: 'res-terminal-inverted' },
          { text: 'Dipasang pada A1-A2, tapi pompa tetap menyala', nextNodeId: 'res-switch-welded' }
        ]
      },
      'res-string-stuck': {
        id: 'res-string-stuck',
        result: {
          cause: 'Tali Bandul Tersangkut di Tangga / Pipa Overflow Toren',
          dangerLevel: 'WASPADA',
          safetyInstruction: 'Matikan saklar pompa air segera untuk mencegah pemborosan listrik dan air.',
          recommendations: [
            'Buka tutup toren dan periksa posisi tali nilon bandul.',
            'Posisikan dudukan radar tepat di tengah lubang toren agar kedua bandul dapat naik turun dengan bebas.',
            'Ganti tali rapuh dengan tali pancing / senar monofilamen tebal atau tali nilon tahan lumut.'
          ],
          suggestedProjectSlug: 'pelampung-otomatis-toren-air'
        }
      },
      'res-terminal-inverted': {
        id: 'res-terminal-inverted',
        result: {
          cause: 'Salah Terminal: Terhubung ke Terminal Pengurasan (B1-B2)',
          dangerLevel: 'AMAN',
          safetyInstruction: 'Cabut steker pompa sebelum membuka kotak radar.',
          recommendations: [
            'Terminal B1-B2 berfungsi untuk mode drainase (menyala saat air PENUH).',
            'Pindahkan kedua kabel ke terminal A1-A2 yang dirancang khusus untuk mode suplai (mematikan pompa saat air PENUH).'
          ],
          suggestedProjectSlug: 'pelampung-otomatis-toren-air'
        }
      },
      'res-switch-welded': {
        id: 'res-switch-welded',
        result: {
          cause: 'Kontak Plat Platina Microswitch Lengket / Terbakar (Welded Contact)',
          dangerLevel: 'WASPADA',
          safetyInstruction: 'Arus start motor pompa air yang besar dapat melelehkan kontak platina saklar radar murahan.',
          recommendations: [
            'Ganti unit switch radar dengan tipe heavy-duty (misal merk Radar ST-70AB asli).',
            'Untuk pompa berdaya besar (>250W), gunakan Magnetic Contactor tambahan agar beban arus saklar radar sangat kecil dan saklar awet selamanya.'
          ]
        }
      }
    }
  },

  // --- PERKAYUAN & MEBEL ---
  {
    id: 'tree-cabinet-door-rub',
    category: 'KAY',
    title: 'Pintu Lemari Miring atau Saling Beradu di Tengah',
    symptom: 'Dua daun pintu lemari kitchen set / pakaian saling bertabrakan saat ditutup, atau celah antar pintu terlihat miring tidak sejajar.',
    initialNodeId: 'q1',
    nodes: {
      q1: {
        id: 'q1',
        question: 'Apakah sekrup plat dasar engsel yang menempel pada dinding lemari terasa kendur/goyang?',
        options: [
          { text: 'Ya, sekrupnya sudah dol dan engsel goyang', nextNodeId: 'res-loose-screw-fix' },
          { text: 'Tidak, engsel terpasang kokoh, hanya posisinya tidak pas', nextNodeId: 'q2' }
        ]
      },
      q2: {
        id: 'q2',
        question: 'Bagian mana dari daun pintu yang saling beradu?',
        options: [
          { text: 'Sudut atas pintu saling bertubrukan di tengah', nextNodeId: 'res-adjust-top-screw' },
          { text: 'Pintu seret menggesek ambalan bawah lemari', nextNodeId: 'res-adjust-height-plate' }
        ]
      },
      'res-loose-screw-fix': {
        id: 'res-loose-screw-fix',
        result: {
          cause: 'Lubang Sekrup Kayu Partikel / MDF Rusak (Dol)',
          dangerLevel: 'AMAN',
          safetyInstruction: 'Ganjal daun pintu agar tidak terjatuh saat melepas sekrup.',
          recommendations: [
            'Lepas sekrup yang dol dari lubang engsel.',
            'Trik Tukang: Celupkan 2-3 batang tusuk gigi ke lem kayu PVAc (lem putih Fox), masukkan ke lubang kayu hingga padat, lalu patahkan rata.',
            'Pasang kembali sekrup aslinya—serat bambu tusuk gigi akan mencengkeram ulir sekrup dengan sangat kuat.',
            'Biarkan lem mengering 2 jam.'
          ],
          suggestedProjectSlug: 'setel-engsel-sendok-lemari'
        }
      },
      'res-adjust-top-screw': {
        id: 'res-adjust-top-screw',
        result: {
          cause: 'Sudut Kemiringan Pintu Belum Dikalibrasi',
          dangerLevel: 'AMAN',
          safetyInstruction: 'Gunakan obeng plus ukuran PH2 agar kepala baut penyetel tidak rusak.',
          recommendations: [
            'Buka pintu lemari.',
            'Cari baut penyetel DEPAN pada lengan engsel paling ATAS.',
            'Putar baut tersebut searah jarum jam sebanyak 1/2 hingga 1 putaran penuh.',
            'Tutup pintu untuk mengecek: daun pintu atas akan bergeser menjauh dari tengah dan celah menjadi lurus.'
          ],
          suggestedProjectSlug: 'setel-engsel-sendok-lemari'
        }
      },
      'res-adjust-height-plate': {
        id: 'res-adjust-height-plate',
        result: {
          cause: 'Penyetelan Ketinggian Plat Engsel Terlalu Rendah',
          dangerLevel: 'AMAN',
          safetyInstruction: 'Ganjal bagian bawah pintu dengan tumpukan buku sebelum mengendorkan sekrup.',
          recommendations: [
            'Kendorkan 2 sekrup plat dasar engsel yang memiliki lubang oval (di dinding dalam lemari).',
            'Angkat sedikit daun pintu ke atas (sekitar 2-3 mm).',
            'Kencangkan kembali sekrup plat dasar tersebut.'
          ],
          suggestedProjectSlug: 'setel-engsel-sendok-lemari'
        }
      }
    }
  },
  {
    id: 'tree-floating-shelf-sag',
    category: 'KAY',
    title: 'Ambalan Dinding (Floating Shelf) Condong Miring ke Depan',
    symptom: 'Setelah dipasang di dinding dan ditaruh barang, ujung luar papan ambalan tampak melorot/miring turun ke bawah.',
    initialNodeId: 'q1',
    nodes: {
      q1: {
        id: 'q1',
        question: 'Apakah jenis dinding tempat memasang ambalan adalah bata merah atau bata ringan (hebel/batako)?',
        options: [
          { text: 'Bata ringan / hebel / gypsum', nextNodeId: 'res-hebel-fischer' },
          { text: 'Bata merah / beton cor padat', nextNodeId: 'q2' }
        ]
      },
      q2: {
        id: 'q2',
        question: 'Apakah besi pin bracket di dalam papan ambalan terasa longgar atau bergeser?',
        options: [
          { text: 'Ya, lubang pin ambalan agak longgar', nextNodeId: 'res-shim-pin' },
          { text: 'Tidak, plat bracket dinding yang terangkat dari tembok', nextNodeId: 'res-fischer-pullout' }
        ]
      },
      'res-hebel-fischer': {
        id: 'res-hebel-fischer',
        result: {
          cause: 'Fischer Standar Tidak Mencengkeram Porus Dinding Hebel / Gypsum',
          dangerLevel: 'WASPADA',
          safetyInstruction: 'Turunkan barang di atas ambalan sebelum ambalan ambruk.',
          recommendations: [
            'Fischer plastik standar licin jika dipasang di bata hebel yang empuk.',
            'Ganti dengan Fischer Khusus Hebel (tipe fischer spiral nilon atau fischer sayap toggle bolt).',
            'Gunakan sekrup yang lebih panjang (minimal 6-7 cm) agar menembus inti dinding.'
          ],
          suggestedProjectSlug: 'pasang-ambalan-melayang-floating-shelf'
        }
      },
      'res-shim-pin': {
        id: 'res-shim-pin',
        result: {
          cause: 'Celah Toleransi Lubang Besi Pin Terlalu Longgar',
          dangerLevel: 'AMAN',
          safetyInstruction: 'Tarik papan keluar dari pin bracket.',
          recommendations: [
            'Lilitkan isolasi listrik hitam 2-3 lapis pada batang besi pin bracket untuk menambah ketebalan diameter pin.',
            'Atau selipkan ganjal tipis (shim) di bagian bawah pertemuan plat besi dan papan kayu.',
            'Dorong kembali papan masuk ke pin hingga kencang.'
          ]
        }
      },
      'res-fischer-pullout': {
        id: 'res-fischer-pullout',
        result: {
          cause: 'Sekrup Dinding Bagian Atas Tercabut Akibat Momen Gaya Beban',
          dangerLevel: 'WASPADA',
          safetyInstruction: 'Beban ambalan melayang bertumpu 90% pada sekrup baris ATAS.',
          recommendations: [
            'Lepas sekrup atas dan pasang fischer ukuran lebih besar (upgrade dari S6 ke S8/S10).',
            'Pastikan kedalaman bor menembus bata padat, bukan hanya plesteran semen acian luar.',
            'Kurangi beban barang berat di bibir luar ambalan.'
          ],
          suggestedProjectSlug: 'pasang-ambalan-melayang-floating-shelf'
        }
      }
    }
  },

  // --- KONSTRUKSI & DINDING (KNS) ---
  {
    id: 'tree-wall-crack-eval',
    category: 'KNS',
    title: 'Dinding Tembok Retak (Rambut vs Retak Struktur Pondasi)',
    symptom: 'Muncul garis retakan pada plesteran dinding tembok kamar atau ruang tamu.',
    initialNodeId: 'qc1',
    nodes: {
      qc1: {
        id: 'qc1',
        question: 'Berapa perkiraan lebar celah retakan dan bentuk polanya?',
        options: [
          { text: 'Retak tipis < 1 mm, berpola acak seperti jaring laba-laba (pecah seribu)', nextNodeId: 'res-hairline-crack' },
          { text: 'Retak lurus tegas > 2 mm atau pola diagonal miring dari sudut kusen', nextNodeId: 'qc2' }
        ]
      },
      qc2: {
        id: 'qc2',
        question: 'Apakah retakan tersebut tembus hingga ke sisi luar tembok sebaliknya atau pintu/jendela menjadi seret?',
        options: [
          { text: 'Ya, tembus ke dua sisi dan kusen pintu ikut melorot miring', nextNodeId: 'res-structural-crack' },
          { text: 'Tidak tembus, hanya pada lapisan semen plesteran satu sisi', nextNodeId: 'res-plaster-debond' }
        ]
      },
      'res-hairline-crack': {
        id: 'res-hairline-crack',
        result: {
          cause: 'Retak Rambut Termal (Penyusutan Acian Semen Cepat Kering)',
          dangerLevel: 'AMAN',
          safetyInstruction: 'Retak rambut adalah fenomena kosmetik non-struktural.',
          recommendations: [
            'Buka sedikit celah dengan kape atau amplas halus No. 150.',
            'Aplikasikan plamir tembok elastis (acrylic wall putty) atau semen instan acian elastis.',
            'Gunakan cat dasar alkali resistant sealer sebelum mengecat ulang.',
            'Sesuai SNI: Pastikan acian selalu dirawat basah (curing) 2-3 hari saat pengerjaan plesteran baru.'
          ],
          suggestedProjectSlug: 'perbaikan-dinding-retak-plester-aci'
        }
      },
      'res-plaster-debond': {
        id: 'res-plaster-debond',
        result: {
          cause: 'Lepas Rekatan Plesteran Akibat Dinding Bata Kering Saat Pengerjaan',
          dangerLevel: 'WASPADA',
          safetyInstruction: 'Waspadai plesteran yang berongga (kopong) rontok menimpa anak-anak.',
          recommendations: [
            'Ketuk dinding dengan gagang obeng; bila bersuara kopong, plesteran lepas dari bata.',
            'Gunakan pahat untuk membuka alur celah huruf V selebar 1.5 cm.',
            'Kuas cairan bonding agent perekat beton ke celah alur.',
            'Isi kembali dengan adukan plester standar SNI 1 PC : 4 PP.',
            'Finishing dengan acian halus tebal 1.5 mm.'
          ],
          suggestedProjectSlug: 'perbaikan-dinding-retak-plester-aci'
        }
      },
      'res-structural-crack': {
        id: 'res-structural-crack',
        result: {
          cause: 'Retak Struktur Akibat Penurunan Pondasi atau Gempa Bumi',
          dangerLevel: 'BAHAYA',
          safetyInstruction: 'JANGAN HANYA MENAMBAL RETAK DENGAN SEMEN! Pondasi atau sloof bawah sedang mengalami pergeseran diferensial.',
          recommendations: [
            'Pasang pita kaca pengukur retak (glass tell-tale) untuk memantau apakah retak terus bertambah lebar.',
            'Konsultasikan segera dengan kontraktor sipil berlisensi atau arsitek.',
            'Perlu perkuatan kolom praktis tambahan (jacketing) atau penyuntikan epoxy beton bertekanan tinggi (pressure injection).'
          ],
          suggestedProjectSlug: 'pengecoran-kolom-praktis-beton-k175'
        }
      }
    }
  },
  {
    id: 'tree-concrete-leak',
    category: 'KNS',
    title: 'Dak Beton Talang Air Rembes & Menetes ke Plafon',
    symptom: 'Plafon gypsum bernoda cokelat basah atau ada tetesan air saat hujan deras dari arah dak beton.',
    initialNodeId: 'qd1',
    nodes: {
      qd1: {
        id: 'qd1',
        question: 'Di mana titik rembesan paling parah terlihat pada dak atas?',
        options: [
          { text: 'Pada pertemuan sudut 90° antara lantai dak dan dinding tembok pembatas', nextNodeId: 'res-corner-joint-leak' },
          { text: 'Ada genangan air banjir di lantai dak karena kemiringan ke pipa buang kurang miring', nextNodeId: 'res-ponding-slope-leak' }
        ]
      },
      'res-corner-joint-leak': {
        id: 'res-corner-joint-leak',
        result: {
          cause: 'Sobeknya Lapisan Cat Anti Bocor di Sudut Mati 90 Derajat',
          dangerLevel: 'WASPADA',
          safetyInstruction: 'Matikan aliran listrik lampu plafon di bawah titik tetesan air sebelum memeriksa atap.',
          recommendations: [
            'Kerok lapisan cat lama yang terkelupas dan lumut hitam sampai bersih.',
            'Buat plesteran sudut tumpul (chamfer / fillet 45 derajat) sepanjang sudut 90° sesuai SNI.',
            'Tanam serat kain kasa polyester mesh di antara lapisan cat waterproofing basah.',
            'Lapisi 3 lapis sistem silang arah melintang.'
          ],
          suggestedProjectSlug: 'waterproofing-dak-beton-nok-genteng'
        }
      },
      'res-ponding-slope-leak': {
        id: 'res-ponding-slope-leak',
        result: {
          cause: 'Genangan Air Akibat Kemiringan Dak Kurang dari 1% - 2%',
          dangerLevel: 'WASPADA',
          safetyInstruction: 'Air yang menggenang berhari-hari akan menembus beton sekuat apa pun.',
          recommendations: [
            'Bersihkan saringan roof drain dari sumbatan daun dan kotoran.',
            'Buat plesteran kemiringan ulang (screeding) ke arah pipa pembuangan minimal 1-2 cm per meter panjang.',
            'Setelah screed kering, aplikasikan waterproofing semen slurry 2 komponen fleksibel.'
          ],
          suggestedProjectSlug: 'waterproofing-dak-beton-nok-genteng'
        }
      }
    }
  }
];
