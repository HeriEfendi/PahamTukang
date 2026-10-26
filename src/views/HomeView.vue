<template>
  <ion-page>
    <AppHeader />

    <ion-content :fullscreen="true" class="home-content">
      <div class="pt-container">
        <!-- Hero Workshop Banner -->
        <div class="hero-card">
          <div class="hero-text-content">
            <div class="hero-badge">
              <span class="pulse-icon">⚡</span>
              <span>100% Offline DIY Assistant</span>
            </div>
            <h1 class="hero-heading">
              Kuasai Perbaikan Rumah <br />
              <span class="text-amber">Mandiri, Aman & Presisi</span>
            </h1>
            <p class="hero-subheading">
              Panduan instalasi kelistrikan, sanitasi, dan perkayuan rumah tangga tanpa perlu kuota internet. Dilengkapi kalkulator bahan & diagnosa kendala.
            </p>

            <div class="hero-quick-stats">
              <div class="stat-pill">
                <span class="stat-num">{{ projects.length }}</span>
                <span class="stat-label">Panduan Master</span>
              </div>
              <div class="stat-pill">
                <span class="stat-num">4</span>
                <span class="stat-label">Kategori SNI & DIY</span>
              </div>
              <div class="stat-pill">
                <span class="stat-num">100%</span>
                <span class="stat-label">Offline Lokal</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Shortcut Cards -->
        <div class="shortcuts-grid">
          <div class="shortcut-card card-troubleshoot" @click="$router.push('/troubleshoot')">
            <div class="shortcut-icon icon-amber">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
            <div class="shortcut-info">
              <h4 class="shortcut-title">Diagnosa Kendala</h4>
              <p class="shortcut-desc">Pohon keputusan atasi MCB jeglek, kran bocor & pintu seret</p>
            </div>
            <div class="shortcut-arrow">→</div>
          </div>

          <div class="shortcut-card card-myprojects" @click="$router.push('/my-projects')">
            <div class="shortcut-icon icon-emerald">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <div class="shortcut-info">
              <h4 class="shortcut-title">Catatan Personal</h4>
              <p class="shortcut-desc">Simpan log pengerjaan, foto dokumentasi & riwayat belanja</p>
            </div>
            <div class="shortcut-arrow">→</div>
          </div>
        </div>

        <!-- Filter & Search Section -->
        <div class="catalog-section">
          <div class="section-title-row">
            <div>
              <h2 class="section-title">Katalog Panduan DIY & Konstruksi</h2>
              <p class="section-sub">Pilih panduan langkah kerja teruji sesuai kebutuhan rumah Anda.</p>
            </div>
          </div>

          <!-- Search Input -->
          <div class="search-bar-wrap">
            <svg class="search-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              class="search-input"
              placeholder="Cari proyek (contoh: saklar, retak dinding, hebel, cor beton, kran)..."
            />
            <button v-if="searchQuery" class="clear-search-btn" @click="searchQuery = ''">✕</button>
          </div>

          <!-- Category Filter Tabs -->
          <div class="filters-row">
            <div class="categories-scroll">
              <button
                :class="['filter-pill', { 'active': selectedCategory === 'ALL' }]"
                @click="selectedCategory = 'ALL'"
              >
                Semua Kategori
              </button>
              <button
                :class="['filter-pill', { 'active': selectedCategory === 'KNS' }]"
                @click="selectedCategory = 'KNS'"
              >
                🧱 Konstruksi SNI (KNS)
              </button>
              <button
                :class="['filter-pill', { 'active': selectedCategory === 'LST' }]"
                @click="selectedCategory = 'LST'"
              >
                ⚡ Kelistrikan (LST)
              </button>
              <button
                :class="['filter-pill', { 'active': selectedCategory === 'SAN' }]"
                @click="selectedCategory = 'SAN'"
              >
                🚰 Sanitasi & Pipa (SAN)
              </button>
              <button
                :class="['filter-pill', { 'active': selectedCategory === 'KAY' }]"
                @click="selectedCategory = 'KAY'"
              >
                🪵 Perkayuan & Mebel (KAY)
              </button>
            </div>

            <!-- Difficulty Filter -->
            <div class="difficulty-filter">
              <select v-model="selectedDifficulty" class="difficulty-select">
                <option value="ALL">Semua Kesulitan</option>
                <option value="Pemula">Pemula</option>
                <option value="Menengah">Menengah</option>
                <option value="Mahir">Mahir</option>
              </select>
            </div>
          </div>

          <!-- Projects Grid -->
          <div v-if="filteredProjects.length > 0" class="projects-grid">
            <ProjectCard
              v-for="project in filteredProjects"
              :key="project.id"
              :project="project"
              @select="openProjectDetail"
            />
          </div>

          <!-- Empty State -->
          <div v-else class="empty-state pt-card">
            <div class="empty-icon">🔍</div>
            <h3>Tidak Ada Panduan yang Cocok</h3>
            <p>Coba gunakan kata kunci pencarian lain atau ubah filter kategori.</p>
            <button class="pt-btn pt-btn-outline" @click="resetFilters">Reset Filter</button>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { IonPage, IonContent } from '@ionic/vue';
import { useRouter } from 'vue-router';
import AppHeader from '../components/AppHeader.vue';
import ProjectCard from '../components/ProjectCard.vue';
import { DIYProject, ProjectCategory, DifficultyLevel } from '../types';
import { getAllProjects } from '../services/db';
import { NativeService } from '../services/native';

const router = useRouter();

const projects = ref<DIYProject[]>([]);
const searchQuery = ref('');
const selectedCategory = ref<string>('ALL');
const selectedDifficulty = ref<string>('ALL');

onMounted(async () => {
  projects.value = await getAllProjects();
});

const filteredProjects = computed(() => {
  return projects.value.filter((p) => {
    // Filter Kategori
    if (selectedCategory.value !== 'ALL' && p.category !== selectedCategory.value) {
      return false;
    }
    // Filter Kesulitan
    if (selectedDifficulty.value !== 'ALL' && p.difficulty !== selectedDifficulty.value) {
      return false;
    }
    // Filter Pencarian
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchOverview = p.overview.toLowerCase().includes(q);
      const matchTags = p.tags.some((t) => t.toLowerCase().includes(q));
      const matchTools = p.tools.some((t) => t.name.toLowerCase().includes(q));
      return matchTitle || matchOverview || matchTags || matchTools;
    }
    return true;
  });
});

const openProjectDetail = (project: DIYProject) => {
  NativeService.triggerHapticFeedback('light');
  router.push(`/project/${project.slug}`);
};

const resetFilters = () => {
  searchQuery.value = '';
  selectedCategory.value = 'ALL';
  selectedDifficulty.value = 'ALL';
};
</script>

<style></style>

