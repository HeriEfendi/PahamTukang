<template>
  <div v-if="isOpen" class="tools-modal-backdrop" @click.self="closeModal">
    <div class="tools-modal-card pt-card">
      <div class="tools-modal-header">
        <div class="header-left">
          <div class="tool-badge-icon">🛠️</div>
          <div>
            <h3 class="tools-modal-title">Kotak Perkakas Digital</h3>
            <p class="tools-modal-sub">Alat bantu pertukangan offline langsung di ponsel Anda</p>
          </div>
        </div>
        <button class="close-btn" @click="closeModal" aria-label="Tutup">✕</button>
      </div>

      <!-- Tab Switcher -->
      <div class="tools-nav-tabs">
        <button
          :class="['tool-nav-btn', { active: activeTool === 'level' }]"
          @click="activeTool = 'level'"
        >
          ⚖️ Waterpass Digital
        </button>
        <button
          :class="['tool-nav-btn', { active: activeTool === 'ruler' }]"
          @click="activeTool = 'ruler'"
        >
          📏 Penggaris Layar
        </button>
        <button
          :class="['tool-nav-btn', { active: activeTool === 'torch' }]"
          @click="activeTool = 'torch'"
        >
          💡 Lampu Sorot
        </button>
      </div>

      <div class="tools-modal-body">
        <!-- 1. WATERPASS DIGITAL SPIRIT LEVEL -->
        <div v-if="activeTool === 'level'" class="level-pane">
          <div class="level-indicator-box" :class="{ 'is-balanced': isBalanced }">
            <div class="spirit-tube">
              <div class="center-target-zone"></div>
              <div
                class="spirit-bubble"
                :style="{ transform: `translate(${bubbleX}px, ${bubbleY}px)` }"
              ></div>
            </div>

            <div class="level-readouts">
              <div class="readout-pill" :class="{ perfect: isBalanced }">
                <span class="readout-label">Kemiringan:</span>
                <span class="readout-val">{{ currentPitch.toFixed(1) }}°</span>
              </div>
              <div class="readout-badge" :class="isBalanced ? 'status-ok' : 'status-tilt'">
                <span v-if="isBalanced">✓ Rata Sempurna (Toleransi SNI &lt; 0.8°)</span>
                <span v-else>⚠️ Bidang Miring, Sejajarkan Permukaan</span>
              </div>
            </div>

            <!-- Tombol Kalibrasi Nol -->
            <div class="level-actions-row">
              <button class="level-action-btn" @click="calibrateZero" title="Setel sudut saat ini sebagai titik nol rata">
                🎯 Kalibrasi Nol
              </button>
              <button v-if="calibrationOffset !== 0" class="level-action-btn reset-btn" @click="resetCalibration">
                🔄 Reset Nol
              </button>
            </div>

            <!-- Manual Slider for Desktop / No sensor -->
            <div v-if="!hasOrientationSensor" class="manual-slider-wrap">
              <label class="slider-lbl">Simulasi Manual Kemiringan:</label>
              <input
                type="range"
                min="-45"
                max="45"
                step="0.5"
                v-model.number="manualAngle"
                @input="applyManualAngle"
                class="pt-range-slider"
              />
            </div>
          </div>

          <div class="tool-instruction-card">
            <h4>💡 Cara Menggunakan Waterpass:</h4>
            <p>
              Tempelkan tepi atau punggung ponsel pada permukaan dinding, kusen pintu, ambalan, atau bata hebel. Gerakkan hingga gelembung berada tepat di antara dua garis tengah. Tekan <strong>Kalibrasi Nol</strong> untuk menyetel bidang acuan.
            </p>
          </div>
        </div>

        <!-- 2. PENGGARIS LAYAR (SCREEN RULER) -->
        <div v-else-if="activeTool === 'ruler'" class="ruler-pane">
          <div class="ruler-container">
            <div class="screen-ruler">
              <div v-for="cm in 12" :key="cm" class="ruler-cm-mark">
                <span class="cm-num">{{ cm }}</span>
                <div class="mm-group">
                  <span v-for="mm in 9" :key="mm" :class="['mm-tick', { 'half-tick': mm === 5 }]"></span>
                </div>
              </div>
            </div>
          </div>
          <div class="tool-instruction-card">
            <h4>💡 Panduan Penggaris Kalibrasi:</h4>
            <p>
              Tempelkan kepala baut, sekrup, paku, atau tebal kayu pada skala sentimeter/milimeter di atas untuk mengukur panjang dan diameternya secara presisi di tempat kerja.
            </p>
          </div>
        </div>

        <!-- 3. LAMPU SOROT KERJA (TORCH / INSPECTION LIGHT) -->
        <div v-else-if="activeTool === 'torch'" class="torch-pane">
          <div class="torch-card" :class="{ 'torch-on': torchActive }">
            <div class="torch-bulb">
              {{ torchActive ? '💡' : '🔦' }}
            </div>
            <h4>{{ torchActive ? 'Lampu Kerja Aktif' : 'Lampu Kerja Padam' }}</h4>
            <p>{{ torchActive ? 'Layar memancarkan cahaya putih maksimal untuk area gelap plafon atau bawah wastafel.' : 'Nyalakan lampu inspeksi darurat saat memeriksa sudut sambungan pipa.' }}</p>

            <button class="pt-btn pt-btn-amber torch-toggle-btn" @click="torchActive = !torchActive">
              {{ torchActive ? 'Matikan Lampu' : 'Nyalakan Lampu Putih Terang' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { NativeService } from '../services/native';

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const activeTool = ref<'level' | 'ruler' | 'torch'>('level');
const currentPitch = ref(0);
const currentRoll = ref(0);
const bubbleX = ref(0);
const bubbleY = ref(0);
const hasOrientationSensor = ref(false);
const torchActive = ref(false);
const calibrationOffset = ref(0);
const manualAngle = ref(0);

let rawGamma = 0;

const isBalanced = computed(() => Math.abs(currentPitch.value) <= 0.8);

let hapticCooldown = false;

const playChimeTone = () => {
  try {
    if (typeof window !== 'undefined' && (window.AudioContext || (window as any).webkitAudioContext)) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // Note A5 (clean chime)
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    }
  } catch {
    // Ignore audio autoplay restrictions if user hasn't interacted
  }
};

const handleOrientation = (event: DeviceOrientationEvent) => {
  if (event.gamma === null && event.beta === null) return;
  hasOrientationSensor.value = true;

  rawGamma = event.gamma || 0;
  const beta = event.beta || 0;

  const adjustedPitch = rawGamma - calibrationOffset.value;
  currentPitch.value = adjustedPitch;
  currentRoll.value = beta;

  // Batasi jangkauan translasi bubble
  bubbleX.value = Math.max(-105, Math.min(105, adjustedPitch * 2.8));
  bubbleY.value = Math.max(-18, Math.min(18, (beta - 45) * 1.2));

  if (isBalanced.value && !hapticCooldown) {
    NativeService.triggerHapticFeedback('success');
    playChimeTone();
    hapticCooldown = true;
    setTimeout(() => {
      hapticCooldown = false;
    }, 1500);
  }
};

const calibrateZero = () => {
  calibrationOffset.value = rawGamma;
  currentPitch.value = 0;
  bubbleX.value = 0;
  NativeService.triggerHapticFeedback('medium');
};

const resetCalibration = () => {
  calibrationOffset.value = 0;
  currentPitch.value = rawGamma;
  bubbleX.value = Math.max(-105, Math.min(105, rawGamma * 2.8));
  NativeService.triggerHapticFeedback('light');
};

const applyManualAngle = () => {
  currentPitch.value = manualAngle.value;
  bubbleX.value = Math.max(-105, Math.min(105, manualAngle.value * 2.8));
  bubbleY.value = 0;

  if (isBalanced.value && !hapticCooldown) {
    NativeService.triggerHapticFeedback('success');
    playChimeTone();
    hapticCooldown = true;
    setTimeout(() => {
      hapticCooldown = false;
    }, 1500);
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

const closeModal = () => {
  torchActive.value = false;
  emit('close');
};
</script>

<style scoped>
.tools-modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(8px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  animation: fadeIn 0.2s ease-out;
}

.tools-modal-card {
  width: 100%;
  max-width: 540px;
  max-height: 90vh;
  background: var(--pt-surface-1, #ffffff);
  border-radius: var(--pt-radius-lg, 20px);
  border: 1px solid var(--pt-border, #e2e8f0);
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.tools-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 20px;
  border-bottom: 1px solid var(--pt-border, #e2e8f0);
  background: var(--pt-surface-2, #f8fafc);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.tool-badge-icon {
  font-size: 26px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(217, 119, 6, 0.15);
  border-radius: 12px;
}

.tools-modal-title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--pt-text-main, #0f172a);
}

.tools-modal-sub {
  margin: 2px 0 0 0;
  font-size: 12px;
  color: var(--pt-text-muted, #64748b);
}

.close-btn {
  background: none;
  border: none;
  font-size: 18px;
  font-weight: bold;
  color: var(--pt-text-muted, #64748b);
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.15s ease;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.08);
  color: #0f172a;
}

.tools-nav-tabs {
  display: flex;
  padding: 8px 16px;
  gap: 8px;
  background: var(--pt-surface-2, #f1f5f9);
  border-bottom: 1px solid var(--pt-border, #e2e8f0);
  overflow-x: auto;
}

.tool-nav-btn {
  flex: 1;
  padding: 10px 12px;
  font-size: 13px;
  font-weight: 600;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 10px;
  color: var(--pt-text-muted, #64748b);
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.tool-nav-btn.active {
  background: var(--pt-surface-1, #ffffff);
  color: var(--pt-amber, #d97706);
  border-color: rgba(217, 119, 6, 0.3);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.tools-modal-body {
  padding: 20px;
  overflow-y: auto;
}

/* Waterpass Tube Styles */
.level-indicator-box {
  background: var(--pt-surface-2, #f8fafc);
  border: 2px solid var(--pt-border, #e2e8f0);
  border-radius: 16px;
  padding: 24px 16px;
  text-align: center;
  transition: all 0.3s ease;
}

.level-indicator-box.is-balanced {
  border-color: #059669;
  background: rgba(5, 150, 105, 0.05);
}

.spirit-tube {
  width: 270px;
  height: 64px;
  background: #0d1424;
  border: 4px solid #334155;
  border-radius: 9999px;
  margin: 0 auto 16px auto;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.6);
}

.is-balanced .spirit-tube {
  border-color: #059669;
  box-shadow: 0 0 16px rgba(5, 150, 105, 0.35), inset 0 2px 8px rgba(0, 0, 0, 0.6);
}

.center-target-zone {
  width: 44px;
  height: 100%;
  border-left: 2px dashed #94a3b8;
  border-right: 2px dashed #94a3b8;
  position: absolute;
  pointer-events: none;
}

.spirit-bubble {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: radial-gradient(circle, #fde047 30%, #ca8a04 100%);
  box-shadow: 0 0 10px rgba(250, 204, 21, 0.6);
  transition: transform 0.08s ease-out;
}

.is-balanced .spirit-bubble {
  background: radial-gradient(circle, #86efac 30%, #16a34a 100%);
  box-shadow: 0 0 14px rgba(34, 197, 94, 0.8);
}

.level-readouts {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.readout-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--pt-surface-1, #ffffff);
  border: 1px solid var(--pt-border, #e2e8f0);
  border-radius: 9999px;
  padding: 6px 14px;
  font-weight: 700;
  font-size: 15px;
  color: var(--pt-text-main, #0f172a);
}

.readout-pill.perfect {
  color: #059669;
  border-color: #059669;
  background: rgba(5, 150, 105, 0.1);
}

.readout-badge {
  font-size: 13px;
  font-weight: 600;
}

.status-ok {
  color: #059669;
}

.status-tilt {
  color: #d97706;
}

.level-actions-row {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 14px;
}

.level-action-btn {
  padding: 6px 14px;
  font-size: 12px;
  font-weight: 700;
  border-radius: 9999px;
  background: var(--pt-surface-1, #ffffff);
  border: 1px solid var(--pt-border, #e2e8f0);
  color: var(--pt-text-main, #0f172a);
  cursor: pointer;
  transition: all 0.2s ease;
}

.level-action-btn:hover {
  background: rgba(217, 119, 6, 0.1);
  border-color: var(--pt-amber, #d97706);
}

.level-action-btn.reset-btn {
  color: #dc2626;
  border-color: rgba(220, 38, 38, 0.3);
}

.manual-slider-wrap {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px dashed var(--pt-border, #e2e8f0);
  text-align: left;
}

.slider-lbl {
  display: block;
  font-size: 11px;
  font-weight: 600;
  color: var(--pt-text-muted, #64748b);
  margin-bottom: 6px;
}

/* Ruler Styles */
.ruler-container {
  overflow-x: auto;
  padding: 10px 0;
}

.screen-ruler {
  display: flex;
  background: #fef9c3;
  color: #713f12;
  border: 2px solid #ca8a04;
  border-radius: 10px;
  padding: 10px 8px;
  min-width: 480px;
}

.ruler-cm-mark {
  flex: 0 0 38px;
  border-left: 2px solid #713f12;
  height: 64px;
  position: relative;
  font-size: 12px;
  font-weight: 700;
  padding-left: 3px;
}

.mm-group {
  display: flex;
  justify-content: space-between;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}

.mm-tick {
  width: 1px;
  height: 10px;
  background: #a16207;
}

.mm-tick.half-tick {
  height: 18px;
  background: #713f12;
}

/* Torch / Light Styles */
.torch-card {
  text-align: center;
  padding: 30px 20px;
  background: var(--pt-surface-2, #f8fafc);
  border-radius: 16px;
  border: 1px solid var(--pt-border, #e2e8f0);
  transition: all 0.3s ease;
}

.torch-card.torch-on {
  background: #ffffff;
  box-shadow: 0 0 50px rgba(255, 255, 255, 0.9), 0 0 30px rgba(251, 191, 36, 0.5);
  border-color: #fbbf24;
}

.torch-bulb {
  font-size: 54px;
  margin-bottom: 12px;
}

.torch-toggle-btn {
  margin-top: 16px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 700;
  border-radius: 12px;
}

.tool-instruction-card {
  margin-top: 16px;
  padding: 14px 16px;
  background: rgba(217, 119, 6, 0.08);
  border-left: 4px solid #d97706;
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.5;
  color: var(--pt-text-main, #0f172a);
}

.tool-instruction-card h4 {
  margin: 0 0 6px 0;
  font-size: 13px;
  font-weight: 700;
  color: #b45309;
}

.tool-instruction-card p {
  margin: 0;
}

.device-note {
  margin-top: 6px !important;
  font-size: 11px;
  color: var(--pt-text-muted, #64748b);
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
}
</style>
