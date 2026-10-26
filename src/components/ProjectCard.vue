<template>
  <div class="pt-card project-card" @click="$emit('select', project)">
    <div class="card-top">
      <div class="badges-row">
        <span :class="['pt-badge', categoryBadgeClass]">
          <span class="cat-icon">{{ categoryIcon }}</span>
          {{ project.categoryName }}
        </span>
        <span v-if="project.sniStandards && project.sniStandards.length > 0" class="pt-badge badge-sni-verified">
          🇮🇩 SNI
        </span>
        <span :class="['pt-badge', difficultyBadgeClass]">
          {{ project.difficulty }}
        </span>
      </div>

      <div class="duration-badge">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        <span>{{ project.durationMinutes }} Menit</span>
      </div>
    </div>

    <div class="card-content">
      <h3 class="project-title">{{ project.title }}</h3>
      <p class="project-desc">{{ project.overview }}</p>

      <div class="tags-row">
        <span v-for="tag in project.tags.slice(0, 3)" :key="tag" class="tag-pill">
          #{{ tag }}
        </span>
      </div>
    </div>

    <div class="card-footer">
      <div class="steps-info">
        <span class="steps-count">{{ project.steps.length }} Langkah Kerja</span>
        <span class="tools-count">{{ project.tools.length }} Alat & Bahan</span>
      </div>
      <div class="arrow-btn">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { DIYProject } from '../types';

const props = defineProps<{
  project: DIYProject;
}>();

defineEmits<{
  (e: 'select', project: DIYProject): void;
}>();

const categoryBadgeClass = computed(() => {
  switch (props.project.category) {
    case 'LST': return 'badge-lst';
    case 'SAN': return 'badge-san';
    case 'KAY': return 'badge-kay';
    case 'KNS': return 'badge-kns';
    default: return '';
  }
});

const categoryIcon = computed(() => {
  switch (props.project.category) {
    case 'LST': return '⚡';
    case 'SAN': return '🚰';
    case 'KAY': return '🪵';
    case 'KNS': return '🧱';
    default: return '🛠️';
  }
});

const difficultyBadgeClass = computed(() => {
  switch (props.project.difficulty) {
    case 'Pemula': return 'badge-diff-pemula';
    case 'Menengah': return 'badge-diff-menengah';
    case 'Mahir': return 'badge-diff-mahir';
    default: return '';
  }
});
</script>

<style></style>

