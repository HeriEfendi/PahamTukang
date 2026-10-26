<template>
  <ion-page>
    <AppHeader>
      <template #actions>
        <button class="exit-btn" @click="exitExecution">
          ✕ Keluar Panduan
        </button>
      </template>
    </AppHeader>

    <ion-content :fullscreen="true" class="exec-content">
      <div v-if="project" class="pt-container">
        <!-- Execution Top Bar -->
        <div class="exec-top-bar pt-card">
          <div class="top-info">
            <span class="project-mini-title">{{ project.title }}</span>
            <span class="step-indicator-text">
              Langkah {{ currentStepIndex + 1 }} dari {{ project.steps.length }}
            </span>
          </div>

          <!-- Progress Bar -->
          <div class="progress-track">
            <div
              class="progress-fill"
              :style="{ width: `${((currentStepIndex + 1) / project.steps.length) * 100}%` }"
            ></div>
          </div>

          <!-- Stepper Dots -->
          <div class="stepper-dots">
            <div
              v-for="(step, idx) in project.steps"
              :key="idx"
              :class="['step-dot', {
                'active': idx === currentStepIndex,
                'done': idx < currentStepIndex
              }]"
              @click="goToStep(idx)"
              :title="`Langkah ${idx + 1}: ${step.title}`"
            >
              <span v-if="idx < currentStepIndex">✓</span>
              <span v-else>{{ idx + 1 }}</span>
            </div>
          </div>
        </div>

        <!-- MAIN STEP CONTENT -->
        <div v-if="!isAllStepsCompleted && currentStep" class="step-main-card pt-card">
          <div class="step-card-header">
            <div class="header-step-row">
              <div class="step-badge">
                <span>LANGKAH {{ currentStep.stepNumber }}</span>
              </div>
              <div class="voice-controls-group">
                <button
                  class="voice-reader-pill"
                  :class="{ 'is-reading': isReadingVoice }"
                  @click="speakCurrentStep"
                  title="Bantu bacakan instruksi saat tangan kotor"
                >
                  <span class="voice-icon" v-if="!isReadingVoice">🔊</span>
                  <span class="sound-wave" v-else>
                    <span class="bar"></span>
                    <span class="bar"></span>
                    <span class="bar"></span>
                  </span>
                  <span class="voice-text">{{ isReadingVoice ? 'Hentikan' : 'Bacakan Langkah' }}</span>
                </button>

                <label class="auto-speak-toggle" title="Otomatis bacakan langkah saat pindah ke langkah berikutnya">
                  <input type="checkbox" v-model="autoSpeakNext" />
                  <span class="toggle-text">Auto</span>
                </label>
              </div>
            </div>
            <h2 class="step-title">{{ currentStep.title }}</h2>
          </div>

          <div class="step-card-body">
            <!-- Step Description -->
            <p class="step-description">{{ currentStep.description }}</p>

            <!-- SNI Note Box (if any) -->
            <div v-if="currentStep.sniNote" class="sni-note-box">
              <div class="box-title">
                <span class="sni-badge-icon">🇮🇩 KETENTUAN STANDAR SNI:</span>
              </div>
              <p class="sni-note-text">{{ currentStep.sniNote }}</p>
            </div>

            <!-- Danger Warning Box (if any) -->
            <div v-if="currentStep.dangerWarning" class="safety-box-critical">
              <div class="box-title">
                <span>⚠️ PERINGATAN KESELAMATAN:</span>
              </div>
              <p class="warning-text">{{ currentStep.dangerWarning }}</p>
            </div>

            <!-- Pro-Tip Box (if any) -->
            <div v-if="currentStep.proTip" class="protip-box">
              <div class="box-title">
                <span>💡 TIPS TUKANG:</span>
              </div>
              <p class="protip-text">{{ currentStep.proTip }}</p>
            </div>

            <!-- Schematic Diagram for this step -->
            <div v-if="currentStep.schematicId" class="step-schematic-wrap">
              <SchematicViewer
                :schematic-id="currentStep.schematicId"
                title="Panduan Skematik Langkah Ini"
                description="Pastikan posisi sambungan kawat/pipa sesuai dengan arah diagram di atas."
              />
            </div>

            <!-- Step Micro-Checklist -->
            <div class="micro-checklist-section">
              <h4 class="checklist-heading">Ceklis Verifikasi Langkah:</h4>
              <div class="checklist-items">
                <div
                  v-for="(checkText, cIdx) in currentStep.checkItems"
                  :key="cIdx"
                  :class="['micro-check-row', { 'is-done': stepChecks[`${currentStepIndex}-${cIdx}`] }]"
                  @click="toggleMicroCheck(currentStepIndex, cIdx)"
                >
                  <div class="check-box-square">
                    <span v-if="stepChecks[`${currentStepIndex}-${cIdx}`]">✓</span>
                  </div>
                  <span class="check-text">{{ checkText }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Step Navigation Buttons -->
          <div class="step-nav-footer">
            <button
              class="pt-btn pt-btn-outline nav-btn-prev"
              :disabled="currentStepIndex === 0"
              @click="prevStep"
            >
              ← Langkah Sebelumnya
            </button>

            <button
              class="pt-btn pt-btn-primary nav-btn-next"
              @click="nextStep"
            >
              <span v-if="currentStepIndex === project.steps.length - 1">
                🎉 Selesaikan Pengerjaan
              </span>
              <span v-else>
                Langkah Berikutnya →
              </span>
            </button>
          </div>
        </div>

        <!-- COMPLETION SCREEN -->
        <div v-else class="completion-card pt-card">
          <div class="completion-icon">🏆</div>
          <h2 class="completion-title">Selamat! Pengerjaan Selesai</h2>
          <p class="completion-desc">
            Anda telah berhasil menyelesaikan proyek <strong>{{ project.title }}</strong> dengan mematuhi prosedur keselamatan.
          </p>

          <div class="completion-stats">
            <div class="comp-stat-item">
              <span class="comp-stat-num">{{ project.steps.length }}</span>
              <span class="comp-stat-lbl">Langkah Tuntas</span>
            </div>
            <div class="comp-stat-item">
              <span class="comp-stat-num">{{ project.durationMinutes }} Min</span>
              <span class="comp-stat-lbl">Estimasi Waktu</span>
            </div>
            <div class="comp-stat-item">
              <span class="comp-stat-num">100%</span>
              <span class="comp-stat-lbl">Safety Passed</span>
            </div>
          </div>

          <div class="completion-actions">
            <button class="pt-btn pt-btn-primary action-btn-large" @click="openLogModal">
              📸 Dokumentasikan Foto & Catat ke My DIY Projects
            </button>

            <button class="pt-btn pt-btn-outline action-btn-large" @click="exitExecution">
              Kembali ke Katalog
            </button>
          </div>
        </div>

        <!-- Troubleshooter Floating Emergency Button -->
        <div class="troubleshooter-float-bar">
          <div class="float-inner" @click="openTroubleshooter">
            <div class="float-icon">🔧</div>
            <div class="float-text">
              <span class="float-title">Mengalami Kendala Setelah Pemasangan?</span>
              <span class="float-sub">Buka Troubleshooter Diagnosa Masalah</span>
            </div>
            <div class="float-arrow">→</div>
          </div>
        </div>

        <!-- Project Log Modal -->
        <ProjectLogModal
          :is-open="isLogModalOpen"
          :default-project-title="project.title"
          :default-category="project.category"
          @save="saveCompletedProjectLog"
          @cancel="isLogModalOpen = false"
        />
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { IonPage, IonContent } from '@ionic/vue';
import { useRoute, useRouter } from 'vue-router';
import AppHeader from '../components/AppHeader.vue';
import SchematicViewer from '../components/SchematicViewer.vue';
import ProjectLogModal from '../components/ProjectLogModal.vue';
import { DIYProject, MyProjectLog } from '../types';
import { getProjectBySlug, saveMyLog } from '../services/db';
import { NativeService } from '../services/native';

const route = useRoute();
const router = useRouter();

const project = ref<DIYProject | null>(null);
const currentStepIndex = ref(0);
const isAllStepsCompleted = ref(false);
const stepChecks = ref<Record<string, boolean>>({});
const isLogModalOpen = ref(false);

const slug = route.params.slug as string;

onMounted(async () => {
  const p = await getProjectBySlug(slug);
  if (p) {
    project.value = p;
  }
});

const currentStep = computed(() => {
  if (!project.value) return null;
  return project.value.steps[currentStepIndex.value];
});

const toggleMicroCheck = (stepIdx: number, checkIdx: number) => {
  const key = `${stepIdx}-${checkIdx}`;
  stepChecks.value[key] = !stepChecks.value[key];
  NativeService.triggerHapticFeedback('light');
};

const isReadingVoice = ref(false);
const autoSpeakNext = ref(false);

const stopVoice = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  isReadingVoice.value = false;
};

