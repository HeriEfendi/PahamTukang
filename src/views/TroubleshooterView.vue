<template>
  <ion-page>
    <AppHeader>
      <template #actions>
        <button class="header-home-btn" @click="$router.push('/home')">
          ← Beranda
        </button>
      </template>
    </AppHeader>

    <ion-content :fullscreen="true" class="troubleshoot-content">
      <div class="pt-container">
        <!-- Header Banner -->
        <div class="troubleshoot-header pt-card">
          <div class="header-icon-box">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#f59e0b" stroke-width="2.2">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
          <div>
            <h1 class="troubleshoot-title">Diagnosa Kendala Mandiri</h1>
            <p class="troubleshoot-sub">
              Mesin pohon keputusan offline untuk mendeteksi akar penyebab masalah paska instalasi dan perbaikan darurat.
            </p>
          </div>
        </div>

        <!-- MODE 1: ACTIVE DIAGNOSTIC QUESTIONNAIRE -->
        <div v-if="activeTree" class="active-diagnostic-card pt-card">
          <div class="diag-header">
            <button class="back-btn" @click="resetDiagnostic">
              ← Kembali ke Daftar Gejala
            </button>
            <span class="active-cat-badge">{{ activeTree.title }}</span>
          </div>

          <div class="diag-body">
            <!-- Question Screen -->
            <div v-if="currentNode && currentNode.question" class="question-screen">
              <div class="symptom-reference">
                <span class="lbl">Gejala:</span>
                <span class="txt">{{ activeTree.symptom }}</span>
              </div>

              <h3 class="question-title">{{ currentNode.question }}</h3>

              <div class="options-list">
                <button
                  v-for="(opt, idx) in currentNode.options"
                  :key="idx"
                  class="option-card"
                  @click="handleSelectOption(opt.nextNodeId)"
                >
                  <span class="option-letter">{{ String.fromCharCode(65 + idx) }}</span>
                  <span class="option-text">{{ opt.text }}</span>
                  <span class="option-arrow">→</span>
                </button>
              </div>
            </div>

            <!-- RESULT SCREEN -->
            <div v-else-if="currentNode && currentNode.result" class="result-screen">
              <!-- Danger Level Badge -->
              <div :class="['danger-level-banner', dangerLevelClass(currentNode.result.dangerLevel)]">
                <div class="danger-icon">
                  <span v-if="currentNode.result.dangerLevel === 'BAHAYA'">🚨</span>
                  <span v-else-if="currentNode.result.dangerLevel === 'WASPADA'">⚠️</span>
                  <span v-else>💡</span>
                </div>
                <div>
                  <span class="danger-tag">TINGKAT RISIKO: {{ currentNode.result.dangerLevel }}</span>
                  <h3 class="cause-heading">{{ currentNode.result.cause }}</h3>
                </div>
              </div>

              <!-- Safety Instruction Box -->
              <div class="safety-box-critical">
                <div class="box-title">
                  <span>TINDAKAN PENGAMANAN PERTAMA:</span>
                </div>
                <p class="safety-instruction-text">{{ currentNode.result.safetyInstruction }}</p>
              </div>

              <!-- Recommendations List -->
              <div class="recs-box">
                <h4 class="recs-title">Langkah Solusi & Perbaikan:</h4>
                <ol class="recs-list">
                  <li v-for="(rec, rIdx) in currentNode.result.recommendations" :key="rIdx">
                    {{ rec }}
                  </li>
                </ol>
              </div>

              <!-- Related Project Guide (if suggested) -->
              <div v-if="currentNode.result.suggestedProjectSlug" class="related-guide-box">
                <div class="guide-info">
                  <span class="guide-sub">Panduan Terkait Tersedia:</span>
                  <strong class="guide-name">Pelajari Cara Instalasi yang Benar</strong>
                </div>
                <button
                  class="pt-btn pt-btn-primary"
                  @click="goToRelatedProject(currentNode.result.suggestedProjectSlug)"
                >
                  Buka Panduan →
                </button>
              </div>

              <div class="result-actions">
                <button class="pt-btn pt-btn-outline" @click="resetDiagnostic">
                  Diagnosa Kendala Lainnya
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- MODE 2: LIST OF SYMPTOMS & SEARCH -->
        <div v-else class="symptoms-list-container">
          <!-- Category Filter Tabs -->
          <div class="category-tabs">
            <button
              :class="['cat-tab', { 'active': selectedCategory === 'ALL' }]"
              @click="selectedCategory = 'ALL'"
            >
              Semua Masalah
            </button>
            <button
              :class="['cat-tab', { 'active': selectedCategory === 'KNS' }]"
              @click="selectedCategory = 'KNS'"
            >
              🧱 Konstruksi SNI
            </button>
            <button
              :class="['cat-tab', { 'active': selectedCategory === 'LST' }]"
              @click="selectedCategory = 'LST'"
            >
              ⚡ Kelistrikan
            </button>
            <button
              :class="['cat-tab', { 'active': selectedCategory === 'SAN' }]"
              @click="selectedCategory = 'SAN'"
            >
              🚰 Sanitasi & Pipa
            </button>
            <button
              :class="['cat-tab', { 'active': selectedCategory === 'KAY' }]"
              @click="selectedCategory = 'KAY'"
            >
              🪵 Perkayuan & Mebel
            </button>
          </div>

          <!-- Symptoms Grid -->
          <div class="symptoms-grid">
            <div
              v-for="tree in filteredTrees"
              :key="tree.id"
              class="symptom-card pt-card"
              @click="startDiagnostic(tree)"
            >
              <div class="symptom-cat-row">
                <span :class="['pt-badge', getCatBadgeClass(tree.category)]">
                  {{ getCatLabel(tree.category) }}
                </span>
              </div>
              <h3 class="symptom-title">{{ tree.title }}</h3>
              <p class="symptom-desc">{{ tree.symptom }}</p>

              <div class="symptom-footer">
                <span class="start-text">Mulai Diagnosa</span>
                <span class="arrow-symbol">→</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { IonPage, IonContent } from '@ionic/vue';
