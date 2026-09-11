<template>
  <div v-if="isOpen" class="modal-backdrop">
    <div class="modal-dialog pt-card">
      <div class="modal-header">
        <div class="shield-badge">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#ef4444" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <div class="header-text">
          <h3 class="modal-title">Prosedur Keselamatan Wajib</h3>
          <p class="modal-sub">Konfirmasi keselamatan kerja sebelum memulai panduan pengerjaan.</p>
        </div>
      </div>

      <div class="modal-body">
        <div class="safety-warning-banner">
          <span class="banner-icon">⚠️</span>
          <p class="banner-text">
            Pertukangan mandiri berisiko tinggi. Pastikan seluruh prosedur keselamatan di bawah ini telah Anda laksanakan secara nyata di lokasi pengerjaan.
          </p>
        </div>

        <div class="checklist-items">
          <div
            v-for="item in items"
            :key="item.id"
            :class="['check-row', { 'checked': checkedState[item.id], 'critical': item.critical }]"
            @click="toggleItem(item.id)"
          >
            <div class="custom-checkbox">
              <svg v-if="checkedState[item.id]" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#0f172a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <div class="check-text-content">
              <div class="check-title-row">
                <span class="check-title">{{ item.text }}</span>
                <span v-if="item.critical" class="critical-tag">Wajib</span>
              </div>
              <p class="check-detail">{{ item.detail }}</p>
            </div>
          </div>
        </div>

        <div class="progress-status">
          <span>Status Kesiapan:</span>
          <strong :class="{ 'ready': isAllChecked }">
            {{ checkedCount }} dari {{ items.length }} Prosedur Terkonfirmasi
          </strong>
        </div>
      </div>

      <div class="modal-footer">
        <button class="pt-btn pt-btn-outline" @click="$emit('cancel')">
          Kembali
        </button>
        <button
          class="pt-btn pt-btn-primary enter-btn"
          :disabled="!isAllChecked"
          @click="confirmAndProceed"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
          Mulai Langkah Pengerjaan
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue';
import { MandatorySafetyCheckItem } from '../types';
import { NativeService } from '../services/native';

const props = defineProps<{
  isOpen: boolean;
  items: MandatorySafetyCheckItem[];
}>();

const emit = defineEmits<{
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}>();

const checkedState = reactive<Record<string, boolean>>({});

const toggleItem = (id: string) => {
  checkedState[id] = !checkedState[id];
  NativeService.triggerHapticFeedback('light');
};

const checkedCount = computed(() => {
  return props.items.filter((item) => checkedState[item.id]).length;
});

const isAllChecked = computed(() => {
  if (props.items.length === 0) return true;
  return props.items.every((item) => checkedState[item.id]);
});

const confirmAndProceed = () => {
  if (!isAllChecked.value) return;
  NativeService.triggerHapticFeedback('success');
  emit('confirm');
};
</script>

<style></style>

