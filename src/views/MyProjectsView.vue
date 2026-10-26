<template>
  <ion-page>
    <AppHeader>
      <template #actions>
        <button class="add-project-header-btn" @click="openCreateModal">
          + Catat Proyek
        </button>
      </template>
    </AppHeader>

    <ion-content :fullscreen="true" class="myprojects-content">
      <div class="pt-container">
        <!-- Stats Summary Bar -->
        <div class="stats-overview-grid">
          <div class="stat-card pt-card">
            <span class="stat-icon">🏆</span>
            <div class="stat-details">
              <span class="stat-val">{{ completedProjectsCount }}</span>
              <span class="stat-title">Proyek Selesai</span>
            </div>
          </div>

          <div class="stat-card pt-card">
            <span class="stat-icon">⏱️</span>
            <div class="stat-details">
              <span class="stat-val">{{ totalMinutesSpent }} Menit</span>
              <span class="stat-title">Waktu Dicurahkan</span>
            </div>
          </div>

          <div class="stat-card pt-card">
            <span class="stat-icon">💰</span>
            <div class="stat-details">
              <span class="stat-val">{{ formatRupiah(totalCostSpent) }}</span>
              <span class="stat-title">Total Realisasi Biaya</span>
            </div>
          </div>
        </div>

        <!-- Action Bar: Add & Export/Import -->
        <div class="action-toolbar pt-card">
          <div class="toolbar-left">
            <h2 class="section-title">Dokumentasi Proyek Saya</h2>
            <p class="section-sub">Catatan riwayat perbaikan dan foto hasil kerja mandiri.</p>
          </div>

          <div class="toolbar-right">
            <button class="pt-btn pt-btn-outline tool-btn" @click="handleExportBackup">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Ekspor Backup
            </button>

            <button class="pt-btn pt-btn-outline tool-btn" @click="triggerImportFileInput">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              Impor Data
            </button>

            <input
              ref="importFileInput"
              type="file"
              accept=".json"
              style="display: none"
              @change="handleImportBackup"
            />
          </div>
        </div>

        <!-- Project Logs List -->
        <div v-if="logs.length > 0" class="logs-grid">
          <div v-for="log in logs" :key="log.id" class="log-card pt-card">
            <!-- Photo Preview (Dual Before/After or Single) or Fallback Icon -->
            <div class="log-media-header">
              <!-- Dual Before & After -->
              <div v-if="log.beforePhotoData && log.photoData" class="before-after-split">
                <div class="split-pane">
                  <img :src="log.beforePhotoData" alt="Sebelum" class="log-img-split" />
                  <span class="split-label before-tag">Sebelum</span>
                </div>
                <div class="split-pane">
                  <img :src="log.photoData" alt="Sesudah" class="log-img-split" />
                  <span class="split-label after-tag">Sesudah</span>
                </div>
              </div>

              <!-- Single Photo (After or Before) -->
              <img
                v-else-if="log.photoData || log.beforePhotoData"
                :src="log.photoData || log.beforePhotoData"
                alt="Dokumentasi Proyek"
                class="log-img"
              />

              <!-- Placeholder -->
              <div v-else class="log-placeholder-img">
                <span class="placeholder-emoji">
                  {{ log.category === 'KNS' ? '🧱' : log.category === 'LST' ? '⚡' : log.category === 'SAN' ? '🚰' : '🪵' }}
                </span>
                <span class="placeholder-text">Tanpa Foto Dokumentasi</span>
              </div>

              <!-- Status Badge -->
              <span :class="['status-pill', statusClass(log.status)]">
                {{ statusLabel(log.status) }}
              </span>
            </div>

            <div class="log-body">
              <div class="log-title-row">
                <h3 class="log-title">{{ log.projectTitle }}</h3>
              </div>

              <div class="log-meta-info">
                <span class="meta-date">📅 {{ formatDate(log.startDate) }}</span>
                <span class="meta-cost">💵 {{ formatRupiah(log.totalCost) }}</span>
                <span class="meta-time">⏱️ {{ log.spentMinutes }} Menit</span>
              </div>

              <!-- Notes -->
              <p v-if="log.userNotes" class="log-notes-text">
                "{{ log.userNotes }}"
              </p>

              <!-- Star Rating -->
              <div v-if="log.rating" class="log-stars">
                <span v-for="s in log.rating" :key="s" class="star-active">★</span>
                <span v-for="s in (5 - log.rating)" :key="s" class="star-inactive">★</span>
              </div>
            </div>

            <div class="log-footer">
              <button class="log-action-btn" @click="editLog(log)">
                ✏️ Edit
              </button>
              <button class="log-action-btn delete-btn" @click="removeLog(log.id)">
                🗑️ Hapus
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="empty-logs pt-card">
          <div class="empty-icon">📝</div>
          <h3 class="empty-title">Belum Ada Proyek Tersimpan</h3>
          <p class="empty-desc">
            Selesaikan panduan DIY atau catat pengerjaan mandiri Anda di rumah sekarang.
          </p>
          <button class="pt-btn pt-btn-primary" @click="openCreateModal">
            + Catat Proyek DIY Pertama
          </button>
        </div>

        <!-- Project Log Modal -->
        <ProjectLogModal
          :is-open="isModalOpen"
          :editing-log="selectedLog"
          @save="handleSaveLog"
          @cancel="isModalOpen = false"
        />
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { IonPage, IonContent } from '@ionic/vue';
import AppHeader from '../components/AppHeader.vue';
import ProjectLogModal from '../components/ProjectLogModal.vue';
import { MyProjectLog } from '../types';
import { getMyLogs, saveMyLog, deleteMyLog, exportAllData, importAllData } from '../services/db';
import { NativeService } from '../services/native';

