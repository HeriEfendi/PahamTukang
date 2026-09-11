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