import { useRouter } from 'vue-router';
import AppHeader from '../components/AppHeader.vue';
import { TroubleshooterTree, TroubleshooterNode, ProjectCategory } from '../types';
import { TroubleshooterEngine } from '../services/troubleshooterEngine';
import { NativeService } from '../services/native';

const router = useRouter();

const selectedCategory = ref<string>('ALL');
const activeTree = ref<TroubleshooterTree | null>(null);
const currentNodeId = ref<string>('');
const questionHistory = ref<string[]>([]);

const allTrees = TroubleshooterEngine.getAllTrees();

const filteredTrees = computed(() => {
  if (selectedCategory.value === 'ALL') return allTrees;
  return allTrees.filter((t) => t.category === selectedCategory.value);
});

const currentNode = computed<TroubleshooterNode | undefined>(() => {
  if (!activeTree.value || !currentNodeId.value) return undefined;
  return TroubleshooterEngine.getNode(activeTree.value, currentNodeId.value);
});

const startDiagnostic = (tree: TroubleshooterTree) => {
  activeTree.value = tree;
  currentNodeId.value = tree.initialNodeId;
  questionHistory.value = [];
  NativeService.triggerHapticFeedback('medium');
};

const handleSelectOption = (nextNodeId: string) => {
  if (currentNodeId.value) {
    questionHistory.value.push(currentNodeId.value);
  }
  currentNodeId.value = nextNodeId;
  NativeService.triggerHapticFeedback('light');
};

const resetDiagnostic = () => {
  activeTree.value = null;
  currentNodeId.value = '';
  questionHistory.value = [];
};

const dangerLevelClass = (level: string) => {
  if (level === 'BAHAYA') return 'danger-bahaya';
  if (level === 'WASPADA') return 'danger-waspada';
  return 'danger-aman';
};

const getCatBadgeClass = (cat: ProjectCategory) => {
  if (cat === 'KNS') return 'badge-kns';
  if (cat === 'LST') return 'badge-lst';
  if (cat === 'SAN') return 'badge-san';
  return 'badge-kay';
};

const getCatLabel = (cat: ProjectCategory) => {
  if (cat === 'KNS') return 'Konstruksi & Dinding';
  if (cat === 'LST') return 'Kelistrikan';
  if (cat === 'SAN') return 'Sanitasi & Pipa';
  return 'Perkayuan & Mebel';
};

const goToRelatedProject = (slug: string) => {
  router.push(`/project/${slug}`);
};
</script>

<style></style>

