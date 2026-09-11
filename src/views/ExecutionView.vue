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
            <div class="step-badge">
              <span>LANGKAH {{ currentStep.stepNumber }}</span>
            </div>
            <h2 class="step-title">{{ currentStep.title }}</h2>
          </div>

          <div class="step-card-body">
            <!-- Step Description -->
            <p class="step-description">{{ currentStep.description }}</p>

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

const nextStep = () => {
  if (!project.value) return;

  if (currentStepIndex.value < project.value.steps.length - 1) {
    currentStepIndex.value++;
    NativeService.triggerHapticFeedback('medium');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    // Finished all steps
    isAllStepsCompleted.value = true;
    NativeService.triggerHapticFeedback('success');
  }
};

const prevStep = () => {
  if (currentStepIndex.value > 0) {
    currentStepIndex.value--;
    NativeService.triggerHapticFeedback('light');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const goToStep = (idx: number) => {
  currentStepIndex.value = idx;
  NativeService.triggerHapticFeedback('light');
};

const exitExecution = () => {
  router.push(`/project/${slug}`);
};

const openTroubleshooter = () => {
  NativeService.triggerHapticFeedback('light');
  router.push('/troubleshoot');
};

const openLogModal = () => {
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

<style></style>

