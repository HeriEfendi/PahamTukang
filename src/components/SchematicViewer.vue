<template>
  <div class="schematic-container pt-card">
    <div class="schematic-header">
      <div class="header-left">
        <span class="schematic-tag">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5">
            <rect x="3" y="3" width="18" height="18" rx="2"></rect>
            <path d="M3 9h18M9 21V9"></path>
          </svg>
          Skema Diagram Pengerjaan
        </span>
        <h4 class="schematic-title">{{ title || 'Diagram Skematik Panduan' }}</h4>
      </div>
      <div class="zoom-indicator">
        <span class="zoom-badge">Vector SVG</span>
      </div>
    </div>

    <!-- SVG Canvas Rendering -->
    <div class="svg-canvas-wrapper">
      <!-- 1. Saklar Tunggal -->
      <svg v-if="schematicId === 'schematic-switch-single'" viewBox="0 0 700 360" class="diagram-svg">
        <defs>
          <linearGradient id="wire-fasa" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#ef4444" />
            <stop offset="100%" stop-color="#b91c1c" />
          </linearGradient>
          <linearGradient id="wire-netral" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#38bdf8" />
            <stop offset="100%" stop-color="#0284c7" />
          </linearGradient>
        </defs>

        <!-- Background Panel -->
        <rect x="0" y="0" width="700" height="360" rx="12" fill="#0d1424" />

        <!-- Grid Lines subtle -->
        <g stroke="#1e293b" stroke-width="1" stroke-dasharray="4,4">
          <line x1="50" y1="50" x2="650" y2="50" />
          <line x1="50" y1="180" x2="650" y2="180" />
          <line x1="50" y1="310" x2="650" y2="310" />
        </g>

        <!-- MCB Box Sumber (Kiri) -->
        <rect x="40" y="80" width="110" height="160" rx="8" fill="#1e293b" stroke="#f59e0b" stroke-width="2" />
        <rect x="75" y="110" width="40" height="60" rx="4" fill="#0f172a" />
        <rect x="85" y="125" width="20" height="30" rx="3" fill="#ef4444" />
        <text x="95" y="70" fill="#f8fafc" font-size="14" font-weight="bold" text-anchor="middle">MCB SUMBER</text>
        <text x="95" y="215" fill="#94a3b8" font-size="11" text-anchor="middle">PLN 220V</text>

        <!-- Jalur Fasa (Merah) dari MCB ke Saklar -->
        <path d="M 150 120 L 280 120 L 280 230" fill="none" stroke="url(#wire-fasa)" stroke-width="5" stroke-linecap="round" />
        <text x="210" y="110" fill="#f87171" font-size="12" font-weight="bold">Kawat Fasa (+)</text>

        <!-- Saklar Tunggal (Tengah Bawah) -->
        <rect x="230" y="230" width="100" height="90" rx="8" fill="#1e293b" stroke="#f59e0b" stroke-width="2" />
        <circle cx="260" cy="275" r="8" fill="#ef4444" />
        <circle cx="300" cy="275" r="8" fill="#ef4444" />
        <!-- Kontak Saklar (Buka/Tutup) -->
        <line x1="260" y1="275" x2="295" y2="260" stroke="#f8fafc" stroke-width="4" stroke-linecap="round" />
        <text x="280" y="340" fill="#f59e0b" font-size="13" font-weight="bold" text-anchor="middle">Saklar Dinding</text>

        <!-- Jalur Fasa Keluar Saklar Menuju Lampu -->
        <path d="M 300 275 L 500 275 L 500 190" fill="none" stroke="url(#wire-fasa)" stroke-width="5" stroke-linecap="round" />
        <text x="400" y="265" fill="#f87171" font-size="11" font-weight="bold">Fasa Terputus</text>

        <!-- Jalur Netral (Biru) LANGSUNG dari Sumber ke Lampu (TIDAK LEWAT SAKLAR) -->
        <path d="M 150 150 L 520 150 L 520 160" fill="none" stroke="url(#wire-netral)" stroke-width="5" stroke-linecap="round" />
        <text x="330" y="140" fill="#38bdf8" font-size="12" font-weight="bold">Kawat Netral (Nol) - Langsung ke Fitting</text>

        <!-- Lampu & Fitting (Kanan Atas) -->
        <circle cx="510" cy="170" r="30" fill="#fbbf24" fill-opacity="0.25" stroke="#f59e0b" stroke-width="3" />
        <circle cx="510" cy="170" r="14" fill="#fbbf24" />
        <!-- Cahaya Lampu Radiasi -->
        <line x1="510" y1="125" x2="510" y2="115" stroke="#fbbf24" stroke-width="3" />
        <line x1="545" y1="140" x2="555" y2="130" stroke="#fbbf24" stroke-width="3" />
        <line x1="545" y1="200" x2="555" y2="210" stroke="#fbbf24" stroke-width="3" />
        <text x="510" y="225" fill="#f8fafc" font-size="14" font-weight="bold" text-anchor="middle">Fitting Lampu</text>

        <!-- Legend Box -->
        <rect x="470" y="270" width="200" height="70" rx="6" fill="#131d2e" stroke="#334155" />
        <line x1="485" y1="290" x2="520" y2="290" stroke="#ef4444" stroke-width="4" />
        <text x="530" y="294" fill="#cbd5e1" font-size="11">Fasa (Arus 220V)</text>
        <line x1="485" y1="315" x2="520" y2="315" stroke="#38bdf8" stroke-width="4" />
        <text x="530" y="319" fill="#cbd5e1" font-size="11">Netral (Nol Volt)</text>
      </svg>

      <!-- 2. Saklar Ganda / Seri -->
      <svg v-else-if="schematicId === 'schematic-switch-double'" viewBox="0 0 700 360" class="diagram-svg">
        <rect x="0" y="0" width="700" height="360" rx="12" fill="#0d1424" />
        <!-- MCB -->
        <rect x="40" y="100" width="90" height="130" rx="8" fill="#1e293b" stroke="#f59e0b" stroke-width="2" />
        <text x="85" y="85" fill="#f8fafc" font-size="13" font-weight="bold" text-anchor="middle">MCB SUMBER</text>

        <!-- Saklar Ganda -->
        <rect x="220" y="180" width="130" height="120" rx="8" fill="#1e293b" stroke="#f59e0b" stroke-width="2" />
        <text x="285" y="325" fill="#f59e0b" font-size="12" font-weight="bold" text-anchor="middle">Saklar Ganda (2 Tombol)</text>

        <!-- Fasa Masuk & Jumper -->
        <path d="M 130 130 L 250 130 L 250 210" fill="none" stroke="#ef4444" stroke-width="4" />
        <!-- Jumper antara input 1 dan input 2 -->
        <path d="M 250 210 Q 270 190 290 210" fill="none" stroke="#fbbf24" stroke-width="5" />
        <text x="270" y="185" fill="#fbbf24" font-size="11" font-weight="bold" text-anchor="middle">Kawat Jumper</text>

        <!-- Output 1 ke Lampu A -->
        <path d="M 250 260 L 460 260 L 460 140" fill="none" stroke="#ef4444" stroke-width="4" />
        <!-- Output 2 ke Lampu B -->
        <path d="M 290 260 L 590 260 L 590 140" fill="none" stroke="#f97316" stroke-width="4" />

        <!-- Netral ke Kedua Lampu -->
        <path d="M 130 150 L 490 150 L 620 150" fill="none" stroke="#38bdf8" stroke-width="4" />

        <!-- Lampu A -->
        <circle cx="475" cy="120" r="22" fill="#fbbf24" fill-opacity="0.3" stroke="#f59e0b" stroke-width="2" />
        <text x="475" y="170" fill="#f8fafc" font-size="12" font-weight="bold" text-anchor="middle">Lampu A</text>

        <!-- Lampu B -->
        <circle cx="605" cy="120" r="22" fill="#fbbf24" fill-opacity="0.3" stroke="#f59e0b" stroke-width="2" />
        <text x="605" y="170" fill="#f8fafc" font-size="12" font-weight="bold" text-anchor="middle">Lampu B</text>
      </svg>

      <!-- 3. Stop Kontak Berarde -->
      <svg v-else-if="schematicId === 'schematic-socket-ground'" viewBox="0 0 700 360" class="diagram-svg">
        <rect x="0" y="0" width="700" height="360" rx="12" fill="#0d1424" />
        <!-- Panel 3 Kabel -->
        <rect x="50" y="70" width="160" height="200" rx="10" fill="#1e293b" stroke="#334155" />
        <text x="130" y="100" fill="#f8fafc" font-size="13" font-weight="bold" text-anchor="middle">Jalur Induk NYM 3x2.5</text>

        <!-- Kabel Fasa (Cokelat) -->
        <path d="M 210 120 L 420 120" fill="none" stroke="#ef4444" stroke-width="5" />
        <text x="290" y="112" fill="#f87171" font-size="11" font-weight="bold">Fasa (220V)</text>

        <!-- Kabel Ground (Kuning-Hijau) -->
        <path d="M 210 170 L 460 170" fill="none" stroke="#84cc16" stroke-width="5" stroke-dasharray="8,4" />
        <text x="290" y="162" fill="#a3e635" font-size="11" font-weight="bold">Arde / Ground (⏚)</text>

        <!-- Kabel Netral (Biru) -->
        <path d="M 210 220 L 500 220" fill="none" stroke="#38bdf8" stroke-width="5" />
        <text x="290" y="212" fill="#38bdf8" font-size="11" font-weight="bold">Netral (Nol)</text>

        <!-- Stop Kontak Schuko Tampak Depan & Belakang -->
        <circle cx="460" cy="170" r="75" fill="#1e293b" stroke="#f59e0b" stroke-width="3" />
        <!-- Dua Lubang Pin -->
        <circle cx="420" cy="170" r="12" fill="#0f172a" stroke="#ef4444" stroke-width="2" />
        <circle cx="500" cy="170" r="12" fill="#0f172a" stroke="#38bdf8" stroke-width="2" />
        <!-- Kuping Arde Atas Bawah -->
        <rect x="453" y="105" width="14" height="18" rx="2" fill="#84cc16" />
        <rect x="453" y="217" width="14" height="18" rx="2" fill="#84cc16" />
        <text x="460" y="275" fill="#f8fafc" font-size="13" font-weight="bold" text-anchor="middle">Stop Kontak 3 Pin</text>
      </svg>

      <!-- 4. Lilitan Seal Tape Kran -->
      <svg v-else-if="schematicId === 'schematic-faucet-tape'" viewBox="0 0 700 360" class="diagram-svg">
        <rect x="0" y="0" width="700" height="360" rx="12" fill="#0d1424" />
        <!-- Bodi Kran -->
        <path d="M 120 180 L 260 180 L 260 120 L 320 120 L 320 220 L 280 240 L 260 220 L 260 200 L 120 200 Z" fill="#475569" stroke="#94a3b8" stroke-width="2" />
        <text x="200" y="160" fill="#f8fafc" font-size="13" font-weight="bold">Bodi Logam Kran</text>

        <!-- Ulir Drat Kran -->
        <g stroke="#f8fafc" stroke-width="4">
          <line x1="80" y1="175" x2="80" y2="205" />
          <line x1="90" y1="175" x2="90" y2="205" />
          <line x1="100" y1="175" x2="100" y2="205" />
          <line x1="110" y1="175" x2="110" y2="205" />
        </g>
        <rect x="75" y="173" width="40" height="34" fill="#ffffff" fill-opacity="0.8" rx="2" />
        <text x="95" y="155" fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="middle">Seal Tape</text>

        <!-- Arah Putaran Panah Lingkaran Searah Jarum Jam -->
        <path d="M 460 120 A 70 70 0 1 1 450 240" fill="none" stroke="#f59e0b" stroke-width="5" stroke-dasharray="6,4" />
        <polygon points="460,110 475,130 450,130" fill="#f59e0b" />
        <text x="480" y="180" fill="#f59e0b" font-size="15" font-weight="bold" text-anchor="middle">SEARAH JARUM JAM</text>
        <text x="480" y="205" fill="#cbd5e1" font-size="12" text-anchor="middle">(Menghadap Penampang Drat)</text>
        <text x="480" y="235" fill="#34d399" font-size="11" text-anchor="middle">✓ Tidak Melipat Saat Masuk Soket Dinding</text>
      </svg>

      <!-- 5. Anatomi Siphon P-Trap -->
      <svg v-else-if="schematicId === 'schematic-ptrap-diagram'" viewBox="0 0 700 360" class="diagram-svg">
        <rect x="0" y="0" width="700" height="360" rx="12" fill="#0d1424" />
        <!-- Dasar Wastafel -->
        <rect x="180" y="30" width="180" height="25" rx="4" fill="#334155" />
        <text x="270" y="47" fill="#f8fafc" font-size="12" font-weight="bold" text-anchor="middle">Dasar Wastafel / Afur</text>

        <!-- Pipa P-Trap Lekukan U -->
        <path d="M 270 55 L 270 170 C 270 260, 380 260, 380 180 L 380 160 L 520 160" fill="none" stroke="#64748b" stroke-width="36" stroke-linecap="square" />
        <!-- Air Genangan Water Seal (Biru) -->
        <path d="M 270 160 L 270 170 C 270 260, 380 260, 380 180 L 380 160" fill="none" stroke="#0ea5e9" stroke-width="24" />
        <text x="325" y="235" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">Water Seal (Jebakan Air)</text>
        <text x="325" y="255" fill="#cbd5e1" font-size="10" text-anchor="middle">Menahan Bau Got Masuk</text>

        <!-- Pipa Buangan Dinding -->
        <rect x="520" y="130" width="80" height="60" fill="#1e293b" stroke="#f59e0b" stroke-width="2" />
        <text x="560" y="165" fill="#f8fafc" font-size="11" font-weight="bold" text-anchor="middle">Dinding</text>

        <!-- Mur Karet Service -->
        <rect x="250" y="100" width="40" height="15" rx="3" fill="#f59e0b" />
        <text x="315" y="112" fill="#fbbf24" font-size="11">Mur Seal Karet (Tanpa Lem)</text>
      </svg>

      <!-- 6. Radar Pelampung Toren -->
      <svg v-else-if="schematicId === 'schematic-radar-toren'" viewBox="0 0 700 360" class="diagram-svg">
        <rect x="0" y="0" width="700" height="360" rx="12" fill="#0d1424" />
        <!-- Tangki Toren -->
        <rect x="220" y="40" width="260" height="280" rx="14" fill="#131d2e" stroke="#334155" stroke-width="2" />
        <!-- Permukaan Air Toren -->
        <rect x="222" y="180" width="256" height="138" fill="#0ea5e9" fill-opacity="0.2" />

        <!-- Bodi Radar di Atap Toren -->
        <rect x="320" y="20" width="60" height="40" rx="6" fill="#f97316" stroke="#f8fafc" stroke-width="2" />
        <text x="350" y="15" fill="#f8fafc" font-size="11" font-weight="bold" text-anchor="middle">Saklar Radar</text>

        <!-- Tali Nilon Gantung -->
        <line x1="350" y1="60" x2="350" y2="260" stroke="#f8fafc" stroke-width="2" />

        <!-- Bandul Atas A1 (Batas Penuh / Pompa OFF) -->
        <circle cx="350" cy="120" r="16" fill="#ea580c" stroke="#f8fafc" stroke-width="2" />
        <text x="380" y="125" fill="#fbbf24" font-size="11" font-weight="bold">Bandul A1 (Batas OFF)</text>

        <!-- Bandul Bawah A2 (Batas Kosong / Pompa ON) -->
        <circle cx="350" cy="240" r="16" fill="#ea580c" stroke="#f8fafc" stroke-width="2" />
        <text x="380" y="245" fill="#34d399" font-size="11" font-weight="bold">Bandul A2 (Batas ON)</text>

        <!-- Jalur Kabel Seri ke Pompa -->
        <path d="M 330 30 L 100 30 L 100 240" fill="none" stroke="#ef4444" stroke-width="4" />
        <rect x="60" y="240" width="80" height="70" rx="6" fill="#1e293b" stroke="#f59e0b" />
        <text x="100" y="280" fill="#f8fafc" font-size="12" font-weight="bold" text-anchor="middle">Pompa Air</text>
      </svg>

      <!-- 7. Pin Ambalan Dinding Melayang -->
      <svg v-else-if="schematicId === 'schematic-shelf-bracket'" viewBox="0 0 700 360" class="diagram-svg">
        <rect x="0" y="0" width="700" height="360" rx="12" fill="#0d1424" />
        <!-- Dinding Bata / Beton -->
        <rect x="60" y="40" width="180" height="280" fill="#1e293b" stroke="#334155" stroke-width="2" />
        <text x="150" y="80" fill="#94a3b8" font-size="13" font-weight="bold" text-anchor="middle">Dinding Plesteran</text>

        <!-- Fischer Plastik S8 di Dinding -->
        <rect x="110" y="135" width="130" height="20" rx="3" fill="#cbd5e1" />
        <line x1="80" y1="145" x2="240" y2="145" stroke="#f59e0b" stroke-width="6" />
        <text x="160" y="125" fill="#fbbf24" font-size="11" font-weight="bold" text-anchor="middle">Fischer S8 & Sekrup 5cm</text>

        <!-- Plat Bracket Besi Tempel -->
        <rect x="240" y="110" width="15" height="140" fill="#64748b" stroke="#f8fafc" stroke-width="2" />

        <!-- Pin Besi Tanam (Menjorok Horizontal) -->
        <rect x="255" y="135" width="220" height="18" rx="4" fill="#94a3b8" stroke="#f8fafc" stroke-width="2" />

        <!-- Papan Kayu Ambalan (Transparan / Potongan) -->
        <rect x="250" y="90" width="360" height="110" rx="6" fill="#b45309" fill-opacity="0.35" stroke="#f59e0b" stroke-width="2" stroke-dasharray="6,4" />
        <text x="440" y="120" fill="#f8fafc" font-size="13" font-weight="bold" text-anchor="middle">Papan Ambalan Kayu</text>
        <text x="440" y="175" fill="#fbbf24" font-size="11" text-anchor="middle">Lubang bor pin di dalam kayu</text>
      </svg>

      <!-- 8. 3 Baut Penyetel Engsel Sendok -->
      <svg v-else-if="schematicId === 'schematic-hinge-adjust'" viewBox="0 0 700 360" class="diagram-svg">
        <rect x="0" y="0" width="700" height="360" rx="12" fill="#0d1424" />
        <!-- Bodi Engsel Sendok -->
        <circle cx="160" cy="180" r="50" fill="#334155" stroke="#64748b" stroke-width="3" />
        <text x="160" y="185" fill="#f8fafc" font-size="11" font-weight="bold" text-anchor="middle">Mangkok 35mm</text>

        <!-- Lengan Engsel -->
        <rect x="180" y="155" width="360" height="50" rx="6" fill="#475569" stroke="#64748b" stroke-width="2" />

        <!-- Baut 1: Depan (Kiri - Kanan) -->
        <circle cx="270" cy="180" r="14" fill="#f59e0b" stroke="#0f172a" stroke-width="2" />
        <text x="270" y="185" fill="#0f172a" font-size="12" font-weight="bold" text-anchor="middle">1</text>
        <text x="270" y="240" fill="#f59e0b" font-size="11" font-weight="bold" text-anchor="middle">Baut 1: Celah Kiri/Kanan</text>

        <!-- Baut 2: Belakang (Maju - Mundur) -->
        <circle cx="390" cy="180" r="14" fill="#0ea5e9" stroke="#0f172a" stroke-width="2" />
        <text x="390" y="185" fill="#0f172a" font-size="12" font-weight="bold" text-anchor="middle">2</text>
        <text x="390" y="240" fill="#0ea5e9" font-size="11" font-weight="bold" text-anchor="middle">Baut 2: Maju/Mundur</text>

        <!-- Baut 3: Plat Oval (Atas - Bawah) -->
        <rect x="475" y="165" width="20" height="30" rx="6" fill="#10b981" stroke="#0f172a" stroke-width="2" />
        <text x="485" y="185" fill="#0f172a" font-size="12" font-weight="bold" text-anchor="middle">3</text>
        <text x="485" y="240" fill="#10b981" font-size="11" font-weight="bold" text-anchor="middle">Baut 3: Naik/Turun</text>
      </svg>

      <!-- 9. Buka Celah Alur V & Plester Aci (SNI 03-2835) -->
      <svg v-else-if="schematicId === 'schematic-wall-crack-v'" viewBox="0 0 700 360" class="diagram-svg">
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
        <rect x="50" y="70" width="600" height="220" rx="6" fill="url(#grad-brick)" stroke="#d97706" stroke-width="2" />
        <rect x="50" y="70" width="600" height="30" fill="url(#grad-plaster)" />
        <text x="70" y="90" fill="#f8fafc" font-size="12" font-weight="bold">Plesteran Lama</text>
        <text x="70" y="160" fill="#fed7aa" font-size="14" font-weight="bold">Dinding Bata / Hebel</text>
        <polygon points="350,70 310,180 390,180" fill="#1e293b" stroke="#f59e0b" stroke-width="3" stroke-dasharray="4,4" />
        <polygon points="350,70 325,160 375,160" fill="#38bdf8" opacity="0.85" />
        <line x1="220" y1="120" x2="320" y2="120" stroke="#f8fafc" stroke-width="2" />
        <text x="130" y="115" fill="#f8fafc" font-size="13" font-weight="bold">Alur Pahat "V" (45°)</text>
        <text x="130" y="132" fill="#94a3b8" font-size="11">Lebar 1.5 cm, Dalam 1.5 cm</text>
        <line x1="480" y1="120" x2="365" y2="120" stroke="#f59e0b" stroke-width="2" />
        <text x="490" y="115" fill="#f59e0b" font-size="13" font-weight="bold">Isian Plester SNI 1:4</text>
        <text x="490" y="132" fill="#94a3b8" font-size="11">+ Lem Bonding Agent Perekat</text>
        <rect x="290" y="66" width="120" height="8" rx="2" fill="#34d399" />
        <text x="350" y="55" fill="#34d399" font-size="12" font-weight="bold" text-anchor="middle">Acian Tebal 1.5 - 2 mm</text>
      </svg>

      <!-- 10. Pemasangan Hebel & Roskam Gerigi (SNI 03-6882) -->
      <svg v-else-if="schematicId === 'schematic-hebel-mortar'" viewBox="0 0 700 360" class="diagram-svg">
        <rect width="700" height="360" rx="12" fill="#0d1424" />
        <rect x="60" y="210" width="280" height="85" rx="4" fill="#334155" stroke="#94a3b8" stroke-width="2" />
        <rect x="350" y="210" width="290" height="85" rx="4" fill="#334155" stroke="#94a3b8" stroke-width="2" />
        <text x="200" y="260" fill="#f8fafc" font-size="14" font-weight="bold">Hebel Blok A</text>
        <text x="490" y="260" fill="#f8fafc" font-size="14" font-weight="bold">Hebel Blok B</text>
        <path d="M 60 205 Q 80 198 100 205 T 140 205 T 180 205 T 220 205 T 260 205 T 300 205 T 340 205 T 380 205 T 420 205 T 460 205 T 500 205 T 540 205 T 580 205 T 620 205 T 640 205" fill="none" stroke="#f59e0b" stroke-width="6" stroke-linecap="round" />
        <text x="350" y="195" fill="#f59e0b" font-size="12" font-weight="bold" text-anchor="middle">Alur Mortar Thinbed 3 mm (Roskam Gerigi 6 mm)</text>
        <rect x="200" y="105" width="300" height="85" rx="4" fill="#475569" stroke="#cbd5e1" stroke-width="2" />
        <text x="350" y="155" fill="#f8fafc" font-size="14" font-weight="bold" text-anchor="middle">Hebel Blok C (Overlap min 15 cm)</text>
        <rect x="40" y="140" width="90" height="15" rx="2" fill="#ef4444" stroke="#f8fafc" stroke-width="1.5" />
        <circle cx="55" cy="147" r="4" fill="#f8fafc" />
        <text x="85" y="130" fill="#f87171" font-size="11" font-weight="bold">Plat Angkur L</text>
        <text x="85" y="170" fill="#94a3b8" font-size="10">Paku ke Kolom tiap 60 cm</text>
      </svg>

      <!-- 11. Rasio Cor Beton K-175 & Selimut Beton SNI (SNI 2847) -->
      <svg v-else-if="schematicId === 'schematic-concrete-mix'" viewBox="0 0 700 360" class="diagram-svg">
        <rect width="700" height="360" rx="12" fill="#0d1424" />
        <g transform="translate(40, 50)">
          <rect x="10" y="40" width="60" height="80" rx="6" fill="#64748b" stroke="#f8fafc" stroke-width="1.5" />
          <text x="40" y="145" fill="#f8fafc" font-size="12" font-weight="bold" text-anchor="middle">1 Ember</text>
          <text x="40" y="160" fill="#cbd5e1" font-size="11" text-anchor="middle">Semen PC</text>
          <text x="90" y="90" fill="#f59e0b" font-size="24" font-weight="bold">+</text>
          <rect x="115" y="40" width="60" height="80" rx="6" fill="#d97706" />
          <rect x="185" y="40" width="60" height="80" rx="6" fill="#d97706" />
          <text x="180" y="145" fill="#f59e0b" font-size="12" font-weight="bold" text-anchor="middle">2 Ember</text>
          <text x="180" y="160" fill="#fed7aa" font-size="11" text-anchor="middle">Pasir Cor Kasar</text>
          <text x="265" y="90" fill="#f59e0b" font-size="24" font-weight="bold">+</text>
          <rect x="290" y="40" width="55" height="80" rx="6" fill="#475569" />
          <rect x="355" y="40" width="55" height="80" rx="6" fill="#475569" />
          <rect x="420" y="40" width="55" height="80" rx="6" fill="#475569" />
          <text x="382" y="145" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">3 Ember</text>
          <text x="382" y="160" fill="#bae6fd" font-size="11" text-anchor="middle">Batu Split 1-2 cm</text>
        </g>
        <g transform="translate(520, 70)">
          <rect x="0" y="0" width="140" height="140" fill="#1e293b" stroke="#e2e8f0" stroke-width="3" />
          <text x="70" y="-10" fill="#94a3b8" font-size="11" text-anchor="middle">Papan Bekisting</text>
          <rect x="5" y="5" width="130" height="130" fill="#334155" />
          <rect x="25" y="25" width="90" height="90" fill="none" stroke="#ef4444" stroke-width="4" rx="4" />
          <circle cx="25" cy="25" r="7" fill="#ef4444" />
          <circle cx="115" cy="25" r="7" fill="#ef4444" />
          <circle cx="25" cy="115" r="7" fill="#ef4444" />
          <circle cx="115" cy="115" r="7" fill="#ef4444" />
          <rect x="5" y="60" width="20" height="20" fill="#34d399" />
          <text x="70" y="170" fill="#34d399" font-size="12" font-weight="bold" text-anchor="middle">Selimut Beton 20 mm</text>
          <text x="70" y="188" fill="#94a3b8" font-size="10" text-anchor="middle">(Ganjal Tahu Beton SNI)</text>
        </g>
      </svg>

      <!-- 12. Sudut Chamfer 45° & Kasa Fiber Waterproofing (SNI 03-6861) -->
      <svg v-else-if="schematicId === 'schematic-waterproofing-plint'" viewBox="0 0 700 360" class="diagram-svg">
        <rect width="700" height="360" rx="12" fill="#0d1424" />
        <polygon points="120,50 200,50 200,220 580,220 580,290 120,290" fill="#1e293b" stroke="#475569" stroke-width="3" />
        <text x="160" y="120" fill="#f8fafc" font-size="13" font-weight="bold">Dinding Plint</text>
        <text x="380" y="260" fill="#f8fafc" font-size="14" font-weight="bold">Lantai Plat Dak Beton</text>
        <polygon points="200,170 200,220 250,220" fill="#f59e0b" stroke="#d97706" stroke-width="2" />
        <text x="260" y="185" fill="#f59e0b" font-size="12" font-weight="bold">Sudut Chamfer 45°</text>
        <text x="260" y="202" fill="#fed7aa" font-size="10">(Cegah Membran Pecah di Sudut 90°)</text>
        <path d="M 195 120 L 195 170 L 250 225 L 360 225" fill="none" stroke="#38bdf8" stroke-width="4" stroke-dasharray="6,4" />
        <text x="365" y="150" fill="#38bdf8" font-size="12" font-weight="bold">Serat Kasa Polyester Mesh</text>
        <text x="365" y="167" fill="#94a3b8" font-size="10">Ditanam di antara lapis 1 & 2</text>
        <path d="M 190 90 L 190 170 L 255 230 L 440 230" fill="none" stroke="#059669" stroke-width="5" stroke-linecap="round" />
        <text x="445" y="210" fill="#34d399" font-size="12" font-weight="bold">Waterproofing 3 Lapis Silang</text>
      </svg>

      <!-- Fallback Default Generic Schematic -->
      <svg v-else viewBox="0 0 700 300" class="diagram-svg">
        <rect x="0" y="0" width="700" height="300" rx="12" fill="#0d1424" />
        <circle cx="350" cy="130" r="40" fill="#f59e0b" fill-opacity="0.15" stroke="#f59e0b" stroke-width="2" />
        <text x="350" y="138" fill="#f59e0b" font-size="28" text-anchor="middle">🛠️</text>
        <text x="350" y="200" fill="#f8fafc" font-size="14" font-weight="bold" text-anchor="middle">Diagram Panduan Presisi PahamTukang</text>
        <text x="350" y="225" fill="#94a3b8" font-size="12" text-anchor="middle">Ikuti instruksi langkah kerja dengan cermat</text>
      </svg>
    </div>

    <div class="schematic-footer">
      <p class="footer-desc">{{ description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  schematicId?: string;
  title?: string;
  description?: string;
}>();
</script>

<style></style>

