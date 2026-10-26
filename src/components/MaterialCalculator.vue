<template>
  <div class="calculator-box pt-card">
    <div class="calc-header">
      <div class="calc-title-row">
        <div class="calc-icon">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="4" y="2" width="16" height="20" rx="2"></rect>
            <line x1="8" y1="6" x2="16" y2="6"></line>
            <line x1="16" y1="14" x2="16" y2="18"></line>
            <path d="M16 10h.01"></path>
            <path d="M12 10h.01"></path>
            <path d="M8 10h.01"></path>
            <path d="M12 14h.01"></path>
            <path d="M8 14h.01"></path>
            <path d="M12 18h.01"></path>
            <path d="M8 18h.01"></path>
          </svg>
        </div>
        <div>
          <h4 class="calc-title">{{ config.title }}</h4>
          <p class="calc-desc">{{ config.description }}</p>
          <div v-if="config.sniReference" class="calc-sni-badge">
            <span class="flag-icon">🇮🇩</span>
            <span class="sni-badge-code">{{ config.sniReference.code }}</span>
            <span class="sni-badge-title">{{ config.sniReference.title }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="calc-body">
      <!-- Input Parameters -->
      <div class="params-grid">
        <div v-for="param in config.parameters" :key="param.id" class="param-item">
          <div class="param-label-row">
            <label :for="param.id" class="param-label">{{ param.label }}</label>
            <span class="param-value-pill">{{ paramValues[param.id] }} {{ param.unit }}</span>
          </div>

          <div class="slider-control">
            <input
              :id="param.id"
              type="range"
              :min="param.min"
              :max="param.max"
              :step="param.step"
              v-model.number="paramValues[param.id]"
              class="pt-range-slider"
            />
          </div>

          <p v-if="param.tooltip" class="param-hint">{{ param.tooltip }}</p>
        </div>
      </div>

      <!-- Output Results Panel -->
      <div class="results-panel">
        <div class="results-badge">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>Hasil Estimasi Kebutuhan Riil</span>
        </div>

        <div class="results-list">
          <div v-for="(item, idx) in calculatedResults.items" :key="idx" class="result-row">
            <div class="res-item-left">
              <span class="res-name">{{ item.name }}</span>
              <span v-if="item.subtext" class="res-subtext">{{ item.subtext }}</span>
            </div>
            <div class="res-item-right">
              <span class="res-qty">{{ item.quantity }}</span>
              <span class="res-cost">{{ formatRupiah(item.estimatedCost) }}</span>
            </div>
          </div>
        </div>

        <div class="total-budget-row">
          <div class="total-label">
            <span>Estimasi Total Anggaran Bahan</span>
            <small>Termasuk margin toleransi sisa pengerjaan</small>
          </div>
          <div class="total-val">{{ formatRupiah(calculatedResults.totalCost) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, watch } from 'vue';
import { CalculatorConfig, MaterialItem } from '../types';

const props = defineProps<{
  config: CalculatorConfig;
  materials: MaterialItem[];
}>();

const emit = defineEmits<{
  (e: 'updateCalculation', result: { totalCost: number; items: any[] }): void;
}>();

// Inisialisasi reactive nilai parameter dari defaultValue
const paramValues = reactive<Record<string, number>>({});
props.config.parameters.forEach((param) => {
  paramValues[param.id] = param.defaultValue;
});

const formatRupiah = (val: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(val);
};

const calculatedResults = computed(() => {
  const formula = props.config.formulaType;
  const items: { name: string; quantity: string; estimatedCost: number; subtext?: string }[] = [];
  let totalCost = 0;

  if (formula === 'electrical_cable') {
    const d1 = paramValues['distance_switch_ceiling'] || 1.5;
    const d2 = paramValues['distance_ceiling_lamp'] || 3.0;
    const allowance = (paramValues['extra_allowance_percent'] || 15) / 100;

    const baseLength = (d1 + d2) * (1 + allowance);
    const cableMeters = Math.ceil(baseLength * 10) / 10; // bulatkan ke 1 desimal
    const conduitPipes = Math.ceil(cableMeters / 2.9);
    const clips = Math.ceil(cableMeters / 0.6);

    const cablePricePerMeter = 9000;
    const conduitPricePerStick = 12000;
    const clipsPriceTotal = 5000;

    const cableCost = Math.ceil(cableMeters) * cablePricePerMeter;
    const conduitCost = conduitPipes * conduitPricePerStick;

    items.push({
      name: 'Kabel NYM Tembaga Tunggal',
      quantity: `${cableMeters} Meter`,
      estimatedCost: cableCost,
      subtext: `Jarak efektif ${(d1 + d2).toFixed(1)}m + toleransi ${(allowance * 100)}%`,
    });

    items.push({
      name: 'Pipa Konduit Pelindung PVC (2.9m/btg)',
      quantity: `${conduitPipes} Batang`,
      estimatedCost: conduitCost,
      subtext: 'Pelindung kabel dari gigitan tikus di plafon',
    });

    items.push({
      name: 'Klem Pipa Konduit & Sekrup',
      quantity: `${clips} Buah`,
      estimatedCost: clipsPriceTotal,
      subtext: 'Dipasang per jarak 60 cm',
    });

    totalCost = cableCost + conduitCost + clipsPriceTotal;
  } else if (formula === 'plumbing_pipe') {
    const isWastePipe = paramValues['drop_height'] !== undefined;

    if (isWastePipe) {
      const drop = paramValues['drop_height'] || 45;
      const horiz = paramValues['horizontal_distance'] || 40;
      const elbows = paramValues['elbow_count'] || 2;

      const totalCm = drop + horiz + 15;
      const sticks = Math.ceil(totalCm / 200);
      const pipeCost = sticks * 28000;
      const elbowCost = elbows * 5000;
      const glueCost = 9000;

      items.push({
        name: 'Pipa PVC D 1-1/4" (2 meter)',
        quantity: `${sticks} Batang (${totalCm} cm)`,
        estimatedCost: pipeCost,
        subtext: 'Sesuai jalur drop & buangan',
      });

      items.push({
        name: 'Knee / Elbow 90° / 45°',
        quantity: `${elbows} Buah`,
        estimatedCost: elbowCost,
        subtext: 'Sambungan belokan arah',
      });

      items.push({
        name: 'Lem Solvent Cement PVC Tube',
        quantity: '1 Tube',
        estimatedCost: glueCost,
      });

      totalCost = pipeCost + elbowCost + glueCost;
    } else {
      // Kran Seal Tape
      const diam = paramValues['pipe_diameter'] || 0.5;
      const isMetal = (paramValues['thread_material'] || 2) === 2;
      const faucets = paramValues['faucet_count'] || 1;

      const wrapsPerFaucet = isMetal ? 16 : 10;
      const tapeRolls = Math.max(1, Math.ceil((faucets * wrapsPerFaucet) / 40));
      const faucetPrice = 45000;
      const tapePrice = 5000;

      const fCost = faucets * faucetPrice;
      const tCost = tapeRolls * tapePrice;

      items.push({
        name: `Kran Air Drat ${diam}"`,
        quantity: `${faucets} Buah`,
        estimatedCost: fCost,
      });

      items.push({
        name: 'Seal Tape PTFE Tebal',
        quantity: `${tapeRolls} Roll (${wrapsPerFaucet} lilitan/kran)`,
        estimatedCost: tCost,
        subtext: isMetal ? 'Drat Logam butuh lilitan lebih rapat' : 'Drat Plastik lilitan sedang',
      });

      totalCost = fCost + tCost;
    }
  } else if (formula === 'floating_shelf') {
    const length = paramValues['shelf_length'] || 80;
    const targetLoad = paramValues['target_load'] || 10;

    const baseBrackets = Math.max(2, Math.ceil(length / 50));
    const extraLoadBrackets = targetLoad > 15 ? 1 : 0;
    const totalPins = baseBrackets + extraLoadBrackets;
    const fischerCount = totalPins * 2;

    const bracketCost = totalPins * 17500;
    const fischerCost = fischerCount * 1500;

    items.push({
      name: 'Pin Braket Besi Tanam (Rod Pin)',
      quantity: `${totalPins} Titik Pin`,
      estimatedCost: bracketCost,
      subtext: `Beban target ${targetLoad} kg pada bentang ${length} cm`,
    });

    items.push({
      name: 'Fischer Dinding S8 & Sekrup Baja 5cm',
      quantity: `${fischerCount} Pasang`,
      estimatedCost: fischerCost,
      subtext: '2 sekrup per dudukan bracket',
    });

    totalCost = bracketCost + fischerCost;
  } else if (formula === 'wall_plaster_ahsp') {
    const area = Number(paramValues['wall_area'] || 12);
    const thickMm = Number(paramValues['plaster_thickness'] || 15);
    const thickM = thickMm / 1000;
    const ratioMode = Number(paramValues['mortar_ratio'] || 2); // 1=1:3, 2=1:4, 3=1:5

    const volumeM3 = area * thickM * 1.1; // 10% toleransi jatuh
    let cementBags50kg = volumeM3 * 6.24;
    let sandM3 = volumeM3 * 0.83;

    if (ratioMode === 1) {
      cementBags50kg = volumeM3 * 7.8;
      sandM3 = volumeM3 * 0.78;
    } else if (ratioMode === 3) {
      cementBags50kg = volumeM3 * 5.1;
      sandM3 = volumeM3 * 0.88;
    }

    const acianSemenKg = area * 3.25;
    const acianBags40kg = Math.max(1, Math.ceil(acianSemenKg / 40));
    const finalCementBags = Math.max(1, Math.ceil(cementBags50kg));
    const finalSandKarung = Math.max(2, Math.ceil(sandM3 * 25));

    const costCement = finalCementBags * 58000;
    const costSand = finalSandKarung * 18000;
    const costAcian = acianBags40kg * 75000;

    items.push({
      name: 'Semen Portland PCC (50 kg)',
      quantity: `${finalCementBags} Sak`,
      estimatedCost: costCement,
      subtext: `Standar SNI Rasio 1:${ratioMode === 1 ? '3' : ratioMode === 3 ? '5' : '4'} tebal ${thickMm}mm`,
    });

    items.push({
      name: 'Pasir Pasang Ayak Halus',
      quantity: `${finalSandKarung} Karung (${sandM3.toFixed(2)} m³)`,
      estimatedCost: costSand,
      subtext: 'Bebas kandungan lumpur organik',
    });

    items.push({
      name: 'Semen Instan Acian Siap Pakai (40 kg)',
      quantity: `${acianBags40kg} Sak`,
      estimatedCost: costAcian,
      subtext: `Menutup ${area} m² acian tebal 1.5-2 mm`,
    });

    totalCost = costCement + costSand + costAcian;
  } else if (formula === 'hebel_aac_block') {
    const length = Number(paramValues['wall_length'] || 3.5);
    const height = Number(paramValues['wall_height'] || 2.8);
    const thicknessType = Number(paramValues['block_thickness'] || 1);

    const areaM2 = length * height;
    const blocksNeeded = Math.ceil(areaM2 * 8.33 * 1.05);
    const mortarKg = areaM2 * (thicknessType === 1 ? 4.0 : 4.8);
    const mortarBags40kg = Math.max(1, Math.ceil(mortarKg / 40));

    const pricePerBlock = thicknessType === 1 ? 9000 : 11500;
    const costBlocks = blocksNeeded * pricePerBlock;
    const costMortar = mortarBags40kg * 72000;

    items.push({
      name: `Bata Ringan Hebel AAC (Tebal ${thicknessType === 1 ? '7.5' : '10'} cm)`,
      quantity: `${blocksNeeded} Keping (${(blocksNeeded / 111).toFixed(2)} m³)`,
      estimatedCost: costBlocks,
      subtext: `Luas dinding ${areaM2.toFixed(1)} m² (termasuk toleransi 5%)`,
    });

    items.push({
      name: 'Semen Mortar Thinbed Perekat (40 kg)',
      quantity: `${mortarBags40kg} Sak`,
      estimatedCost: costMortar,
      subtext: 'Aplikasi roskam bergigi ketebalan spesi 3 mm',
    });

    totalCost = costBlocks + costMortar;
  } else if (formula === 'concrete_k175_mix') {
    const lenM = Number(paramValues['concrete_length'] || 3.0);
    const widthM = Number(paramValues['concrete_width'] || 15) / 100;
    const thickM = Number(paramValues['concrete_thickness'] || 15) / 100;

    const volumeM3 = lenM * widthM * thickM * 1.1;

    const cementBags50kg = Math.max(1, Math.ceil(volumeM3 * 6.5));
    const sandKarung = Math.max(2, Math.ceil(volumeM3 * 0.54 * 25));
    const splitKarung = Math.max(3, Math.ceil(volumeM3 * 0.76 * 25));

    const costCement = cementBags50kg * 68000;
    const costSand = sandKarung * 22000;
    const costSplit = splitKarung * 25000;

    items.push({
      name: 'Semen Portland PCC 50 kg',
      quantity: `${cementBags50kg} Sak`,
      estimatedCost: costCement,
      subtext: 'Takaran lapangan: 1 Bagian Ember',
    });

    items.push({
      name: 'Pasir Cor Kasar Hitam',
      quantity: `${sandKarung} Karung`,
      estimatedCost: costSand,
      subtext: 'Takaran lapangan: 2 Bagian Ember',
    });

    items.push({
      name: 'Batu Split / Kerikil 1-2 cm',
      quantity: `${splitKarung} Karung`,
      estimatedCost: costSplit,
      subtext: 'Takaran lapangan: 3 Bagian Ember',
    });

    totalCost = costCement + costSand + costSplit;
  } else if (formula === 'electrical_load_puil') {
    const totalWatt = Number(paramValues['total_watt'] || 1300);
    const wireDistM = Number(paramValues['wire_distance'] || 10);
    const voltage = 220; // Standar PLN 220V
    const currentAmp = totalWatt / voltage;

    let mcbAmp = 4;
    if (currentAmp > 16) mcbAmp = 25;
    else if (currentAmp > 10) mcbAmp = 16;
    else if (currentAmp > 6) mcbAmp = 10;
    else if (currentAmp > 4) mcbAmp = 6;

    let wireSpec = 'NYM 3 x 1.5 mm²';
    let wirePricePerM = 12000;
    if (mcbAmp >= 16) {
      wireSpec = 'NYM 3 x 2.5 mm²';
      wirePricePerM = 17500;
    }

    const wireCost = wireDistM * wirePricePerM;
    const mcbCost = 45000;

    items.push({
      name: `Kabel Tembaga ${wireSpec} (Standar PUIL 2020)`,
      quantity: `${wireDistM} Meter`,
      estimatedCost: wireCost,
      subtext: `Kapasitas beban arus ${currentAmp.toFixed(1)} Ampere (Daya ${totalWatt}W)`,
    });

    items.push({
      name: `MCB Box Pembatas ${mcbAmp} Ampere (SNI)`,
      quantity: `1 Buah`,
      estimatedCost: mcbCost,
      subtext: `Rating trip aman untuk daya ${totalWatt} Watt`,
    });

    totalCost = wireCost + mcbCost;
  } else {
    // default / door repair
    const height = paramValues['door_height'] || 120;
    const weight = paramValues['door_weight'] || 6;

    let hinges = 2;
    if (height > 180 || weight > 12) hinges = 4;
    else if (height > 120 || weight > 7) hinges = 3;

    const hingeCost = hinges * 18000;
    const screwCost = hinges * 4 * 500;

    items.push({
      name: 'Engsel Sendok Soft Close',
      quantity: `${hinges} Buah`,
      estimatedCost: hingeCost,
      subtext: `Rekomendasi untuk daun pintu ${height} cm (${weight} kg)`,
    });

    items.push({
      name: 'Sekrup Kayu 3.5 x 16mm',
      quantity: `${hinges * 4} Buah`,
      estimatedCost: screwCost,
    });

    totalCost = hingeCost + screwCost;
  }

  return { items, totalCost };
});

watch(calculatedResults, (newVal) => {
  emit('updateCalculation', newVal);
}, { immediate: true });
</script>

<style></style>