const logs = ref<MyProjectLog[]>([]);
const isModalOpen = ref(false);
const selectedLog = ref<MyProjectLog | null>(null);
const importFileInput = ref<HTMLInputElement | null>(null);

const loadLogs = async () => {
  logs.value = await getMyLogs();
};

onMounted(async () => {
  await loadLogs();
});

const completedProjectsCount = computed(() => {
  return logs.value.filter((l) => l.status === 'completed').length;
});

const totalMinutesSpent = computed(() => {
  return logs.value.reduce((acc, l) => acc + (l.spentMinutes || 0), 0);
});

const totalCostSpent = computed(() => {
  return logs.value.reduce((acc, l) => acc + (l.totalCost || 0), 0);
});

const formatRupiah = (val: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(val);
};

const formatDate = (iso: string): string => {
  try {
    return new Date(iso).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
};

const statusClass = (status: string) => {
  if (status === 'completed') return 'status-completed';
  if (status === 'in_progress') return 'status-in-progress';
  return 'status-repair';
};

const statusLabel = (status: string) => {
  if (status === 'completed') return 'Selesai';
  if (status === 'in_progress') return 'Sedang Dikerjakan';
  return 'Butuh Perbaikan';
};

const openCreateModal = () => {
  selectedLog.value = null;
  isModalOpen.value = true;
};

const editLog = (log: MyProjectLog) => {
  selectedLog.value = { ...log };
  isModalOpen.value = true;
};

const removeLog = async (id: string) => {
  if (confirm('Hapus catatan proyek ini dari riwayat?')) {
    await deleteMyLog(id);
    await loadLogs();
    NativeService.triggerHapticFeedback('light');
  }
};

const handleSaveLog = async (log: MyProjectLog) => {
  await saveMyLog(log);
  isModalOpen.value = false;
  await loadLogs();
};

const handleExportBackup = async () => {
  try {
    const dataStr = await exportAllData();
    const filename = `pahamtukang-backup-${new Date().toISOString().split('T')[0]}.json`;
    const message = await NativeService.exportBackupFile(dataStr, filename);
    alert(message);
    NativeService.triggerHapticFeedback('success');
  } catch (err) {
    alert('Gagal mengekspor data: ' + err);
  }
};

const triggerImportFileInput = () => {
  importFileInput.value?.click();
};

const handleImportBackup = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async () => {
    try {
      const content = reader.result as string;
      const res = await importAllData(content);
      alert(`Berhasil memulihkan ${res.logsCount} catatan proyek dan status checklist!`);
      await loadLogs();
      NativeService.triggerHapticFeedback('success');
    } catch (err) {
      alert('Gagal mengimpor berkas backup: ' + err);
    }
  };
  reader.readAsText(file);
};
</script>

<style scoped>
.before-after-split {
  display: flex;
  width: 100%;
  height: 160px;
  position: relative;
}

.split-pane {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.split-pane:first-child {
  border-right: 2px solid #ffffff;
}

.log-img-split {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.split-label {
  position: absolute;
  bottom: 8px;
  font-size: 10px;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.before-tag {
  left: 8px;
  background: rgba(15, 23, 42, 0.75);
  color: #f1f5f9;
}

.after-tag {
  right: 8px;
  background: #059669;
  color: #ffffff;
}
</style>

