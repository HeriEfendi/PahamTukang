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
            <span class="brand-sub">DIY Offline-First</span>
          </div>
        </div>

        <div class="header-actions">
          <div class="offline-badge" title="Aplikasi 100% berjalan tanpa koneksi internet">
            <span class="status-dot"></span>
            <span class="status-text">100% Offline</span>
          </div>

          <slot name="actions"></slot>
        </div>
      </div>
    </ion-toolbar>
  </ion-header>
</template>

<script setup lang="ts">
import { IonHeader, IonToolbar } from '@ionic/vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const goToHome = () => {
  router.push('/home');
};
</script>

<style></style>

