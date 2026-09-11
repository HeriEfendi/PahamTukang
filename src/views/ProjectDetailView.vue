<template>
  <ion-page>
    <AppHeader>
      <template #actions>
        <button class="back-nav-btn" @click="$router.push('/home')">
          ← Kembali
        </button>
      </template>
    </AppHeader>

    <ion-content :fullscreen="true" class="detail-content">
      <div v-if="project" class="pt-container">
        <!-- Project Hero Header -->
        <div class="project-header-card pt-card">
          <div class="header-badges">
            <span :class="['pt-badge', categoryBadgeClass]">
              {{ project.categoryName }}
            </span>
            <span :class="['pt-badge', difficultyBadgeClass]">
              {{ project.difficulty }}
            </span>
            <span class="duration-tag">⏱️ {{ project.durationMinutes }} Menit</span>
          </div>

          <h1 class="project-title-large">{{ project.title }}</h1>
          <p class="project-overview-text">{{ project.overview }}</p>

          <!-- Safety Hazards Warning Box -->
          <div class="safety-box-critical">
            <div class="box-title">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <span>Perhatian Bahaya Utama:</span>
            </div>
            <ul class="hazards-list">
              <li v-for="(hazard, idx) in project.safetyHazards" :key="idx">
                {{ hazard }}
              </li>
            </ul>
          </div>
        </div>

        <!-- Navigation Tabs: BOM Checklist, Kalkulator, Skema -->
        <div class="view-tabs-bar">
          <button
            :class="['view-tab-btn', { 'active': activeTab === 'bom' }]"
            @click="activeTab = 'bom'"
          >
            📋 Daftar Alat & Bahan (BOM)
          </button>

          <button
            v-if="project.calculatorConfig"
            :class="['view-tab-btn', { 'active': activeTab === 'calc' }]"
            @click="activeTab = 'calc'"
          >
            🧮 Kalkulator Kebutuhan
          </button>

          <button
            :class="['view-tab-btn', { 'active': activeTab === 'schematic' }]"
            @click="activeTab = 'schematic'"
          >
            📐 Skema Diagram
          </button>
        </div>

        <!-- TAB 1: BOM CHECKLIST -->
        <div v-if="activeTab === 'bom'" class="bom-tab-content">
          <!-- Tools Section -->
          <div class="bom-section pt-card">
            <div class="bom-section-header">
              <h3 class="bom-title">1. Daftar Alat Kerja (Tools)</h3>
              <span class="checked-summary">{{ checkedToolsCount }} / {{ project.tools.length }} Siap</span>
            </div>

            <div class="bom-items-list">
              <div
                v-for="tool in project.tools"
                :key="tool.id"
                :class="['bom-item-row', { 'is-checked': checkedTools[tool.id] }]"
                @click="toggleTool(tool.id)"
              >
                <div class="bom-check">
                  <svg v-if="checkedTools[tool.id]" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#0f172a" stroke-width="3">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <div class="bom-info">
                  <div class="item-name-row">
                    <span class="item-name">{{ tool.name }}</span>
                    <span v-if="tool.required" class="required-pill">Wajib</span>
                  </div>
                  <span v-if="tool.specification" class="item-spec">{{ tool.specification }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Materials Section -->
          <div class="bom-section pt-card">
            <div class="bom-section-header">
              <h3 class="bom-title">2. Daftar Bahan & Material</h3>
              <span class="checked-summary">{{ checkedMaterialsCount }} / {{ project.materials.length }} Siap</span>
            </div>

            <div class="bom-items-list">
              <div
                v-for="mat in project.materials"
                :key="mat.id"
                :class="['bom-item-row', { 'is-checked': checkedMaterials[mat.id] }]"
                @click="toggleMaterial(mat.id)"
              >
                <div class="bom-check">
                  <svg v-if="checkedMaterials[mat.id]" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#0f172a" stroke-width="3">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <div class="bom-info">
                  <div class="item-name-row">
                    <span class="item-name">{{ mat.name }}</span>
                    <span class="mat-qty-badge">{{ mat.defaultQty }} {{ mat.unit }}</span>
                  </div>
                  <div class="item-meta-row">
                    <span class="item-price">Est. {{ formatRupiah(mat.estimatedPriceUnit) }}/{{ mat.unit }}</span>
                    <span v-if="mat.note" class="item-note">({{ mat.note }})</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="materials-budget-summary">
              <span>Estimasi Standar Total Bahan:</span>
              <strong>{{ formatRupiah(totalStandardMaterialCost) }}</strong>
            </div>
          </div>
        </div>

        <!-- TAB 2: KALKULATOR -->
        <div v-if="activeTab === 'calc' && project.calculatorConfig" class="calc-tab-content">
          <MaterialCalculator
            :config="project.calculatorConfig"
            :materials="project.materials"
          />
        </div>

        <!-- TAB 3: SKEMA DIAGRAM -->
        <div v-if="activeTab === 'schematic'" class="schematic-tab-content">
          <SchematicViewer
            v-for="diag in project.diagrams"
            :key="diag.id"
            :schematic-id="diag.id"
            :title="diag.title"
            :description="diag.description"
          />
        </div>

        <!-- Bottom Action Bar -->
        <div class="bottom-action-container">
          <div class="bottom-action-card pt-card">
            <div class="prep-summary">
              <span class="prep-label">Kesiapan Alat & Bahan:</span>
              <span class="prep-percent">{{ preparationPercentage }}% Lengkap</span>
            </div>
            <button class="pt-btn pt-btn-primary start-work-btn" @click="openSafetyGate">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              Mulai Pengerjaan
            </button>
          </div>
        </div>

        <!-- Safety Gate Modal -->
        <SafetyGateModal
          :is-open="isSafetyModalOpen"
          :items="project.mandatorySafetyChecklist"
          @confirm="onSafetyConfirmed"
          @cancel="isSafetyModalOpen = false"
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
import MaterialCalculator from '../components/MaterialCalculator.vue';
import SchematicViewer from '../components/SchematicViewer.vue';
import SafetyGateModal from '../components/SafetyGateModal.vue';
import { DIYProject, UserChecklistState } from '../types';
import { getProjectBySlug, getChecklistState, saveChecklistState } from '../services/db';
import { NativeService } from '../services/native';

const route = useRoute();
const router = useRouter();

const project = ref<DIYProject | null>(null);
const activeTab = ref<'bom' | 'calc' | 'schematic'>('bom');
const checkedTools = ref<Record<string, boolean>>({});
const checkedMaterials = ref<Record<string, boolean>>({});
const isSafetyModalOpen = ref(false);

const slug = route.params.slug as string;

onMounted(async () => {
  const p = await getProjectBySlug(slug);
  if (p) {
    project.value = p;
    // Load saved checklist state
    const savedState = await getChecklistState(p.id);
    if (savedState) {
      savedState.checkedTools.forEach((id) => (checkedTools.value[id] = true));
      savedState.checkedMaterials.forEach((id) => (checkedMaterials.value[id] = true));
    }
  }
});

const categoryBadgeClass = computed(() => {
  switch (project.value?.category) {
    case 'LST': return 'badge-lst';
    case 'SAN': return 'badge-san';
    case 'KAY': return 'badge-kay';
    default: return '';
  }
});

const difficultyBadgeClass = computed(() => {
  switch (project.value?.difficulty) {
    case 'Pemula': return 'badge-diff-pemula';
    case 'Menengah': return 'badge-diff-menengah';
    case 'Mahir': return 'badge-diff-mahir';
    default: return '';
  }
});

const formatRupiah = (val: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(val);
};

const toggleTool = async (id: string) => {
  checkedTools.value[id] = !checkedTools.value[id];
  NativeService.triggerHapticFeedback('light');
  await persistChecklist();
};

const toggleMaterial = async (id: string) => {
  checkedMaterials.value[id] = !checkedMaterials.value[id];
  NativeService.triggerHapticFeedback('light');
  await persistChecklist();
};

const checkedToolsCount = computed(() => {
  if (!project.value) return 0;
  return project.value.tools.filter((t) => checkedTools.value[t.id]).length;
});

const checkedMaterialsCount = computed(() => {
  if (!project.value) return 0;
  return project.value.materials.filter((m) => checkedMaterials.value[m.id]).length;
});

const totalStandardMaterialCost = computed(() => {
  if (!project.value) return 0;
  return project.value.materials.reduce((acc, m) => acc + m.defaultQty * m.estimatedPriceUnit, 0);
});

const preparationPercentage = computed(() => {
  if (!project.value) return 0;
  const totalItems = project.value.tools.length + project.value.materials.length;
  if (totalItems === 0) return 100;
  const checked = checkedToolsCount.value + checkedMaterialsCount.value;
  return Math.round((checked / totalItems) * 100);
});

const persistChecklist = async () => {
  if (!project.value) return;
  const state: UserChecklistState = {
    projectId: project.value.id,
    checkedTools: Object.keys(checkedTools.value).filter((k) => checkedTools.value[k]),
    checkedMaterials: Object.keys(checkedMaterials.value).filter((k) => checkedMaterials.value[k]),
    safetyCompleted: false,
    currentStep: 1,
    updatedAt: new Date().toISOString(),
  };
  await saveChecklistState(state);
};

const openSafetyGate = () => {
  NativeService.triggerHapticFeedback('medium');
  isSafetyModalOpen.value = true;
};

const onSafetyConfirmed = () => {
  isSafetyModalOpen.value = false;
  router.push(`/project/${slug}/execute`);
};
</script>

<style></style>