const speakCurrentStep = () => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    alert('Perangkat Anda belum mendukung sintesis suara offline.');
    return;
  }

  if (window.speechSynthesis.speaking) {
    stopVoice();
    return;
  }

  if (!currentStep.value) return;

  const step = currentStep.value;
  const text = `Langkah ${step.stepNumber}. ${step.title}. ${step.description}. ${
    step.sniNote ? 'Ketentuan Standar S N I: ' + step.sniNote + '. ' : ''
  }${step.dangerWarning ? 'Perhatian Bahaya: ' + step.dangerWarning + '. ' : ''}${
    step.proTip ? 'Tips Tukang: ' + step.proTip : ''
  }`;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'id-ID';
  utterance.rate = 0.95;

  utterance.onstart = () => {
    isReadingVoice.value = true;
  };
  utterance.onend = () => {
    isReadingVoice.value = false;
  };
  utterance.onerror = () => {
    isReadingVoice.value = false;
  };

  window.speechSynthesis.speak(utterance);
};

const nextStep = () => {
  if (!project.value) return;
  stopVoice();

  if (currentStepIndex.value < project.value.steps.length - 1) {
    currentStepIndex.value++;
    NativeService.triggerHapticFeedback('medium');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (autoSpeakNext.value) {
      setTimeout(() => speakCurrentStep(), 400);
    }
  } else {
    // Finished all steps
    isAllStepsCompleted.value = true;
    NativeService.triggerHapticFeedback('success');
  }
};

