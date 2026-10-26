<template>
  <ion-header class="ion-no-border pt-app-header">
    <ion-toolbar>
      <div class="header-inner pt-container">
        <div class="brand-section" @click="goToHome">
          <div class="brand-icon">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
            </svg>
          </div>
          <div class="brand-text">
            <span class="brand-name">Paham<span class="brand-accent">Tukang</span></span>
            <span class="brand-sub">Standar SNI & DIY Offline</span>
          </div>
        </div>

        <div class="header-actions">
          <!-- Tombol Toolkit Perkakas Digital -->
          <button
            class="header-action-btn toolkit-btn"
            title="Buka Waterpass Digital & Penggaris"
            @click="openToolsModal = true"
          >
            <span class="btn-icon">🛠️</span>
            <span class="btn-text">Toolkit</span>
          </button>

          <!-- Toggle Mode Gelap / Terang -->
          <button
            class="header-action-btn theme-toggle-btn"
            :title="isDarkMode ? 'Beralih ke Tema Terang' : 'Beralih ke Tema Gelap'"
            @click="toggleTheme"
          >
            <span>{{ isDarkMode ? '☀️' : '🌙' }}</span>
          </button>

          <!-- Status Offline SNI -->
          <div class="offline-badge" title="Aplikasi 100% berjalan tanpa koneksi internet (Standar SNI)">
            <span class="status-dot"></span>
            <span class="status-text">Offline SNI</span>
          </div>

          <slot name="actions"></slot>
        </div>
      </div>
    </ion-toolbar>

    <!-- Modal Kotak Perkakas Digital -->
    <HandymanToolsModal :is-open="openToolsModal" @close="openToolsModal = false" />
  </ion-header>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { IonHeader, IonToolbar } from '@ionic/vue';
import { useRouter } from 'vue-router';
import HandymanToolsModal from './HandymanToolsModal.vue';
import { NativeService } from '../services/native';

const router = useRouter();
const isDarkMode = ref(false);
const openToolsModal = ref(false);

const goToHome = () => {
  router.push('/home');
};

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  if (isDarkMode.value) {
    document.body.classList.add('dark-theme');
    localStorage.setItem('pt_theme', 'dark');
  } else {
    document.body.classList.remove('dark-theme');
    localStorage.setItem('pt_theme', 'light');
  }
  NativeService.triggerHapticFeedback('light');
};

onMounted(() => {
  const saved = localStorage.getItem('pt_theme');
  if (saved === 'dark' || (!saved && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDarkMode.value = true;
    document.body.classList.add('dark-theme');
  }
});
</script>

<style scoped>
.header-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 9999px;
  border: 1px solid var(--pt-border, #e2e8f0);
  background: var(--pt-surface-2, #f1f5f9);
  color: var(--pt-text-main, #0f172a);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.header-action-btn:hover {
  background: var(--pt-surface-3, #e2e8f0);
  border-color: var(--pt-amber, #d97706);
}

.toolkit-btn {
  color: var(--pt-amber, #d97706);
  border-color: rgba(217, 119, 6, 0.3);
  background: rgba(217, 119, 6, 0.08);
}

.theme-toggle-btn {
  padding: 6px 10px;
  font-size: 14px;
}

@media (max-width: 640px) {
  .offline-badge .status-text {
    display: none;
  }
  .offline-badge {
    padding: 5px 8px;
  }
}

@media (max-width: 480px) {
  .btn-text {
    display: none;
  }
  .toolkit-btn {
    padding: 6px 8px;
  }
  .brand-sub {
    display: none;
  }
}
</style>