const prevStep = () => {
  if (currentStepIndex.value > 0) {
    stopVoice();
    currentStepIndex.value--;
    NativeService.triggerHapticFeedback('light');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (autoSpeakNext.value) {
      setTimeout(() => speakCurrentStep(), 400);
    }
  }
};

const goToStep = (idx: number) => {
  stopVoice();
  currentStepIndex.value = idx;
  NativeService.triggerHapticFeedback('light');
};

const exitExecution = () => {
  stopVoice();
  router.push(`/project/${slug}`);
};

const openTroubleshooter = () => {
  stopVoice();
  NativeService.triggerHapticFeedback('light');
  router.push('/troubleshoot');
};

const openLogModal = () => {
  stopVoice();
  isLogModalOpen.value = true;
};

const saveCompletedProjectLog = async (log: MyProjectLog) => {
  if (project.value) {
    log.projectId = project.value.id;
  }
  await saveMyLog(log);
  isLogModalOpen.value = false;
  router.push('/my-projects');
};
</script>

<style scoped>
.header-step-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  flex-wrap: wrap;
  gap: 8px;
}

.voice-reader-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 9999px;
  background: var(--pt-surface-2, #f1f5f9);
  border: 1px solid var(--pt-border, #e2e8f0);
  color: var(--pt-text-main, #0f172a);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.voice-reader-pill:hover {
  background: rgba(217, 119, 6, 0.1);
  border-color: var(--pt-amber, #d97706);
}

.voice-reader-pill.is-reading {
  background: #ef4444;
  color: #ffffff;
  border-color: #dc2626;
  animation: pulse 1.5s infinite;
}

.sni-note-box {
  background: rgba(2, 132, 199, 0.08);
  border-left: 4px solid #0284c7;
  border-radius: 8px;
  padding: 12px 16px;
  margin: 16px 0;
}

.sni-badge-icon {
  font-size: 12px;
  font-weight: 800;
  color: #0284c7;
  letter-spacing: 0.04em;
}

.sni-note-text {
  margin: 4px 0 0 0;
  font-size: 13px;
  line-height: 1.5;
  color: var(--pt-text-main, #0f172a);
}

.voice-controls-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.auto-speak-toggle {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 700;
  color: var(--pt-text-muted, #64748b);
  cursor: pointer;
  background: var(--pt-surface-2, #f1f5f9);
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid var(--pt-border, #e2e8f0);
}

.auto-speak-toggle input {
  cursor: pointer;
}

.sound-wave {
  display: inline-flex;
  align-items: flex-end;
  gap: 2px;
  height: 14px;
}

.sound-wave .bar {
  width: 3px;
  background: #ffffff;
  border-radius: 1px;
  animation: equalize 0.8s infinite ease-in-out;
}

.sound-wave .bar:nth-child(1) { height: 6px; animation-delay: 0.1s; }
.sound-wave .bar:nth-child(2) { height: 14px; animation-delay: 0.25s; }
.sound-wave .bar:nth-child(3) { height: 9px; animation-delay: 0.4s; }

@keyframes equalize {
  0%, 100% { height: 4px; }
  50% { height: 14px; }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.03); }
  100% { transform: scale(1); }
}
</style>

